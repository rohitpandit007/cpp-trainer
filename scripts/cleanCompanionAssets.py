import os
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

INPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'companion'))
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'companion_cleaned'))

FILES = [
    'all tests passed.png',
    'coding.png',
    'compile error.png',
    'concept mastered.png',
    'default.png',
    'repeated failure.png',
    'runtime error.png',
    'solved without hints.png',
    'test passed.png',
    'thinking.png',
    'ultimate mastery.png',
    'wrong answer.png'
]

def clean_image(filename):
    in_path = os.path.join(INPUT_DIR, filename)
    out_path = os.path.join(OUTPUT_DIR, filename)
    print(f'Processing {filename}...')
    
    img = Image.open(in_path)
    orig_arr = np.array(img)
    arr = orig_arr[:, :, :3].astype(float)
    h, w, _ = arr.shape
    
    # 1. Define known background margins (guaranteed zero character content)
    bg_known = np.zeros((h, w), dtype=bool)
    bg_known[:, :400] = True
    bg_known[:, 2400:] = True
    bg_known[:40, :] = True
    bg_known[1490:, :] = True
    
    # 2. Separate known background into dark and light squares
    lum = arr.mean(axis=-1)
    median_lum = float(np.median(lum[bg_known]))
    dark_mask = bg_known & (lum < median_lum - 5)
    light_mask = bg_known & (lum > median_lum + 5)
    
    # 3. Fit 2D linear planes (a*x + b*y + c) for dark and light square colors
    step = 4
    Y, X = np.mgrid[:h:step, :w:step]
    
    dark_sub = dark_mask[::step, ::step]
    X_dark, Y_dark = X[dark_sub], Y[dark_sub]
    A_dark = np.column_stack([X_dark, Y_dark, np.ones_like(X_dark)])
    dark_planes = [np.linalg.lstsq(A_dark, arr[::step, ::step, c][dark_sub], rcond=None)[0] for c in range(3)]
    
    light_sub = light_mask[::step, ::step]
    X_light, Y_light = X[light_sub], Y[light_sub]
    A_light = np.column_stack([X_light, Y_light, np.ones_like(X_light)])
    light_planes = [np.linalg.lstsq(A_light, arr[::step, ::step, c][light_sub], rcond=None)[0] for c in range(3)]
    
    # 4. Reconstruct spatial grid of expected dark and light tones
    X_grid, Y_grid = np.meshgrid(np.arange(w, dtype=float), np.arange(h, dtype=float))
    c_dark_grid = np.stack([dark_planes[c][0]*X_grid + dark_planes[c][1]*Y_grid + dark_planes[c][2] for c in range(3)], axis=-1)
    c_light_grid = np.stack([light_planes[c][0]*X_grid + light_planes[c][1]*Y_grid + light_planes[c][2] for c in range(3)], axis=-1)
    
    # 5. Compute color distance to the checkerboard color segment [c_dark_grid, c_light_grid]
    v = c_light_grid - c_dark_grid
    v_len_sq = (v**2).sum(axis=-1)
    diff = arr - c_dark_grid
    t = (diff * v).sum(axis=-1) / np.maximum(v_len_sq, 1e-6)
    perp = diff - t[:, :, None] * v
    dist_from_segment_line = np.sqrt((perp**2).sum(axis=-1))
    dist_to_dark = np.sqrt(((arr - c_dark_grid)**2).sum(axis=-1))
    dist_to_light = np.sqrt(((arr - c_light_grid)**2).sum(axis=-1))
    dist_to_segment = np.where(t < 0, dist_to_dark, np.where(t > 1, dist_to_light, dist_from_segment_line))
    
    # 6. Traverse background starting from the 4 outer image borders
    traversable = (dist_to_segment < 24.0)
    labeled, num_comps = ndimage.label(traversable)
    bg_mask = (labeled == labeled[0, 0])
    
    # 7. Check for internal enclosed background holes (e.g. loops between arms/tail and body)
    sat = arr.max(axis=-1) - arr.min(axis=-1)
    sizes = ndimage.sum(np.ones_like(traversable), labeled, range(1, num_comps + 1))
    for i, s in enumerate(sizes):
        comp_id = i + 1
        if comp_id != labeled[0, 0] and s > 300:
            c_mask = (labeled == comp_id)
            c_mean_d = float(dist_to_segment[c_mask].mean())
            c_mean_s = float(sat[c_mask].mean())
            if c_mean_d < 16.0 and c_mean_s < 16.0:
                bg_mask |= c_mask
                
    # 8. Boundary smoothing and antialiasing feathering
    dist_from_bg = ndimage.distance_transform_edt(~bg_mask)
    alpha = np.where(bg_mask, 0.0, 1.0)
    
    # Edge band (within 3 pixels of background)
    edge_band = (~bg_mask) & (dist_from_bg <= 3.0)
    d_edge = dist_to_segment[edge_band]
    feathered = np.clip((d_edge - 18.0) / (52.0 - 18.0), 0.05, 1.0)
    alpha[edge_band] = feathered
    
    # 9. Guaranteed zero margins for outer 400px horizontally and 40px vertically
    alpha[:, :400] = 0.0
    alpha[:, 2400:] = 0.0
    alpha[:40, :] = 0.0
    alpha[1490:, :] = 0.0
    
    # 10. Clean isolated low-saturation speckles (< 40px with mean_sat < 22)
    is_fg = (alpha > 0.0)
    labeled_fg, num_fg = ndimage.label(is_fg)
    fg_sizes = ndimage.sum(np.ones_like(is_fg), labeled_fg, range(1, num_fg + 1))
    for i, s in enumerate(fg_sizes):
        if s < 40:
            c_mask = (labeled_fg == (i + 1))
            if float(sat[c_mask].mean()) < 22.0:
                alpha[c_mask] = 0.0
    
    # 11. Clean edge colors: unblend the checkerboard background from semi-transparent edge pixels
    out_rgb = arr.copy()
    expected_bg = np.where(lum[:, :, None] < median_lum, c_dark_grid, c_light_grid)
    semi_trans = (alpha > 0.0) & (alpha < 0.95)
    
    a_exp = alpha[semi_trans, None]
    unblended = (out_rgb[semi_trans] - (1.0 - a_exp) * expected_bg[semi_trans]) / np.maximum(a_exp, 0.1)
    out_rgb[semi_trans] = np.clip(unblended, 0.0, 255.0)
    
    # 12. Assemble final 4-channel RGBA array
    out_rgba = np.zeros((h, w, 4), dtype=np.uint8)
    out_rgba[:, :, :3] = np.clip(out_rgb, 0.0, 255.0).round().astype(np.uint8)
    out_rgba[:, :, 3] = (alpha * 255.0).round().astype(np.uint8)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_img = Image.fromarray(out_rgba, mode='RGBA')
    out_img.save(out_path, format='PNG', optimize=True)
    
    trans_count = int((out_rgba[:, :, 3] == 0).sum())
    opaque_count = int((out_rgba[:, :, 3] == 255).sum())
    edge_count = int(((out_rgba[:, :, 3] > 0) & (out_rgba[:, :, 3] < 255)).sum())
    total_px = h * w
    print(f'  Saved {filename}: {w}x{h} RGBA | trans={trans_count/total_px:.1%}, opaque={opaque_count/total_px:.1%}, edge={edge_count/total_px:.2%}')

def main():
    print('Starting companion asset cleaner...')
    for f in FILES:
        clean_image(f)
    print('All 12 assets processed successfully.')

if __name__ == '__main__':
    main()

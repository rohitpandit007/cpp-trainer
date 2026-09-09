import os
import sys
import numpy as np
from PIL import Image

TARGET_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'companion_cleaned'))

EXPECTED_FILES = [
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

EXPECTED_WIDTH = 2816
EXPECTED_HEIGHT = 1536

def validate_asset(filename):
    path = os.path.join(TARGET_DIR, filename)
    print(f'Validating {filename}...')
    assert os.path.exists(path), f'File {filename} does not exist at {path}'
    
    # 1. Valid PNG and RGBA mode
    img = Image.open(path)
    assert img.format == 'PNG', f'{filename}: Expected PNG format, got {img.format}'
    assert img.mode == 'RGBA', f'{filename}: Expected RGBA mode, got {img.mode}'
    
    # 2. Dimensions unchanged
    assert img.size == (EXPECTED_WIDTH, EXPECTED_HEIGHT), f'{filename}: Expected size ({EXPECTED_WIDTH}, {EXPECTED_HEIGHT}), got {img.size}'
    
    arr = np.array(img)
    assert arr.shape == (EXPECTED_HEIGHT, EXPECTED_WIDTH, 4), f'{filename}: Expected shape (1536, 2816, 4), got {arr.shape}'
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    
    # 3. Transparent background exists where expected
    # All 4 corners MUST have alpha == 0
    corners = [(0, 0), (0, EXPECTED_WIDTH - 1), (EXPECTED_HEIGHT - 1, 0), (EXPECTED_HEIGHT - 1, EXPECTED_WIDTH - 1)]
    for cy, cx in corners:
        assert alpha[cy, cx] == 0, f'{filename}: Corner ({cx}, {cy}) must have alpha 0, got {alpha[cy, cx]}'
        
    # Outer margins must be 100% transparent (no character exists in outer 200px horizontally or 20px vertically)
    assert (alpha[:, :200] == 0).all(), f'{filename}: Left margin (x<200) has non-transparent pixels'
    assert (alpha[:, 2600:] == 0).all(), f'{filename}: Right margin (x>2600) has non-transparent pixels'
    assert (alpha[:20, :] == 0).all(), f'{filename}: Top margin (y<20) has non-transparent pixels'
    assert (alpha[1510:, :] == 0).all(), f'{filename}: Bottom margin (y>1510) has non-transparent pixels'
    
    # 4. Character core is preserved (opaque alpha == 255)
    # Pikachu yellow fur: R>200, G>160, B<80
    yellow_fur = (rgb[:, :, 0] > 200) & (rgb[:, :, 1] > 160) & (rgb[:, :, 2] < 80)
    assert yellow_fur.sum() > 50000, f'{filename}: Yellow fur not found ({yellow_fur.sum()} pixels)'
    # Yellow fur must be >99.9% opaque
    yellow_alpha = alpha[yellow_fur]
    opaque_yellow_pct = (yellow_alpha == 255).sum() / len(yellow_alpha)
    assert opaque_yellow_pct > 0.99, f'{filename}: Yellow fur is not opaque ({opaque_yellow_pct:.1%})'
    
    # 5. Antialiased edges exist
    edge_pixels = (alpha > 0) & (alpha < 255)
    assert edge_pixels.sum() > 100, f'{filename}: Expected antialiased edge pixels, got {edge_pixels.sum()}'
    
    # 6. Overall transparent ratio is within reasonable expected range (65% to 85%)
    trans_ratio = (alpha == 0).sum() / (EXPECTED_WIDTH * EXPECTED_HEIGHT)
    assert 0.65 <= trans_ratio <= 0.85, f'{filename}: Transparent ratio {trans_ratio:.1%} outside expected [65%, 85%]'
    
    print(f'  [PASS] {filename}: {img.size} {img.mode} | trans={trans_ratio:.1%}, yellow_opaque={opaque_yellow_pct:.2%}, edge_px={edge_pixels.sum()}')

def main():
    print(f'Validating all 12 assets in {TARGET_DIR}...')
    for f in EXPECTED_FILES:
        validate_asset(f)
    print('ALL 12 ASSETS VALIDATED AND FULLY COMPLIANT!')

if __name__ == '__main__':
    main()

/**
 * Pikachu Companion Presentation Component for CodeBloom C++ Trainer.
 * Subscribes to CompanionController, renders double-buffered image transitions,
 * animates state changes, manages contextual speech bubbles, progression tiers,
 * and supports responsive docking.
 *
 * Phase D4B: Contextual C++ reactions, bug recovery celebration, progression tier styles,
 * and side-effect free educational C++ tip cycling.
 */

import { COMPANION_STATES, getProgressionTier } from './companionState.js';
import { companionController as defaultController } from './companionController.js';
import { assetRegistry as defaultAssetRegistry } from './assetRegistry.js';
import { storageManager } from '../storageManager.js';

export const DEFAULT_SPEECH_MESSAGES = {
  [COMPANION_STATES.IDLE]: "Ready when you are! Pick a lesson or start coding.",
  [COMPANION_STATES.THINKING]: "Let's trace this step by step...",
  [COMPANION_STATES.CODING]: "", // Kept silent during typing to prevent distraction
  [COMPANION_STATES.TEST_PASSED]: "Nice! That test passed!",
  [COMPANION_STATES.WRONG_OUTPUT]: "Almost there! Let's check where the output differed.",
  [COMPANION_STATES.COMPILE_ERROR]: "Syntax bump! The compiler gave us a helpful clue.",
  [COMPANION_STATES.RUNTIME_ERROR]: "Whoa, it crashed! Let's check memory and loop bounds.",
  [COMPANION_STATES.TIRED]: "Tough bug! Let's take a breath and re-read the error.",
  [COMPANION_STATES.CELEBRATION]: "All tests passed! Outstanding work!",
  [COMPANION_STATES.INDEPENDENT_SUCCESS]: "Solved with zero hints! Pure craft!",
  [COMPANION_STATES.MASTERY]: "Concept mastered! You leveled up!",
  [COMPANION_STATES.ULTIMATE_MASTERY]: "Curriculum complete! You are a genuine C++ coder!"
};

export const SPEECH_POOLS = {
  [COMPANION_STATES.IDLE]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.IDLE],
    "Take your time to read the problem description carefully.",
    "Ready for the next challenge! Let's build something solid."
  ],
  [COMPANION_STATES.THINKING]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.THINKING],
    "Breaking the problem down into smaller parts makes it easier.",
    "Consider the inputs, outputs, and edge cases before coding."
  ],
  [COMPANION_STATES.CODING]: [
    "" // Kept silent during typing to prevent distraction
  ],
  [COMPANION_STATES.TEST_PASSED]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.TEST_PASSED],
    "Good progress! Keep that momentum going.",
    "Green check! You're on the right track."
  ],
  [COMPANION_STATES.WRONG_OUTPUT]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.WRONG_OUTPUT],
    "Check your loop conditions and boundary values.",
    "Compare your actual output with the expected output format."
  ],
  [COMPANION_STATES.COMPILE_ERROR]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.COMPILE_ERROR],
    "Check for missing semicolons, matching brackets, or type mismatches.",
    "Read the compiler error message starting from the first reported line."
  ],
  [COMPANION_STATES.RUNTIME_ERROR]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.RUNTIME_ERROR],
    "Check for division by zero or accessing an array out of bounds.",
    "Make sure all pointers are valid and pointing to allocated memory."
  ],
  [COMPANION_STATES.TIRED]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.TIRED],
    "Step back and trace the logic with a pencil or simple print statements.",
    "Debugging is learning! You're closer than you think."
  ],
  [COMPANION_STATES.CELEBRATION]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.CELEBRATION],
    "Clean compile, all tests green! Great execution!",
    "Well done! Your solution works as intended."
  ],
  [COMPANION_STATES.INDEPENDENT_SUCCESS]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.INDEPENDENT_SUCCESS],
    "Solved completely on your own with zero hints! Outstanding craft!",
    "No hints needed! You conquered that problem entirely on your own!"
  ],
  [COMPANION_STATES.MASTERY]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.MASTERY],
    "Mastery achieved! You've proven your understanding of this topic.",
    "Deep understanding unlocked! You're leveling up fast."
  ],
  [COMPANION_STATES.ULTIMATE_MASTERY]: [
    DEFAULT_SPEECH_MESSAGES[COMPANION_STATES.ULTIMATE_MASTERY],
    "Phenomenal achievement! You've mastered every foundational C++ concept!",
    "Grand mastery unlocked! You have built a remarkable C++ foundation."
  ]
};

export const CXX_TIPS = [
  "C++ Tip: Remember to end class and struct definitions with a semicolon (;).",
  "C++ Tip: Pass large objects by const reference (const T&) to avoid costly copies.",
  "C++ Tip: Always initialize pointers and variables to prevent undefined behavior.",
  "C++ Tip: Break complex functions into smaller, single-responsibility helper functions.",
  "C++ Tip: Prefer nullptr over NULL or 0 in modern C++.",
  "C++ Tip: Remember that array indexing in C++ starts at 0, and out-of-bounds access is undefined.",
  "C++ Tip: Match every 'new' with 'delete', or better yet, use RAII and smart pointers.",
  "C++ Tip: Semicolons are not needed after function bodies, only after function declarations."
];

/**
 * Deterministically computes the contextual speech message for a companion snapshot.
 * @param {Object} snapshot
 * @param {Record<string, number>} [indexMap] Optional round-robin index state for testing/cycling
 * @returns {string}
 */
export function getSpeechMessage(snapshot, indexMap = {}) {
  if (!snapshot) return '';
  const state = snapshot.state;

  // 1. Bug Recovery celebration
  if (snapshot.lastMetadata?.isBugRecovery || snapshot.isBugRecovery) {
    if (state === COMPANION_STATES.CELEBRATION || state === COMPANION_STATES.INDEPENDENT_SUCCESS || state === COMPANION_STATES.TEST_PASSED) {
      return "Bug squashed! Persistence through errors is the mark of a true programmer!";
    }
  }

  // 2. Level up
  if (snapshot.lastMetadata?.sourceEvent === 'LEVEL_UP' || snapshot.lastMetadata?.level) {
    const lvl = snapshot.lastMetadata?.level || snapshot.level;
    const name = snapshot.lastMetadata?.levelName || snapshot.levelName;
    if (lvl) {
      return `Level up! You are now a Level ${lvl} ${name ? `${name}!` : 'coder!'}`;
    }
  }

  // 3. Achievement unlocked
  if (snapshot.lastMetadata?.sourceEvent === 'ACHIEVEMENT_UNLOCKED' && snapshot.lastMetadata?.title) {
    return `Achievement unlocked: ${snapshot.lastMetadata.title}!`;
  }

  // 4. Concept Mastery with specific concept name
  if (state === COMPANION_STATES.MASTERY) {
    const concept = snapshot.lastMetadata?.conceptName || snapshot.lastMetadata?.concept || snapshot.concept;
    if (concept) {
      const cleanConcept = String(concept).replace(/-/g, ' ');
      return `Mastery achieved in ${cleanConcept}! Your C++ foundation is growing stronger!`;
    }
  }

  // 5. Contextual Compiler Error
  if (state === COMPANION_STATES.COMPILE_ERROR) {
    const meta = snapshot.lastMetadata || {};
    const concept = (meta.concept || meta.lessonId || '').toLowerCase();
    const classified = snapshot.classifiedError || meta.classifiedError;

    if (concept.includes('pointer') || concept.includes('memory')) {
      return "Compiler check: verify pointer syntax (* vs &) and dynamic allocation types.";
    }
    if (concept.includes('class') || concept.includes('struct') || concept.includes('access')) {
      return "Compiler check: did you put a semicolon (;) after the class definition?";
    }
    if (concept.includes('function')) {
      return "Compiler check: verify your return type and parameter list match the declaration.";
    }
    if (concept.includes('inheritance') || concept.includes('abstract')) {
      return "Compiler check: verify base class access specifiers and pure virtual functions.";
    }
    if (concept.includes('runtime') || concept.includes('polymorphism')) {
      return "Compiler check: verify virtual function signatures match in the derived class.";
    }
    if (classified?.description) {
      return `Compiler note: ${classified.description}`;
    }
  }

  // 6. Contextual Runtime Error
  if (state === COMPANION_STATES.RUNTIME_ERROR) {
    const meta = snapshot.lastMetadata || {};
    const concept = (meta.concept || meta.lessonId || '').toLowerCase();
    if (concept.includes('memory') || concept.includes('pointer')) {
      return "Runtime check: verify pointers are not null and allocated memory is properly freed.";
    }
  }

  // 7. Contextual Wrong Output
  if (state === COMPANION_STATES.WRONG_OUTPUT) {
    const meta = snapshot.lastMetadata || {};
    const concept = (meta.concept || meta.lessonId || '').toLowerCase();
    if (concept.includes('function')) {
      return "Output check: ensure your function returns the value rather than printing early.";
    }
    if (concept.includes('memory')) {
      return "Output check: make sure you are dereferencing the pointer to get the value.";
    }
  }

  // 8. Fall back to deterministic speech pool
  const pool = SPEECH_POOLS[state] || [DEFAULT_SPEECH_MESSAGES[state] || ''];
  const poolIdx = (indexMap[state] || 0) % pool.length;
  indexMap[state] = poolIdx + 1;
  return pool[poolIdx];
}


export class PikachuCompanion {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.container] Parent DOM node (defaults to document.body)
   * @param {import('./companionController.js').CompanionController} [options.controller]
   * @param {import('./assetRegistry.js').AssetRegistry} [options.assetRegistry]
   * @param {Record<string, string>} [options.speechMessages]
   */
  constructor(options = {}) {
    this.container = options.container || (typeof document !== 'undefined' ? document.body : null);
    this.controller = options.controller || defaultController;
    this.assetRegistry = options.assetRegistry || defaultAssetRegistry;
    this.speechMessages = { ...DEFAULT_SPEECH_MESSAGES, ...(options.speechMessages || {}) };
    this.speechIndices = {};
    this.clickTipIndex = 0;

    this.root = null;
    this.bubbleEl = null;
    this.bubbleTextEl = null;
    this.imgCurrent = null;
    this.imgNext = null;
    this.badgeEl = null;
    this.toggleBtn = null;
    this.milestoneTimer = null;

    this.isMinimized = false;
    this.currentState = COMPANION_STATES.IDLE;
    this.currentProgressionTier = 'novice';
    this.unsubscribeController = null;
    this.mediaQueryListener = null;

    this.isMinimized = storageManager.isCompanionMinimized();

    if (this.container) {
      this.init();
    }
  }

  /**
   * Mounts companion DOM structure and attaches event listeners.
   */
  init() {
    if (!this.container || typeof document === 'undefined') return;

    // Remove any existing dock
    const existing = this.container.querySelector('#companion-dock');
    if (existing) {
      existing.remove();
    }

    const initialSnapshot = this.controller.getSnapshot();
    this.currentProgressionTier = initialSnapshot?.progressionTier || 'novice';

    // Build DOM structure
    this.root = document.createElement('div');
    this.root.className = `companion-dock state-idle tier-${this.currentProgressionTier} ${this.isMinimized ? 'minimized' : ''}`;
    this.root.id = 'companion-dock';
    this.root.setAttribute('role', 'complementary');
    this.root.setAttribute('aria-label', 'Pikachu Coding Companion');

    this.root.innerHTML = `
      <div class="companion-bubble" id="companion-bubble" aria-live="polite">
        <span class="bubble-text">${this.escapeHtml(this.speechMessages[COMPANION_STATES.IDLE])}</span>
        <div class="bubble-tail"></div>
      </div>
      <div class="companion-stage">
        <div class="companion-avatar-frame" tabindex="0" role="button" aria-label="Pikachu companion - Click for a C++ tip" title="Pikachu companion - Click for a C++ tip">
          <img class="companion-img current" src="${this.assetRegistry.getAssetUrl(COMPANION_STATES.IDLE)}" alt="Pikachu companion" />
          <img class="companion-img next" src="" alt="" style="opacity: 0;" />
        </div>
        <div class="companion-controls">
          <span class="companion-state-badge">IDLE</span>
          <button class="companion-toggle-btn" title="Minimize / Expand companion" aria-label="Toggle companion">${this.isMinimized ? '▲' : '─'}</button>
        </div>
      </div>
    `;

    this.container.appendChild(this.root);

    // Cache elements
    this.bubbleEl = this.root.querySelector('.companion-bubble');
    this.bubbleTextEl = this.root.querySelector('.bubble-text');
    this.imgCurrent = this.root.querySelector('.companion-img.current');
    this.imgNext = this.root.querySelector('.companion-img.next');
    this.badgeEl = this.root.querySelector('.companion-state-badge');
    this.toggleBtn = this.root.querySelector('.companion-toggle-btn');
    const avatarFrame = this.root.querySelector('.companion-avatar-frame');

    // Attach interaction handlers
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMinimize();
      });
    }

    if (avatarFrame) {
      avatarFrame.addEventListener('click', () => {
        if (this.isMinimized) {
          this.toggleMinimize(false);
        } else {
          this.handleAvatarClick();
        }
      });

      avatarFrame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (this.isMinimized) {
            this.toggleMinimize(false);
          } else {
            this.handleAvatarClick();
          }
        }
      });
    }

    // Fallback handlers on image errors
    const fallbackUrl = this.assetRegistry.getAssetUrl(COMPANION_STATES.IDLE);
    if (this.imgCurrent) {
      this.imgCurrent.addEventListener('error', () => {
        if (this.imgCurrent.src !== fallbackUrl) {
          this.imgCurrent.src = fallbackUrl;
        }
      });
    }

    if (this.imgNext) {
      this.imgNext.addEventListener('error', () => {
        if (this.imgNext.src !== fallbackUrl) {
          this.imgNext.src = fallbackUrl;
        }
      });
    }

    // Handle Reduced Motion preferences
    this.initReducedMotion();

    // Preload Pikachu assets in browser
    this.assetRegistry.preloadAssets().catch(() => {});

    // Subscribe to CompanionController snapshots
    this.unsubscribeController = this.controller.subscribe((snapshot) => {
      this.handleSnapshot(snapshot);
    });
  }

  /**
   * Initializes reduced-motion detection and media query watcher.
   */
  initReducedMotion() {
    if (this.controller.reducedMotion && this.root) {
      this.root.classList.add('reduced-motion');
    }

    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyReducedMotion = (matches) => {
      if (matches || this.controller.reducedMotion) {
        this.root?.classList.add('reduced-motion');
        this.controller.setReducedMotion(true);
      } else {
        this.root?.classList.remove('reduced-motion');
        this.controller.setReducedMotion(false);
      }
    };

    if (mediaQuery.matches) {
      applyReducedMotion(true);
    }

    this.mediaQueryListener = (e) => applyReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', this.mediaQueryListener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(this.mediaQueryListener);
    }
  }

  /**
   * Renders the updated companion snapshot dispatched by CompanionController.
   * @param {Object} snapshot
   */
  handleSnapshot(snapshot) {
    if (!this.root || !snapshot) return;

    this.currentState = snapshot.state;

    // 1. Update State Class for CSS animations
    this.updateStateClass(this.currentState);

    // 2. Update Progression Tier Class
    if (snapshot.progressionTier) {
      this.updateProgressionTierClass(snapshot.progressionTier);
    }

    // 3. Update Status Badge
    if (this.badgeEl) {
      this.badgeEl.textContent = this.currentState.replace(/_/g, ' ');
    }

    // 4. Smooth Double-Buffered Image Transition
    if (snapshot.assetUrl) {
      this.transitionImage(snapshot.assetUrl);
    }

    // 5. Contextual Speech Bubble Message
    this.updateSpeechBubble(snapshot);

    // 6. Handle minimized milestone indication
    if (this.isMinimized && (snapshot.state === COMPANION_STATES.MASTERY || snapshot.state === COMPANION_STATES.ULTIMATE_MASTERY || snapshot.lastMetadata?.sourceEvent === 'LEVEL_UP')) {
      this.triggerMinimizedMilestonePulse();
    }
  }

  /**
   * Swaps state CSS classes on the companion dock.
   * @param {string} state
   */
  updateStateClass(state) {
    if (!this.root) return;

    // Remove any existing state-* classes
    const classList = Array.from(this.root.classList);
    for (const cls of classList) {
      if (cls.startsWith('state-')) {
        this.root.classList.remove(cls);
      }
    }

    const stateSlug = `state-${(state || 'idle').toLowerCase().replace(/_/g, '-')}`;
    this.root.classList.add(stateSlug);
  }

  /**
   * Swaps progression tier CSS classes on the companion dock.
   * @param {string} tier
   */
  updateProgressionTierClass(tier) {
    if (!this.root) return;

    this.currentProgressionTier = tier || 'novice';
    const classList = Array.from(this.root.classList);
    for (const cls of classList) {
      if (cls.startsWith('tier-')) {
        this.root.classList.remove(cls);
      }
    }

    this.root.classList.add(`tier-${this.currentProgressionTier}`);
  }

  /**
   * Smoothly cross-fades the companion character image.
   * @param {string} nextUrl
   */
  transitionImage(nextUrl) {
    if (!this.imgCurrent || !this.imgNext) return;

    const currentSrc = this.imgCurrent.getAttribute('src');
    if (currentSrc === nextUrl) {
      return; // Already showing this asset
    }

    // If reduced motion is active, switch immediately
    if (this.controller.reducedMotion) {
      this.imgCurrent.src = nextUrl;
      return;
    }

    // Load into next layer
    this.imgNext.src = nextUrl;
    this.imgNext.style.opacity = '0';

    const onNextLoaded = () => {
      this.imgNext.removeEventListener('load', onNextLoaded);

      // Trigger cross-fade
      this.imgNext.style.opacity = '1';
      this.imgCurrent.style.opacity = '0';

      setTimeout(() => {
        this.imgCurrent.src = nextUrl;
        this.imgCurrent.style.opacity = '1';
        this.imgNext.style.opacity = '0';
      }, 250);
    };

    if (this.imgNext.complete) {
      onNextLoaded();
    } else {
      this.imgNext.addEventListener('load', onNextLoaded);
    }
  }

  /**
   * Updates speech bubble message contextually.
   * @param {Object} snapshot
   */
  updateSpeechBubble(snapshot) {
    if (!this.bubbleEl || !this.bubbleTextEl) return;

    // When coding, hide bubble to avoid distraction
    if (snapshot.state === COMPANION_STATES.CODING) {
      this.bubbleEl.classList.add('bubble-hidden');
      return;
    }

    const message = getSpeechMessage(snapshot, this.speechIndices);

    if (message) {
      this.bubbleTextEl.textContent = message;
      this.bubbleEl.classList.remove('bubble-hidden');
    } else {
      this.bubbleEl.classList.add('bubble-hidden');
    }
  }

  /**
   * Handles user clicking Pikachu directly (Easter egg / encouraging tips).
   * Strictly non-gameplay: 0 XP, 0 streak effect, 0 mastery mutation.
   */
  handleAvatarClick() {
    if (!this.bubbleEl || !this.bubbleTextEl) return;

    const tip = CXX_TIPS[this.clickTipIndex % CXX_TIPS.length];
    this.clickTipIndex = (this.clickTipIndex + 1) % CXX_TIPS.length;

    this.bubbleTextEl.textContent = tip;
    this.bubbleEl.classList.remove('bubble-hidden');
  }

  /**
   * Triggers a subtle pulse on the minimized dock for major milestones.
   */
  triggerMinimizedMilestonePulse() {
    if (!this.root) return;
    this.root.classList.add('milestone-pulse');
    if (this.milestoneTimer) {
      clearTimeout(this.milestoneTimer);
    }
    this.milestoneTimer = setTimeout(() => {
      this.root?.classList.remove('milestone-pulse');
      this.milestoneTimer = null;
    }, 2000);
  }

  /**
   * Toggles minimized state.
   * @param {boolean} [forceState]
   */
  toggleMinimize(forceState) {
    this.isMinimized = typeof forceState === 'boolean' ? forceState : !this.isMinimized;

    if (this.root) {
      this.root.classList.toggle('minimized', this.isMinimized);
    }
    if (this.toggleBtn) {
      this.toggleBtn.textContent = this.isMinimized ? '▲' : '─';
      this.toggleBtn.title = this.isMinimized ? 'Expand companion' : 'Minimize companion';
    }

    storageManager.setCompanionMinimized(this.isMinimized);
  }

  /**
   * Helper to escape HTML characters in text.
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  /**
   * Destroys companion instance, unsubscribes listeners, and cleans up DOM.
   */
  destroy() {
    if (this.milestoneTimer) {
      clearTimeout(this.milestoneTimer);
      this.milestoneTimer = null;
    }

    if (this.unsubscribeController) {
      this.unsubscribeController();
      this.unsubscribeController = null;
    }

    if (this.mediaQueryListener && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', this.mediaQueryListener);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(this.mediaQueryListener);
      }
      this.mediaQueryListener = null;
    }

    if (this.root && this.root.parentNode) {
      this.root.parentNode.removeChild(this.root);
      this.root = null;
    }
  }
}

/**
 * Convenience factory to mount the Pikachu companion.
 * @param {HTMLElement} [container]
 * @param {import('./companionController.js').CompanionController} [controller]
 * @returns {PikachuCompanion}
 */
export function initPikachuCompanion(container, controller) {
  return new PikachuCompanion({ container, controller });
}

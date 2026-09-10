/**
 * Gamification UI Controller for CodeBloom C++ Trainer (Phase D4A).
 * Renders header progression pill, floating achievement toasts, and the
 * comprehensive achievements view modal.
 */

import { ACHIEVEMENTS } from './achievements.js';
import { LEARNING_EVENTS } from '../eventBus.js';

export class GamificationUI {
  /**
   * @param {Object} options
   * @param {import('./gamificationEngine.js').GamificationEngine} options.engine
   * @param {import('../eventBus.js').LearningEventBus} [options.eventBus]
   */
  constructor(options = {}) {
    this.engine = options.engine;
    this.eventBus = options.eventBus || this.engine?.eventBus;
    this.toastContainer = null;
    this.modalElement = null;
    this.unbindEventBus = null;

    if (this.eventBus) {
      this.bindEvents();
    }
  }

  bindEvents() {
    if (this.unbindEventBus) this.unbindEventBus();

    const unsubscribe = this.eventBus.on(LEARNING_EVENTS.ACHIEVEMENT_UNLOCKED, (data) => {
      if (data?.achievement) {
        this.showToast(data.achievement);
      }
    });

    this.unbindEventBus = unsubscribe;
  }

  /**
   * Renders the HTML string for the compact header progression pill.
   * @param {Object} snapshot
   * @returns {string} HTML string
   */
  static renderHeaderPill(snapshot) {
    if (!snapshot) return '';

    const { level, levelName, xp, nextLevelXp, progressPercentage, streaks } = snapshot;
    const streak = streaks?.currentIndependentStreak || 0;

    return `
      <div class="progression-pill" data-action="open-achievements" title="Click to view achievements and rank progress">
        <span class="pill-level-tag" title="Level ${level}: ${esc(levelName)}">LVL ${level}</span>
        <span class="pill-level-name">${esc(levelName)}</span>
        <span class="pill-xp-bar" aria-label="${progressPercentage}% to next level" title="${progressPercentage}% progress to next level">
          <span class="pill-xp-fill" style="width: ${progressPercentage}%"></span>
        </span>
        <span class="pill-xp-text" title="XP (Experience Points) — Earned by writing C++ code and passing checks">${xp} XP</span>
        ${streak >= 2 ? `
          <span class="pill-streak-tag" title="${streak} exercises solved independently in a row">
            🔥 ${streak}
          </span>
        ` : ''}
      </div>
    `;
  }

  /**
   * Displays a non-blocking, accessible toast alert when an achievement is earned.
   * @param {Object} achievement
   */
  showToast(achievement) {
    if (typeof document === 'undefined') return;

    if (!this.toastContainer) {
      this.toastContainer = document.querySelector('#achievement-toast-container');
      if (!this.toastContainer) {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'achievement-toast-container';
        this.toastContainer.className = 'achievement-toast-container';
        this.toastContainer.setAttribute('role', 'alert');
        this.toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.toastContainer);
      }
    }

    // Limit visible toasts to at most 1 to avoid blocking workspace (P2 UI/UX)
    while (this.toastContainer.children.length >= 1) {
      const oldest = this.toastContainer.firstChild;
      if (oldest) this.toastContainer.removeChild(oldest);
    }

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-icon">${esc(achievement.icon || '🏆')}</div>
      <div class="toast-body">
        <div class="toast-header">Achievement Unlocked!</div>
        <div class="toast-title">${esc(achievement.title)}</div>
        <div class="toast-desc">${esc(achievement.description)}</div>
      </div>
      <div class="toast-xp">+${achievement.xpReward} XP</div>
      <button class="toast-close" title="Dismiss">✕</button>
    `;

    const dismiss = () => {
      toast.classList.add('dismissing');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', (e) => {
      e.stopPropagation();
      dismiss();
    });

    toast.addEventListener('click', () => {
      dismiss();
      this.openModal();
    });

    this.toastContainer.appendChild(toast);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (toast.parentNode && toast.classList && !toast.classList.contains('dismissing')) {
        dismiss();
      }
    }, 5000);
  }

  /**
   * Opens the interactive achievements modal drawer.
   */
  openModal() {
    if (typeof document === 'undefined') return;
    this.closeModal();

    const snapshot = this.engine ? this.engine.getSnapshot() : {
      xp: 0,
      level: 1,
      levelName: 'C++ Beginner',
      progressPercentage: 0,
      unlockedAchievements: {},
      unlockedCount: 0,
      totalAchievements: Object.keys(ACHIEVEMENTS).length
    };

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'achievements-modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-label', 'Achievements and Level Progress');

    const allAchievements = Object.values(ACHIEVEMENTS);

    modalBackdrop.innerHTML = `
      <div class="achievements-modal">
        <div class="achievements-modal-header">
          <div class="achievements-modal-title">
            <span>🏆</span>
            <span>Your C++ Progression & Achievements</span>
          </div>
          <button class="achievements-modal-close" data-action="close-modal" title="Close">✕</button>
        </div>

        <div class="achievements-modal-body">
          <div class="achievements-summary-banner">
            <div class="summary-level-info">
              <div>Current Rank: <b>Level ${snapshot.level} — ${esc(snapshot.levelName)}</b></div>
              <small>${snapshot.progressPercentage}% progress to next rank</small>
            </div>
            <div class="summary-xp-total">
              <b>${snapshot.xp} Total XP</b>
              <div><small>${snapshot.unlockedCount} / ${snapshot.totalAchievements} Badges Unlocked</small></div>
            </div>
          </div>

          <div class="achievements-grid">
            ${allAchievements.map(ach => {
              const isUnlocked = Boolean(snapshot.unlockedAchievements[ach.id]);
              return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                  <div class="card-icon">${esc(ach.icon)}</div>
                  <div class="card-body">
                    <div class="card-title-row">
                      <span class="card-title">${esc(ach.title)}</span>
                      <span class="card-reward">+${ach.xpReward} XP</span>
                    </div>
                    <div class="card-desc">${esc(ach.description)}</div>
                    <div class="card-status">${isUnlocked ? '✓ UNLOCKED' : '🔒 IN PROGRESS'}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop || e.target.closest('[data-action="close-modal"]')) {
        this.closeModal();
      }
    });

    const keyListener = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', keyListener);
    }
    modalBackdrop._keyListener = keyListener;

    document.body.appendChild(modalBackdrop);
    this.modalElement = modalBackdrop;
  }

  closeModal() {
    if (this.modalElement) {
      if (typeof window !== 'undefined' && this.modalElement._keyListener) {
        window.removeEventListener('keydown', this.modalElement._keyListener);
      }
      if (this.modalElement.parentNode) {
        this.modalElement.parentNode.removeChild(this.modalElement);
      }
      this.modalElement = null;
    }
  }

  destroy() {
    if (this.unbindEventBus) this.unbindEventBus();
    this.closeModal();
    if (this.toastContainer && this.toastContainer.parentNode) {
      this.toastContainer.parentNode.removeChild(this.toastContainer);
    }
  }
}

function esc(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

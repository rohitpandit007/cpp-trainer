/**
 * Visual Primitives for C++ Concept Visualization (Phase D3).
 * Reusable DOM & SVG rendering components for memory boxes, call stack frames,
 * pointer relationship arrows, class blueprints, object instances, and player controls.
 */

export const VisualPrimitives = {
  /**
   * Renders variable memory slots.
   * @param {Array<Object>} variables
   * @param {string} [highlightTarget]
   * @returns {string} HTML string
   */
  renderVariables(variables = [], highlightTarget = '') {
    if (!variables || variables.length === 0) return '';

    return `
      <div class="vis-section vis-memory-section">
        <div class="vis-section-title">
          <span>🧠 STACK MEMORY (Variables)</span>
          <small class="provenance-tag">EDUCATIONAL MODEL</small>
        </div>
        <div class="vis-variable-grid">
          ${variables.map(v => {
            const isHighlighted = highlightTarget === v.name || v.changed;
            return `
              <div class="vis-variable-card ${isHighlighted ? 'highlight-pulse' : ''} ${v.isShadowed ? 'shadowed' : ''}">
                <div class="var-header">
                  <span class="var-type">${esc(v.type || 'auto')}</span>
                  <span class="var-name">${esc(v.name)}</span>
                  ${v.address ? `<span class="var-addr">${esc(v.address)}</span>` : ''}
                </div>
                <div class="var-body">
                  <div class="var-value ${v.changed ? 'value-changed' : ''}">
                    ${v.previousValue ? `<span class="old-val">${esc(v.previousValue)} ➔</span>` : ''}
                    <strong class="curr-val">${esc(v.value)}</strong>
                  </div>
                  ${v.isAlias ? '<span class="alias-pill">REFERENCE ALIAS</span>' : ''}
                  ${v.isShadowed ? '<span class="shadowed-pill">SHADOWED IN INNER SCOPE</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Renders the Call Stack frames.
   * @param {Array<Object>} frames
   * @param {string} [highlightTarget]
   * @returns {string} HTML string
   */
  renderCallStack(frames = [], highlightTarget = '') {
    if (!frames || frames.length === 0) return '';

    // Stack frames render with the newest (active) frame on top
    const displayFrames = [...frames].reverse();

    return `
      <div class="vis-section vis-stack-section">
        <div class="vis-section-title">
          <span>📚 CALL STACK (Function Execution)</span>
          <small class="provenance-tag">LIFO CALL FRAMES</small>
        </div>
        <div class="vis-stack-container">
          ${displayFrames.map((frame, idx) => {
            const isTop = idx === 0;
            const isHighlighted = highlightTarget && frame.name.includes(highlightTarget);
            return `
              <div class="vis-stack-frame ${frame.isActive ? 'frame-active' : 'frame-suspended'} ${isHighlighted ? 'highlight-pulse' : ''}">
                <div class="frame-header">
                  <span class="frame-tag">${isTop ? '▶ TOP (ACTIVE)' : '⏸ SUSPENDED'}</span>
                  <strong class="frame-name">${esc(frame.name)}</strong>
                </div>
                ${frame.locals && frame.locals.length > 0 ? `
                  <div class="frame-locals">
                    ${frame.locals.map(l => `
                      <span class="local-pill">
                        <b>${esc(l.name)}:</b> <code>${esc(l.value)}</code>
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
                ${frame.returnValue ? `
                  <div class="frame-return">
                    <span>Return Value:</span> <strong>${esc(frame.returnValue)}</strong>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Renders Dynamic Heap memory allocations.
   * @param {Array<Object>} heapObjects
   * @returns {string} HTML string
   */
  renderHeap(heapObjects = []) {
    if (!heapObjects || heapObjects.length === 0) return '';

    return `
      <div class="vis-section vis-heap-section">
        <div class="vis-section-title">
          <span>🌐 HEAP MEMORY (new / delete)</span>
          <small class="provenance-tag">DYNAMIC LIFETIME</small>
        </div>
        <div class="vis-heap-grid">
          ${heapObjects.map(h => `
            <div class="vis-heap-card ${h.isFreed ? 'heap-freed' : 'heap-active'}">
              <div class="heap-header">
                <span class="heap-id">${esc(h.id)}</span>
                <span class="heap-type">${esc(h.type)}</span>
              </div>
              <div class="heap-body">
                <strong>${esc(h.value || h.type)}</strong>
                ${h.vptr ? `<small class="vptr-tag">vptr ➔ ${esc(h.vptr)}</small>` : ''}
                ${h.isFreed ? '<span class="freed-badge">DEALLOCATED</span>' : '<span class="alive-badge">ALLOCATED</span>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Renders Class Blueprint structures (Type declarations).
   * @param {Array<Object>} classes
   * @returns {string} HTML string
   */
  renderClasses(classes = []) {
    if (!classes || classes.length === 0) return '';

    return `
      <div class="vis-section vis-classes-section">
        <div class="vis-section-title">
          <span>📐 CLASS BLUEPRINTS (Type Declarations)</span>
          <small class="provenance-tag">STATIC DEFINITIONS</small>
        </div>
        <div class="vis-class-grid">
          ${classes.map(c => `
            <div class="vis-class-box ${c.isAbstract ? 'class-abstract' : ''}">
              <div class="class-title-bar">
                <strong>${esc(c.name)}</strong>
                ${c.isAbstract ? '<span class="abstract-badge">ABSTRACT (=0)</span>' : ''}
                ${c.baseClass ? `<span class="base-badge">: ${esc(c.baseClass)}</span>` : ''}
              </div>
              ${c.members && c.members.length > 0 ? `
                <div class="class-members-block">
                  <small>MEMBER ATTRIBUTES:</small>
                  ${c.members.map(m => `<div><code>${esc(m.type)} ${esc(m.name)};</code></div>`).join('')}
                </div>
              ` : ''}
              ${c.methods && c.methods.length > 0 ? `
                <div class="class-methods-block">
                  <small>METHODS:</small>
                  ${c.methods.map(fn => `<div><code>${esc(fn)}</code></div>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Renders instantiated Objects in memory.
   * @param {Array<Object>} objects
   * @returns {string} HTML string
   */
  renderObjects(objects = []) {
    if (!objects || objects.length === 0) return '';

    return `
      <div class="vis-section vis-objects-section">
        <div class="vis-section-title">
          <span>📦 OBJECT INSTANCES (Active in Memory)</span>
          <small class="provenance-tag">CONCRETE MEMORY LAYOUT</small>
        </div>
        <div class="vis-object-grid">
          ${objects.map(obj => `
            <div class="vis-object-box ${obj.changed ? 'highlight-pulse' : ''}">
              <div class="obj-header">
                <strong>${esc(obj.name)} : ${esc(obj.className)}</strong>
                ${obj.status ? `<span class="status-badge">${esc(obj.status)}</span>` : ''}
              </div>
              <div class="obj-body">
                ${obj.subobjects ? `
                  <div class="subobjects-container">
                    <small>EMBEDDED BASE SUBOBJECT:</small>
                    ${obj.subobjects.map(s => `
                      <div class="subobject-card">
                        <b>${esc(s.name)}</b>
                        ${s.methods ? `<div><code>${s.methods.join(', ')}</code></div>` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                ${obj.members ? `
                  <div class="members-table">
                    ${Object.entries(obj.members).map(([k, v]) => `
                      <div class="member-row">
                        <span class="mem-key">${esc(k)}:</span>
                        <span class="mem-val"><code>${esc(v)}</code></span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Renders relationship connection badges (pointers, references, inheritance, dispatch).
   * @param {Array<Object>} relationships
   * @returns {string} HTML string
   */
  renderRelationships(relationships = []) {
    if (!relationships || relationships.length === 0) return '';

    return `
      <div class="vis-relationships-bar">
        <span class="rel-label">🔗 ACTIVE CONNECTIONS:</span>
        <div class="rel-list">
          ${relationships.map(r => `
            <div class="rel-pill rel-${r.type}">
              <span class="rel-from">${esc(r.from)}</span>
              <span class="rel-arrow">${r.type === 'points_to' ? '➔ (points to)' : r.type === 'inherits' ? '▲ (inherits)' : r.type === 'dispatches' ? '⚡ (dynamic dispatch)' : '═ (alias)'}</span>
              <span class="rel-to">${esc(r.to)}</span>
              ${r.label ? `<small>(${esc(r.label)})</small>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Renders standard output log produced by cout.
   * @param {Array<string>} outputLog
   * @returns {string} HTML string
   */
  renderOutput(outputLog = []) {
    if (!outputLog || outputLog.length === 0) return '';

    return `
      <div class="vis-output-card">
        <div class="output-card-header">
          <span>📺 STANDARD OUTPUT (cout)</span>
        </div>
        <pre><code>${outputLog.map(esc).join('\n')}</code></pre>
      </div>
    `;
  },

  /**
   * Renders the Interactive Timeline player bar.
   * @param {number} currentIndex 0-indexed
   * @param {number} totalSteps
   * @param {boolean} isPlaying
   * @param {string} mode 'AUTO' | 'STEP'
   * @returns {string} HTML string
   */
  renderPlayerControls(currentIndex, totalSteps, isPlaying, mode) {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex >= totalSteps - 1;

    return `
      <div class="vis-player-bar">
        <div class="player-left">
          <button class="vis-btn" data-vis-action="prev" ${isFirst ? 'disabled' : ''} title="Previous step (Left Arrow)">◀ Prev</button>
          <button class="vis-btn vis-play-btn ${isPlaying ? 'btn-pause' : 'btn-play'}" data-vis-action="toggle-play" title="Play / Pause (Spacebar)">
            ${isPlaying ? '❚❚ Pause' : '▶ Play Auto'}
          </button>
          <button class="vis-btn" data-vis-action="next" ${isLast ? 'disabled' : ''} title="Next step (Right Arrow)">Next ▶</button>
          <button class="vis-btn vis-btn-subtle" data-vis-action="reset" title="Restart simulation (R)">↺ Reset</button>
        </div>

        <div class="player-center">
          <span class="step-indicator">Step <b>${currentIndex + 1}</b> of <b>${totalSteps}</b></span>
          <div class="step-dots">
            ${Array.from({ length: totalSteps }, (_, i) => `
              <span class="step-dot ${i === currentIndex ? 'active' : i < currentIndex ? 'completed' : ''}" data-vis-step="${i}"></span>
            `).join('')}
          </div>
        </div>

        <div class="player-right">
          <button class="mode-toggle-btn" data-vis-action="toggle-mode" title="Switch auto/step mode">
            Mode: <b>${mode}</b>
          </button>
          <button class="close-vis-btn" data-vis-action="close" title="Close visualizer drawer">✕</button>
        </div>
      </div>
    `;
  }
};

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

export const renderVariables = VisualPrimitives.renderVariables;
export const renderCallStack = VisualPrimitives.renderCallStack;
export const renderHeap = VisualPrimitives.renderHeap;
export const renderClasses = VisualPrimitives.renderClasses;
export const renderObjects = VisualPrimitives.renderObjects;
export const renderRelationships = VisualPrimitives.renderRelationships;
export const renderOutput = VisualPrimitives.renderOutput;
export const renderPlayerControls = VisualPrimitives.renderPlayerControls;

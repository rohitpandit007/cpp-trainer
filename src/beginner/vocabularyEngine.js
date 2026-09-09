/**
 * Contextual C++ Vocabulary Engine for CodeBloom Beginner Learning Layer.
 * Resolves C++ syntax tokens, keywords, and OOP terms to plain-language definitions,
 * practical analogies, and code snippets.
 */

import { VOCABULARY_TERMS } from './beginnerData.js';

export class VocabularyEngine {
  constructor() {
    this.terms = VOCABULARY_TERMS;
  }

  /**
   * Resolves a term key. Returns null if not found.
   */
  getTerm(query) {
    if (!query || typeof query !== 'string') return null;
    const clean = query.trim().toLowerCase();

    // Direct lookup
    if (this.terms[clean]) return this.terms[clean];

    // Alias map for common variations
    const aliases = {
      'semicolon': ';',
      'curly braces': '{}',
      'braces': '{}',
      'parentheses': '()',
      'parens': '()',
      'stream insertion': '<<',
      'stream extraction': '>>',
      'assignment': '=',
      'equals': '==',
      'not equals': '!=',
      'scope': '::',
      'pointer': '*',
      'reference': '&',
      'address': '&',
      'include': '#include',
      'and': '&&',
      'or': '||',
      'not': '!',
      'newline': 'endl',
      'line break': 'endl',
      'end line': 'endl'
    };

    if (aliases[clean] && this.terms[aliases[clean]]) {
      return this.terms[aliases[clean]];
    }

    return null;
  }

  getAllTerms() {
    return Object.values(this.terms);
  }

  /**
   * Renders an interactive, accessible vocabulary term card.
   * Displays the 4 structured dimensions:
   * 1. What it means
   * 2. What it does here
   * 3. Why it is needed
   * 4. Tiny code example
   */
  static renderTermCard(termObj) {
    if (!termObj) {
      return `
        <div class="vocab-card empty">
          <p>Select a keyword, symbol, or term to view its beginner-friendly explanation.</p>
        </div>
      `;
    }

    const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const whatItMeans = termObj.whatItMeans || termObj.plainDefinition;
    const whatItDoesHere = termObj.whatItDoesHere || termObj.analogy;
    const whyNeeded = termObj.whyNeeded || 'Essential foundational C++ language construct.';

    return `
      <div class="vocab-card" role="region" aria-label="Vocabulary explanation for ${esc(termObj.term)}">
        <div class="vocab-top">
          <code class="vocab-token">${esc(termObj.term)}</code>
          <span class="vocab-category">${esc(termObj.category)}</span>
        </div>
        <div class="vocab-def">
          <strong>1. What it means:</strong>
          <p>${esc(whatItMeans)}</p>
        </div>
        <div class="vocab-analogy">
          <strong>2. What it does here:</strong>
          <p>💡 ${esc(whatItDoesHere)}</p>
        </div>
        <div class="vocab-why">
          <strong>3. Why it is needed:</strong>
          <p>⚙️ ${esc(whyNeeded)}</p>
        </div>
        <div class="vocab-example">
          <strong>4. In Code Example:</strong>
          <pre><code>${esc(termObj.example)}</code></pre>
        </div>
      </div>
    `;
  }

  /**
   * Renders the interactive vocabulary bar / glossary explorer.
   */
  static renderGlossaryExplorer(activeTermKey = 'int') {
    const terms = Object.values(VOCABULARY_TERMS);
    const active = VOCABULARY_TERMS[activeTermKey] || terms[0];

    return `
      <div class="vocab-explorer">
        <div class="vocab-token-bar" role="tablist" aria-label="C++ vocabulary tokens">
          ${terms.map(t => {
            const key = Object.keys(VOCABULARY_TERMS).find(k => VOCABULARY_TERMS[k] === t) || t.term;
            const isSelected = t === active;
            return `
              <button class="vocab-chip ${isSelected ? 'active' : ''}" data-action="pick-vocab" data-term-key="${key}" role="tab" aria-selected="${isSelected}">
                ${t.term}
              </button>
            `;
          }).join('')}
        </div>
        <div class="vocab-display-slot">
          ${VocabularyEngine.renderTermCard(active)}
        </div>
      </div>
    `;
  }
}

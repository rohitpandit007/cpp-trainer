/**
 * Beginner UI Presentation Layer for CodeBloom.
 * Unifies the Beginner Hub view and provides contextual beginner drawers in the workspace.
 */

import { MentalModelsEngine } from './mentalModels.js';
import { VocabularyEngine } from './vocabularyEngine.js';
import { WhyExplanationEngine } from './whyExplanations.js';
import { ScaffoldingEngine } from './scaffoldingEngine.js';

export class BeginnerUI {
  /**
   * Renders the comprehensive Beginner Hub view.
   */
  static renderHub(activeTab = 'onboarding', engines = {}) {
    const { onboarding, predict, debug, decompose } = engines;

    const tabs = [
      { id: 'onboarding', label: '🚀 Zero-to-C++', icon: '🚀' },
      { id: 'models', label: '💡 Mental Models', icon: '💡' },
      { id: 'vocab', label: '📖 Vocabulary & Why', icon: '📖' },
      { id: 'predict', label: '🔬 Predict & Run', icon: '🔬' },
      { id: 'debug', label: '🛠️ Micro Debug', icon: '🛠️' },
      { id: 'decompose', label: '🧩 Deconstruct', icon: '🧩' },
      { id: 'scaffold', label: '📈 Scaffolding Ladder', icon: '📈' }
    ];

    let contentHtml = '';
    if (activeTab === 'onboarding') {
      contentHtml = onboarding ? onboarding.render() : '<p>Loading Onboarding...</p>';
    } else if (activeTab === 'models') {
      const models = new MentalModelsEngine().getAllModels();
      contentHtml = `
        <div class="models-collection">
          <div class="collection-header">
            <h2>The 5 Universal Mental Models of Programming</h2>
            <p>Master these 5 patterns and you can understand virtually any computer program.</p>
          </div>
          <div class="models-grid">
            ${models.map(m => MentalModelsEngine.renderCard(m)).join('')}
          </div>
        </div>
      `;
    } else if (activeTab === 'vocab') {
      contentHtml = `
        <div class="vocab-and-why-container">
          <section class="hub-section">
            <h2>Contextual C++ Vocabulary</h2>
            <p>Plain-English explanations for keywords, operators, and syntax marks.</p>
            ${VocabularyEngine.renderGlossaryExplorer()}
          </section>
          <section class="hub-section">
            <h2>Why Am I Writing This?</h2>
            <p>Understand the exact reason behind every line of C++ boilerplate.</p>
            ${WhyExplanationEngine.renderAccordion()}
          </section>
        </div>
      `;
    } else if (activeTab === 'predict') {
      contentHtml = predict ? predict.render() : '<p>Loading Predict Engine...</p>';
    } else if (activeTab === 'debug') {
      contentHtml = debug ? debug.render() : '<p>Loading Debug Engine...</p>';
    } else if (activeTab === 'decompose') {
      contentHtml = decompose ? decompose.render() : '<p>Loading Decomposition Trainer...</p>';
    } else if (activeTab === 'scaffold') {
      contentHtml = ScaffoldingEngine.renderProgressionOverview();
    }

    return `
      <main class="beginner-hub" role="region" aria-label="Beginner Learning Hub">
        <div class="hub-top-bar">
          <div class="hub-brand">
            <span class="hub-badge">BEGINNER LEARNING LAYER</span>
            <h1>Zero-to-C++ Foundation & Mental Models</h1>
          </div>
          <p class="hub-subtitle">Gentle, step-by-step guidance designed specifically for someone with zero prior programming experience.</p>
          
          <nav class="hub-tabs-nav" role="tablist" aria-label="Beginner Hub features">
            ${tabs.map(t => `
              <button class="hub-tab-btn ${activeTab === t.id ? 'active' : ''}" data-action="beginner-tab" data-tab-id="${t.id}" role="tab" aria-selected="${activeTab === t.id}">
                ${t.label}
              </button>
            `).join('')}
          </nav>
        </div>

        <div class="hub-tab-content">
          ${contentHtml}
        </div>
      </main>
    `;
  }

  /**
   * Renders a contextual assistant drawer / banner in the lesson workspace.
   */
  static renderWorkspaceBeginnerBanner(onboardingComplete = false) {
    if (onboardingComplete) return '';

    return `
      <div class="beginner-onboarding-banner" role="complementary" aria-label="Beginner onboarding invitation">
        <div class="banner-icon">🌱</div>
        <div class="banner-text">
          <strong>Brand new to programming?</strong>
          <span>Start with the interactive <b>Zero-to-C++ Onboarding</b> to master what code is, how to run it, and how to fix errors before starting Lesson 1.</span>
        </div>
        <button class="banner-btn" data-action="mode" data-mode="beginner">Start Onboarding →</button>
      </div>
    `;
  }
}

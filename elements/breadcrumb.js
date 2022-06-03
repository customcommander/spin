import {LitElement, html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';

customElements.define('spin-breadcrumb', class extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  static properties = {
    path: {
      type: Array
    }
  }

  constructor() {
    super();
    this.path = [];
  }

  #generateNavigateEvent(idx) {
    return JSON.stringify({
      type: 'NAVIGATE',
      to: idx
    });
  }

  render() {
    return html`
      <nav>
      ${repeat(this.path, ([idx]) => idx, ([idx, title]) => html`
        <button data-spin-event=${this.#generateNavigateEvent(idx)}>
          ${title}
        </button>
      `)}
      </nav>
    `;
  };
});

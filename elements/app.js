import {LitElement, html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {nanoid} from 'nanoid';
import './panels.js';
import './panel.js';

customElements.define('spin-app', class extends LitElement {
  static styles = css`
    :host {
      --app-width: 100vw;
      --app-height: 100vh;
    }

    #app {
      width: var(--app-width);
      height: var(--app-height);
      overflow: hidden;
    }

    spin-panels {
      width: calc(var(--app-width) * 50);
      height: var(--app-height);
    }
  `

  static properties = {
    loader: {},
    panels: {
      type: Array,
      state: true
    }
  }

  constructor() {
    super();
    this.panels = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadPanel();
  }

  async _loadPanel() {
    const id = nanoid();
    const panel = JSON.stringify(await window[this.loader]());
    this.panels = this.panels.concat([[id, panel]]); // array of pairs!
  }

  _clickHandler(ev) {
    const path = ev.composedPath();
    if (path.some(el => el.className === 'load-panel')) {
      this._loadPanel();
    }
  }

  render() {
    return html`
      <div id="app" @click=${this._clickHandler}>
        <spin-panels>
        ${repeat(this.panels, ([id]) => id, ([, x]) => html`
          <spin-panel content="${x}"></spin-panel>
        `)}
        </spin-panels>
      </div>
    `;
  }
});

import {LitElement, html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {nanoid} from 'nanoid';
import './panels.js';
import './panel.js';

const PANEL_ID_KEY = '@@spin/id';

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
    let panel;
    try {
      let response = await window[this.loader]();
      panel = Object.assign(response, {[PANEL_ID_KEY]: id});
    } catch (e) {
      panel = {
        [PANEL_ID_KEY]: id,
        head: {
          title: 'Error!'
        },
        body: {
          content: [
            'Something occurred…'
          ]
        }
      };
    }
    const panelJson = JSON.stringify(panel);
    this.panels = this.panels.concat([[id, panelJson]]); // array of pairs!
  }

  _clickHandler(ev) {
    const spinEl = ev.composedPath().find(el => el.dataset.spinEvent);
    if (!spinEl) return;
    const {name: spinEventName, ...spinEventData} = JSON.parse(spinEl.dataset.spinEvent);
    if (spinEventName == 'PANEL_LOAD') {
      this._loadPanel();
    }
  }

  render() {
    return html`
      <div id="app" @click=${this._clickHandler}>
        <spin-panels>
        ${repeat(this.panels, ([id]) => id, ([, json]) => html`
          <spin-panel content="${json}"></spin-panel>
        `)}
        </spin-panels>
      </div>
    `;
  }
});

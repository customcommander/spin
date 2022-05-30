import {LitElement, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styleMap} from 'lit/directives/style-map.js';
import {nanoid} from 'nanoid';
import {createMachine, interpret} from 'xstate';
import machineDefinition from './app.machine.json';
import './panels.js';
import './panel.js';

const PANEL_ID_KEY = '@@spin/id';

const LOADING_PANEL = id => ({
  [PANEL_ID_KEY]: id,
  head: {
    title: 'Loading'
  },
  body: {
    content: [
      'Fetching panel. Please wait.'
    ]
  }
});

// TODO: use `err`
const ERROR_PANEL = (id, err) => ({
  [PANEL_ID_KEY]: id,
  head: {
    title: 'Error!'
  },
  body: {
    content: [
      'Something occurred… :('
    ]
  }
});

customElements.define('spin-app', class extends LitElement {
  static properties = {
    loader: {},
    panels: {
      type: Array,
      state: true
    },
    focus: {
      type: Number,
      state: true
    }
  };

  #machina;
  #machinaService;

  constructor() {
    super();
    this.panels = [];
    this.focus = 0;
    this.#machina = createMachine(machineDefinition, {
      actions: {
        displayLoadingPanel: (_, {at}) => {
          const id = nanoid();
          const json = JSON.stringify(LOADING_PANEL(id));
          this.panels = this.panels.slice(0, at).concat([[id, json]]);
          this.focus = this.panels.length - 1;
        },
        displayPanel: (_, {panel}) => {
          const id = panel[PANEL_ID_KEY];
          const json = JSON.stringify(panel);
          this.panels = this.panels.slice(0, -1).concat([[id, json]]);
          this.focus = this.panels.length - 1;
        }
      }
    });
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.#machinaService = interpret(this.#machina);
    this.#machinaService.start();
    this._loadPanel();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#machinaService.stop();
  }

  async _loadPanel() {
    const id = nanoid();
    let panel;
    try {
      let response = await window[this.loader]();
      panel = Object.assign(response, {[PANEL_ID_KEY]: id});
    } catch (e) {
      panel = ERROR_PANEL(id);
    }
    this.#machinaService.send({type: 'PANEL_LOADED', panel});
  }

  _clickHandler(ev) {
    const spinEl = ev.composedPath().find(el => el.dataset.spinEvent);
    if (!spinEl) return;
    const spinEvent = JSON.parse(spinEl.dataset.spinEvent);
    if (spinEvent.type == 'PANEL_LOAD') {
      this.#machinaService.send(spinEvent); 
      this._loadPanel();
    }
  }

  #gridColumn(pos) {
    const isHome = this.focus == 0;
    const isPrimary = this.focus == pos;
    const isSecondary = (this.focus - 1) == pos;
    const isHiddenLeft = pos < (this.focus - 1);

    const cols = ( isHome       ? [151, 154]
                 : isPrimary    ? [152, 154]
                 : isSecondary  ? [151, 152]
                 : isHiddenLeft ? [151 - (this.focus - pos - 1), 151 - (this.focus - pos - 2)]
                                : [154 + (pos - this.focus - 1), 154 + (pos - this.focus)]);

    return {gridColumn: `${cols[0]}/${cols[1]}`};
  }

  render() {
    return html`
      <div @click=${this._clickHandler}>
        <spin-panels>
        ${repeat(this.panels, ([id]) => id, ([id, json], pos) => html`
          <spin-panel
            id="${id}"
            position="${pos}"
            content="${json}"
            style=${styleMap(this.#gridColumn(pos))}></spin-panel>
        `)}
        </spin-panels>
      </div>
    `;
  }
});

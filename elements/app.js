import {LitElement, html, css} from 'lit';
import {animate} from '@lit-labs/motion';
import {styleMap} from 'lit/directives/style-map.js';
import {repeat} from 'lit/directives/repeat.js';
import {nanoid} from 'nanoid';
import {createMachine, interpret, assign} from 'xstate';
import machineDefinition from './app.machine.json';
import './breadcrumb.js';
import './panels.js';
import './panel.js';

const generateLoadingPanel = () => ({
  head: {
    title: 'Loading'
  },
  body: {
    content: [
      'Fetching panel. Please wait.'
    ]
  }
});

const generateErrorPanel = (e) => ({
  head: {
    title: 'Error!'
  },
  body: {
    content: [
      {type: 'text', id: id(), content: [
        'error: '+ e.message
      ]}
    ]
  }
});

customElements.define('spin-app', class extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
    }

    #app {
      display: grid;
      grid-template-rows: 50px 1fr;
      width: 100%;
      height: 100%;
    }
  `;

  static properties = {
    loader: {},
    op: {
      type: Object
    },
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
        onPreload: assign(({focus}, {at}) => {
          this.#setPanel(at || focus, generateLoadingPanel());
          return {focus: at || focus};
        }),
        loadPanel: async (_, payload) => {
          try {
            let panel = await window[this.loader](payload?.op || this.op);
            this.#machinaService.send({type: 'PANEL_LOADED', panel});
          } catch (e) {
            this.#machinaService.send({type: 'PANEL_ERROR', error: e});
          }
        },
        focusPanel: ({focus}) => {
          this.focus = focus;
        },
        setErrorPanel: ({focus}, {error}) => {
          this.#setPanel(focus, generateErrorPanel(error));
        },
        setPanel: ({focus}, {panel}) => {
          this.#setPanel(focus, panel);
        },
        goToPanel: assign((_, {to: focus}) => {
          this.focus = focus;
          return {focus};
        })
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.#machinaService = interpret(this.#machina);
    this.#machinaService.start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#machinaService.stop();
  }

  #setPanel(idx, panel) {
    const id = nanoid();
    const {head: {title}} = panel;
    const panelJson = JSON.stringify(panel);
    this.panels = this.panels.slice(0, idx).concat([[id, title, panelJson]]);
  }

  #dispatchClick(ev) {
    const spinEl = ev.composedPath().find(el => el.dataset?.spinEvent);
    if (!spinEl) return;
    const spinEvent = JSON.parse(spinEl.dataset.spinEvent);
    this.#machinaService.send(spinEvent);
  }

  #indexToPosition(idx) {
    const isHome = this.focus == 0 && idx == 0;
    const isPrimary = this.focus == idx;
    const isSecondary = (this.focus - 1) == idx;
    const isHiddenLeft = idx < (this.focus - 1);
    let l, r;

    if (isHome) {
      [l, r] = [0, 0];
    } else if (isPrimary) {
      [l, r] = [33, 0];
    } else if (isSecondary) {
      [l, r] = [0, 67];
    } else if (isHiddenLeft) {
      [l, r] = [ -33 * (this.focus - 1 - idx)
               , 100 + (33 * (this.focus - 2 - idx)) ];
    } else {
      [l, r] = [ 100 + (33 * Math.abs(this.focus + 1 - idx))
               , -33 * (idx - this.focus) ];
    }

    return {left: `${l}%`, right: `${r}%`};
  }

  #generateBreadcrumb() {
    return JSON.stringify(
      this.panels.map(([, title], idx) => [idx, idx == 0 ? 'Home' : title]));
  }

  render() {
    const animOptions = { properties: ['left', 'right'] };
    return html`
      <div id="app" @click=${this.#dispatchClick}>
        <spin-breadcrumb path=${this.#generateBreadcrumb()}></spin-breadcrumb>
        <spin-panels>
        ${repeat(this.panels, ([id]) => id, ([,, json], idx) => html`
          <spin-panel
            index=${idx}
            content=${json}
            style=${styleMap(this.#indexToPosition(idx))}
            ${animate(animOptions)}></spin-panel>
        `)}
        </spin-panels>
      </div>
    `;
  }
});

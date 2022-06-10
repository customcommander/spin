import {LitElement, html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {choose} from 'lit/directives/choose.js';
import './menu.js';
import './text.js';

customElements.define('spin-panel', class extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-rows: 50px 1fr;
      position: absolute;
      top: 0;
      bottom: 0;
      overflow: hidden;
      border-right: 1px solid black;
    }

    .head {
      background-color: grey;
    }

    .body {
      background-color: whitesmoke;
      height: 100%;
      overflow: auto;
    }
  `;

  static properties = {
    content: {
      type: Object,
    }
  };

  render() {
    return html`
      <div class="head">${this.content.head.title}</div>
      <div class="body">
      ${repeat(this.content.body.content, c => c.id, c => html`
        ${choose(c.type, [
            ['menu', () => html`
              <spin-menu content=${JSON.stringify(c)}></spin-menu>`],
            ['text', () => html`
              <spin-text content=${JSON.stringify(c.content)}></spin-text>`]
        ])}
      `)}
      </div>
    `;
  };
});

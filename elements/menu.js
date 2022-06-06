import {LitElement, html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {ifDefined} from 'lit/directives/if-defined.js';

customElements.define('spin-menu', class extends LitElement {
  static styles = css`
    ol {
      display: flex;
      flex-direction: column;
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    li {
      flex: 1 1 50px;
      border-bottom: 1px solid black;
      display: grid;
      grid-template-columns: 50px 1fr 50px;
      grid-template-rows: 1fr;
    }

    .left {
    }

    .main {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr;
    }

    .right {
    }

    li[data-spin] {
      cursor: pointer;
    }

    li[data-spin]:hover {
      background-color: lavender;
    }
  `

  static properties = {
    content: {
      type: Object
    }
  }

  render() {
    return html`
      <ol>
      ${repeat(this.content.items, item => item.id, item => {
        const payload = !item.op ? null : JSON.stringify({type: 'PANEL_LOAD', op: item.op});
        return html`
        <li data-spin=${ifDefined(payload)}>
          <div class="left">
            🌯
          </div>
          <div class="main">
            <span>${item.name}</span>
            <span>Some description goes here</span>
          </div>
          <div class="right">
            ►
          </div>
        </li>
      `})}
      </ol>
    `;
  }
});

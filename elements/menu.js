import {LitElement, html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';

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
      ${repeat(this.content.items, item => item.id, item => html`
        <li>${item.name}</li>
      `)}
      </ol>
    `;
  }
});

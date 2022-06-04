import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js';

customElements.define('spin-text', class extends LitElement {
  static properties = {
    content: {
      type: Array
    }
  }

  render() {
    console.log(this.content)
    return html`
      ${map(this.content, txt => html`
        <p>${txt}</p>
      `)}
    `;
  }
});

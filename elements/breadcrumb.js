import {LitElement, html, css} from 'lit';

customElements.define('spin-breadcrumb', class extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <button>BACK</button>
      <button>FORWARD</button>
    `;
  };
});

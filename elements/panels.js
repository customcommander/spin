import {LitElement, html, css} from 'lit';

customElements.define('spin-panels', class extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: repeat(150, 1fr);
      grid-template-rows: 1fr;
    }
  `

  render() {
    return html`
      <slot></slot>
    `;
  }
});

import {LitElement, html, css} from 'lit';

customElements.define('spin-panels', class extends LitElement {
  static styles = css`
    :host {
      position: relative;
      overflow: hidden;
    }

    #panels {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  `

  render() {
    return html`
      <slot></slot>
    `;
  }
});

import {LitElement, html, css} from 'lit';

customElements.define('spin-panels', class extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
    }

    #grid {
      display: grid;
      position: absolute;
      top: 0;
      right: calc(100vw * -50);
      bottom: 0;
      left: calc(100vw * -50);
      grid-template-columns: repeat(303, 1fr);
      grid-template-rows: 1fr;
    }
  `

  render() {
    return html`
      <div id="grid">
        <slot></slot>
      </div>
    `;
  }
});

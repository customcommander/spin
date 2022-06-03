import {LitElement, html, css} from 'lit';

customElements.define('spin-panel', class extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-rows: 1fr 9fr;
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .head {
      background-color: grey;
    }

    .body {
      background-color: whitesmoke;
    }
  `;

  static properties = {
    content: {
      type: Object,
    },
    index: {
      type: Number
    }
  };

  render() {
    return html`
      <div class="head">${this.content.head.title}</div>
      <div class="body">
        ${this.content.body.content[0]}
        <button data-spin-event=${JSON.stringify({type: 'PANEL_LOAD', at: (this.index + 1)})}>
          more panel
        </button>
      </div>
    `;
  };
});

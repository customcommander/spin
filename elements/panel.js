import {LitElement, html, css} from 'lit';

customElements.define('spin-panel', class extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 9fr;
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
    position: {
      type: Number
    }
  };

  render() {
    return html`
      <div class="head">${this.content.head.title}</div>
      <div class="body">
        ${this.content.body.content[0]}
        <button data-spin-event="${JSON.stringify({type: 'PANEL_LOAD', at: this.position+1})}">
          more panel
        </button>
      </div>
    `;
  };
});

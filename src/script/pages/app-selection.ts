import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-selection')
export class AppSelection extends LitElement {
  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <h2>Selection Page</h2>
      </div>
    `;
  }
}

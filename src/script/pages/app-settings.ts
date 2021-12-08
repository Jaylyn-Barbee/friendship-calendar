import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-settings')
export class AppSettings extends LitElement {
  static get styles() {
    return css``;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <h2>Settings</h2>
      </div>
    `;
  }
}

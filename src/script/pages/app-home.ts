import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { test } from '../services/calendar-api-test';
// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  static get styles() {
    return css`
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
  }


  render() {
    return html`
    <button @click="${() => test()}"> test </button>
    `;
  }
}

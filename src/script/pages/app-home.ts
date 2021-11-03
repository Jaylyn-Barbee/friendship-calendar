import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { months } from '../services/data';

import "../components/date-cell";
// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/

  static get styles() {
    return css`
    #page {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }

    #calGrid{
      display: grid;
      grid-template-columns: 1fr 1fr  1fr 1fr  1fr 1fr 1fr;
      grid-template-rows:  1fr 1fr 1fr 1fr 1fr;
    }
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
    <div id="page">
      <div id="calGrid">
        ${months[0].days.map((d: any) => html`<app-cell .day=${d} .month=${"january"} .year=${2021}></app-cell>`)}
      </div>
    </div>
    `;
  }
}

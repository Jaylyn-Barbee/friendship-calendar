import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import "../components/date-cell";

import "../components/calendar";
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 75%;
      width: 75%;
      margin: 0 auto;
    }
    #calHeader {
      background: green;
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/

    // get month, day, year from current_data
    // set current_day flag on date-cell

    // saves index of days of the week for which the first day of this month started.

  }

  render() {
    return html`
    <div id="page">
      <div id="calHeader">
        <h1>[Insert Friend Group Name Here]'s Calendar</h1>
      </div>
      <app-calendar></app-calendar>

    </div>
    `;
  }
}

import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import "../components/date-cell";

import "../components/calendar";
// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {

  @property() groupName: any = "JETT";
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/

  static get styles() {
    return css`
    #page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin: 0 auto;
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
    // let myEvents = getEvents();
  }

  render() {
    return html`
    <div id="page">
      <app-calendar></app-calendar>
    </div>
    `;
  }
}

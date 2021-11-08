import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { months, days_of_week } from '../services/data';

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

    #calendar {
      display: flex;
      flex-direction: column;
    }

    #days_headers {
      display: grid;
      grid-template-columns: repeat(7, minmax(100px, 300px));
      grid-template-rows: repeat(1, minmax(25px, 50px));
    }

    .day_header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 16px;
      font-weight: bolder;
      border: 1px solid black;
    }

    #calHolder {
      display: grid;
      width: 100%;
      grid-template-columns: 2fr 5fr 2fr;
    }

    #months {
      background: red;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #months-header{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 10%;
    }

    #months-header h2{
      font-size: 16px;
      font-weight: bolder;
      margin: 0;
    }

    .month_name {
      height: 7.5%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bolder;
    }



    #calGrid{
      display: grid;
      grid-template-columns: repeat(7, minmax(100px, 300px));
      grid-template-rows:  repeat(5, minmax(50px, 100px));;
    }

    #events {
      background: red;
      height: 100%;
    }

    #events h2{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bolder;
      margin: 0;
      height: 10%;

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

  }

  render() {
    return html`
    <div id="page">
      <div id="calHeader">
        <h1>[Insert Friend Group Name Here]'s Calendar</h1>
      </div>
      <div id="calHolder">
        <div id="months">
          <div id="months-header">
            <ion-icon name="arrow-dropleft"></ion-icon>
            <h2>[Current Year]</h2>
            <ion-icon name="arrow-dropright"></ion-icon>
          </div>
          ${months.map((m: any) => html`<span class="month_name">${m.name}</span>`)}

        </div>

        <div id="calendar">
          <div id="days_headers">
            ${days_of_week.map((d: string) => html`<span class="day_header">${d}</span>`)}
          </div>
          <div id="calGrid">
            ${months[0].days.map((d: any) => html`<app-cell .day=${d} .month=${"january"} .year=${2021}></app-cell>`)}
          </div>
        </div>

        <div id="events">
          <h2>Today's Events</h2>
        </div>
      </div>

    </div>
    `;
  }
}

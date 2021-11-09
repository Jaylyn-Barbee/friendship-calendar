import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { event } from "../types/interfaces"
import { getEvents } from "../services/calendar-api"

@customElement('app-cell')
export class AppCell extends LitElement {
  @property() date: any;
  @property({type: Array}) events!: event[];
  @property() week_day: any;
  @property() day: any;
  @property() month: any;
  @property() year: any;
  @property() active: any;

  static get styles() {
    return css`

        #cell {
            height: 100%;
            width: 100%;
            background: white;
        }
        #day {
            display: flex;
            justify-content: flex-start;
            align-items: baseline;
            grid-column: 2;
            width: 100%;
            height: 50%;
            font-size: 24px;
            font-weight: bolder;
        }

        #bottom{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50%;
        }
        #today-cell {
            height: 100%;
            width: 100%;
            background: lightblue;
        }
        `;

  }

  constructor() {
    super();
  }

  firstUpdated(){
      this.date = new Date();
      var test_event1: event = {name: "Test Name", location: "Test Location", attendees: ["Test User 1", "Test User 2"], date: this.date}
      var test_event2: event = {name: "Test Name 2", location: "Test Location 2", attendees: ["Test User 1", "Test User 2", "Test User 3"], date: this.date}
      this.events = [test_event1, test_event2];

      //getEvents() //next steps

      this.requestUpdate;
  }

  render() {
    return html`

        ${ this.active == "false" ?

        html`
        <div id="cell">
            <span id="day">${this.day}</span>
            <span id="bottom">
            ${this.events && this.events.length > 0 ? html`<ion-icon name="medical"></ion-icon>` : null}
            </span>
        </div>`
        :
        html`
        <div id="today-cell">
            <span id="day">${this.day}</span>
            <span id="bottom">
            ${this.events && this.events.length > 0 ? html`<ion-icon name="medical"></ion-icon>` : null}
            </span>
        </div>`
    }


    `;
  }
}

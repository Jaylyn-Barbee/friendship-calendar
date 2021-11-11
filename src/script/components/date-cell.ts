import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { event } from "../types/interfaces"
import { events, months } from "../services/data"


@customElement('app-cell')
export class AppCell extends LitElement {
  @property() date: any;
  @property({type: Array}) events!: event[];
  @property() week_day: any;
  @property() day: any;
  @property() month: any;
  @property() year: any;
  @property() active: any;
  @property() event_today: any = false;

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

      for(const i of events){
        var year = i.date.getFullYear();
        var month = i.date.getMonth()+1;
        var day = i.date.getDate();

        let event_date = year + "-" + month + "-" + day;

        if(this.year + "-" + (this.month + 1) + "-" + this.day  === event_date){
            this.event_today = true;
        }
      }

      //getEvents() //next steps

      this.requestUpdate;
  }

  handleClick() {
      let stringDate = months[this.month].name + " " + this.day + ", " + this.year;

      let event = new CustomEvent('day-clicked', {
        detail: {
          selected_day: stringDate
        }
      });
      this.dispatchEvent(event);
      // fire a custom event with data, in calendar have a listener, calendar will then pass it ot the agenda
  }

  render() {
    return html`

        ${ this.active == "false" ?

        html`
        <div id="cell" @click=${() => this.handleClick()}>
            <span id="day">${this.day}</span>
            <span id="bottom">
            ${this.event_today ? html`<ion-icon name="medical"></ion-icon>` : null}
            </span>
        </div>`
        :
        html`
        <div id="today-cell" @click=${() => this.handleClick()}>
            <span id="day">${this.day}</span>
            <span id="bottom">
            ${this.event_today ? html`<ion-icon name="medical"></ion-icon>` : null}
            </span>
        </div>`
    }


    `;
  }
}

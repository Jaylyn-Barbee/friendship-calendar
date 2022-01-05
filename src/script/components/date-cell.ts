import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { months } from "../services/data"
// import { areThereEventsToday } from "../services/calendar-api"

@customElement('app-cell')
export class AppCell extends LitElement {
  @state() date: any;
  @state() week_day: any;
  @property() day: any;
  @property() month: any;
  @property() year: any;
  @property() active: any;


  static get styles() {
    return css`

        #cell {
            height: 100%;
            width: 100%;
        }
        #hat {
            height: 5%;
            width: 100%;
        }
        .color {
            background: #6C375F;
        }
        #day {
            display: flex;
            justify-content: flex-start;
            align-items: baseline;
            grid-column: 2;
            width: 100%;
            height: 95%;
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
        }
        .selected {
            background: #F1E4EE;
        }
        .inactive {
            background: white;
        }

        `;

  }

  constructor() {
    super();
  }

  async firstUpdated(){

    //this.event_today = await areThereEventsToday(this.day, this.month, this.year);

      this.requestUpdate;
  }

  handleClick(e: any) {

      let stringDate = months[this.month].name + " " + this.day + ", " + this.year;
      let numDate_in = this.year + "-" + ("00" + ((this.month + 1) as number)).slice(-2) + "-" + ("00" + (this.day as number)).slice(-2);
      let event = new CustomEvent('day-clicked', {
        detail: {
            selected_day: stringDate,
            selected_cell: (e.path[1] as HTMLBodyElement),
            numDate: numDate_in
        }
      });
      this.dispatchEvent(event);
  }

  render() {
    return html`

        ${ this.active == "false" ?

        html`
        <div id="cell" @click=${(e: any) => this.handleClick(e)}>
            <div id="hat"></div>
            <span id="day">${this.day}</span>
        </div>`
        :
        html`
        <div id="today-cell" @click=${(e: any) => this.handleClick(e)}>
            <div id="hat" class="color"></div>
            <span id="day">${this.day}</span>
        </div>`
    }
    `;
  }
}

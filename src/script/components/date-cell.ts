import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { getGroupEvents } from '../services/database';

@customElement('app-cell')
export class AppCell extends LitElement {
  @state() date: any;
  @state() week_day: any;
  @state() event_today: any;
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
            height: 47.5%;
            font-size: 24px;
            font-weight: bolder;
        }

        #bottom{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 47.5%;
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

        @media(max-width: 450px){

            #day {
                font-size: 12px;
                justify-content: center;
                align-items: center;
            }

            #bottom {
                font-size: 12px;
            }
        }



        `;

  }

  constructor() {
    super();
  }

  async firstUpdated(){

    await this.areThereEventsToday(this.day, this.month, this.year);

    this.requestUpdate;
  }

  async areThereEventsToday(day: any, month: any, year: any){

    let today = year + "-" + ("00" + ((month + 1) as number)).slice(-2) + "-" + ("00" + (day as number)).slice(-2);
    let event_list = await getGroupEvents();
    event_list = event_list.map((e: any) => e.event.start.dateTime.split("T")[0]);

    let hit_list = event_list.filter( (date: any) => date === today);

    this.event_today = hit_list.length > 0;
  }

  handleClick(e: any) {

      let stringDate = this.year + "-" + ("00" + ((this.month + 1) as number)).slice(-2) + "-" + ("00" + (this.day as number)).slice(-2) + "T00:00";
      let limit_in = this.year + "-" + ("00" + ((this.month + 1) as number)).slice(-2) + "-" + ("00" + ((parseInt(this.day) + 1) as number)).slice(-2) + "T00:00";
      let event = new CustomEvent('day-clicked', {
        detail: {
            selected_day: stringDate,
            day_limit: limit_in,
            selected_cell: (e.path[1] as HTMLBodyElement),
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
            <span id="bottom">
                ${this.event_today ? html`<ion-icon name="medical"></ion-icon>` : null}
            </span>
        </div>`
        :
        html`
        <div id="today-cell" @click=${(e: any) => this.handleClick(e)}>
            <div id="hat" class="color"></div>
            <span id="day">${this.day}</span>
            <span id="bottom">
                ${this.event_today ? html`<ion-icon name="medical"></ion-icon>` : null}
            </span>
        </div>`
    }
    `;
  }
}

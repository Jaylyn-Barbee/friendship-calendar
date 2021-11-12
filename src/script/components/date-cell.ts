import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { event } from "../types/interfaces"
import { months } from "../services/data"


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
            height: 45%;
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

        `;

  }

  constructor() {
    super();
  }

  firstUpdated(){
      this.requestUpdate;
  }

  handleClick(e: any) {

      let stringDate = months[this.month].name + " " + this.day + ", " + this.year;

      let event = new CustomEvent('day-clicked', {
        detail: {
            selected_day: stringDate,
            selected_cell: (e.path[1] as HTMLBodyElement)
        }
      });
      this.dispatchEvent(event);
      // fire a custom event with data, in calendar have a listener, calendar will then pass it ot the agenda
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
        <div id="today-cell" @click=${() => this.handleClick()}>
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

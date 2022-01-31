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
  @state() showLoader: any | null = false;


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

        .loader {
        transform: rotateZ(45deg);
        perspective: 1000px;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        color: #000;
      }
        .loader:before,
        .loader:after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: inherit;
          height: inherit;
          border-radius: 50%;
          transform: rotateX(70deg);
          animation: 1s spin linear infinite;
        }
        .loader:after {
          color: #DDBDD5;
          transform: rotateY(70deg);
          animation-delay: .4s;
        }

      @keyframes rotate {
        0% {
          transform: translate(-50%, -50%) rotateZ(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotateZ(360deg);
        }
      }

      @keyframes rotateccw {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(-360deg);
        }
      }

      @keyframes spin {
        0%,
        100% {
          box-shadow: .2em 0px 0 0px currentcolor;
        }
        12% {
          box-shadow: .2em .2em 0 0 currentcolor;
        }
        25% {
          box-shadow: 0 .2em 0 0px currentcolor;
        }
        37% {
          box-shadow: -.2em .2em 0 0 currentcolor;
        }
        50% {
          box-shadow: -.2em 0 0 0 currentcolor;
        }
        62% {
          box-shadow: -.2em -.2em 0 0 currentcolor;
        }
        75% {
          box-shadow: 0px -.2em 0 0 currentcolor;
        }
        87% {
          box-shadow: .2em -.2em 0 0 currentcolor;
        }
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

            .loader {
              width: 24px;
              height: 24px;
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

    this.showLoader = true

    let today = year + "-" + ("00" + ((month + 1) as number)).slice(-2) + "-" + ("00" + (day as number)).slice(-2);
    let event_list = await getGroupEvents();
    event_list = event_list.map((e: any) => e.event.start.dateTime.split("T")[0]);

    let hit_list = event_list.filter( (date: any) => date === today);

    this.event_today = hit_list.length > 0;
    this.showLoader = false;
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
                ${this.showLoader ?
                    html`<span class="loader"></span>` :
                    html`${this.event_today ? html`<ion-icon name="medical"></ion-icon>` : null}`
                }
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

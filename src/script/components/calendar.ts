import { LitElement, css, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth } from '../services/data';

@customElement('app-calendar')
export class AppCalendar extends LitElement {
    @property() monthIndex: any;
    @state() year: any;
    @state() day: any;
    @state() date_string: any;
    @property() _calendarTemplate: any = [];
    @property() _daysTemplate: any = [];
    @property() last_selected: any;

  static get styles() {
    return css`


      #calHolder {
        display: grid;
        width: 100%;
        grid-template-columns: 2fr 5fr 2fr;
        height: 650px;
      }

      #months {
        background: rgb(248, 248, 248);
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
        width: 100%;
      }

      .month_name:hover {
        cursor: pointer;
      }

      ion-icon:hover {
        cursor: pointer;
      }

      #days_headers {
        display: grid;
        grid-template-columns: repeat(7, minmax(100px, 300px));
        grid-template-rows: repeat(1, minmax(25px, 50px));
        border-bottom: 1px solid black;
      }

      .day_header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bolder;
      }

      #calendar {
        display: flex;
        flex-direction: column;
      }

      #calGrid {
        display: grid;
        grid-template-columns: repeat(7, minmax(100px, 300px));
        grid-template-rows:  repeat(5, auto-fill);
        height: 100%;
      }

      app-cell {
        border-bottom: 1px solid #dfdfdf;
      }

      app-cell:hover {
        cursor: pointer;
      }

      .selected {
        background: #F1E4EE;
      }

      #events {
        background: rgb(248, 248, 248);
        height: 100%;
        overflow-y: scroll;
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

      .loader {
        width: 60px;
        height: 60px;
        display: block;
        margin: 20px auto;
        position: relative;
        background: radial-gradient(ellipse at center, #ddbdd5 69%, rgba(0, 0, 0, 0) 70%), linear-gradient(to right, rgba(0, 0, 0, 0) 47%, #ddbdd5 48%, #ddbdd5 52%, rgba(0, 0, 0, 0) 53%);
        background-size: 20px 20px , 20px auto;
        background-repeat: repeat-x;
        background-position: center bottom, center -5px;
        box-sizing: border-box;
      }
      .loader::before,
      .loader::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        left: -20px;
        top: 0;
        width: 20px;
        height: 60px;
        background: radial-gradient(ellipse at center, #ddbdd5 69%, rgba(0, 0, 0, 0) 70%), linear-gradient(to right, rgba(0, 0, 0, 0) 47%, #ddbdd5 48%, #ddbdd5 52%, rgba(0, 0, 0, 0) 53%);
        background-size: 20px 20px , 20px auto;
        background-repeat: no-repeat;
        background-position: center bottom, center -5px;
        transform: rotate(0deg);
        transform-origin: 50% 0%;
        animation: animPend 1s linear infinite alternate;
      }
      .loader::after {
        animation: animPend2 1s linear infinite alternate;
        left: 100%;
      }

      @keyframes animPend {
        0% {
          transform: rotate(22deg);
        }
        50% {
          transform: rotate(0deg);
        }
      }

      @keyframes animPend2 {
        0%, 55% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(-22deg);
        }
      }

        `;

  }

  constructor() {
    super();
  }

  firstUpdated(){
    this.monthIndex = current_date.getMonth();
    this.year = current_date.getFullYear();
    this.day = current_date.getDate();
    this.date_string = this.stringTheDate();
    this.generateCal(this.monthIndex, this.year);
    this.requestUpdate();
  }

  stringTheDate() {
    let month = months[this.monthIndex].name;
    let day = this.day;
    let year = this.year;
    return month + " " + day + ", " + year;
  }

  setMonthIndex(monthIndex: any) {
    this.monthIndex = monthIndex;
    this.generateCal(this.monthIndex, this.year);
    this.requestUpdate();
  }

  generateCal(month: any, year: any) {
    this._calendarTemplate = [];
    this._daysTemplate = []
    let firstDay = (new Date(year, month)).getDay();
    let date = 1;

    for(let d = 0; d < 7; d++){
      this._daysTemplate.push(html`<span class="day_header">${days_of_week[d]}</span>`)
    }

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          this._calendarTemplate.push(html`<app-cell .active=${"false"}></app-cell>`)
        } else if (date > daysInMonth(month, year)) {
          break;
        } else {
          if (date === current_date.getDate() && month === current_date.getMonth() && year === current_date.getFullYear()) {
            this._calendarTemplate.push(html`<app-cell id="today" @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"true"}></app-cell>`)
          } else {
            this._calendarTemplate.push(html`<app-cell @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"false"}></app-cell>`)
          }
          date += 1;
        }
      }
    }
  }

  changeYear(direction: any){
    if(direction == "up"){
      this.year++;
    } else {
      this.year--;
    }
    this.generateCal(this.monthIndex, this.year);
    this.requestUpdate();
  }

  updateSelectedDay(day: string, cell: HTMLElement){

    // updating day for the purpose of showing events
    this.date_string = day;

    /*
    // updating style on highlighted day
    let allCells: any = []
    allCells = this.shadowRoot?.querySelectorAll("app-cell");

    if(!this.last_selected){
      this.last_selected = this.shadowRoot?.getElementById("today");
    }
    this.last_selected.classList.remove("selected");

    cell.classList.add("selected");

    this.last_selected = cell;
    */

    this.requestUpdate();
  }


  render() {
    return html`
        <div id="calHolder">

          <div id="months">
            <div id="months-header">
              <ion-icon name="arrow-dropleft" @click=${() => this.changeYear("down")}></ion-icon>
              <h2>${this.year}</h2>
              <ion-icon name="arrow-dropright" @click=${() => this.changeYear("up")}></ion-icon>
            </div>
            ${months.map((m: any) => html`<span class="month_name" @click=${() => this.setMonthIndex(m.i)}>${m.name}</span>`)}
          </div>

          <div id="calendar">
            <div id="days_headers">
                ${this._daysTemplate}
            </div>
            <div id="calGrid">
              ${this._calendarTemplate.map((cell: any) => html`${cell}`)}
            </div>
          </div>

          <div id="events">
            <h2>Today's Events</h2>
            <mgt-agenda days=1 date=${this.date_string}>
              <template data-type="loading"><span class="loader"></span></template>
              <template data-type="no-data">No events found for this day!</template>
            </mgt-agenda>
          </div>

        </div>

    </div>
    `;
  }
}

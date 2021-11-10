import { LitElement, css, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth } from '../services/data';

@customElement('app-calendar')
export class AppCalendar extends LitElement {
    @property() monthIndex: any;
    @state() year: any;
    @state() day_selected: any;
    @property() _calendarTemplate: any = [];
    @property() _daysTemplate: any = [];
    //@property() stringDate: string = "";

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

      .month_name:active {
        border: 1px solid black;
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
        `;

  }

  constructor() {
    super();
  }

  firstUpdated(){
    this.monthIndex = current_date.getMonth();
    this.day_selected = current_date.getDate();
    this.year = current_date.getFullYear();
    this.generateCal(this.monthIndex, this.year);
    //this.stringTheDate();
    this.requestUpdate();
  }

  /*
  stringTheDate() {
    let month = months[this.monthIndex].name;
    let day = this.day_selected;
    let year = this.year;
    console.log(month + " " + day + ", " + year);
    this.stringDate =  month + " " + day + ", " + year;
    this.requestUpdate();
  }
  */

  setMonthIndex(monthIndex: any) {
    this.monthIndex = monthIndex;
    this.generateCal(this.monthIndex, this.year);
    this.requestUpdate();
  }

  /*
  updateDay(date: any){
    console.log("date", date)
    this.day_selected = date
    this.stringTheDate();
  }
  */

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
            this._calendarTemplate.push(html`<app-cell .day=${date.toString()} .month=${month} .year=${year} .active=${"true"}></app-cell>`)
          } else {
            this._calendarTemplate.push(html`<app-cell .day=${date.toString()} .month=${month} .year=${year} .active=${"false"}></app-cell>`)
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
            <mgt-agenda></mgt-agenda>
          </div>

        </div>

    </div>
    `;
  }
}

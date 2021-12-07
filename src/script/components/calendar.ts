import { LitElement, css, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth } from '../services/data';
import { getGroupName } from '../services/database';
import { provider } from '../services/provider';
import { Router } from '@vaadin/router';
import '@microsoft/mgt-components';

@customElement('app-calendar')
export class AppCalendar extends LitElement {
    @property() provider: any;
    @property() monthIndex: any;
    @property() monthName: any;
    @state() year: any;
    @state() day: any;
    @state() date_string: any;
    @property() _calendarTemplate: any = [];
    @property() _daysTemplate: any = [];
    @property() last_selected: any;
    @property() today_cell: any;
    @property() group_name: any = "";


  static get styles() {
    return css`
      #wholeWrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
      }

      #calHolder {
        display: grid;
        width: 100%;
        grid-template-columns: 2fr 5fr 2fr;
        height: 100%;
      }

      #calHeader {
        background: #DDBDD5;
        display: grid;
        width: 100%;
        grid-template-columns: 2fr 5fr 2fr;
        height: 75px;
      }

      #calHeader * {
        display: flex;
        align-items: center;
      }

      #dropdown {
        position: relative;
        display: inline-block;

        width: 100%;
        height: 100%;
      }

      #settings_header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 16px;
        height: 100%;
      }

      #settings_header p {
        height: 100%;
        font-size: 24px;
        font-weight: bolder;
        padding-left: 16px;
      }

      .dropdown-option {
        margin: 0;
        padding: 10px 0;
        width: 100%;
      }

      #dropdown-content p:hover {
        cursor: pointer;
        background-color: #F1E4EE;
      }

      #settings_header:hover {
        cursor: pointer;
      }

      #dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 12px 16px;
        margin-left: 16px;
        z-index: 1;
      }

      #dropdown:hover #dropdown-content {
        display: block;
      }

      #selectedHeader {
        width: 100%;
        justify-content: center;
        margin: 0;
      }

      ion-datetime {
        --placeholder-color: black;
      }

      #login {
        justify-content: right;
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

      #agendaHolder {
        height: 80%;
        overflow-y: scroll;
      }

      #addEvent {
        height: 10%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid black;

      }

      #addButton {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 16px;
        font-weight: bolder;
        padding: 10px;

        border-radius: 5px;
        background-color: #F1E4EE;
        border: none;
      }

      #addButton:hover {
          cursor: pointer;
          background-color: #ddbdd5
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

      .loader_top {
        width: 100%;
        height: 4.8px;
        display: inline-block;
        position: relative;
        overflow: hidden;
      }
      .loader_top::after {
        content: '';
        width: 96px;
        height: 4.8px;
        background: #000;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        animation: hitZak 0.6s ease-in-out infinite alternate;
      }

      @keyframes hitZak {
        0% {
          left: 0;
          transform: translateX(-1%);
        }
        100% {
          left: 100%;
          transform: translateX(-99%);
        }
      }


        `;

  }

  constructor() {
    super();
  }

  async firstUpdated(){
    this.provider = provider;
    this.monthIndex = current_date.getMonth();
    this.monthName = months[this.monthIndex].name;
    this.year = current_date.getFullYear();
    this.day = current_date.getDate();
    this.date_string = this.stringTheDate();
    this.group_name = await getGroupName();
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
            this._calendarTemplate.push(html`<app-cell id="today" class="selected" @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"true"}></app-cell>`)
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

    // updating style on highlighted day
    this.handleHighlightedDay(cell, false)

    this.requestUpdate();
  }

  handleHighlightedDay(cell: any, clear: Boolean){
    if(!this.last_selected){
      this.last_selected = this.shadowRoot?.getElementById("today");
    }

    this.last_selected.classList.remove("selected");

    if(!clear){
      this.last_selected = cell;
      cell.classList.add("selected");
    }

  }

  changeDate(event: any){
    let date = new Date(event.detail.value)
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    this.monthIndex = monthIndex;
    this.monthName = months[this.monthIndex].name;
    this.year = year;

    this.handleHighlightedDay(null, true);

    this.generateCal(this.monthIndex, this.year);
    if(this.monthIndex == current_date.getMonth()){
      this.today_cell = this.shadowRoot!.getElementById("today");
      this.last_selected = this.today_cell;
    }

  }

  handleLeaveGroup(){
    // leave group.
    alert("are you sure you wanna leave the group?");
  }


  render() {
    return html`
        <div id="wholeWrapper">
          <div id="calHeader">
            <div id="dropdown">
              <span id="settings_header"> ${this.group_name.length > 0? html`<p>${this.group_name}</p>` : html`<span class="loader_top"></span>`} <ion-icon name="settings" style="font-size: 24px; margin-left: 10px"></ion-icon></span>
              <div id="dropdown-content">
                <p class="dropdown-option" @click=${() => Router.go("/settings")}>Group Settings</p>
                <p class="dropdown-option" @click=${() => this.handleLeaveGroup()}>Leave Group</p>
              </div>
            </div>
            <h1 id="selectedHeader">
            <ion-datetime
                display-format="MMMM YYYY"
                min="0001-01-01"
                max="3000-12-31"
                placeholder=${this.monthName + " " + this.year}
                @ionChange=${(e: any) => this.changeDate(e)}>
              </ion-datetime>
              <!--
                 Placeholder for Date


              <ion-button id="open-modal">Open Datetime Modal</ion-button>
                <ion-modal trigger="open-modal">
                  <ion-content>
                    <ion-datetime></ion-datetime>
                  </ion-content>
                </ion-modal>
               -->
            </h1>
            <div id="login"><mgt-login></mgt-login></div>
          </div>

          <div id="calHolder">
            <div id="months">
              <div id="months-header">
                <h2>Users</h2>
              </div>
              Replace this with list of active members of group.
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
              <div id="agendaHolder">
                <mgt-agenda days=1 date=${this.date_string} preferred-timezone="Eastern Standard Time">
                  <template data-type="loading"><span class="loader"></span></template>
                  <template data-type="no-data">No events found for this day!</template>
                </mgt-agenda>
              </div>
              <div id="addEvent">
                <button id="addButton" @click=${() => Router.go("/new_event")}>Add New Event <ion-icon name="add-circle-outline" style="margin-left: 5px;"></ion-icon></button>
              </div>
            </div>

          </div>
        </div>
    `;
  }
}

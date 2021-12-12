import { LitElement, css, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth, highlighted_day, setHighlightedDay } from '../services/data';
import { getGroupMembers, getGroupName } from '../services/database';
import { provider } from '../services/provider';
import { Router } from '@vaadin/router';
import "../components/date-switcher";
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
    @property() members: any = [];
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
      }

      #settings_header p:hover {
        cursor: default;
      }

      #settings_header ion-icon:hover {
        cursor: pointer;
      }

      #current-date-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
      }

      #current-date {
        font-size: 36px;
        font-weight: bolder;
        margin: 0 10px;
      }

      #switcher-icon {
        position: relative;
      }

      #switcher-box {
        display: none;
        width: 180px;
        height: 180px;
        background-color: #F1E4EE;
        padding: 10px;
        position: absolute;
        top: 25px;
        left: 105%;

        box-shadow: rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px, rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px;
      }

      #switcher-box {
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }


      #year-sec {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
      }

      #year {
        padding:10px;
        width: 100%;
      }

      #year:hover {
        background-color: #ddbdd5;
        cursor: pointer;
      }

      #arrows {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      #months-sec {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        place-items: center;
        height: 100%;
        width: 100%;
        margin-top: 5px;
      }

      .short-month {
        margin: 0;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .short-month:hover {
        background-color: #ddbdd5;
        cursor: pointer;
      }

      #login {
        display: flex;
        align-items: center;
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

      #user-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .user-list-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        width: 100%;
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

      .loader-card {
        width: 100%;
        height: 100px;
        display: block;
        background-image: linear-gradient(100deg, transparent, rgba(38, 50, 56, 0.5) 50%, transparent 80%), radial-gradient(circle 50px at 50px 50px, #FFF 99%, transparent 0), linear-gradient(#FFF 20px, transparent 0), linear-gradient(#FFF 20px, transparent 0), linear-gradient(#FFF 20px, transparent 0);
        background-repeat: no-repeat;
        background-size: 75px 100px, 100px 100px, 125px 20px, 260px 20px, 260px 20px;
        background-position: -50% 0, 0 0, 120px 0, 120px 40px, 120px 80px, 120px 120px;
        box-sizing: border-box;
        animation: animloader 1s linear infinite;
      }

      @keyframes animloader {
        0% {
          background-position: 0% 0, 0 0, 120px 0, 120px 40px, 120px 80px, 120px 120px;
        }
        100% {
          background-position: 100% 0, 0 0, 120px 0, 120px 40px, 120px 80px, 120px 120px;
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
    this.members = await getGroupMembers();
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
            this._calendarTemplate.push(html`<app-cell id="today" class="selected" @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell, e.detail.numDate) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"true"}></app-cell>`)
          } else {
            this._calendarTemplate.push(html`<app-cell @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell, e.detail.numDate) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"false"}></app-cell>`)
          }
          date += 1;
        }
      }
    }

  }

  updateSelectedDay(day: string, cell: HTMLElement, numDate: string){

    // updating day for the purpose of showing events
    this.date_string = day;
    setHighlightedDay(numDate);
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

  changeDate(monthIndex: any, year: any){
    let date = new Date(year, monthIndex);

    this.monthIndex = date.getMonth();
    this.monthName = months[this.monthIndex].name;
    this.year = year;

    this.handleHighlightedDay(null, true);

    this.generateCal(this.monthIndex, this.year);
    if(this.monthIndex == current_date.getMonth()){
      this.today_cell = this.shadowRoot!.getElementById("today");
      this.last_selected = this.today_cell;
    }

  }

  toggleSwitcher() {
    let switcher = this.shadowRoot!.getElementById("switcher-box");

    if(switcher!.style.display === ""){
      switcher!.style.display = "flex";
    } else if(switcher!.style.display === "flex"){
      switcher!.style.display = "";
    }
  }

  jumpToToday(){
    this.monthIndex = current_date.getMonth();
    this.monthName = months[this.monthIndex].name;
    this.year = current_date.getFullYear();
    this.generateCal(this.monthIndex, this.year);
  }

  handleLeaveGroup(){
    // leave group.
    alert("are you sure you wanna leave the group?");
  }

  render() {
    return html`
        <div id="wholeWrapper">
          <div id="calHeader">
            <div id="settings_header">
              <ion-icon name="exit-outline" @click=${() => this.handleLeaveGroup()} style="font-size: 24px; margin-left: 10px; color: red; font-weight: bold;"></ion-icon>
              <ion-icon name="settings" @click=${() => Router.go("/settings")} style="font-size: 24px; margin: 0 10px;"></ion-icon>
              ${this.group_name.length > 0? html`<p style="display: flex; align-items: center; justify-content: center;">${this.group_name}</p>` : html`<span class="loader_top"></span>`}
          </div>

            <div id="current-date-box">
              <ion-icon @click=${() => this.jumpToToday()} name="today-outline" style="font-size: 24px;"></ion-icon>
              <h1 id="current-date">${this.monthName} ${this.year}</h1>
              <div id="switcher-icon" @click=${() => this.toggleSwitcher()}>
                <ion-icon  name="calendar-outline" style="font-size: 24px;"></ion-icon>
                <div id="switcher-box">
                  <div id="year-sec">
                    <span id="year">${this.year}</span>
                    <span id="arrows">
                      <ion-icon name="arrow-up-outline"  @click=${() => this.changeDate(this.monthIndex, (this.year + 1))}></ion-icon>
                      <ion-icon name="arrow-down-outline" @click=${() => this.changeDate(this.monthIndex, (this.year - 1))}></ion-icon>
                    </span>
                  </div>
                  <div id="months-sec">
                    ${months.map(
                      (month: any, index: any) =>
                        html`<p class="short-month" @click=${() => this.changeDate(index, this.year)}>${(month.name as string).substring(0, 3)}</p>`
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div id="login"><mgt-login></mgt-login></div>
          </div>

          <div id="calHolder">
            <div id="months">
              <div id="months-header">
                <h2>Users</h2>
              </div>
              <ul id="user-list">
                ${this.members.map((member: any) =>
                  html`<li class="user-list-item">
                          <mgt-person user-id="${member}" view="twoLines" person-card="hover">
                            <template data-type="loading"><span class="loader-card"></span></template>
                          </mgt-person>
                        </li>`)}
              </ul>
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

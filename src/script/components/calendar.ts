import { LitElement, css, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth, setHighlightedDay } from '../services/data';
import { deleteGroup, getAdmins, getCalendarGroupId, getGroupCode, getGroupMembersInformation, getGroupName, getMainCalendarId, isUserAdmin, removeUser } from '../services/database';
import { provider } from '../services/provider';
import { Router } from '@vaadin/router';
import '@microsoft/mgt-components';
import { getCurrentUserId } from '../services/calendar-api';

@customElement('app-calendar')
export class AppCalendar extends LitElement {
    @state() provider: any;
    @state() monthIndex: any;
    @state() monthName: any;
    @state() year: any;
    @state() day: any;
    @state() date_string: any;
    @state() _calendarTemplate: any = [];
    @state() _daysTemplate: any = [];
    @state() members: any = [];
    @state() last_selected: any;
    @state() today_cell: any;
    @state() group_name: any = "";
    @state() calendar_group_id: any = "";
    @state() calendar_id: any = "";
    @state() event_query: any = "";
    @state() day_limit: any = "";
    @state() showLeaveModal: any = false;
    @state() showLeaveLoader: any = false;
    @state() notEnoughAdmins: any = false;

  static get styles() {
    return css`
      #wholeWrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
      }

      #calHeader {
        background: #DDBDD5;
        display: grid;
        width: 100%;
        grid-template-columns: 2fr 5fr 2fr;
        height: 75px;
        padding: 10px 0;
      }


      #left-sec {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      #middle-sec {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      #calIcons {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #jump {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }

      #jump:hover {
        cursor: pointer;
      }

      #switcher-icon {
        position: relative;
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #switcher-icon:hover {
        cursor: pointer;
      }

      .icon-label {
        margin: 0;
        margin-left: 5px;
      }

      #switcher-box {
        display: none;
        width: 180px;
        height: 180px;
        background-color: #F1E4EE;
        padding: 10px;
        position: absolute;
        top: 25px;
        left: 0%;

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

      #current-date {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: bolder;
        margin: 0;
        width: 100%;
      }

      #groupName {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bolder;
        margin: 0;
        width: 100%;
        text-align: center;
      }

      #login {
        display: flex;
        align-items: center;
        justify-content: right;
        margin-right: 10px;
      }

      #calHolder {
        display: grid;
        width: 100%;
        grid-template-columns: 2fr 5fr 2fr;
        height: 100%;
      }

      #users {
        background: rgb(248, 248, 248);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #users-header{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 10%;
      }

      #users-header h2{
        font-size: 16px;
        font-weight: bolder;
        margin: 0;
      }

      #user-list {
        list-style: none;
        margin: 0;
        margin-bottom: 20px;
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

      #calendar {
        display: flex;
        flex-direction: column;
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
      .modal-box {
    height: fit-content;
    width: 25vw;
    background-color: white;

    padding: 55px;

    position: absolute;
    z-index: 101;
    top: 50%;  /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */

    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    box-shadow: rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px, rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px;
  }

  .modal-box slot {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .modal-box p {
    text-align: center;
  }

  .modal-box button {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 16px;
    font-weight: bolder;
    padding: 10px 30px;
    margin-top: 10px;

    border-radius: 30px;
    background-color: #F1E4EE;
    border: none;

    width: 45%;
  }

  .modal-box button:hover {
    cursor: pointer;
    background-color: #ddbdd5
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
    this.day_limit = this.stringTheDatePlusOne();
    this.group_name = await getGroupName();
    this.members = await getGroupMembersInformation();
    this.calendar_group_id = await getCalendarGroupId();
    this.calendar_id = await getMainCalendarId();
    this.event_query = "me/calendarGroups/" + this.calendar_group_id + "/calendars/" + this.calendar_id + "/events?$filter=start/dateTime ge \'" + this.date_string + "\' and start/dateTime lt \'" + this.day_limit + "\'or end/dateTime ge \'" + this.date_string + "\' and end/dateTime lt \'" + this.day_limit +"\'"
    this.generateCal(this.monthIndex, this.year);
    this.requestUpdate();
  }

  stringTheDate() {
    let month = months[this.monthIndex].name;
    let day = this.day;
    let year = this.year;

    return year + "-" + ("00" + ((this.monthIndex + 1) as number)).slice(-2) + "-" + ("00" + (day as number)).slice(-2) + "T00:00";

  }
  stringTheDatePlusOne() {
    let month = months[this.monthIndex].name;
    let day = this.day;
    let year = this.year;

    return year + "-" + ("00" + ((this.monthIndex + 1) as number)).slice(-2) + "-" + ("00" + ((day + 1) as number)).slice(-2) + "T00:00";

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
            this._calendarTemplate.push(html`<app-cell id="today" class="selected" @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell, e.detail.day_limit) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"true"}></app-cell>`)
          } else {
            this._calendarTemplate.push(html`<app-cell @day-clicked="${(e: any) => { this.updateSelectedDay(e.detail.selected_day, e.detail.selected_cell, e.detail.day_limit) }}" .day=${date.toString()} .month=${month} .year=${year} .active=${"false"}></app-cell>`)
          }
          date += 1;
        }
      }
    }

  }

  updateSelectedDay(day: string, cell: HTMLElement, limit: string){

    // updating day for the purpose of showing events
    this.date_string = day;
    this.day_limit = limit;
    this.event_query = "me/calendarGroups/" + this.calendar_group_id + "/calendars/" + this.calendar_id + "/events?$filter=start/dateTime ge \'" + this.date_string + "\' and start/dateTime lt \'" + this.day_limit + "\'or end/dateTime ge \'" + this.date_string + "\' and end/dateTime lt \'" + this.day_limit +"\'";
    setHighlightedDay(day);
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
    this.handleHighlightedDay(null, true);
    if(this.monthIndex == current_date.getMonth()){
      this.today_cell = this.shadowRoot!.getElementById("today");
      this.last_selected = this.today_cell;
    }
    this.generateCal(this.monthIndex, this.year);
  }

  async handleLeaveGroup(){
    let uid = await getCurrentUserId();
    let code = await getGroupCode();
    let isAdmin = await isUserAdmin(uid);
    let adminList = await getAdmins(code)
    if(isAdmin && adminList.length == 1){
      this.notEnoughAdmins = true;
    }
    this.showLeaveModal = true;
  }

  async handleLeaveResult(action: any){
    // make sure that if this person is the only admin of the group
    // they cannot leave before reassigning the role.
    if(action){
      let uid = await getCurrentUserId();
      let code = await getGroupCode();
      this.showLeaveLoader = true;
      await removeUser(code, uid).then(() => Router.go("/create-or-join"));
    } else {
      this.showLeaveModal = false;
    }
  }

  async handleDeleteGroup(){

    let code = await getGroupCode();
    this.showLeaveLoader = true;
    await deleteGroup(code).then(() => Router.go("/create-or-join"));

  }

  render() {
    return html`
        <div id="wholeWrapper">
          <div id="calHeader">
            <div id="left-sec">
              ${this.group_name.length > 0? html`<h2 id="groupName" style="display: flex; align-items: center; justify-content: center;">Calendar: ${this.group_name}</h2>` : html`<span class="loader_top"></span>`}
            </div>
            <div id="middle-sec">
              <h1 id="current-date">${this.monthName} ${this.year}</h1>
              <div id="calIcons">
                <span id="jump" @click=${() => this.jumpToToday()}>
                  <ion-icon name="today-outline" style="font-size: 24px;"></ion-icon>
                  <p class="icon-label">Jump to Today</p>
                </span>

                <div id="switcher-icon" @click=${() => this.toggleSwitcher()}>
                  <ion-icon  name="calendar-outline" style="font-size: 24px;"></ion-icon>
                  <p class="icon-label">Change Date</p>
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
            </div>
            <div id="login">
              <mgt-login></mgt-login>
              <ion-icon name="settings" @click=${() => Router.go("/settings")} style="font-size: 24px; margin: 0 10px;"></ion-icon>
              <ion-icon name="exit-outline" @click=${() => this.handleLeaveGroup()} style="font-size: 24px; margin-left: 10px; color: red; font-weight: bold;"></ion-icon>
            </div>
          </div>

          <div id="calHolder">
            <div id="users">
              <div id="users-header">
                <h2>Users</h2>
              </div>
              <ul id="user-list">
                ${this.members.map((member: any) =>
                  html`<li class="user-list-item">
                          <mgt-person .personDetails=${member.details} view="twoLines" person-card="hover">
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
                <mgt-agenda days=1 preferred-timezone="Eastern Standard Time" event-query=${this.event_query}>
                  <template data-type="loading"><span class="loader"></span></template>
                  <template data-type="no-data">No events found for this day!</template>
                </mgt-agenda>
              </div>
              <div id="addEvent">
                <button id="addButton" @click=${() => Router.go("/new_event")}>Add New Event <ion-icon name="add-circle-outline" style="margin-left: 5px;"></ion-icon></button>
              </div>
            </div>
          </div>
          ${this.showLeaveModal ?
          html`
            <div class="modal-box">
              ${this.showLeaveLoader ? html`<span class="loader"></span>` :
              this.members.length != 1 ?
                this.notEnoughAdmins ?
                html`
                  <p>You are the only admin of the group. You must first reassign this role on the settings page in order to proceed.</p>
                  <slot>
                    <button @click=${() => this.handleLeaveResult(false)}>Cancel</button>
                    <button @click=${() => Router.go("/settings")}>Go to Settings</button>
                  </slot>
                `:
                html`
                  <p>Are you sure you want to leave the group?</p>
                  <slot>
                    <button @click=${() => this.handleLeaveResult(false)}>No</button>
                    <button @click=${() => this.handleLeaveResult(true)}>Yes</button>
                  </slot>
                ` :
              html`
                <p>You are the only member of the group. Leaving will result in deletion of the group. Are you sure you want to proceed?</p>
                <slot>
                  <button @click=${() => this.handleLeaveResult(false)}>No</button>
                  <button @click=${() => this.handleDeleteGroup()}>Yes</button>
                </slot>
              `}
          </div>
          ` :
          html``}
        </div>
    `;
  }
}

import { LitElement, css, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth, setHighlightedDay } from '../services/data';
import { deleteEventsFromDB, deleteGroup, getAdmins, getCalendarGroupId, getGroupCode, getGroupEvents, getGroupMembersInformation, getGroupName, getMainCalendarId, getUserEvents, isUserAdmin, removeUser, updatedUserEvents } from '../services/database';
import { provider } from '../services/provider';
import { Router } from '@vaadin/router';
import '@microsoft/mgt-components';
import { createNewEvents, deleteEvent, getCurrentUserId } from '../services/calendar-api';

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
    @state() showDeleteEventModal: any = false;
    @state() showDeleteEventLoader: any = false;
    @state() showDeleteEventError: any = false;
    @state() id_tobe_deleted: any = "";
    @state() flyoutMenu: any;

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
        place-items: center;
      }

      #leave-group {
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 12px;
        font-weight: bolder;
        padding: 10px;

        border-radius: 5px;
        background-color: #F1E4EE;
        border: none;

        margin-right: 10px;
      }

      #leave-group p {
        margin: 0;
        margin-right: 5px;
      }

      #leave-group:hover {
        cursor: pointer;
      }

      #left-sec {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80%;
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
        z-index: 1;
        box-shadow: rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px, rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

      }

      #h-switcher-box {
        display: none;
        width: 180px;
        height: 180px;
        background-color: #F1E4EE;
        padding: 10px;
        position: absolute;
        top: 25px;
        left: 0%;
        z-index: 1;
        box-shadow: rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px, rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px;
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
        justify-content: center;
        margin-left: 10px;
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
        align-items: flex-start;
        justify-content: center;
        margin-bottom: 10px;
        width: 50%;
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

      mgt-agenda:hover{
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

  #hamburger-header {
    display: none;
    background: #DDBDD5;
    justify-content: space;
    align-items: center;
    width: 98vw;
    height: 75px;
    padding: 10px;
  }

  #hamburger:hover {
    cursor: pointer;
  }

  #flyoutMenu {
    position: fixed;
    left: 0;
    top: 0;
    transform: translate3d(100vw, 0, 0);
    transition: transform 1s cubic-bezier(0, .52, 0, 1);

    width: 35vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    background: rgb(248, 248, 248);
    z-index: 1;

  }

  #flyoutMenu.show {
    transform: translate3d(65vw, 0, 0);
    box-shadow: rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px, rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px;
  }

  #menu-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  #flyout-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-size: 24px;
  }

  #flyout-login p {
    margin: 0;
    margin-bottom: 10px;
  }

  .menu-item {
    display: grid;
    grid-template-columns: 1fr 6fr;
    align-items: center;
    justify-content: flex-start;
  }

  .menu-item:hover {
    cursor: pointer;
  }

  .menu-item p {
    margin-left: 5px;
    font-size: 24px;
    margin: 10px 0;
  }

  #menu-calendar-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }


  @media(max-width: 1100px){
    #calHeader {
      display: none;
    }

    #hamburger-header {
      display: flex;
    }

    #users {
      display: none;
    }
    #calHolder{
      grid-template-columns: 7fr 2fr;
      padding-left: 3px;
    }
    .modal-box {
      width: 50vw;
    }
  }

  @media(max-width: 900px){

    #calHeader {
      padding: 10px;
      width: 98vw;
    }

    #days_headers {
      display: grid;
      grid-template-columns: repeat(7, minmax(50px, 150px));
      grid-template-rows: repeat(1, minmax(25px, 50px));
      border-bottom: 1px solid black;
    }

    #calGrid {
      display: grid;
      grid-template-columns: repeat(7, minmax(50px, 150px));
      grid-template-rows:  repeat(5, auto-fill);
      height: 100%;
    }

    #calHolder {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    #calendar {
      height: 60%;
    }

    #events{
      height: 40%;
    }

    #events h2 {
      margin-top: 10px;
    }

    #addEvent {
      height: 20%
    }

    #agendaHolder {
      height: 70%
    }

  }


  @media(max-width: 450px){

    #login {
      display: none;
    }

    #groupName {
      font-size: 14px;
    }

    #calHeader {
      padding: 0;
      width: 100vw;
      grid-template-columns: 1fr 1fr;
    }

    #current-date{
      font-size: 18px;
    }

    .icon-label {
      font-size: 12px;
    }

    #hamburger-header {
      width: 95vw;
      padding-bottom: 0;
    }

    .menu-item p{
      font-size: 16px;
    }

    #flyout-login p {
      font-size: 12px;
    }

    #days_headers {
      display: grid;
      grid-template-columns: repeat(7, minmax(10px, 60px));
      grid-template-rows: repeat(1, minmax(25px, 50px));
      border-bottom: 1px solid black;
    }

    .day_header {
      font-size: 10px;
    }

    #calGrid {
      display: grid;
      grid-template-columns: repeat(7, minmax(10px, 60px));
      grid-template-rows:  repeat(5, auto-fill);
      height: 100%;
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
    this.generateCal(this.monthIndex, this.year);
    this.date_string = this.stringTheDate();
    this.day_limit = this.stringTheDatePlusOne();
    this.group_name = await getGroupName();
    this.members = await getGroupMembersInformation();
    this.calendar_group_id = await getCalendarGroupId();
    this.calendar_id = await getMainCalendarId();
    this.event_query = "me/calendarGroups/" + this.calendar_group_id + "/calendars/" + this.calendar_id + "/events?$filter=start/dateTime ge \'" + this.date_string + "\' and start/dateTime lt \'" + this.day_limit + "\'or end/dateTime ge \'" + this.date_string + "\' and end/dateTime lt \'" + this.day_limit +"\'&$orderby=start/dateTime "
    await this.syncEvents();

    this.shadowRoot!.querySelector('mgt-agenda')!.addEventListener('eventClick', (e: any) => {
      this.handleDeleteEvent(e.detail.event);
    });

    this.requestUpdate();
  }

  handleDeleteEvent(event: any){
    this.id_tobe_deleted = event.id;
    this.showDeleteEventModal = true;
  }

  async handleDeleteEventAction(){
    this.showDeleteEventLoader = true;
    try{
      await deleteEvent(this.id_tobe_deleted);
      await deleteEventsFromDB(this.id_tobe_deleted);
      this.showDeleteEventLoader = false;
      this.showDeleteEventModal = false;
    } catch(error: any){
      this.showDeleteEventLoader = false;
      this.showDeleteEventError = true;
    }

  }

  async syncEvents(){
    const savedValue = sessionStorage.getItem('EventsSyncd');

    if (JSON.parse(savedValue as string) !== true) {
      sessionStorage.setItem('EventsSyncd', JSON.stringify(true));

      let group_events = await getGroupEvents();
      let user_events = await getUserEvents();

      //so eventually i want to check if the current users are invited to the event then to add them, but for now
      // I am going to add every event despite if they are invited or not.
      if(group_events.length > user_events.length){
        console.log("list is behind");
          await updatedUserEvents(group_events);
          if(user_events.length == 0){
            await createNewEvents(group_events);
          } else {
            let diff = group_events.length - user_events.length;
            console.log("diff", diff);
            let new_events = group_events.slice(diff + 1, group_events.length);
            console.log("new_events", new_events);
            console.log("creating new events called");
            await createNewEvents(new_events);
            console.log("nice");
          }
      }

    } else {
      return;
    }
  }

  stringTheDate() {
    let day = this.day;
    let year = this.year;

    return year + "-" + ("00" + ((this.monthIndex + 1) as number)).slice(-2) + "-" + ("00" + (day as number)).slice(-2) + "T00:00";

  }
  stringTheDatePlusOne() {
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
    this.event_query = "me/calendarGroups/" + this.calendar_group_id + "/calendars/" + this.calendar_id + "/events?$filter=start/dateTime ge \'" + this.date_string + "\' and start/dateTime lt \'" + this.day_limit + "\'or end/dateTime ge \'" + this.date_string + "\' and end/dateTime lt \'" + this.day_limit +"\'&$orderby=start/dateTime";
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
    this.date_string = this.stringTheDate();
    this.day_limit = this.stringTheDatePlusOne();
    this.updateSelectedDay(this.date_string, this.last_selected, this.day_limit);

  }

  toggleSwitcher(diff: any) {
    let switcher;
    if(diff.length > 0){
      switcher = this.shadowRoot!.getElementById(diff + "switcher-box");

    } else {
      switcher = this.shadowRoot!.getElementById("switcher-box");
    }

    if(switcher!.style.display === ""){
      switcher!.style.display = "flex";
    } else if(switcher!.style.display === "flex"){
      switcher!.style.display = "";
    }
  }

  jumpToToday(){
    this.changeDate(current_date.getMonth(), current_date.getFullYear());
  }

  async handleDeleteGroup(){

    let code = await getGroupCode();
    this.showLeaveLoader = true;
    await deleteGroup(code).then(() => Router.go("/create-or-join"));

  }

  showMenu() {
    console.log("called");
    this.flyoutMenu = this.shadowRoot?.getElementById("flyoutMenu");
    this.flyoutMenu.classList.add("show");
  }

  closeOut(e: any){
    e.stopPropagation();
    this.shadowRoot!.getElementById("flyoutMenu")!.classList.remove("show");
  }

  render() {
    return html`
      <div id="wholeWrapper">
        <div id="calHeader">
          <div id="login">

            <mgt-login></mgt-login>

          </div>

          <div id="middle-sec">
            <h1 id="current-date">${this.monthName} ${this.year}</h1>
            <div id="calIcons">
              <span id="jump" @click=${() => this.jumpToToday()}>
                <ion-icon name="today-outline" style="font-size: 24px;"></ion-icon>
                <p class="icon-label">Jump to Today</p>
              </span>

              <div id="switcher-icon" @click=${() => this.toggleSwitcher("")}>
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

          <div id="left-sec">
            <ion-icon name="settings" @click=${() => Router.go("/settings")} style="font-size: 24px;"></ion-icon>
            ${this.group_name.length > 0? html`<h2 id="groupName" style="display: flex; align-items: center; justify-content: center;">Calendar: ${this.group_name}</h2>` : html`<span class="loader_top"></span>`}
          </div>
        </div> <!-- closes id = calHeader-->

        <div id="hamburger-header">
          <div id="spacer"></div>
          <div id="middle-sec">
            <h1 id="current-date">${this.monthName} ${this.year}</h1>
            <div id="calIcons">
              <span id="jump" @click=${() => this.jumpToToday()}>
                <ion-icon name="today-outline" style="font-size: 24px;"></ion-icon>
                <p class="icon-label">Jump to Today</p>
              </span>

              <div id="switcher-icon" @click=${() => this.toggleSwitcher("h-")}>
                <ion-icon  name="calendar-outline" style="font-size: 24px;"></ion-icon>
                <p class="icon-label">Change Date</p>
                <div id="h-switcher-box">
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

          <div id="hamburger" @click=${() => this.showMenu()}>
            <ion-icon name="settings" style="font-size: 32px"></ion-icon>
          </div>
        </div>

        <div id="flyoutMenu">
          <div id="menu-top">
            <ion-icon name="close-outline" @click=${(e: any) => this.closeOut(e)}></ion-icon>
          </div>
          <div id="menu-bottom">
            <div>
              <div id="menu-calendar-title">
                ${this.group_name.length > 0? html`<h2 id="groupName" style="display: flex; align-items: center; justify-content: center;">Calendar: ${this.group_name}</h2>` : html`<span class="loader_top"></span>`}
              </div>
              <div class="menu-item"  @click=${() => Router.go("/settings")}>
                <ion-icon name="settings" style="font-size: 24px; margin: 0 10px;"></ion-icon>
                <p>Settings</p>
              </div>
            </div>
            <div id="flyout-login">
              <p>Click below to sign out:</p>
              <mgt-login></mgt-login>
            </div>
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

      </div> <!-- closes wholeWrapper DIV -->

      ${this.showDeleteEventModal ?
          html`
            <div class="modal-box">
            ${this.showDeleteEventLoader ?
              html`<span class="loader"></span>` :
              html`
                <p>Are you sure you want to delete this event?</p>
                ${this.showDeleteEventError ? html`<p style="color: red; font-weight: bold;">The was an error deleting this event. Check your network connection and try again.</p>` : html``}
                <slot>
                  <button @click=${() => this.showDeleteEventModal = false}>No</button>
                  <button @click=${() => this.handleDeleteEventAction()}>Yes</button>
                </slot>`
            }
            </div>` :
          html`` }

    `;
  }
}

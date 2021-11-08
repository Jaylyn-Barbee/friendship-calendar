import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { months, days_of_week, current_date, daysInMonth } from '../services/data';

@customElement('app-calendar')
export class AppCalendar extends LitElement {
    @property() firstDay: any;
    @property() numOfDays: any;
    @property() monthIndex: any;
    @property() year: any;


  static get styles() {
    return css`
      #calendar {
        display: flex;
        flex-direction: column;
      }

      #days_headers {
        display: grid;
        grid-template-columns: repeat(7, minmax(100px, 300px));
        grid-template-rows: repeat(1, minmax(25px, 50px));
      }

      .day_header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 16px;
        font-weight: bolder;
        border: 1px solid black;
      }

      #calHolder {
        display: grid;
        width: 100%;
        grid-template-columns: 2fr 5fr 2fr;
      }

      #months {
        background: red;
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

      #calGrid {
        display: grid;
        grid-template-columns: repeat(7, minmax(100px, 300px));
        grid-template-rows:  repeat(5, minmax(50px, 100px));;
      }

      #events {
        background: red;
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

      tr {
          border-bottom: 1px solid black;
          display: flex;
          align-items: center;
      }

      td {
          width: 100px;
          height: 150px;
      }
        `;

  }

  constructor() {
    super();
  }

  firstUpdated(){
        this.firstDay = (new Date(current_date.getFullYear(), current_date.getMonth())).getDay();
        this.numOfDays = daysInMonth(current_date.getFullYear(), current_date.getMonth);
        this.monthIndex = current_date.getMonth();
        this.year = current_date.getFullYear;
  }

  setMonthIndex(monthIndex: any) {
    this.monthIndex = monthIndex;
  }

  generateCal(month: any, year: any) {

    let firstDay = (new Date(year, month)).getDay();

    let tbl = this.shadowRoot?.getElementById("calendarBody"); // body of the calendar

    // clearing all previous cells
    if(tbl){
        tbl.innerHTML = "";
    }
    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        let cell;

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            // if we are in the first row and not yet at the first day of the month
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                let date_cell = document.createElement("app-cell");
                // set an attribute for a special blank cell?
                cell.appendChild(date_cell);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = document.createElement("td");

                let date_cell = document.createElement("app-cell");
                date_cell.setAttribute('day', date.toString())
                cell.appendChild(date_cell);

                if (date === current_date.getDate() && year === current_date.getFullYear() && month === current_date.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date
                row.appendChild(cell);
                date += 1;
            }
        }

        if(tbl){
            tbl.appendChild(row); // appending each row into calendar body.
        }
    }

  }


  render() {
    return html`
        <div id="calHolder">
        <div id="months">
          <div id="months-header">
            <ion-icon name="arrow-dropleft"></ion-icon>
            <h2>[Current Year]</h2>
            <ion-icon name="arrow-dropright"></ion-icon>
          </div>
          ${months.map((m: any) => html`<span class="month_name" @click=${() => this.setMonthIndex(m.i)}>${m.name}</span>`)}

        </div>
        <div id="calendar">
          <div id="days_headers">
            ${days_of_week.map((d: string) => html`<span class="day_header">${d}</span>`)}
          </div>
          <div id="calendarBody">
              ${true ? this.generateCal(10, 2021) : html`ooof`}
          </div>
        </div>

        <div id="events">
          <h2>Today's Events</h2>
        </div>
      </div>

    </div>
    `;
  }
}

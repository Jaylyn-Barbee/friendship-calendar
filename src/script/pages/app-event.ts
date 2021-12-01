import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@microsoft/mgt-components';

@customElement('app-event')
export class AppEvent extends LitElement {
  @property() provider: any;

  static get styles() {
    return css`
    #page {
        background-color: #F1E4EE;
        height: 100vh;
    }

    section {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 400px;
        padding-top: 100px;
        background: #DDBDD5;
    }

    .curve {
        position: absolute;
        height: 250px;
        width: 100%;
        bottom: 0;
        text-align: center;
    }

    .curve::before {
        content: '';
        display: block;
        position: absolute;
        border-radius: 100% 50%;
        width: 55%;
        height: 100%;
        transform: translate(85%, 60%);
        background-color: #F1E4EE;
        z-index: 1;
    }

    .curve::after {
        content: '';
        display: block;
        position: absolute;
        border-radius: 100% 50%;
        width: 55%;
        height: 100%;
        background-color: #DDBDD5;
        transform: translate(-4%, 40%);
    }

    form {
        display: flex;
        flex-direction: column;

        height: fit-content;
        width: 35vw;
        background-color: white;

        border-radius: 10px;
        padding: 20px;

        position: absolute;
        z-index: 100;
        top: 50%;  /* position the top  edge of the element at the middle of the parent */
        left: 50%; /* position the left edge of the element at the middle of the parent */

        transform: translate(-50%, -50%);
    }

    form input {
        margin-bottom: 10px;
    }

    #submit {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 16px;
        font-weight: bolder;
        padding: 10px;
        margin-top: 10px;

        border-radius: 5px;
        background-color: #F1E4EE;
        border: none;
      }

      #submit:hover {
          cursor: pointer;
          background-color: #ddbdd5
      }

    `;
  }

  constructor() {
    super();
  }

  firstUpdated(){

  }

  handleSubmit(event: any){
    console.log(event);
  }

  render() {
    return html`
        <div id="page">
            <section>
                <div class="curve"></div>
            </section>
            <form id="create_event_form">
                <label for="event_name">Event Name:</label>
                <input type="text" id="event_name" name="event_name">

                <label for="event_body">Body:</label>
                <input type="text" id="event_body" name="event_body">

                <label for="event_start">Start Time:</label>
                <input type="datetime-local" id="event_start" name="event_start">

                <label for="event_end">End Time:</label>
                <input type="datetime-local" id="event_end" name="event_end">

                <label for="event_location">Event Location:</label>
                <input type="text" id="event_location" name="event_location">

                <label for="event_attendees">Attendees:</label>
                <mgt-people-picker></mgt-people-picker>

                <input id="submit" type="button" value="Add New Event"  @click=${(event: any) => this.handleSubmit(event)}/>
            </form>
        </div>
    `;
  }
}

/*
{
  "subject": "Christmas dinner",
  "body": {
    "contentType": "HTML",
    "content": "Happy holidays!"
  },
  "start": {
      "dateTime": "2019-12-25T18:00:00",
      "timeZone": "Pacific Standard Time"
  },
  "end": {
      "dateTime": "2019-12-25T22:00:00",
      "timeZone": "Pacific Standard Time"
  },
  "location":{
      "displayName":"Alex' home"
  },
  "attendees": [
    {
      "emailAddress": {
        "address":"meganb@contoso.onmicrosoft.com",
        "name": "Megan Bowen"
      },
      "type": "required"
    },
    {
      "emailAddress": {
        "address":"ChristieC@contoso.onmicrosoft.com",
        "name": "Christie Cline"
      },
      "type": "required"
    }
  ]
}
*/
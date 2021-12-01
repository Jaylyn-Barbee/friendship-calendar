import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@microsoft/mgt-components';

@customElement('app-event')
export class AppEvent extends LitElement {
  @property() provider: any;

  static get styles() {
    return css`

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
            <form id="create_event_form" @submit=${(event: any) => this.handleSubmit(event)}>
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

                <label for="event_attendees">Event Location:</label>
                <mgt-people-picker></mgt-people-picker>
                <!-- Put the person cards for those selected. -->
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
import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { createAndSubmitEvent } from '../services/calendar-api';
import { Router } from '@vaadin/router';
import '@microsoft/mgt-components';
import '../components/toast';

@customElement('app-event')
export class AppEvent extends LitElement {
  @property() provider: any;
  @property({type: Boolean}) showErrorToast: any | null = false;

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

    #back {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        margin-bottom: 20px;
        width: fit-content;
        border-bottom: 1px solid transparent
    }

    #back:hover{
        cursor: pointer;
        border-bottom: 1px solid black;
        animation: bounce 1s;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateX(8px);
        }
        60% {
            transform: translateX(-8px);
        }
    }

    #inner-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      margin: 20px 0;
      grid-gap: 20px;
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

    #create_event_form {
        display: flex;
        flex-direction: column;

        height: fit-content;
        width: 50vw;
        background-color: white;

        padding: 55px;

        position: absolute;
        z-index: 100;
        top: 50%;  /* position the top  edge of the element at the middle of the parent */
        left: 50%; /* position the left edge of the element at the middle of the parent */

        transform: translate(-50%, -50%);
    }

    #create_event_form input {
        margin-bottom: 20px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #A8A8A8;
        height: 38px;
        width: 100%;
        font-size: 14px;
        text-indent: 10px;
    }

    #inner-grid input {
        margin-top: 6px;
        margin-bottom: 0;
        text-indent: 10px;
    }

    #create_event_form input:hover {
        border-color: black;
    }

    #create_event_form label {
        margin-bottom: 6px;
        font-size: 12px;
    }

    .inner-label {
        margin-bottom: 60px;
        font-size: 12px;
    }

    mgt-people-picker {
      --input-border: 1px solid #A8A8A8;
      --input-border-color--focus: black;
    }

    textarea {
      margin-bottom: 20px;
      border-radius: 4px;
      border: 1px solid #A8A8A8;
      width: 100%;
      font-size: 14px;
      text-indent: 10px;
    }

    textarea:hover {
        border-color: black;
    }

    #submit {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 16px;
        font-weight: bolder;
        padding: 20px 55px;
        margin-top: 10px;

        border-radius: 30px;
        background-color: #F1E4EE;
        border: none;

        width: 33%;
      }

      #submit:hover {
        cursor: pointer;
        background-color: #ddbdd5
      }

      @media(max-width: 870px){
        #inner-grid {
            display: flex;
            flex-direction: column;
        }

        #submit {
            width: 100%;
        }
      }

    `;
  }

  constructor() {
    super();
  }

  firstUpdated(){

  }

  async handleSubmit(){
    /* Build event structure and post to client */
    let event_name = this.shadowRoot!.getElementById("event_name") as any;
    let event_body = this.shadowRoot!.getElementById("event_body") as any;
    let start_time = this.shadowRoot!.getElementById("event_start") as any;
    let end_time = this.shadowRoot!.getElementById("event_end") as any;
    let event_location = this.shadowRoot!.getElementById("event_location") as any;
    let attendees = this.shadowRoot!.querySelector('mgt-people-picker') as any;

    if(event_name.value.length == 0|| event_body.value.length == 0 || start_time.value.length == 0 || end_time.value.length == 0 || event_location.value.length == 0){
        this.showErrorToast = true;
        setTimeout(() => {
            this.showErrorToast = false;
        }, 3000)
    } else {
        // set loader flag to true
        await createAndSubmitEvent(event_name.value, event_body.value, start_time.value, end_time.value,  event_location.value, attendees.selectedPeople);
        // when this returns set loader flag to false
        // if success then route to calendar
        // else do an error on this page.
    }
  }

  render() {
    return html`
        <div id="page">
            <section>
                <div class="curve"></div>
            </section>
            <div id="create_event_form" >
                <span id="back" @click=${() => Router.go("/")}><ion-icon name="arrow-back" style="font-size: 14px; margin-right: 5px;"></ion-icon>Back</span>
                <label for="event_name">Event Name:</label>
                <input type="text" id="event_name" name="event_name" placeholder="Enter your event name..."/>

                <label for="event_attendees">Attendees:</label>
                <mgt-people-picker id="attendees" style="border-radius: 4px;" placeholder="Enter names to invite to your event..."></mgt-people-picker>

                <div id="inner-grid">
                  <span>
                    <label class="inner-label" for="event_start">Start Time:</label>
                    <input type="datetime-local" id="event_start" name="event_start"/>
                  </span>

                  <span>
                    <label class="inner-label" for="event_end">End Time:</label>
                    <input type="datetime-local" id="event_end" name="event_end"/>
                  </span>

                  <span>
                    <label class="inner-label" for="event_location">Event Location:</label>
                    <input type="text" id="event_location" name="event_location" placeholder="Enter your event location..."/>
                  </span>

                </div>

                <label for="event_body">Invite Message:</label>
                <textarea id="event_body" name="event_body" rows="5" cols="60" placeholder="Enter your event invite message..."></textarea>

                <button id="submit" @click=${() => this.handleSubmit()}>Add Event</button>
            </div>
        </div>
        ${this.showErrorToast ? html`<app-toast>Please make sure that all fields are populated before submitting.</app-toast>` : html``}

    `;
  }
}
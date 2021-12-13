import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import { provider } from '../services/provider';
import { getCurrentUserId } from '../services/calendar-api';
import { getGroupCode, getGroupName, getTimezone, isUserAdmin } from '../services/database';
import { zoneMappings } from '../services/data';


@customElement('app-settings')
export class AppSettings extends LitElement implements BeforeEnterObserver {
  async onBeforeEnter(
    location: RouterLocation,
    commands: PreventAndRedirectCommands,
    router: Router) {
      if(provider !== undefined && provider.getAllAccounts().length == 0){
        Router.go("/login")
      }
  }

  @property({type: Boolean}) showLoader: any | null = false;
  @property({type: Boolean}) userIsAdmin: any | null = false;
  @property({type: Boolean}) inputState: any | null = false; // if false, the inputs are disabled. if true, inputs are not disabled
  @property({type: Boolean}) groupName: any | null = "";
  @property({type: Boolean}) timezone: any | null = "";
  @property({type: Boolean}) groupCode: any | null = "";

  static get styles() {
    return css`
    #page {
      height: 100vh;
      background-color: #F1E4EE;
  }

  section {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 400px;
      padding-top: 100px;
      background: #DDBDD5;
      width: 100%;
  }

  #top-slot {
    display: flex;
    align-item: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    font-size: 14px;
  }

  #back, #edit {
      display: flex;
      align-items: center;
      justify-content: flex-start;
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

  #edit:hover{
    cursor: pointer;
    border-bottom: 1px solid black;
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

  #s-box {
      position: absolute;
      height: fit-content;
      width: 30vw;
      background-color: white;

      padding: 55px;

      position: absolute;
      z-index: 100;
      top: 50%;  /* position the top  edge of the element at the middle of the parent */
      left: 50%; /* position the left edge of the element at the middle of the parent */

      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
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

  #s-box input {
    margin-bottom: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #A8A8A8;
    height: 38px;
    width: 100%;
    font-size: 14px;
    text-indent: 10px;
  }

  #s-box input:hover {
    border-color: black;
  }

  #s-box label {
    margin-bottom: 6px;
    font-size: 12px;
  }

  #edit-message {
    font-size: 12px;
    margin: 0;
  }

  #s-box select {
    margin-bottom: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #A8A8A8;
    height: 38px;
    width: 100%;
    font-size: 14px;
    text-indent: 10px;
  }

  #s-box select:hover {
    border-color: black;
  }

  #s-box input:disabled:hover{
    cursor: not-allowed;
  }

  #s-box select:disabled:hover{
    cursor: not-allowed;
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

  async firstUpdated() {
    let userId = await getCurrentUserId();
    this.userIsAdmin = await isUserAdmin(userId);

    this.groupName = await getGroupName();
    this.timezone = await getTimezone();
    this.groupCode = await getGroupCode();
  }

  toggleEdit(){
    if(this.inputState){
      // Get the group name
      let group_name = (this.shadowRoot!.getElementById("group_name") as any).value;

      // Get the timezone
      let timezone_sel = this.shadowRoot!.getElementById("timezones") as any;
      let timezone = timezone_sel.options[timezone_sel.selectedIndex].text

      if(group_name !== this.groupName || timezone !== this.timezone){
        console.log("write new settings");
      }
    }
    let inputs = this.shadowRoot!.querySelectorAll(".disable-toggle");
    inputs.forEach((input: any) => input.disabled = this.inputState);
    this.inputState = !this.inputState;
  }

  render() {
    return html`
      <div id="page">
        <section>
          <div class="curve"></div>
        </section>
        <div id="s-box">
        ${this.showLoader ? html`<span class="loader"></span>` :
            html`
              <div id="top-slot">
                <span id="back" @click=${() => Router.go("/")}><ion-icon name="arrow-back" style="font-size: 14px; margin-right: 5px;"></ion-icon>Back</span>
                ${this.userIsAdmin ?
                  html`<span id="edit" @click=${() => this.toggleEdit()}>
                    ${this.inputState ?
                      html `<ion-icon name="save" style="font-size: 14px; margin-right: 5px;"></ion-icon>Save Settings` :
                      html`<ion-icon name="pencil" style="font-size: 14px; margin-right: 5px;" ></ion-icon>Edit Settings`
                    }
                    </span>` :
                  html`<p id="edit-message">Contact your group admin to edit settings.</p>`
                }
              </div>
                <label for="group_name">Group Name:</label>
                <input class="disable-toggle" type="text" id="group_name" name="group_name" value=${this.groupName} disabled />

                <label for="group_code">Group Code:</label>
                <input type="text" id="group_code" name="group_code" value=${this.groupCode} disabled />

                <label for="timezones">Default Timezone:</label>
                <select class="disable-toggle" name="timezones" id="timezones" disabled>
                    ${zoneMappings.map((zone: any) => this.timezone === zone ? html`<option value="${zone}" selected>${zone}</option>` : html`<option value="${zone}">${zone}</option>`)}
                </select>
            `}
        </div>
      </div>
    `;
  }
}

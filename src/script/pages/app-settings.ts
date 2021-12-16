import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import { provider } from '../services/provider';
import { getCurrentUserId } from '../services/calendar-api';
import { addAdmin, getGroupCode, getGroupMembersInformation, getGroupName, getTimezone, isUserAdmin, removeAdmin, updateGroupSettings } from '../services/database';
import { zoneMappings } from '../services/data';
import '../components/toast';


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

  @state() showLoader: any | null = false;
  @state() userIsAdmin: any | null = false;
  @state() inputState: any | null = false; // if false, the inputs are disabled. if true, inputs are not disabled
  @state() groupName: any | null = "";
  @state() timezone: any | null = "";
  @state() groupCode: any | null = "";
  @state() memberDetails: any | null = [];
  @state() everythingLoaded: any | null = false;
  @state() showLengthToast: any | null = false;
  @state() showSuccessToast: any | null = false;
  @state() showErrorToast: any | null = false;
  @state() showConfirmAdminModal: any | null = false;
  @state() makeThisPersonAdmin: any | null = "";
  @state() addAdmin: any | null;
  @state() activeAdminBox: any | null;

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
      height: fit-content;
      width: 50vw;
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

  .top-input {
    margin-bottom: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #A8A8A8;
    height: 38px;
    width: 100%;
    font-size: 14px;
    text-indent: 10px;
  }

  .top-input:hover {
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

  .disable-toggle:disabled:hover{
    cursor: not-allowed;
  }



  th {
    text-align: center;
  }

  td {
    text-align: center;
    width: fit-content;
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

  .switch {
    position: relative;
    display: inline-block;
    width: 43px;
    height: 17px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 1px;
    bottom: 1px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #DDBDD5
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #DDBDD5
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  .table-slider:disabled + .slider:hover {
    cursor: not-allowed;
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .remover-enabled:hover{
    cursor: pointer;
  }

  .remover-disabled:hover{
    cursor: not-allowed;
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

  async firstUpdated() {
    this.showLoader = true;
    let userId = await getCurrentUserId();
    this.userIsAdmin = await isUserAdmin(userId);
    this.groupName = await getGroupName();
    this.timezone = await getTimezone();
    this.groupCode = await getGroupCode();
    this.memberDetails = await getGroupMembersInformation();
    this.showLoader = false;
    this.everythingLoaded = true;
    this.requestUpdate();
  }

  getInput(member: any){
    if(this.memberDetails.length == 1){
      return html`<input @change=${(e: any) => this.startAdminProcess(e, member)} class="table-slider" type="checkbox" checked disabled>`
    }
    if(member.isAdmin){
      return html`<input @change=${(e: any) => this.startAdminProcess(e, member)} class="disable-toggle table-slider" type="checkbox" checked disabled>`
    } else {
      return html`<input @change=${(e: any) => this.startAdminProcess(e, member)} class="disable-toggle table-slider" type="checkbox" disabled>`
    }
  }

  async toggleEdit(){
    if(this.inputState){
      // Get the group name
      let group_name = ((this.shadowRoot!.getElementById("group_name") as any).value as string);

      // Get the timezone
      let timezone_sel = this.shadowRoot!.getElementById("timezones") as any;
      let timezone = (timezone_sel.options[timezone_sel.selectedIndex].text as string)

      if(group_name !== this.groupName || timezone !== this.timezone){

        if(group_name.length < 5){
          this.showLengthToast = true;
          setTimeout(() => {
              this.showLengthToast = false;
          }, 3000);
          (this.shadowRoot!.getElementById("group_name") as any)!.value = this.groupName;
          this.requestUpdate();
          return;
        }
        try{
          await updateGroupSettings(this.groupCode, group_name, timezone);
          this.showSuccessToast = true;
          setTimeout(() => {
              this.showSuccessToast = false;
          }, 3000);
        } catch(error: any){
          console.error(error)
          this.showErrorToast = true;
          setTimeout(() => {
              this.showErrorToast = false;
          }, 3000);
        }
      }
    }
    let inputs = this.shadowRoot!.querySelectorAll(".disable-toggle");
    inputs.forEach((input: any) => input.disabled = this.inputState);
    this.inputState = !this.inputState;
  }

  startAdminProcess(e: any, member: any){
    this.activeAdminBox = e.target
    this.showConfirmAdminModal = true;
    this.makeThisPersonAdmin = member;
    if(this.activeAdminBox.checked){
      this.addAdmin = true;
    } else {
      this.addAdmin = false;
    }
  }

  async handleAdminResult(no: any, add: any, member: any){
    if(no){
      this.showConfirmAdminModal = false;
      this.activeAdminBox.checked = !this.activeAdminBox.checked;
      return;
    }
    if(add){
      try{
        await addAdmin(this.groupCode, member.uid)
        this.showSuccessToast = true;
        setTimeout(() => {
            this.showSuccessToast = false;
        }, 3000);
      } catch(error: any) {
        console.log(error);
        this.showErrorToast = true;
        setTimeout(() => {
            this.showErrorToast = false;
        }, 3000);
      }

      this.showConfirmAdminModal = false;

    } else {
      try{
        await removeAdmin(this.groupCode, member.uid);
        this.showSuccessToast = true;
        setTimeout(() => {
            this.showSuccessToast = false;
        }, 3000);
      } catch(error: any) {
        console.log(error);
        this.showErrorToast = true;
          setTimeout(() => {
              this.showErrorToast = false;
          }, 3000);
      }

      this.showConfirmAdminModal = false;
    }
  }

  confirmRemoveUser(member: any){
    alert("are you sure you want to remove " + member.details.displayName + " from the group");
    // actually handle removing them from the group
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
              <input class="disable-toggle top-input" type="text" id="group_name" name="group_name" value=${this.groupName} maxlength="45" disabled />

              <label for="group_code">Group Code:</label>
              <input class="top-input" type="text" id="group_code" name="group_code" value=${this.groupCode} disabled />

              <label for="timezones">Default Timezone:</label>
              <select class="disable-toggle top-input" name="timezones" id="timezones" disabled>
                  ${zoneMappings.map((zone: any) => this.timezone === zone ? html`<option value="${zone}" selected>${zone}</option>` : html`<option value="${zone}">${zone}</option>`)}
              </select>

              <table>
                <tr>
                  <th>Member Name</th>
                  <th>Member Email</th>
                  <th>Toggle Admin</th>
                  <th>Remove User</th>
                </tr>

                ${this.memberDetails.map((member: any) =>
                  html`
                  <tr>
                    <td>${member.details.displayName}</td>
                    <td>${member.details.mail}</td>
                    <td>
                      <label class="switch">
                        ${this.getInput(member)}
                        <span class="slider round"></span>
                      </label>
                    </td>
                    <td>
                      ${this.inputState && this.memberDetails.length > 1 ?
                        html`<ion-icon class="remover-enabled" @click=${() => this.confirmRemoveUser(member)} name="close"></ion-icon>` :
                        html`<ion-icon class="remover-disabled" name="close"></ion-icon>`
                      }
                    </td>
                  </tr>`
                )}
              </table>
            `}
        </div>
        ${this.showLengthToast ? html`<app-toast>Your group name must contain atleast 5 characters. Please try again.</app-toast>` : html``}
        ${this.showSuccessToast ? html`<app-toast>Your group settings have been successfully updated!</app-toast>` : html``}
        ${this.showErrorToast ? html`<app-toast>There was an error updating your group settings. Please try again.</app-toast>` : html``}
        ${this.showConfirmAdminModal ?
          html`
            <div class="modal-box" id="admin-box">
              ${this.addAdmin ? html`<p>Are you sure you want to give ${this.makeThisPersonAdmin.details.displayName} admin priviledges?</p>` :
                                html`<p>Are you sure you want to remove ${this.makeThisPersonAdmin.details.displayName} as an admin of your group?</p>`}
            <slot>
              <button @click=${() => this.handleAdminResult(true, this.addAdmin, this.makeThisPersonAdmin)}>No</button>
              <button @click=${() => this.handleAdminResult(false, this.addAdmin, this.makeThisPersonAdmin)}>Yes</button>
            </slot>
          </div>
          ` :
          html``}
      </div>
    `;
  }
}

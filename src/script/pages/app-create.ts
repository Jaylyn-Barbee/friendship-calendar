import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import { zoneMappings } from "../services/data"
import '../components/toast';
import { createMainCalendar, getCurrentUserId } from '../services/calendar-api';
import { checkForCode, checkForUserInDb, createNewGroup } from '../services/database';
import { provider } from '../services/provider';

@customElement('app-create')
export class AppCreate extends LitElement implements BeforeEnterObserver {


    async onBeforeEnter(
      location: RouterLocation,
      commands: PreventAndRedirectCommands,
      router: Router) {
        if(provider !== undefined && provider.getAllAccounts().length == 0){
          Router.go("/login")
        }

        let userId = await getCurrentUserId();
        let in_db = await checkForUserInDb(userId);
        if(in_db){
            Router.go("/");
        }
    }

    @state() code: any;
    @state() showCopyToast: any | null = false;
    @state() showErrorToast: any | null = false;
    @state() showLoader: any | null = false;

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

            #c-box {
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

            #c-box input {
                margin-bottom: 20px;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid #A8A8A8;
                height: 38px;
                width: 100%;
                font-size: 14px;
                text-indent: 10px;
            }

            #c-box input:hover {
                border-color: black;
            }

            #c-box label {
                margin-bottom: 6px;
                font-size: 12px;
            }

            #c-box select {
                margin-bottom: 20px;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid #A8A8A8;
                height: 38px;
                width: 100%;
                font-size: 14px;
                text-indent: 10px;
            }

            #c-box select:hover {
                border-color: black;
            }

            #bottom {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            #code-box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-top: 1px solid #A8A8A8;
                margin-top: 20px;
            }

            #group-code {
                display: flex;
                align-items: center;
                width: 100%;
                font-size: 24px;
                margin-top: 20px;
            }

            #group-code p {
                width: fit-content;
            }

            ion-icon:hover {
                cursor: pointer;
            }

            #create-button {
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

                width: 50%;
            }

            #create-button:hover {
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

        `;
    }

    constructor() {
        super();
    }

    async firstUpdated(){
        this.code = await this.generateCode();
    }

    async generateCode(){
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = ""
        var charactersLength = characters.length;

        while(true){
            for ( var i = 0; i < 6 ; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            let validCode = await checkForCode(result)
            if(!validCode){
                break;
            } else {
                result = "";
            }
        }

        return result;
    }

    shareCode() {

        let copyText: string = "Join my group on Sync'd! The join code is: " + this.code;

        if ((navigator as any).share) {
            (navigator as any).share({
              title: 'Share group code from Sync\'d',
              text: copyText
            });
        } else {
            /* Copy the text inside the text field */
            navigator.clipboard.writeText(copyText);
            this.showCopyToast = true;
            setTimeout(() => {
                this.showCopyToast = false;
            }, 3000)
        }

    }

    errorToast(){
        this.showErrorToast = true;
        setTimeout(() => {
            this.showErrorToast = false;
        }, 3000)
    }

    // need to make sure the group_name isn't empty.
    async createGroup(){
        // Get the group name
        let group_name = (this.shadowRoot!.getElementById("group_name") as any).value;

        // Get the timezone
        let timezone_sel = this.shadowRoot!.getElementById("timezones") as any;
        let timezone = timezone_sel.options[timezone_sel.selectedIndex].text

        if(group_name.length < 5){
            this.errorToast();
            return;
        }

        this.showLoader = true;
        // Get the code
        let code = this.code;

        // Create a calendar (calendar-api)
        let cal_id = await createMainCalendar(group_name);

        // Get the user who created it, push to admin and member
        let userId = await getCurrentUserId();

        // push info to db
        try {
            await createNewGroup(group_name, timezone, code, cal_id, userId);
            Router.go("/pick-calendar");
        } catch(error: any){
            console.error(error);
        }
    }

    render() {
        return html`
        <div id="page">
            <section>
            <div class="curve"></div>
            </section>
            <div id="c-box">
            ${this.showLoader ? html`<span class="loader"></span>` :
            html`
                <span id="back" @click=${() => Router.go("/create-or-join")}><ion-icon name="arrow-back" style="font-size: 14px; margin-right: 5px;"></ion-icon>Back</span>
                <label for="group_name">Group Name:</label>
                <input type="text" id="group_name" name="group_name" placeholder="Enter your group name..." maxlength="45"/>

                <label for="timezones">Default Timezone:</label>
                <select name="timezones" id="timezones">
                    ${zoneMappings.map((zone: any) => html`<option value="${zone}">${zone}</option>`)}
                </select>

                <div id="bottom">
                    <button id="create-button" @click=${() => this.createGroup()}>Create Group</button>
                    <div id="code-box">
                        <p id="group-code" >Your Group Join Code is: ${this.code}</p>
                        <ion-icon @click=${() => this.shareCode()} name="share-social-outline" style="margin-left: 5px; font-size: 32px;"></ion-icon>
                    </div>
                </div>`
            }
            </div>
        </div>
        ${this.showCopyToast ? html`<app-toast>Invite Message copied to clip board!</app-toast>` : html``}
        ${this.showErrorToast ? html`<app-toast>Please enter a group name with at least 5 characters!</app-toast>` : html``}

        `;
    }
}
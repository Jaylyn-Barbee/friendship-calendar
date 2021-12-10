import { LitElement, css, html  } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getCurrentUserId } from '../services/calendar-api';
import { checkForCode, addUserToGroup, checkForUserInDb } from '../services/database';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import { provider } from '../services/provider';

@customElement('app-join')
export class AppJoin extends LitElement implements BeforeEnterObserver {

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

  @property({type: Boolean}) showLoader: any | null = false;

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

            #j-box {
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

            #j-box input {
                margin-bottom: 20px;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid #A8A8A8;
                height: 60px;
                width: 100%;
                font-size: 24px;
                text-indent: 10px;
            }

            #j-box input:hover {
                border-color: black;
            }

            #j-box label {
                margin-bottom: 6px;
                font-size: 16px;
            }

            #join-button {
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

                width: 100%;
            }

            #join-button:hover {
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

  async firstUpdated() {
  }

  async joinGroup(){
    // Get Code
    let group_code = (this.shadowRoot!.getElementById("code_field") as any).value.toUpperCase();

    // Verify that it is an exisiting group
    let valid = await checkForCode(group_code);

    // push user id to members
    if(valid){
      this.showLoader = true;
      let userId = await getCurrentUserId();
      try{
        await addUserToGroup(group_code, userId);
        Router.go("/pick-calendar");
      } catch(error: any){
        console.error(error);

      }
    } else {
      Router.go("/join-group/error");
    }

    // Route to selection
  }

  render() {
    return html`
      <div id="page">
        <section>
            <div class="curve"></div>
            </section>
            <div id="j-box">
            ${this.showLoader ? html`<span class="loader"></span>` :
            html`
              <span id="back" @click=${() => Router.go("/create-or-join")}><ion-icon name="arrow-back" style="font-size: 14px; margin-right: 5px;"></ion-icon>Back</span>
                <label for="code_field">Enter code below to join your group! (code is not case-sensitive)</label>
                <input type="text" id="code_field" name="code_field" placeholder="Enter code..."/>
                <button id="join-button" @click=${() => this.joinGroup()}>Join Group</button>
                `}
            </div>
        </div>
    `;
  }
}

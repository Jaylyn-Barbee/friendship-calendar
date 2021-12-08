import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import { provider } from '../services/provider';


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

  #s-box input {
    margin-rigt: 5px;
  }

  .radio-input {
    display: flex;
    margin-bottom: 10px;
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

  render() {
    return html`
      <div id="page">
        <section>
        <div class="curve"></div>
        </section>
        <div id="s-box">
        ${this.showLoader ? html`<span class="loader"></span>` :
            html`

            `}
        </div>
      </div>
    `;
  }
}

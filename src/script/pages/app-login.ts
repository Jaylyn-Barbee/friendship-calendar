import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@microsoft/mgt-components';
import { provider } from '../services/provider';
import { Router } from '@vaadin/router';


@customElement('app-login')
export class AppLogin extends LitElement {

  @property() provider: any;

  static get styles() {
    return css`
        #page{
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

        #login-box {
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
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        mgt-login {
            --margin: 0;
            --padding: 10px;
            background-color: #F1E4EE;
            --button-background-color--hover: #DDBDD5;
            --button-color--hover: black;
        }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated(){
    this.provider = provider;
    this.shadowRoot!.querySelector('mgt-login')?.addEventListener('loginCompleted', (e: any) => {
      Router.go("/create-or-join")
    });
  }

  render() {
    return html`
      <div id="page">
        <section>
          <div class="curve"></div>
        </section>
        <div id="login-box">
          <h1>Welcome to Friendship Calendar!</h1>
          <p>An easy to use event calendar for busy groups to plan time with one another!</p>
          <mgt-login></mgt-login>
        </div>
      </div>
    `;
  }
}

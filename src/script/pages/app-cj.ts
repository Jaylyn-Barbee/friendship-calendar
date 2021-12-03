import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

@customElement('app-cj')
export class AppCj extends LitElement {
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

        #cj-box {
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

        button {
            background: #F1E4EE;
            border-radius: 10px;
            width: 80%;
            padding: 20px 50px;
            box-shadow: 0;
            border: none;
        }

        button:hover {
            background: #DDBDD5;
            cursor: pointer;
        }

        #join {
            margin-top: 20px;
        }

        p {
            margin: 0;
            margin-top: 5px;
            font-size: 12px;
            text-align: center;
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
        <div id="cj-box">
          <button id="create" @click=${ () => Router.go("/create-group")}>Create</button>
          <p>Create a new group from scratch</p>
          <button id="join" @click=${ () => Router.go("/join-group")}>Join a Group</button>
          <p>Join an existing group</p>
        </div>
      </div>
    `;
  }
}


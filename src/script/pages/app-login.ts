import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@microsoft/mgt-components';
import { provider } from '../services/provider';

@customElement('app-login')
export class AppLogin extends LitElement {
  @property() provider: any;

  static get styles() {
    return css`
        #page{
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0px;
        }

        mgt-login {
            --margin: 0;
            --padding: 10px;
            border: 1px solid black;
            border-radius: 10px;
        }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated(){
    this.provider = provider;
  }

  render() {
    return html`
        <div id="page">
            <mgt-login></mgt-login>
        </div>
    `;
  }
}

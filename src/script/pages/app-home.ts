import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import "../components/date-cell";
import "../components/calendar";
// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { provider } from '../services/provider';

@customElement('app-home')
export class AppHome extends LitElement implements BeforeEnterObserver{

  onBeforeEnter(
    location: RouterLocation,
    commands: PreventAndRedirectCommands,
    router: Router) {
      if(provider !== undefined && provider.getAllAccounts().length == 0){
        Router.go("/login")
      }
  }

  static get styles() {
    return css`
    #page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin: 0 auto;
    }

    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {

  }

  render() {
    return html`
    <div id="page">
      <app-calendar></app-calendar>
    </div>
    `;
  }
}

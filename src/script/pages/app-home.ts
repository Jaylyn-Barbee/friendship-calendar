import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import "../components/date-cell";
import "../components/calendar";
// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { provider } from '../services/provider';
import { getCurrentUserId } from '../services/calendar-api';
import { checkForUserInDb } from '../services/database';

@customElement('app-home')
export class AppHome extends LitElement implements BeforeEnterObserver{

  async onBeforeEnter(
    location: RouterLocation,
    commands: PreventAndRedirectCommands,
    router: Router) {
      if(provider !== undefined && provider.getAllAccounts().length == 0){
        Router.go("/login")
      }
      let userId = await getCurrentUserId();
      let in_db = await checkForUserInDb(userId);
      if(!in_db){
          Router.go("/create-or-join");
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

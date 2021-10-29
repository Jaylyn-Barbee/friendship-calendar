import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { test } from '../services/calendar-api-test';
// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  static get styles() {
    return css`
      #welcomeBar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      #welcomeBar fast-card {
        margin-bottom: 12px;
      }

      #welcomeCard,
      #infoCard {
        padding: 18px;
        padding-top: 0px;
      }

      pwa-install {
        position: absolute;
        bottom: 16px;
        right: 16px;
      }

      button {
        cursor: pointer;
      }

      @media (min-width: 1200px) {
        #welcomeCard,
        #infoCard {
          width: 40%;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        #welcomeBar {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        #welcomeCard {
          margin-right: 64px;
        }
      }

      @media(prefers-color-scheme: light) {
        fast-card {
          --background-color: white;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/

  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`

    `;
  }
}

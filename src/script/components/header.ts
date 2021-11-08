import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@microsoft/mgt-components';
import { provider } from '../services/provider';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'Friendship Calendar';
  @property() provider: any;

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        background: var(--app-color-primary);
        color: white;
        height: 4em;
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        font-size: 20px;
        font-weight: bold;
      }

      nav {
        width: max-content;
        display: flex;
        justify-content: space-between;
      }

      nav fast-anchor {
        margin-left: 10px;
        width: max-content;
      }

      @media(prefers-color-scheme: light) {
        header {
          color: black;
        }
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
      <header>
        <h1>${this.title}</h1>

        <nav>
          <fast-anchor href="./" appearance="button">Home</fast-anchor>
          <fast-anchor href="./about" appearance="button">About</fast-anchor>
          <mgt-login></mgt-login>
        </nav>
      </header>
    `;
  }
}

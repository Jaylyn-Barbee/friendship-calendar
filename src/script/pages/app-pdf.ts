import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('app-pdf')
export class AppPDF extends LitElement {

  static get styles() {
    return css`
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated(){
  }

  render() {
    return html`
      pdf page
    `;
  }
}

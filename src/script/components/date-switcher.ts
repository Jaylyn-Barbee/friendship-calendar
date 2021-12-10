import { LitElement, css, html } from 'lit-element';
import { property, customElement } from 'lit/decorators.js';

@customElement('app-switcher')
export class AppSwitcher extends LitElement {
    @property() show: any = "";

    static get styles() {
        return css`
            #box {
                display: none;
                width: 400px;
                height: 300px;
                background-color: black;
                position: absolute;
            }
        `
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div id="box">

            </div>
        `
    }
}
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import '../components/header';
import './app-home';

@customElement('app-index')
export class AppIndex extends LitElement {
  static get styles() {
    return css`

      #routerOutlet > * {
        width: 100% !important;
      }

      #routerOutlet > .leaving {
        animation: 160ms fadeOut ease-in-out;
      }

      #routerOutlet > .entering {
        animation: 160ms fadeIn linear;
      }

      main {
        overflow-y: hidden;
        overflow-x: hidden;
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }

        to {
          opacity: 0;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0.2;
        }

        to {
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/

    // For more info on using the @vaadin/router check here https://vaadin.com/router

    const router = new Router(this.shadowRoot?.querySelector('#routerOutlet'));
    router.setRoutes([
      // temporarily cast to any because of a Type bug with the router
      {
        path: '',
        animate: true,
        children: [
          { path: '/', component: 'app-home' },
          {
            path: '/new_event',
            component: 'app-event',
            action: async () => {
              await import('./app-event.js');
            },
          },
          {
            path: '/login',
            component: 'app-login',
            action: async () => {
              await import('./app-login.js');
            },
          },
          {
            path: '/create-or-join',
            component: 'app-cj',
            action: async () => {
              await import('./app-cj.js');
            },
          },
          {
            path: '/create-group',
            component: 'app-create',
            action: async () => {
              await import('./app-create.js');
            },
          },
          {
            path: '/join-group',
            component: 'app-join',
            action: async () => {
              await import('./app-join.js');
            },
          },
          {
            path: '/join-group/error',
            component: 'app-joinerror',
            action: async () => {
              await import('./app-joinerror.js');
            },
          },
          {
            path: '/pick-calendar',
            component: 'app-selection',
            action: async () => {
              await import('./app-selection.js');
            },
          },
          {
            path: '/settings',
            component: 'app-settings',
            action: async () => {
              await import('./app-settings.js');
            },
          },
          {
            path: '/open-pdf',
            component: 'app-pdf',
            action: async () => {
              await import('./app-pdf.js');
            },
          }
        ],
      } as any,
    ]);
  }

  render() {
    return html`
      <div>
        <main>
          <div id="routerOutlet"></div>
        </main>
      </div>
    `;
  }
}

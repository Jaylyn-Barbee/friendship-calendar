import { Providers, Msal2Provider } from "@microsoft/mgt";

const clientId = '7675d309-afb2-4679-b801-6f9dbf50c4fd';

const scopes = [
  'user.read',
  'people.read',
  'user.readbasic.all',
  'contacts.read',
  'calendars.read',
  'Presence.Read.All',
  'Presence.Read'
]

Providers.globalProvider = new Msal2Provider({
    clientId,
    scopes,
    redirectUri: window.location.origin
  });

export var provider = Providers.globalProvider;
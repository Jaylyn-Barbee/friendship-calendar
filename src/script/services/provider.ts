import { Providers, Msal2Provider } from "@microsoft/mgt";

const clientId = 'a9d85621-5a2a-4211-9862-e0375021df83';

const scopes = [
  'user.read',
  'people.read',
  'user.readbasic.all',
  'contacts.read',
  'calendars.read',
  'Presence.Read.All',
  'Presence.Read',
  'Calendars.ReadWrite',
  'Group.ReadWrite.All'
]

Providers.globalProvider = new Msal2Provider({
    clientId,
    scopes,
    redirectUri: window.location.origin
});

export var provider = Providers.globalProvider;
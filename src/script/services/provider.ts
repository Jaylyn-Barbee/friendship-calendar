import { Providers, Msal2Provider } from "@microsoft/mgt";

const clientId = "__clientID__";

const scopes = [
  'user.read',
  'people.read',
  'User.ReadBasic.All',
  'contacts.read',
  'calendars.read',
  'Presence.Read.All',
  'Presence.Read',
  'Calendars.ReadWrite',
  'Group.ReadWrite.All'
]

Providers.globalProvider = new Msal2Provider({
    clientId,
    scopes
});

export var provider = Providers.globalProvider;
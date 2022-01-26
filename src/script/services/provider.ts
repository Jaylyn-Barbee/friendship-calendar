import { Providers, Msal2Provider } from "@microsoft/mgt";
import { env } from "../utils/environment";

const clientId = env.clientID;

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
    scopes,
    redirectUri: window.location.origin
});

export var provider = Providers.globalProvider;
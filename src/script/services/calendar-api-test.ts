import { Providers, Msal2Provider } from "@microsoft/mgt";

Providers.globalProvider = new Msal2Provider({
  clientId: '7675d309-afb2-4679-b801-6f9dbf50c4fd'
});

let provider = Providers.globalProvider;

export async function test(){
    if (provider) {
        let graphClient = provider.graph.client;
        let userDetails = await graphClient.api('me').get();
        console.log("userDetails = ", userDetails);

    }
}

export function got() {
    console.log("hit got");
}
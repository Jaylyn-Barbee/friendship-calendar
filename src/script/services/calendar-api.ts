import {provider} from "./provider"

const graphClient = provider.graph.client;

export async function test(){
    if (provider) {

        let userDetails = await graphClient.api('me').get();
        console.log("userDetails = ", userDetails);

        let calDetails = await graphClient.api('me/calendars').get();
        console.log("calDetails = ", calDetails);
    }
}

export function got() {
    console.log("hit got");
}
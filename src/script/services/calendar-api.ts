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

export async function areThereEventsToday(day: any, month: any, year: any) {
    let events = await graphClient.api('me/calendar/events').get();

    let eventList = events.value;

    if(day < 10) {
        day = "0" + day;
    }

   for(let i = 0; i < eventList.length; i++){
       let eventTime = eventList[i].start.dateTime;
       eventTime = eventTime.split("T")[0];

       let match = year + "-" + (month + 1) + "-" + day;
       console.log(match);
       if(eventTime === match){
           return true;
       }
   }

    return false;
}

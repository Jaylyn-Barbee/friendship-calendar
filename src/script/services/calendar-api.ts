import { provider } from "./provider"

const graphClient = provider.graph.client;

export async function test(){
    if (provider) {

        //let userDetails = await graphClient.api('me').get();
        //console.log("userDetails = ", userDetails);

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

export async function createAndSubmitEvent(event_name: string, event_body: string, start_time: string, end_time: string,  event_location: string, attendees: any[]){
    /*
    console.log("name", event_name);
    console.log("body", event_body);
    console.log("start", start_time);
    console.log("end", end_time);
    console.log("location", event_location);
    console.log("attendees", attendees);
    */

    let attendeeList: any[] = []
    attendees.forEach(person => {
        attendeeList.push({emailAddress: { address: person.scoredEmailAddresses[0].address, name: person.displayName}})
    });

    const event = {
        subject: event_name,
        body: {
          contentType: 'HTML',
          content: event_body
        },
        start: {
            dateTime: start_time,
            timeZone: 'Eastern Standard Time' // will be replaced with groups perferred TZ
        },
        end: {
            dateTime: end_time,
            timeZone: 'Eastern Standard Time' // will be replaced with groups perferred TZ
        },
        location: {
            displayName: event_location
        },
        attendees: attendeeList
    };

    console.log(event);
    await graphClient.api('/me/calendar/events').post(event);
    // Add loader for await and on success put a toast saying success and bounce back to calendar
    // Also, in the future this will be added to the master calendar not the individual personal calendar
}
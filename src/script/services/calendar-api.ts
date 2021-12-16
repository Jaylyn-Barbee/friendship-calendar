import { provider } from "./provider"

const graphClient = provider.graph.client;

export async function getCurrentUserId(){
    let userDetails = await graphClient.api('me').get();
    return userDetails.id;
}

export async function getCurrentUserDetails(){
    let userDetails = await graphClient.api('me').get();
    return userDetails;
}

export async function getPhoto(){
    /* let photoBlob = await graphClient.api('me/photo/$value').get();
    //const photo = window.URL.createObjectURL(photoBlob.data);
    console.log("photo", photoBlob.toString('base64')); */

    try{
        let photoBlob = await graphClient.api('me/photo/$value').get();
        //const photo = URL.createObjectURL(photoBlob.data);
        //console.log(photo);
        return photoBlob;
    } catch(error: any) {
        console.error("No Photo Available");
        // try to get the initials. figure this out later..
        return "assets/images/placeholder.png";
    }
}

export async function createMainCalendar(group_name: string) {
    const calendar = {
        name: group_name + "'s Calendar"
      };

    let resp = await graphClient.api('/me/calendars').post(calendar);

    return resp.id;
}

export async function createAndSubmitEvent(event_name: string, event_body: string, start_time: string, end_time: string,  event_location: string, attendees: any[]){

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


    await graphClient.api('/me/calendar/events').post(event);
    // Add loader for await and on success put a toast saying success and bounce back to calendar
    // Also, in the future this will be added to the master calendar not the individual personal calendar
}

export async function getCurrentUsersCalendars(){
    let calDetails = await graphClient.api('me/calendars').get();
    return calDetails.value;
}
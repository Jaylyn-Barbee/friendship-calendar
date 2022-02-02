import { getGroupName, pushEventToCurrentUser, pushEventToGroup } from "./database";
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

    try{
        let photoBlob = await graphClient.api('me/photo/$value').get();
        return photoBlob;
    } catch(error: any) {
        console.error("No Photo Available");
        // try to get the initials. figure this out later..
        return "assets/images/placeholder.png";
    }
}

export async function createMainCalendar(group_name: string) {

    const calendarGroup = {
        name: group_name
    };

    let gresp = await graphClient.api('/me/calendarGroups').post(calendarGroup);

    let group_id = gresp.id;

    const calendar = {
        name: group_name + "\'s Calendar"
    };

    let cal_resp = await graphClient.api('/me/calendargroups/' + group_id + '/calendars').post(calendar);
    let cal_id = cal_resp.id;
    return [cal_id, group_id];
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

    let group_name = await getGroupName();
    let gresp = await graphClient.api('/me/calendarGroups').get();
    let groups = gresp.value
    let group_id = "";
    for(let i = 0; i < groups.length; i ++){
        let group = groups[i];
        if(group.name === group_name){
            group_id = group.id
        }
    }

    let resp = await graphClient.api('/me/calendars').get();
    let cals = resp.value
    let cal_id = "";
    for(let i = 0; i < cals.length; i ++){
        let cal = cals[i];
        let cal_name: string = (cal.name as string)
        if(cal_name.startsWith(group_name)){
            cal_id = cal.id
        }
    }

    let event_resp = await graphClient.api('/me/calendarGroups/'+ group_id +'/calendars/'+ cal_id +'/events').post(event);
    let event_id = event_resp.id;

    let db_event_obj = {
        id: event_id,
        event: event
    }

    await pushEventToGroup(db_event_obj);
    await pushEventToCurrentUser(db_event_obj);
}

export async function createNewEvents(new_events: any){
    let group_name = await getGroupName();
    let gresp = await graphClient.api('/me/calendarGroups').get();
    let groups = gresp.value
    let group_id = "";
    for(let i = 0; i < groups.length; i ++){
        let group = groups[i];
        if(group.name === group_name){
            group_id = group.id
        }
    }

    let resp = await graphClient.api('/me/calendars').get();
    let cals = resp.value
    let cal_id = "";
    for(let i = 0; i < cals.length; i ++){
        let cal = cals[i];
        let cal_name: string = (cal.name as string)
        if(cal_name.startsWith(group_name)){
            cal_id = cal.id
        }
    }

    for(let i = 0; i < new_events.length; i++){
        let event = new_events[i].event;
        await graphClient.api('/me/calendarGroups/'+ group_id +'/calendars/'+ cal_id +'/events').post(event);
    }
}

export async function getCurrentUsersCalendars(){
    let calDetails = await graphClient.api('me/calendars').get();
    return calDetails.value;
}

export async function deleteEvent(id: any){
    await graphClient.api('/me/events/' + id).delete();
}
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc, deleteDoc, enableIndexedDbPersistence } from "firebase/firestore";
import { env } from "../utils/environment";
import { getCurrentUserId } from "./calendar-api";

initializeApp({
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
});

const db = getFirestore();
enableIndexedDbPersistence(db)
  .catch((err: any) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

export async function addUser(userName_in: string, email_in: string, uid_in: string, photo_in: any, cal_id_in: string, group_id_in: string, groupCode_in: string, isAdmin_in: Boolean) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            uid: uid_in,
            details: {
                displayName: userName_in,
                mail: email_in,
                personImage: photo_in
            },
            cal_id: cal_id_in,
            group_id: group_id_in,
            groupCode: groupCode_in,
            isAdmin: isAdmin_in,
            user_events: []
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function createNewGroup(group_name: string, group_tz: string, group_code: string, user_id: string) {
    try {
        const docRef = await addDoc(collection(db, "groups"), {
            group_name: group_name,
            join_code: group_code,
            members: [user_id],
            admins: [user_id],
            default_tz: group_tz,
            group_events: []
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// True if code exists, false if code does not exist.
export async function checkForCode(code: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length != 0;
}

export async function addUserToGroup(code: string, uid: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);
    let updated_mems = item.data().members;
    updated_mems.push(uid);

    await setDoc(ref, {
        group_name: item.data().group_name,
        join_code: item.data().join_code,
        members: updated_mems,
        admins: item.data().admins,
        default_tz: item.data().default_tz,
        group_events: item.data().group_events
    });
}

export async function checkForUserInDb(uid: string){
    const groupsRef = collection(db, "users");
    const q = query(groupsRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length != 0;
}

export async function getMainCalendarId(){
    let uid = await getCurrentUserId();
    const groupsRef = collection(db, "users");
    const q = query(groupsRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    let ret = "";
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        ret = docu.data().cal_id;
    });

    return ret;
}

export async function getCalendarGroupId(){
    let uid = await getCurrentUserId();
    const groupsRef = collection(db, "users");
    const q = query(groupsRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    let ret = "";
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        ret = docu.data().group_id;
    });

    return ret;
}

export async function getGroupName(){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let ret = "";
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        ret = docu.data().group_name;
    });

    return ret;
}

export async function getGroupMembers(){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let ret = "";
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        ret = docu.data().members;
    });

    return ret;
}

export async function isUserAdmin(uid: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", uid));

    const querySnapshot = await getDocs(q);

    let admin_list: any = [];
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        admin_list = docu.data().admins;
    });

    return admin_list.includes(uid);
}

export async function getTimezone(){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let ret = "";
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        ret = docu.data().default_tz;
    });

    return ret;

}

export async function getGroupCode(){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let ret = "";
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        ret = docu.data().join_code;
    });

    return ret;

}

export async function getGroupMembersInformation(){

    let memberIds = await getGroupMembers();

    let ret: any[] = [];
    for(let i = 0; i < memberIds.length; i++){
        let memberId = memberIds[i];
        const groupsRef = collection(db, "users");
        const q = query(groupsRef, where("uid", "==", memberId));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docu: any) => {
            // doc.data() is never undefined for query doc snapshots
            ret.push(docu.data());
        });

    }

    return ret;
}

export async function getGroupEvents(){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });
    return item.data().group_events;
}

export async function getUserEvents(){
    let uid = await getCurrentUserId();
    const groupsRef = collection(db, "users");
    const q = query(groupsRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });
    return item.data().user_events;
}

export async function updatedUserEvents(group_events: any){
    let uid = await getCurrentUserId();
    const groupsRef = collection(db, "users");
    const q = query(groupsRef, where("uid", "==", uid));

    const uquerySnapshot = await getDocs(q);

    let uitem: any;
    uquerySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        uitem = docu;
    });

    let uref = doc(db, 'users', uitem.id);

    await setDoc(uref, {
        details: uitem.data().details,
        groupCode: uitem.data().groupCode,
        isAdmin: uitem.data().isAdmin,
        cal_id: uitem.data().cal_id,
        group_id: uitem.data().group_id,
        uid: uitem.data().uid,
        user_events: group_events
    });
}

export async function updateGroupSettings(code: string, group_name: string, default_tz: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);

    await setDoc(ref, {
        group_name: group_name,
        join_code: item.data().join_code,
        members: item.data().members,
        admins: item.data().admins,
        default_tz: default_tz,
        group_events: item.data().group_events
    });
}

export async function addAdmin(code: string, uid: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);
    let updated_admins = item.data().admins;
    updated_admins.push(uid);

    await setDoc(ref, {
        group_name: item.data().group_name,
        join_code: item.data().join_code,
        members: item.data().members,
        admins: updated_admins,
        default_tz: item.data().default_tz,
        group_events: item.data().group_events
    });

    const usersRef = collection(db, "users");
    const uq = query(usersRef, where("uid", "==", uid));

    const uquerySnapshot = await getDocs(uq);

    let uitem: any;
    uquerySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        uitem = docu;
    });

    let uref = doc(db, 'users', uitem.id);

    await setDoc(uref, {
        details: uitem.data().details,
        groupCode: uitem.data().groupCode,
        isAdmin: true,
        cal_id: uitem.data().cal_id,
        group_id: uitem.data().group_id,
        uid: uitem.data().uid,
        user_events: uitem.data().user_events
    });


}

export async function removeAdmin(code: string, uid: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);
    let updated_admins = item.data().admins;

    const indexToRemove = updated_admins.indexOf(uid);
    if (indexToRemove > -1){
        updated_admins.splice(indexToRemove, 1);
    }

    await setDoc(ref, {
        group_name: item.data().group_name,
        join_code: item.data().join_code,
        members: item.data().members,
        admins: updated_admins,
        default_tz: item.data().default_tz,
        group_events: item.data().group_events
    });

    const usersRef = collection(db, "users");
    const uq = query(usersRef, where("uid", "==", uid));

    const uquerySnapshot = await getDocs(uq);

    let uitem: any;
    uquerySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        uitem = docu;
    });

    let uref = doc(db, 'users', uitem.id);

    await setDoc(uref, {
        details: uitem.data().details,
        groupCode: uitem.data().groupCode,
        isAdmin: false,
        cal_id: uitem.data().cal_id,
        group_id: uitem.data().group_id,
        uid: uitem.data().uid,
        user_events: uitem.data().user_events
    });
}

export async function removeUser(code: string, uid: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);
    let updated_admins = item.data().admins;

    let indexToRemove = updated_admins.indexOf(uid);
    if (indexToRemove > -1){
        updated_admins.splice(indexToRemove, 1);
    }

    let updated_mems = item.data().admins;
    indexToRemove = updated_mems.indexOf(uid);
    if (indexToRemove > -1){
        updated_mems.splice(indexToRemove, 1);
    }

    await setDoc(ref, {
        group_name: item.data().group_name,
        join_code: item.data().join_code,
        members: updated_mems,
        admins: updated_admins,
        default_tz: item.data().default_tz,
        group_events: item.data().group_events
    });

    const usersRef = collection(db, "users");
    const uq = query(usersRef, where("uid", "==", uid));

    const uquerySnapshot = await getDocs(uq);

    let uitem: any;
    uquerySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        uitem = docu;
    });

    await deleteDoc(doc(db, 'users', uitem.id));
}

export async function getAdmins(code: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });
    return item.data().admins;
}

export async function deleteGroup(code: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    await deleteDoc(doc(db, 'groups', item.id));

    const usersRef = collection(db, "users");
    const uq = query(usersRef, where("groupCode", "==", code));

    const uquerySnapshot = await getDocs(uq);

    uquerySnapshot.forEach(async (docu: any) => {
        await deleteDoc(doc(db, 'users', docu.id));
    });

}

export async function pushEventToGroup(event_id: any){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);
    let updated_events = item.data().group_events;
    updated_events.push(event_id);

    await setDoc(ref, {
        group_name: item.data().group_name,
        join_code: item.data().join_code,
        members: item.data().members,
        admins: item.data().admins,
        default_tz: item.data().default_tz,
        group_events: updated_events
    });
}

export async function pushEventToCurrentUser(event_id: any){
    let uid = await getCurrentUserId();
    const usersRef = collection(db, "users");
    const uq = query(usersRef, where("uid", "==", uid));

    const uquerySnapshot = await getDocs(uq);

    let uitem: any;
    uquerySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        uitem = docu;
    });

    let uref = doc(db, 'users', uitem.id);
    let updated_events = uitem.data().user_events;
    updated_events.push(event_id);

    await setDoc(uref, {
        details: uitem.data().details,
        groupCode: uitem.data().groupCode,
        isAdmin: uitem.data().isAdmin,
        cal_id: uitem.data().cal_id,
        group_id: uitem.data().group_id,
        uid: uitem.data().uid,
        user_events: updated_events
    });
}

export async function deleteEventsFromDB(event_id: any){
    let userId = await getCurrentUserId();
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    let item: any;
    querySnapshot.forEach((docu: any) => {
        // doc.data() is never undefined for query doc snapshots
        item = docu;
    });

    let ref = doc(db, 'groups', item.id);
    let updated_events: any = item.data().group_events;
    let filtered_events = updated_events.filter( (event: any) => event.id !== event_id);

    await setDoc(ref, {
        group_name: item.data().group_name,
        join_code: item.data().join_code,
        members: item.data().members,
        admins: item.data().admins,
        default_tz: item.data().default_tz,
        group_events: filtered_events
    });

    let mem_arr = item.data().members;
    for(let i = 0; i < mem_arr.length; i++){
        let uid = mem_arr[i];
        const usersRef = collection(db, "users");
        const uq = query(usersRef, where("uid", "==", uid));

        const uquerySnapshot = await getDocs(uq);

        let uitem: any;
        uquerySnapshot.forEach((docu: any) => {
            // doc.data() is never undefined for query doc snapshots
            uitem = docu;
        });

        let uref = doc(db, 'users', uitem.id);
        let updated_events = uitem.data().user_events;
        let ufiltered_events = updated_events.filter( (event: any) => event.id !== event_id);

        await setDoc(uref, {
            details: uitem.data().details,
            groupCode: uitem.data().groupCode,
            isAdmin: uitem.data().isAdmin,
            cal_id: uitem.data().cal_id,
            group_id: uitem.data().group_id,
            uid: uitem.data().uid,
            user_events: ufiltered_events
        });
    }

}
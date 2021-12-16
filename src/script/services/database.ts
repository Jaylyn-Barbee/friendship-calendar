import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc, deleteDoc, enableIndexedDbPersistence } from "firebase/firestore";
import { getCurrentUserId } from "./calendar-api";
/*
Your web app's Firebase configuration
For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtw-fshQIcn_Mg4mp2k5aB7eL-qtK6ZsI",
  authDomain: "friendship-calendar-c0efc.firebaseapp.com",
  projectId: "friendship-calendar-c0efc",
  storageBucket: "friendship-calendar-c0efc.appspot.com",
  messagingSenderId: "890395032689",
  appId: "1:890395032689:web:e1bf4ff6e0882351c6afd0",
  measurementId: "G-68FCYH7CN8"
};

Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/

initializeApp({
    apiKey: "AIzaSyBtw-fshQIcn_Mg4mp2k5aB7eL-qtK6ZsI",
    authDomain: "friendship-calendar-c0efc.firebaseapp.com",
    projectId: "friendship-calendar-c0efc",
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

export async function addUser(userName_in: string, email_in: string, uid_in: string, photo_in: any, pc_id_in: string, groupCode_in: string, isAdmin_in: Boolean) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            uid: uid_in,
            details: {
                displayName: userName_in,
                mail: email_in,
                personImage: photo_in
            },
            pc_id: pc_id_in,
            groupCode: groupCode_in,
            isAdmin: isAdmin_in
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function createNewGroup(group_name: string, group_tz: string, group_code: string, cal_id: string, user_id: string) {
    try {
        const docRef = await addDoc(collection(db, "groups"), {
            group_name: group_name,
            join_code: group_code,
            members: [user_id],
            main_cal_id: cal_id,
            admins: [user_id],
            default_tz: group_tz
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
        main_cal_id: item.data().main_cal_id,
        admins: item.data().admins,
        default_tz: item.data().default_tz
    });
}

export async function checkForUserInDb(uid: string){
    const groupsRef = collection(db, "users");
    const q = query(groupsRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length != 0;
}

export async function getMainCalendarId(){

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
        main_cal_id: item.data().main_cal_id,
        admins: item.data().admins,
        default_tz: default_tz
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
        main_cal_id: item.data().main_cal_id,
        admins: updated_admins,
        default_tz: item.data().default_tz
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
        pc_id: uitem.data().pc_id,
        uid: uitem.data().uid
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
        main_cal_id: item.data().main_cal_id,
        admins: updated_admins,
        default_tz: item.data().default_tz
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
        pc_id: uitem.data().pc_id,
        uid: uitem.data().uid
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
        main_cal_id: item.data().main_cal_id,
        admins: updated_admins,
        default_tz: item.data().default_tz
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
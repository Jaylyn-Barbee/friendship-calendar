import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where } from "firebase/firestore";
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

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBtw-fshQIcn_Mg4mp2k5aB7eL-qtK6ZsI",
    authDomain: "friendship-calendar-c0efc.firebaseapp.com",
    projectId: "friendship-calendar-c0efc",
  });

const db = getFirestore();

export async function addUser() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            pc_id: "test",
            user_object_id: "test"
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

export async function checkForCode(code: string){
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("join_code", "==", code));

    console.log(q);
}
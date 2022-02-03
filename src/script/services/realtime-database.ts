import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "__apiKey__",
  authDomain: "__authDomain__",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://friendship-calendar-c0efc-default-rtdb.firebaseio.com/",
  projectId: "__projectId__",
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase(app);

export async function testRealTime() {
    set(ref(db, 'users/' + "abc"), {
      username: "name",
      email: "email",
      profile_picture : "imageUrl"
    });
}
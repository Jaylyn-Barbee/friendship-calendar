export let env = {
    clientID: "a9d85621-5a2a-4211-9862-e0375021df83",
    apiKey: "AIzaSyBtw-fshQIcn_Mg4mp2k5aB7eL-qtK6ZsI",
    authDomain: "friendship-calendar-c0efc.firebaseapp.com",
    projectId: "friendship-calendar-c0efc",
    isProduction: false
}

if ((window as any).ENV == "production") {
    env.isProduction = true;
}
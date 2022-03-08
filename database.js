const admin = require("firebase-admin");



const serviceAccount = require("./hamstrar-52944-firebase.json");



admin.initializeApp({

credential: admin.credential.cert(serviceAccount),

});



function getDatabase() {

return admin.firestore();

}



module.exports = getDatabase;
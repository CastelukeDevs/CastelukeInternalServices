import admin, { ServiceAccount, initializeApp } from "firebase-admin";
import firebaseConfig from "./firebaseConfig";

const serviceAccount = firebaseConfig as admin.ServiceAccount;

const config = {
  credential: admin.credential.cert(serviceAccount),
};
export default admin.initializeApp(config);

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    storageBucket: "image-gallery-405811.appspot.com",
  };

const app = initializeApp(firebaseConfig);

export default getStorage(app);

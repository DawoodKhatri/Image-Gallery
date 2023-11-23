import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStream,
  deleteObject,
} from "firebase/storage";
import storage from "../config/storage.js";

export const upload = async (folder, fileName, fileBuffer, fileMimeType) => {
  const imageRef = ref(storage, `${folder}/${fileName}`);
  const uploadPath = (
    await uploadBytes(imageRef, fileBuffer, { contentType: fileMimeType })
  ).ref.fullPath;
  return uploadPath;
};

export const getUrl = async (filePath) => {
  const storageRef = ref(storage, filePath);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

export const getFileStream = (filePath) => {
  const storageRef = ref(storage, filePath);
  const fileStream = getStream(storageRef);
  return fileStream;
};

export const deleteFile = async (filePath) => {
  const storageRef = ref(storage, filePath);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};

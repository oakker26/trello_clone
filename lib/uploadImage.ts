// import { Storage } from "appwrite";

import { ID, stroage } from "@/appwrite";

export const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await stroage.createFile(
    process.env.NEXT_PUBLIC_BUCKET_ID!,
    ID.unique(),
    file
  );
  return fileUploaded;
};

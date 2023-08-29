import { stroage } from "@/appwrite";
import { Image } from "@/types";

export const getUrl = async (image: Image) => {
  const url = stroage.getFilePreview(image.bucketId, image.fileId);
  return url;
};

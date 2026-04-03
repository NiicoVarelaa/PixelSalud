const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto`;

export const getCloudinaryUrl = (imageName) => {
  return `${CLOUDINARY_BASE_URL}/${imageName}`;
};

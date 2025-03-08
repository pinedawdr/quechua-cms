import axios from 'axios';

const CLOUD_NAME = 'dwsht1d0o';
const API_KEY = '229868652573285';
const UPLOAD_PRESET = 'quechua_app_preset';

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('api_key', API_KEY);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const getImageUrl = (publicId) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;
};
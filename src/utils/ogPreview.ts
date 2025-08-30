export const getOpenGraphImage = (url: string): string | null => {
  try {
    // Use screenshot.rocks service which allows CORS
    const cleanUrl = encodeURIComponent(url);
    return `https://image.thum.io/get/width/1200/crop/800/${cleanUrl}`;
  } catch (error) {
    console.error('Error generating website preview URL:', error);
    return null;
  }
};
export const getOpenGraphImage = (url: string): string | null => {
  try {
    // Use a reliable screenshot service that generates Open Graph previews
    // This service creates a screenshot/preview of the website
    const cleanUrl = encodeURIComponent(url);
    return `https://api.urlbox.io/v1/ca482d7e-9417-4569-90fe-80f7c5e1c781/png?url=${cleanUrl}&width=1200&height=630`;
  } catch (error) {
    console.error('Error generating website preview URL:', error);
    return null;
  }
};
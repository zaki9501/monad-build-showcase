export const getOpenGraphImage = async (url: string): Promise<string | null> => {
  try {
    // For cross-origin requests, we'll use a proxy service
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) return null;
    
    // Parse the HTML to find og:image
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    
    // Look for og:image meta tag
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (ogImage) {
      // Handle relative URLs
      if (ogImage.startsWith('/')) {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}${ogImage}`;
      }
      return ogImage;
    }
    
    // Fallback to twitter:image
    const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    if (twitterImage) {
      if (twitterImage.startsWith('/')) {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}${twitterImage}`;
      }
      return twitterImage;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Open Graph image:', error);
    return null;
  }
};
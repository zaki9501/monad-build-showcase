
export const getGithubPreviewImage = (githubUrl: string): string | null => {
  try {
    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    // Remove .git suffix if present
    const cleanRepo = repo.replace(/\.git$/, '');
    
    // GitHub's Open Graph image URL format
    return `https://opengraph.githubassets.com/1/${owner}/${cleanRepo}`;
  } catch (error) {
    console.error('Error generating GitHub preview URL:', error);
    return null;
  }
};

/**
 Converts GitHub blob or raw web URLs to direct raw links suitable for HTML5 <video> elements.
 e.g., https://github.com/user/repo/blob/main/demo.mp4 
    -> https://raw.githubusercontent.com/user/repo/main/demo.mp4
*/
export function formatVideoUrl(url: string | undefined): string {
  if (!url || typeof url !== 'string') return '';

  let trimmed = url.trim();

  // Handle GitHub blob URLs
  // Matches: https://github.com/username/repository/blob/branch/filename.mp4
  const githubBlobRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/i;
  const blobMatch = trimmed.match(githubBlobRegex);
  if (blobMatch) {
    const [, user, repo, branch, filePath] = blobMatch;
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
  }

  // Handle GitHub raw format without raw.githubusercontent.com
  const githubRawRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/raw\/([^\/]+)\/(.+)$/i;
  const rawMatch = trimmed.match(githubRawRegex);
  if (rawMatch) {
    const [, user, repo, branch, filePath] = rawMatch;
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
  }

  return trimmed;
}

/**
 * Validates if the string appears to be a plausible video URL
 */
export function isPlausibleVideoUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  const formatted = formatVideoUrl(url);
  return (
    formatted.startsWith('http://') ||
    formatted.startsWith('https://') ||
    formatted.startsWith('data:video/') ||
    formatted.startsWith('blob:')
  );
}

// Collection of sample free royalty-free workout / fitness MP4 videos for defaults
export const SAMPLE_VIDEOS = {
  benchPress: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  squat: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  deadlift: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  shoulderPress: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  pullUp: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
};

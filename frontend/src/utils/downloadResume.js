/**
 * Downloads Aryan Thakor's Resume PDF reliably across all browsers.
 * First attempts to download via the backend attachment streaming API,
 * and falls back to direct client-side static asset download.
 */
export async function downloadResume(customFilename = 'Aryan_Thakor_Resume.pdf') {
  try {
    const res = await fetch('/api/resume/download');
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', customFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    }
  } catch (err) {
    console.warn('Backend resume download endpoint unreachable, falling back to static asset.', err);
  }

  // Fallback: direct programmatic anchor download
  try {
    const link = document.createElement('a');
    link.href = '/assets/documents/AryanThakorResume.pdf';
    link.setAttribute('download', customFilename);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (fallbackErr) {
    console.error('Failed to trigger resume download', fallbackErr);
    window.open('/assets/documents/AryanThakorResume.pdf', '_blank');
    return false;
  }
}

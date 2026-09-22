/**
 * Optimizes an uploaded image file for frontend storage and instant display.
 * Uses canvas to scale large camera photos down to a reasonable dimension
 * and converts to a base64 DataURL, keeping storage lightweight (~50-150KB).
 */
export function optimizeImageFile(file, maxWidth = 1000, maxHeight = 1000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided.'));
    }

    // SVG files can be read directly
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // ICO files can be read directly
    if (file.type === 'image/x-icon' || file.name.toLowerCase().endsWith('.ico')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        try {
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve(dataUrl);
        } catch {
          resolve(event.target.result);
        }
      };
      img.onerror = () => {
        resolve(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

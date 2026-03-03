/**
 * Convert an image file to WebP format using the Canvas API.
 *
 * @param {File} file - The source image file
 * @param {object} options - Conversion options
 * @param {number} options.quality - Quality 0–1 (ignored when lossless=true)
 * @param {boolean} options.lossless - Use lossless encoding
 * @param {number|null} options.width - Target width in px (null = keep original)
 * @param {number|null} options.height - Target height in px (null = keep original)
 * @param {boolean} options.keepAspectRatio - Maintain aspect ratio when resizing
 * @returns {Promise<{ blob: Blob, originalSize: number, webpSize: number, width: number, height: number }>}
 */
export async function convertToWebP(file, options = {}) {
  const {
    quality = 0.85,
    lossless = false,
    width = null,
    height = null,
    keepAspectRatio = true,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        let targetW = img.naturalWidth;
        let targetH = img.naturalHeight;

        if (width || height) {
          if (keepAspectRatio) {
            const ratio = img.naturalWidth / img.naturalHeight;
            if (width && height) {
              // Fit within box
              if (width / height > ratio) {
                targetW = Math.round(height * ratio);
                targetH = height;
              } else {
                targetW = width;
                targetH = Math.round(width / ratio);
              }
            } else if (width) {
              targetW = width;
              targetH = Math.round(width / ratio);
            } else {
              targetH = height;
              targetW = Math.round(height * ratio);
            }
          } else {
            if (width) targetW = width;
            if (height) targetH = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas 2D context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Use quality=1 for high-quality mode; note that canvas.toBlob does
        // not guarantee lossless output regardless of the quality value.
        const qualityValue = lossless ? 1 : quality;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            resolve({
              blob,
              originalSize: file.size,
              webpSize: blob.size,
              width: targetW,
              height: targetH,
            });
          },
          'image/webp',
          qualityValue
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Format bytes to a human-readable string.
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get a WebP output filename from the original filename.
 */
export function getWebPFilename(originalName) {
  const lastDot = originalName.lastIndexOf('.');
  const baseName = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${baseName}.webp`;
}

/**
 * Trigger a browser download of a Blob.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Supported source MIME types */
export const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'image/webp',
  'image/tiff',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/ico',
  'image/x-icon',
];

export const SUPPORTED_EXTENSIONS =
  '.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.tiff,.tif,.avif,.heic,.heif,.ico';

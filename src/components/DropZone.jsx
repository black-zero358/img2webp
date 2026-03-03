import { useRef, useState, useCallback } from 'react';
import { SUPPORTED_EXTENSIONS } from '../utils/converter';

export default function DropZone({ onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      if (!files) {
        return;
      }
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith('image/') ||
        (f.type === '' &&
          SUPPORTED_EXTENSIONS.split(',').some((ext) =>
            f.name.toLowerCase().endsWith(ext.trim())
          ))
      );
      if (imageFiles.length > 0) onFiles(imageFiles);
    },
    [onFiles]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onInputChange = useCallback(
    (e) => handleFiles(e.target.files),
    [handleFiles]
  );

  return (
    <div
      className={`drop-zone ${dragging ? 'dragging' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.key !== 'Enter') {
            e.preventDefault();
          }
          inputRef.current?.click();
        }
      }}
      aria-label="Upload images"
    >
      <div className="drop-zone-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="drop-zone-title">Drag &amp; drop images here</p>
      <p className="drop-zone-subtitle">or click to browse files</p>
      <p className="drop-zone-formats">
        Supports: JPG, PNG, GIF, BMP, SVG, TIFF, AVIF, WebP, ICO
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={SUPPORTED_EXTENSIONS}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

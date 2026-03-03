import { useState, useEffect, useMemo } from 'react';
import { formatBytes, getWebPFilename, downloadBlob } from '../utils/converter';

const STATUS_ICON = {
  idle: null,
  converting: (
    <svg className="spin icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  done: (
    <svg className="icon-sm text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="icon-sm text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
};

export default function ImageCard({ item, onRemove }) {
  const { file, status, result, error, previewUrl } = item;
  const [showConverted, setShowConverted] = useState(false);

  const savings =
    result
      ? (result.originalSize > 0
        ? Math.round(((result.originalSize - result.webpSize) / result.originalSize) * 100)
        : 0)
      : null;

  const handleDownload = () => {
    if (result?.blob) {
      downloadBlob(result.blob, getWebPFilename(file.name));
    }
  };

  const convertedObjectUrl = useMemo(
    () => (result?.blob ? URL.createObjectURL(result.blob) : null),
    [result]
  );

  useEffect(() => {
    return () => {
      if (convertedObjectUrl) URL.revokeObjectURL(convertedObjectUrl);
    };
  }, [convertedObjectUrl]);

  return (
    <div className={`image-card ${status}`}>
      <div className="card-preview">
        {(showConverted && convertedObjectUrl) ? (
          <img src={convertedObjectUrl} alt="converted" />
        ) : (
          previewUrl && <img src={previewUrl} alt={file.name} />
        )}

        {result && (
          <button
            className="preview-toggle"
            onClick={() => setShowConverted((v) => !v)}
            title={showConverted ? 'Show original' : 'Show converted'}
          >
            {showConverted ? 'Original' : 'WebP'}
          </button>
        )}

        <button
          className="remove-btn"
          onClick={onRemove}
          title="Remove"
          aria-label="Remove image"
        >
          ×
        </button>
      </div>

      <div className="card-info">
        <div className="card-filename" title={file.name}>
          {STATUS_ICON[status]}
          <span>{file.name}</span>
        </div>

        {status === 'converting' && (
          <div className="card-status converting">Converting…</div>
        )}

        {status === 'error' && (
          <div className="card-status error">{error}</div>
        )}

        {status === 'done' && result && (
          <div className="card-stats">
            <div className="stat">
              <span className="stat-label">Original</span>
              <span className="stat-value">{formatBytes(result.originalSize)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">WebP</span>
              <span className="stat-value">{formatBytes(result.webpSize)}</span>
            </div>
            <div className={`stat saving ${savings >= 0 ? 'positive' : 'negative'}`}>
              <span className="stat-label">Saved</span>
              <span className="stat-value">
                {savings >= 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Size</span>
              <span className="stat-value">{result.width}×{result.height}</span>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <button className="download-btn" onClick={handleDownload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon-sm">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download WebP
          </button>
        )}

        {status === 'idle' && (
          <div className="card-status idle">Ready to convert</div>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback, useEffect, useRef } from 'react';
import DropZone from './components/DropZone';
import OptionsPanel from './components/OptionsPanel';
import ImageCard from './components/ImageCard';
import { convertToWebP, getWebPFilename, downloadBlob } from './utils/converter';
import './App.css';

const DEFAULT_OPTIONS = {
  quality: 85,
  lossless: false,
  width: null,
  height: null,
  keepAspectRatio: true,
};

let idCounter = 0;

function createItem(file) {
  idCounter += 1;
  return {
    id: idCounter,
    file,
    status: 'idle',
    result: null,
    error: null,
    previewUrl: URL.createObjectURL(file),
  };
}

export default function App() {
  const [items, setItems] = useState([]);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [converting, setConverting] = useState(false);
  // Keep a ref in sync with items so the cleanup effect can access the latest
  // list of preview URLs without needing items in its dependency array.
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  useEffect(() => {
    // Revoke all object URLs when the component unmounts to avoid memory leaks.
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const handleFiles = useCallback((files) => {
    setItems((prev) => [...prev, ...files.map(createItem)]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems((prev) => {
      prev.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      return [];
    });
  }, []);

  const convertAll = useCallback(async () => {
    const toConvert = items.filter((i) => i.status !== 'converting');
    if (toConvert.length === 0) return;

    setConverting(true);

    setItems((prev) =>
      prev.map((item) => ({ ...item, status: 'converting', result: null, error: null }))
    );

    for (const item of toConvert) {
      try {
        const result = await convertToWebP(item.file, {
          quality: options.quality / 100,
          lossless: options.lossless,
          width: options.width,
          height: options.height,
          keepAspectRatio: options.keepAspectRatio,
        });
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'done', result } : i
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', error: err.message }
              : i
          )
        );
      }
    }

    setConverting(false);
  }, [items, options]);

  const downloadAll = useCallback(() => {
    const done = items.filter((i) => i.status === 'done' && i.result?.blob);
    done.forEach((item) => {
      downloadBlob(item.result.blob, getWebPFilename(item.file.name));
    });
  }, [items]);

  const doneCount = items.filter((i) => i.status === 'done').length;
  const hasItems = items.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg viewBox="0 0 40 40" fill="none" className="logo-icon">
              <rect width="40" height="40" rx="10" fill="url(#grad)" />
              <path d="M8 28L14 16l6 8 4-5 8 9H8z" fill="white" opacity="0.9" />
              <circle cx="26" cy="14" r="3" fill="white" opacity="0.9" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">img2webp</span>
          </div>
          <p className="header-subtitle">
            Convert images to WebP format — fast, free, and private (all processing happens in your browser)
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="workspace">
          <div className="left-panel">
            <DropZone onFiles={handleFiles} />

            {hasItems && (
              <div className="action-bar">
                <button
                  className="btn btn-primary"
                  onClick={convertAll}
                  disabled={converting}
                >
                  {converting ? (
                    <>
                      <svg className="spin icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Converting…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon-sm">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                      Convert {items.length} image{items.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>

                {doneCount > 1 && (
                  <button className="btn btn-secondary" onClick={downloadAll}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon-sm">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download All ({doneCount})
                  </button>
                )}

                <button className="btn btn-ghost" onClick={clearAll}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon-sm">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Clear All
                </button>
              </div>
            )}

            <OptionsPanel options={options} onChange={setOptions} />
          </div>

          <div className="right-panel">
            {!hasItems ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="empty-icon">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p>Your images will appear here</p>
                <p className="empty-hint">Upload images using the drop zone on the left</p>
              </div>
            ) : (
              <div className="image-grid">
                {items.map((item) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          All conversion happens locally in your browser — your images never leave your device.
        </p>
      </footer>
    </div>
  );
}

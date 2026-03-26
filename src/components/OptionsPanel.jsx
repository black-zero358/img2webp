import { useLang } from '../LangContext.jsx';

export default function OptionsPanel({ options, onChange }) {
  const { quality, lossless, width, height, keepAspectRatio } = options;
  const { t } = useLang();

  const set = (key, val) => onChange({ ...options, [key]: val });

  return (
    <div className="options-panel">
      <h2 className="options-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        {t('optionsTitle')}
      </h2>

      {/* Quality */}
      <div className="option-group">
        <label className="option-label">
          <span>{t('quality')}</span>
          <span className="option-value">{lossless ? t('lossless') : `${quality}%`}</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={quality}
          disabled={lossless}
          onChange={(e) => set('quality', Number(e.target.value))}
          className="range-slider"
        />
        <div className="range-labels">
          <span>{t('low')}</span>
          <span>{t('high')}</span>
        </div>
      </div>

      {/* Lossless */}
      <div className="option-group">
        <label className="toggle-label">
          <span className="option-label-text">{t('losslessMode')}</span>
          <div className="toggle-description">{t('losslessDesc')}</div>
          <div
            className={`toggle ${lossless ? 'active' : ''}`}
            onClick={() => set('lossless', !lossless)}
            role="switch"
            aria-checked={lossless}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && set('lossless', !lossless)}
          >
            <div className="toggle-thumb" />
          </div>
        </label>
      </div>

      {/* Resize */}
      <div className="option-group">
        <div className="option-label-text">{t('resize')}</div>
        <div className="resize-inputs">
          <div className="resize-field">
            <label htmlFor="resize-w">{t('widthPx')}</label>
            <input
              id="resize-w"
              type="number"
              min={1}
              max={16384}
              placeholder={t('autoPlaceholder')}
              value={width ?? ''}
              onChange={(e) =>
                set('width', e.target.value ? Number(e.target.value) : null)
              }
              className="num-input"
            />
          </div>
          <div className="resize-separator">×</div>
          <div className="resize-field">
            <label htmlFor="resize-h">{t('heightPx')}</label>
            <input
              id="resize-h"
              type="number"
              min={1}
              max={16384}
              placeholder={t('autoPlaceholder')}
              value={height ?? ''}
              onChange={(e) =>
                set('height', e.target.value ? Number(e.target.value) : null)
              }
              className="num-input"
            />
          </div>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={keepAspectRatio}
            onChange={(e) => set('keepAspectRatio', e.target.checked)}
          />
          <span>{t('maintainAspect')}</span>
        </label>
      </div>
    </div>
  );
}

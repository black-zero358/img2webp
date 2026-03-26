export const translations = {
  en: {
    // Header
    headerSubtitle:
      'Convert images to WebP format — fast, free, and private (all processing happens in your browser)',

    // Action bar
    converting: 'Converting…',
    convertBtn: (n) => `Convert ${n} image${n !== 1 ? 's' : ''}`,
    downloadAll: (n) => `Download All (${n})`,
    clearAll: 'Clear All',

    // Empty state
    emptyTitle: 'Your images will appear here',
    emptyHint: 'Upload images using the drop zone on the left',

    // Footer
    footerNote:
      'All conversion happens locally in your browser — your images never leave your device.',

    // Language toggle
    langToggle: '中文',

    // DropZone
    dropTitle: 'Drag & drop images here',
    dropSubtitle: 'or click to browse files',
    dropFormats: 'Supports: JPG, PNG, GIF, BMP, SVG, TIFF, AVIF, WebP, ICO',
    dropAriaLabel: 'Upload images',

    // OptionsPanel
    optionsTitle: 'Conversion Options',
    quality: 'Quality',
    lossless: 'Lossless',
    losslessMode: 'Lossless Mode',
    losslessDesc: 'Preserve all image data (larger file)',
    resize: 'Resize',
    widthPx: 'Width (px)',
    heightPx: 'Height (px)',
    autoPlaceholder: 'auto',
    maintainAspect: 'Maintain aspect ratio',
    low: 'Low',
    high: 'High',

    // ImageCard
    showOriginal: 'Show original',
    showConverted: 'Show converted',
    original: 'Original',
    webp: 'WebP',
    convertingStatus: 'Converting…',
    readyToConvert: 'Ready to convert',
    downloadWebp: 'Download WebP',
    remove: 'Remove',
    removeAriaLabel: 'Remove image',
    saved: 'Saved',
    size: 'Size',
  },

  zh: {
    // Header
    headerSubtitle:
      '将图片转换为 WebP 格式——快速、免费、私密（所有处理均在浏览器中完成）',

    // Action bar
    converting: '转换中…',
    convertBtn: (n) => `转换 ${n} 张图片`,
    downloadAll: (n) => `全部下载 (${n})`,
    clearAll: '清空',

    // Empty state
    emptyTitle: '图片将显示在此处',
    emptyHint: '使用左侧上传区域添加图片',

    // Footer
    footerNote: '所有转换均在浏览器本地完成——您的图片不会离开设备。',

    // Language toggle
    langToggle: 'English',

    // DropZone
    dropTitle: '将图片拖放至此',
    dropSubtitle: '或点击选择文件',
    dropFormats: '支持：JPG、PNG、GIF、BMP、SVG、TIFF、AVIF、WebP、ICO',
    dropAriaLabel: '上传图片',

    // OptionsPanel
    optionsTitle: '转换选项',
    quality: '质量',
    lossless: '无损',
    losslessMode: '无损模式',
    losslessDesc: '保留所有图像数据（文件较大）',
    resize: '调整大小',
    widthPx: '宽度 (px)',
    heightPx: '高度 (px)',
    autoPlaceholder: '自动',
    maintainAspect: '保持宽高比',
    low: '低',
    high: '高',

    // ImageCard
    showOriginal: '显示原图',
    showConverted: '显示转换后',
    original: '原始',
    webp: 'WebP',
    convertingStatus: '转换中…',
    readyToConvert: '等待转换',
    downloadWebp: '下载 WebP',
    remove: '删除',
    removeAriaLabel: '删除图片',
    saved: '节省',
    size: '尺寸',
  },
};

export function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'zh') return saved;
  const browserLang = navigator.language || '';
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

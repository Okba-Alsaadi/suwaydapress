interface Props {
  title: string;
  locale: string;
  variant?: 'white' | 'grey';
  className?: string;
}

// ------------------ FONT SIZE CONFIGURATION (edit these) ------------------
const TITLE_SIZES = {
  // White variant (grey title with maroon triangle)
  white: {
    en: 'text-xs',   // English, white background
    ar: 'text-body',   // Arabic, white background
  },
  // Grey variant (white title on grey background)
  grey: {
    en: 'text-xs',   // English, grey background
    ar: 'text-body',   // Arabic, grey background (or change to 'text-sm' if needed)
  },
} as const;
// ------------------------------------------------------------------------

export default function SectionTitleBar({ title, locale, variant = 'white', className = '' }: Props) {
  const isRTL = locale === 'ar';
  const primaryColor = '#550000';
  const isEnglish = locale === 'en';

  // Get the right font size based on variant and language
  const langKey = isEnglish ? 'en' : 'ar';
  const sizeClass = TITLE_SIZES[variant][langKey];

  if (variant === 'grey') {
    // Centred white title on grey background
    return (
      <div className={`flex justify-center ${className}`}>
        <div className={`bg-white text-primary font-bold ${sizeClass} px-3 py-1 rounded-sm border border-transparent w-30 h-10 flex items-center justify-center box-border leading-none font-ui`}>
          {title}
        </div>
      </div>
    );
  }

  // variant === 'white' – left‑aligned grey title with maroon triangle
  const triangleStyle = isRTL
    ? { borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `8px solid ${primaryColor}` }
    : { borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${primaryColor}` };

  return (
    <div className={className}>
      <div
        className="inline-flex items-stretch border border-gray-300 rounded-sm overflow-hidden w-30 h-10"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="w-6 h-full bg-gray-200 flex items-center justify-center shrink-0">
          <div style={{ width: 0, height: 0, ...triangleStyle }} />
        </div>
        <div className={`bg-gray-200 text-primary font-bold ${sizeClass} truncate flex items-center flex-1 h-full leading-none font-ui`}>
          {title}
        </div>
      </div>
    </div>
  );
}
export interface RuledPaperConfig {
  isRuled: boolean;
  paperBg: string;
  lineColor: string;
  marginColor: string;
  textColor: string;
  lineHeight: number;
  baselinePos: number;
}

export const RULED_BACKGROUND_IDS = [
  'lined_paper',
  'dark_lined_paper',
  'text_classic_lined_margin',
  'text_soft_blue_lines',
  'text_vintage_manuscript',
  'text_legal_pad_yellow',
  'text_night_ruled_glow',
  'text_wide_ruled_notebook',
  'text_cornell_study',
  'text_poetry_journal',
];

export function getRuledPaperConfig(bgId: string): RuledPaperConfig | null {
  const configs: Record<string, Partial<RuledPaperConfig>> = {
    lined_paper: {
      paperBg: '#ffffff',
      lineColor: '#93c5fd', // أزرق دفاتر مدرسية ناعم
      marginColor: '#f87171',
      textColor: '#0f172a',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_classic_lined_margin: {
      paperBg: '#ffffff',
      lineColor: '#93c5fd',
      marginColor: '#f87171',
      textColor: '#0f172a',
      lineHeight: 38,
      baselinePos: 27,
    },
    dark_lined_paper: {
      paperBg: '#0b1120',
      lineColor: 'rgba(56, 189, 248, 0.28)',
      marginColor: 'rgba(244, 63, 94, 0.5)',
      textColor: '#f1f5f9',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_soft_blue_lines: {
      paperBg: '#f8fafc',
      lineColor: 'rgba(37, 99, 235, 0.25)',
      marginColor: '#f87171',
      textColor: '#0f172a',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_vintage_manuscript: {
      paperBg: '#f7efe1',
      lineColor: 'rgba(180, 83, 9, 0.25)',
      marginColor: 'rgba(180, 83, 9, 0.4)',
      textColor: '#332211',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_legal_pad_yellow: {
      paperBg: '#fefce8',
      lineColor: 'rgba(202, 138, 4, 0.3)',
      marginColor: '#f87171',
      textColor: '#1c1917',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_night_ruled_glow: {
      paperBg: '#090d1a',
      lineColor: 'rgba(34, 211, 238, 0.28)',
      marginColor: 'rgba(236, 72, 153, 0.5)',
      textColor: '#cffafe',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_wide_ruled_notebook: {
      paperBg: '#fafafa',
      lineColor: 'rgba(100, 116, 139, 0.25)',
      marginColor: '#f87171',
      textColor: '#0f172a',
      lineHeight: 40,
      baselinePos: 29,
    },
    text_cornell_study: {
      paperBg: '#fbfbfb',
      lineColor: 'rgba(139, 92, 246, 0.26)',
      marginColor: '#a855f7',
      textColor: '#1e1b4b',
      lineHeight: 38,
      baselinePos: 27,
    },
    text_poetry_journal: {
      paperBg: '#faf6ee',
      lineColor: 'rgba(120, 53, 15, 0.25)',
      marginColor: 'rgba(180, 83, 9, 0.4)',
      textColor: '#2c1d11',
      lineHeight: 38,
      baselinePos: 27,
    },
  };

  const conf = configs[bgId];
  if (!conf) return null;

  return {
    isRuled: true,
    paperBg: conf.paperBg || '#ffffff',
    lineColor: conf.lineColor || '#93c5fd',
    marginColor: conf.marginColor || '#f87171',
    textColor: conf.textColor || '#0f172a',
    lineHeight: conf.lineHeight || 38,
    baselinePos: conf.baselinePos || 27,
  };
}

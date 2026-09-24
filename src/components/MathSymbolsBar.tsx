import React from 'react';

interface MathSymbolsBarProps {
  onInsertSymbol: (symbol: string) => void;
}

const MATH_SYMBOLS = [
  { label: 'π', val: 'π', name: 'باي' },
  { label: '√', val: '√()', name: 'جذر' },
  { label: 'x²', val: '²', name: 'تربيع' },
  { label: 'x³', val: '³', name: 'تكعيب' },
  { label: '∫', val: '∫ ', name: 'تكامل' },
  { label: 'Σ', val: 'Σ', name: 'مجموع' },
  { label: '∞', val: '∞', name: 'ما لا نهاية' },
  { label: 'α', val: 'α', name: 'ألفا' },
  { label: 'β', val: 'β', name: 'بيتا' },
  { label: 'θ', val: 'θ', name: 'ثيتا' },
  { label: 'Δ', val: 'Δ', name: 'دلتا' },
  { label: '±', val: '±', name: 'موجب/سالب' },
  { label: '×', val: '×', name: 'ضرب' },
  { label: '÷', val: '÷', name: 'قسمة' },
  { label: '≠', val: '≠', name: 'لا يساوي' },
  { label: '≤', val: '≤', name: 'أصغر من أو يساوي' },
  { label: '≥', val: '≥', name: 'أكبر من أو يساوي' },
  { label: '→', val: '→', name: 'سهم' },
  { label: '½', val: '½', name: 'نصف' },
  { label: '°', val: '°', name: 'درجة' },
  { label: 'f(x)', val: 'f(x) = ', name: 'دالة' },
  { label: 'lim', val: 'lim_(x→0) ', name: 'نهاية' },
];

export const MathSymbolsBar: React.FC<MathSymbolsBarProps> = ({ onInsertSymbol }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-2 bg-slate-900/60 backdrop-blur border-y border-slate-800 scrollbar-none text-xs">
      <span className="text-[10px] font-bold text-amber-400/80 px-1 whitespace-nowrap flex-shrink-0 dir-rtl">
        رموز علمية:
      </span>
      {MATH_SYMBOLS.map((sym) => (
        <button
          key={sym.label}
          type="button"
          onClick={() => onInsertSymbol(sym.val)}
          title={sym.name}
          className="flex-shrink-0 min-w-[30px] h-7 px-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 border border-slate-700 font-mono text-xs font-semibold flex items-center justify-center transition active:scale-90"
        >
          {sym.label}
        </button>
      ))}
    </div>
  );
};

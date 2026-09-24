import { Note } from '../types/note';

const NOTES_STORAGE_KEY = 'nahwa_aldarb_notes_v2';
const THEME_STORAGE_KEY = 'nahwa_aldarb_theme_v1';

export const INITIAL_NOTES: Note[] = [
  {
    id: 'welcome_note_1',
    title: 'مرحباً بك في تطبيق "درب" 🌿',
    content: `مرحباً بك في مساحتك الخاصة لتدوين الملاحظات والأفكار والخواطر!

✨ **أبرز ما يميز تطبيق درب:**
• ⚡ **حفظ تلقائي وفوري**: كل كلمة تكتبها تُحفظ فوراً في ذاكرة جهازك.
• 📶 **يعمل بالكامل بلا إنترنت**: دوّن في أي وقت وفي أي مكان.
• 🎨 **أكثر من ٧٠ خلفية هادئة ومتنوعة**: اختر الخلفية التي تناسب مزاجك من زر (الخلفيات).
• 📊 **إضافة جداول**: تنظيم بياناتك وجداول المقارنة بمرونة.
• 🌿 **شبكة تفرعية**: خريطة أفكار شجرية لتنظيم الأهداف والمشاريع.
• 📋 **قوائم مهام وتذكيرات**: أضف مهامك اليومية وتتبّع إنجازها.
• 🌙 **وضع داكن وفاتح**: مريح للعين في النهار والليل.

ابدأ بكتابة فكرتك واستمتع بالهدوء وسرعة التدوين! 🌸`,
    checklists: [
      { id: 'chk_1', text: 'تجربة زر (الخلفيات) واختيار خلفيتك المفضلة', completed: true },
      { id: 'chk_2', text: 'تجربة إضافة جدول أو شبكة تفرعية', completed: false },
      { id: 'chk_3', text: 'تجربة الوضع الداكن والفاتح بالأعلى', completed: true },
    ],
    tables: [
      {
        id: 'sample_tbl_1',
        title: 'جدول الأولويات الأسبوعية',
        headers: ['المهمة', 'الهدف', 'الحالة'],
        rows: [
          { id: 'r1', cells: ['قراءة كتاب', 'تطوير الذات', 'مستمر'] },
          { id: 'r2', cells: ['ممارسة رياضة', 'الصحة البدنية', 'منجز'] },
        ],
      },
    ],
    branchRoots: [
      {
        id: 'sample_branch_1',
        text: 'خطة النجاح وتطوير الذات',
        children: [
          {
            id: 'sb_1',
            text: 'العادات الصباحية (قراءة وهدوء)',
            children: [],
          },
          {
            id: 'sb_2',
            text: 'إنجاز المهام اليومية بتركيز',
            children: [],
          },
        ],
      },
    ],
    backgroundId: 'forest_mist',
    fontFamily: 'Cairo',
    subject: 'عام',
    tags: ['ترحيب', 'أفكار'],
    stickers: ['stk_coffee', 'stk_gym'],
    pinned: true,
    favorite: true,
    archived: false,
    inTrash: false,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: 'daily_goals_demo',
    title: 'خطة اليوم وتطوير الذات ☕',
    content: `أهداف يومية بسيطة لتحقيق التوازن والإنتاجية:

1. شرب كوب ماء وبدء اليوم بامتنان وهدوء.
2. التركيز على الأولويات الثلاث الأكثر أهمية.
3. قراءة ٢٠ دقيقة في كتاب ملهم ومفيد.
4. ممارسة رياضة المشي الخفيف واستنشاق الهواء النقي.

"الخطوات الصغيرة اليومية تقودك نحو الدرب الصحيح." ✨`,
    checklists: [
      { id: 'chk_d1', text: 'شرب ٢ لتر ماء خلال اليوم', completed: true },
      { id: 'chk_d2', text: 'قراءة الورد اليومي', completed: true },
      { id: 'chk_d3', text: 'ترتيب مكتب العمل والملاحظات', completed: false },
    ],
    backgroundId: 'cozy_coffee',
    fontFamily: 'Tajawal',
    subject: 'تطوير الذات',
    tags: ['يوميات', 'أهداف'],
    pinned: false,
    favorite: true,
    archived: false,
    inTrash: false,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
  },
];

export function getSavedNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_NOTES;
  } catch (err) {
    console.error('Error loading notes from localStorage:', err);
    return INITIAL_NOTES;
  }
}

export function saveNotesToStorage(notes: Note[]): boolean {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (err) {
    console.error('Error saving notes to localStorage:', err);
    return false;
  }
}

export function getSavedTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveThemeToStorage(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

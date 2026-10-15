import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

// Support high payload size for high-res phone camera shots
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Google Gen AI
const ai = new GoogleGenAI();

// POST /api/scan-board: AI Vision OCR & Blackboard Extractor
app.post('/api/scan-board', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', subjectHint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'يرجى تقديم صورة للوح أو الورقة للتحليل',
      });
    }

    // Robust extraction of pure base64 data and mime type
    let effectiveMime = mimeType || 'image/jpeg';
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+_-]+);base64,/);
    if (mimeMatch) {
      effectiveMime = mimeMatch[1];
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(effectiveMime)) {
      effectiveMime = 'image/jpeg';
    }

    let base64Data = imageBase64;
    if (base64Data.includes('base64,')) {
      base64Data = base64Data.split('base64,')[1];
    }
    base64Data = base64Data.replace(/[\r\n\s]/g, '');

    const prompt = `أنت خبير في التدوين الذكي وتلخيص المعرفة (Ultra-Smart Note Organizer & Extractor).
مهمتك: قراءة كل حرف وكلمة ورقم وشكل في الصورة، ثم إعادة صياغتها وتنظيمها بشكل مبسط جداً ومرتب يسهل فهمه وحفظه.

إرشادات التنظيم الصارم:
1. حول كل نصوص الصورة إلى ملاحظة منظمة:
   - ابدأ بـ 📌 عنوان معبر عن الموضوع.
   - استخدم نقاطاً (•) للعناصر الأساسية.
   - استخدم ترقيماً (١، ٢، ٣) للخطوات أو المسائل.
   - إذا كانت هناك جداول، صممها كنص منظم أو قائمة واضحة.
   - المعادلات والرموز الرياضية يجب أن تظهر بشكلها الصحيح.
2. التبسيط: اشرح بأسلوب سهل، واستخدم عبارات قصيرة ومباشرة.
3. الأمانة: لا تخترع معلومات من خارج الصورة، ركز فقط على ما هو موجود أمامك.

أخرج النتيجة ككائن JSON صالح فقط بالشكل التالي:
{
  "title": "عنوان موجز معبر",
  "subject": "المادة الدراسية",
  "suggestedBackgroundId": "notebook_paper",
  "content": "محتوى الملاحظة المفرغ والمنظم والمبسط (استخدم علامات markdown للترتيب)",
  "summary": "ملخص في سطر واحد لما تم استخراجه",
  "tags": ["وسم1", "وسم2"]
}`;

    // Fast Multi-Model Race: Race the most reliable latest models simultaneously
    let responseText = '';
    const modelsToTry = [
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
    ];
    let lastError: any = null;

    outerLoop: for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const racePromises = modelsToTry.map(async (modelName) => {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Model ${modelName} timed out`)), 9000)
          );

          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: effectiveMime,
                      data: base64Data,
                    },
                  },
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            config: {
              responseMimeType: 'application/json',
            },
          });

          const response: any = await Promise.race([generatePromise, timeoutPromise]);
          const text = response.text?.trim() || '';
          if (!text) {
            throw new Error(`Empty response from ${modelName}`);
          }
          return { model: modelName, text };
        });

        const winner = await Promise.any(racePromises);
        responseText = winner.text;
        console.log(`Scan successful with model: ${winner.model} (attempt ${attempt})`);
        break outerLoop;
      } catch (err: any) {
        lastError = err;
        console.warn(`Parallel attempt ${attempt} failed, retrying...`);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    if (!responseText) {
      throw lastError || new Error('فشل استخراج البيانات من الصورة بالذكاء الاصطناعي');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('لم نتمكن من قراءة استجابة الذكاء الاصطناعي بشكل سليم');
      }
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error scanning whiteboard/paper:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ أثناء تحليل الصورة بالذكاء الاصطناعي',
    });
  }
});

// POST /api/ai-assist: AI Explainer, Quiz Generator, and Note Enhancer
app.post('/api/ai-assist', async (req, res) => {
  try {
    const { action, content, noteTitle, subject } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'محتوى الملاحظة مطلوب' });
    }

    let systemPrompt = '';
    if (action === 'explain') {
      systemPrompt = `أنت معلم وأستاذ متميز وشغوف بأسلوب مبسط ومشجع.
اشرح المحتوى التالي المأخوذ من ملاحظة/سبورة دراسية (${subject || 'عام'}) بأسلوب سلس ومبسط جداً للطلاب، واذكر أهم المفاهيم والنصائح للاستيعاب الذكي.
المحتوى:
${content}`;
    } else if (action === 'quiz') {
      systemPrompt = `أنت خبير إعداد الامتحانات والاختبارات التفاعلية.
بناءً على الملاحظة التالية (${noteTitle || 'ملاحظة دراسية'} - ${subject || 'عام'}):
أنشئ 3 أسئلة مراجعة واختبار ذاتي للطلاب مع الإجابات النموذجية والشرح البسيط لكل إجابة.
المحتوى:
${content}`;
    } else if (action === 'translate') {
      systemPrompt = `أنت مترجم أكاديمي محترف ودقيق.
ترجم النص التالي بدقة مع الحفاظ على التنسيق والرموز والمصطلحات العلمية (إذا كان بالعربي ترجمه للإنجليزي والعكس، أو قدم النسخة المترجمة المزدوجة):
المحتوى:
${content}`;
    } else {
      systemPrompt = `أصلح ونسق وأضف إضاءات وإيضاحات هامة للملاحظة التالية:
${content}`;
    }

    const models = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let resultText = '';

    for (const m of models) {
      try {
        const response: any = await ai.models.generateContent({
          model: m,
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        });
        resultText = response.text?.trim() || '';
        if (resultText) break;
      } catch (err) {
        console.warn(`AI assist attempt with ${m} failed`, err);
      }
    }

    if (!resultText) {
      throw new Error('تعذر معالجة الطلب بالذكاء الاصطناعي حالياً');
    }

    return res.json({
      success: true,
      result: resultText,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ أثناء معالجة الطلب بالذكاء الاصطناعي',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[درب] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();

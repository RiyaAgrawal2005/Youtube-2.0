

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface TranslateRequestBody {
  text: string;
  targetLang: string;

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, targetLang} = req.body as TranslateRequestBody;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing text or targetLang in request body' });
  }

  try {
    // Try LibreTranslate first
   
    const response = await axios.post(
      'https://libretranslate.de/translate',
      {
        q: text,
        source: 'auto',
        target: targetLang,
        format: 'text',
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const translatedText = response.data.translatedText || response.data.translated_text;

    if (translatedText && translatedText.trim().toLowerCase() !== text.trim().toLowerCase()) {
      return res.status(200).json({ translatedText });
    }

    // If no meaningful translation, try MyMemory fallback
    const fallbackResponse = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        // langpair: `${srcLang}|${targetLang}`,
        langpair: `en|${targetLang}`,  // assuming source is English

        // langpair: `auto|${targetLang}`,
      },
    });

    const fallbackTranslation = fallbackResponse.data.responseData.translatedText || '';

    if (fallbackTranslation) {
      return res.status(200).json({ translatedText: fallbackTranslation });
    }

    return res.status(200).json({
      translatedText: '⚠️ Translation might not have changed or input is already in target language.',
    });
  } catch (error: any) {
    console.error('Translation API error:', error.response?.data || error.message || error);
    return res.status(500).json({ error: 'Translation failed' });
  }
}

















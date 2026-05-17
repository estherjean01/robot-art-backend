module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, theme, style, input } = req.body;
  if (!type || !theme || !style || !input) {
    return res.status(400).json({ error: '缺少必要參數' });
  }

  const THEME_PROMPTS = {
    cyber: '賽博龐克風格，充滿科技感與未來感，語言冷靜、富含隱喻，涉及霓虹城市、機器意識、數位靈魂等意象',
    dream: '夢幻詩意風格，語言柔美，充滿自然意象——花瓣、水波、月光、薄霧，帶有日系物哀之美',
    classic: '古典神秘風格，語言莊重典雅，帶有中西古典詩歌意境，可融合古希臘神話、唐詩宋詞意象',
  };

  const THEME_TONE = {
    cyber: '冷靜、精準、充滿未來感',
    dream: '溫柔、細膩、充滿感性',
    classic: '莊重、富有詩意、古典雅致',
  };

  let prompt = '';
  if (type === 'poem') {
    prompt = `你是一位專精於${THEME_PROMPTS[theme]}的詩人。語氣${THEME_TONE[theme]}。請根據使用者輸入的主題，創作一首${style}。詩要有意境、有層次，長度適中（約8-16行）。直接輸出詩的內容，不要加任何說明或標題前綴。\n\n主題：${input}\n風格：${style}`;
  } else {
    prompt = `你是一位將中文意象轉譯為英文圖像生成提示詞的專家。輸出只能是英文關鍵詞，不超過25個單詞，適合圖像生成使用。不要有任何中文或解釋。\n\n將以下中文意象轉為圖像提示詞：「${input}」，風格：${style}`;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || '生成失敗' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ result: text });

  } catch (err) {
    return res.status(500).json({ error: err.message || '生成失敗' });
  }
};

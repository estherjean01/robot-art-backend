# 與機器人對話 — 後端 API

Vercel serverless 後端，使用 Google Gemini API 生成詩與圖像關鍵字。

## 部署步驟

1. 將此資料夾上傳到 GitHub（新 repo）
2. 到 [vercel.com](https://vercel.com) 匯入此 repo
3. 在 Vercel 專案設定 → **Environment Variables** 新增：
   - Key：`GEMINI_API_KEY`
   - Value：你的 Google Gemini API Key
4. 部署完成後複製你的 Vercel 網址（例如 `https://robot-art-backend.vercel.app`）
5. 貼到前端 `index.html` 的 `BACKEND_URL` 變數

## 取得 Gemini API Key

前往 [aistudio.google.com](https://aistudio.google.com) → Get API Key → 免費建立

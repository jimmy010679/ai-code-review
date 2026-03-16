# AI Code Review - 靜態網站部署

![PROD deployment](https://github.com/jimmy010679/ai-code-review/actions/workflows/production.yaml/badge.svg)
![Gemini AI Code Review](https://github.com/jimmy010679/ai-code-review/actions/workflows/ai-review.yml/badge.svg)

本專案是一個基於 Nginx 的靜態網站，透過 Docker 進行容器化，自動部署至 Google Cloud Run，並整合了 Gemini AI 進行自動化的 Code Review。

## 🚀 正式環境網址

您可以造訪以下網址查看最新部署版本：
**[https://ai-code-review-run-628326101026.asia-east1.run.app](https://ai-code-review-run-628326101026.asia-east1.run.app)**

---

## ✨ 核心功能：AI 自動化 Code Review

本專案整合了 **Google Gemini Pro API**，每當開發者開啟 Pull Request (PR) 或更新內容時，系統會自動進行代碼審查：

1. **觸發機制**：當 PR 被建立 (opened) 或更新 (synchronize) 時觸發。
2. **差異分析**：GitHub Action 會擷取 PR 的 `git diff` 內容。
3. **AI 審核**：將代碼變動發送至 Gemini API，由 AI 擔任資深前端 Leader 進行審查。
4. **自動回覆**：AI 的建議會透過 `gh` CLI 自動留言在 PR 下方，提供開發者改進建議。

### 相關設定
若要啟用此功能，需在 GitHub Repository 中設定：
- **Secrets**: `GEMINI_API_KEY` (從 Google AI Studio 取得)。
- **Variables**: `GEMINI_CODE_REVIEWER_MODEL` (例如 `gemini-1.5-flash`)。

---

## 🛠 CI/CD 流程

本專案使用 **GitHub Actions** 實現自動化：

- **Production Deployment**:
  1. **Docker Build**: 建置 Nginx 映像檔。
  2. **Artifact Registry (GAR)**: 推送映像檔。
  3. **Cloud Run**: 自動更新正式環境服務。

---

## 💻 本地開發 (Local Development)

### 1. 建置本地映像檔
```bash
docker build -t ai-code-review .
```

### 2. 啟動容器
```bash
docker run -d -p 8080:80 --name ai-code-review-container ai-code-review
```

### 3. 查看網頁
打開瀏覽器造訪：[http://localhost:8080](http://localhost:8080)

---

## 專案結構

- `src/`: 存放靜態網頁原始碼。
- `scripts/gemini-reviewer.js`: AI Code Review 的核心執行腳本。
- `.github/workflows/`:
  - `production.yaml`: 正式環境自動化部署流程。
  - `ai-review.yml`: PR 自動化 AI 審查流程。
- `Dockerfile`: Docker 映像檔建置設定。

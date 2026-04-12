# 結合 Gemini API 自動化PR審查 與 GCP Cloud Run 自動化部署

![PROD deployment](https://github.com/jimmy010679/ai-code-review/actions/workflows/production.yaml/badge.svg)
![Gemini AI Code Review](https://github.com/jimmy010679/ai-code-review/actions/workflows/ai-review.yml/badge.svg)

本專案是一個基於 **Next.js (Standalone 模式)** 的應用程式，透過 Docker 進行容器化，自動部署至 Google Cloud Run，並整合了 Gemini AI 進行自動化的 Issue Auto-Fix + Code Review。

## 🚀 正式環境網址

您可以造訪以下網址查看最新部署版本：
**[https://ai-code-review-cloud-run-628326101026.asia-east1.run.app/](https://ai-code-review-cloud-run-628326101026.asia-east1.run.app/)**

---

## ✨ AI 驅動開發流程

### 1. 🛠️ AI Issue 自動修復 (Issue Auto-Fix)
透過 GitHub Issues 觸發的 **Self-healing** 機制，實現「手機貼標籤，AI 發 PR」：
- **環境感知 (Environment Aware)**：自動解析 Issue 目標修改分支，動態切換代碼基線。
- **品質防線 (Quality Gates)**：AI 生成修復代碼後，強制通過 `yarn lint` 與 `yarn build` 驗證，確保 PR 具備可合併性。
- **物理護欄 (Physical Guardrails)**：透過 Git 物理還原技術，強制保護 `.github/` 與 `scripts/` 目錄，防止 AI 竄改維運配置。

### 2. 🔍 AI 自動化 Code Review
每當開發者開啟 Pull Request (PR) 或更新內容時，系統會自動進行深度審查：
- **資深 Leader 視角**：擷取 `git diff` 內容並發送至 Gemini API，由 AI 擔任資深前端主管提供改進建議。
- **自動化留言**：審查結果會直接留言於 PR 下方，大幅縮短人工 Review 時間。

### 相關設定
請在 GitHub Repository 中設定：

| 類型 | GitHub 變數名稱 | 來源 / 範例值 | 說明 |
| :--- | :--- | :--- | :--- |
| **Secrets** | `GEMINI_API_KEY` | Google AI Studio | 用於調用 Gemini API 的授權密鑰 |
| **Variables** | `GEMINI_CODE_REVIEWER_MODEL` | `gemini-2.5-flash-lite` | 指定使用的 AI 模型版本 |
| **Variables** | `GEMINI_AUTO_FIX_MODEL` | `gemini-2.5-flash-lite` | 指定使用的 AI 模型版本 |

---

## 🏗 基礎設施管理 (Infrastructure as Code)

本專案的雲端基礎架構採用 **Terraform** 進行管理，相關配置於另一個 **[gcp-infra-core](https://github.com/jimmy010679/gcp-infra-core)** 專案中。這種方式確保了環境的可複製性與安全性。

### 資源與變數對照表
若需重新配置或部署，請參考以下對應關係：

| 類型 | GitHub 變數名稱 | Terraform 資源 / 屬性 | 說明 |
| :--- | :--- | :--- | :--- |
| **Variables** | `GCP_PROJECT_ID` | `var.ai_code_review_project_id` | GCP 專案 ID |
| **Variables** | `GCP_REGION` | `var.region` | 部署區域 (預設: `asia-east1`) |
| **Variables** | `GAR_REPO_NAME` | `ai-code-review-repo` | Artifact Registry 儲存庫 ID |
| **Variables** | `CLOUD_RUN_SERVICE_NAME` | `ai-code-review-cloud-run` | Cloud Run 服務名稱 |
| **Variables** | `GCP_WIF_PROVIDER` | `google_iam_workload_identity_pool_provider` | WIF Provider 的完整名稱 |
| **Variables** | `GCP_SERVICE_ACCOUNT` | `tf-github-ai-reviewer@...` | 用於部署的專屬 Service Account Email |

---

## 🛠 CI/CD 流程說明

1. **Issue-to-PR**: 
   - 監聽 Issue `labeled` 事件 -> 解析目標分支 -> AI 嘗試修復 -> **物理還原運維腳本** -> 通過 Lint/Build 驗證 -> 自動發起 PR。
2. **Code Review**: 
   - PR 開啟或更新時，觸發 `ai-review.yml` 進行程式碼差異分析與建議。
3. **Production Deployment**: 
   - 合併至 `main` 後，觸發 WIF 認證並推送 Image 至 Cloud Run。

---

## 🛡️ 安全性與架構特色

- **無密鑰架構 (Keyless)**：完全捨棄傳統 Service Account Key，採用 **Workload Identity Federation (WIF)** 實現 GitHub 與 GCP 間的短效權限交換。
- **基礎設施即代碼 (IaC)**：運用 **Terraform** 進行跨專案資源管理，將基礎建設與應用程式資源分層管控。
- **輕量化容器**：利用 Next.js Standalone 與 Docker Multi-stage Build，產出極小化映像檔並存於 **Artifact Registry**。

---

## 💻 本地開發 (Local Development)

### 1. 安裝與執行
```bash
corepack enable
yarn install
yarn dev
```

### 2. Docker 本地測試
```bash
# 建置
docker build -t ai-code-review .

# 啟動 (對應至本地 3000 埠)
docker run -d -p 3000:3000 --name ai-code-review-container ai-code-review

# 造訪 http://localhost:3000
```

---

## 專案結構

- `src/`: 存放應用程式原始碼。
- `scripts/gemini-reviewer.js`: AI Code Review 的核心執行腳本。
- `.github/workflows/`:
  - `production.yaml`: 正式環境自動化部署流程。
  - `ai-review.yml`: PR 自動化 AI 審查流程。
- `Dockerfile`: Next.js Standalone 多階段建置設定。
- `next.config.ts`: 已開啟 `output: "standalone"` 以優化 Docker 映像檔。

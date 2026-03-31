# 結合 Gemini API 自動化PR審查 與 GCP Cloud Run 自動化部署

![PROD deployment](https://github.com/jimmy010679/ai-code-review/actions/workflows/production.yaml/badge.svg)
![Gemini AI Code Review](https://github.com/jimmy010679/ai-code-review/actions/workflows/ai-review.yml/badge.svg)

本專案是一個基於 **Next.js (Standalone 模式)** 的應用程式，透過 Docker 進行容器化，自動部署至 Google Cloud Run，並整合了 Gemini AI 進行自動化的 Code Review。

## 🚀 正式環境網址

您可以造訪以下網址查看最新部署版本：
**[https://ai-code-review-cloud-run-628326101026.asia-east1.run.app/](https://ai-code-review-cloud-run-628326101026.asia-east1.run.app/)**

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
- **Variables**: `GEMINI_CODE_REVIEWER_MODEL` (例如 `gemini-2.5-flash-lite`)。

---

## 🏗 基礎設施管理 (Infrastructure as Code)

本專案的雲端基礎架構採用 **Terraform** 進行管理，相關配置於另一個 `gcp-infra-core` 專案中。這種方式確保了環境的可複製性與安全性。

### 核心資源定義
- **Artifact Registry (`google_artifact_registry_repository`)**: 存放 Docker 映像檔，並設有 `prevent_destroy` 以防止意外刪除。
- **Cloud Run (`google_cloud_run_v2_service`)**: 執行 Next.js 應用程式。配置 `ignore_changes = [template[0].containers[0].image]`，讓 Terraform 只管理基礎設施，而實際的 Image 更新則交由 GitHub Actions 處理。
- **Workload Identity Federation (WIF)**: 透過 GitHub OIDC 與 GCP 進行安全對接，捨棄傳統的 Service Account Key，提高安全性。

### 資源與變數對照表
若需重新配置或部署，請參考以下對應關係：

| GitHub 變數名稱 | Terraform 資源/屬性 | 說明 |
| :--- | :--- | :--- |
| `GCP_PROJECT_ID` | `var.project_id` | GCP 專案編號 |
| `GCP_REGION` | `var.region` | 部署區域 (預設: `asia-east1`) |
| `GAR_REPO_NAME` | `ai-code-review-repo` | Artifact Registry 儲存庫 ID |
| `CLOUD_RUN_SERVICE_NAME` | `ai-code-review-cloud-run` | Cloud Run 服務名稱 |
| `GCP_WIF_PROVIDER` | `google_iam_workload_identity_pool_provider` | WIF Provider 的完整名稱 |
| `GCP_SERVICE_ACCOUNT` | `tf-github-deployer@...` | 用於部署的 Service Account Email |

---

## 🛠 CI/CD 流程

本專案使用 **GitHub Actions** 實現自動化：

1. **基礎設施同步**: 修改 `gcp-infra-core` 後，手動或透過自動化工具執行 `terraform apply`。
2. **Production Deployment**:
   - ... (後續步驟同前)

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
- `gcp-infra-core/`: Terraform 基礎設施配置（Artifact Registry, Cloud Run, WIF）。
- `scripts/gemini-reviewer.js`: AI Code Review 的核心執行腳本。
- `.github/workflows/`:
  - `production.yaml`: 正式環境自動化部署流程。
  - `ai-review.yml`: PR 自動化 AI 審查流程。
- `Dockerfile`: Next.js Standalone 多階段建置設定。
- `next.config.ts`: 已開啟 `output: "standalone"` 以優化 Docker 映像檔。

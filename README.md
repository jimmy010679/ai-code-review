# AI Code Review - 靜態網站部署

[![PROD deployment](https://github.com/${{ github.repository }}/actions/workflows/production.yaml/badge.badge.svg)](https://github.com/${{ github.repository }}/actions/workflows/production.yaml)

本專案是一個基於 Nginx 的靜態網站，透過 Docker 進行容器化，並自動部署至 Google Cloud Run。

## 🚀 正式環境網址

您可以造訪以下網址查看最新部署版本：
**[https://ai-code-review-run-628326101026.asia-east1.run.app](https://ai-code-review-run-628326101026.asia-east1.run.app)**

---

## 🛠 CI/CD 流程

本專案使用 **GitHub Actions** 實現自動化部署流程：

1. **GitHub Push**: 當 `main` 分支有程式碼推送時觸發 Workflow。
2. **Docker Build**: 自動建置 Nginx 映像檔。
3. **Artifact Registry (GAR)**: 將建置好的映像檔推送到 Google Cloud 的存放庫中。
4. **Cloud Run**: 自動將新版映像檔部署到 Google Cloud Run。

---

## 💻 本地開發 (Local Development)

若要在本地環境運行，請確保已安裝 Docker：

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

## 常用指令

- **停止容器**：`docker stop ai-code-review-container`
- **刪除容器**：`docker rm ai-code-review-container`
- **查看日誌**：`docker logs -f ai-code-review-container`

## 專案結構

- `src/`: 存放靜態網頁原始碼。
- `Dockerfile`: Docker 映像檔建置設定。
- `.github/workflows/production.yaml`: CI/CD 自動化部署設定。
- `.dockerignore`: 排除不需要打包進映像檔的檔案。

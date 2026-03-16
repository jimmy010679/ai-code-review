# AI Code Review - 靜態網站部署

本專案使用 Nginx 提供 `src/index.html` 的靜態網頁服務。

## 快速開始

### 1. 使用 Docker 建置映像檔

請在專案根目錄執行以下指令：

```bash
docker build -t ai-code-review .
```

### 2. 啟動容器

將容器的 `80` 埠對應至本地的 `8080` 埠：

```bash
docker run -d -p 8080:80 --name ai-code-review-container ai-code-review
```

### 3. 查看網頁

打開瀏覽器並造訪：[http://localhost:8080](http://localhost:8080)

## 常用指令

- **停止容器**：
  ```bash
  docker stop ai-code-review-container
  ```
- **刪除容器**：
  ```bash
  docker rm ai-code-review-container
  ```
- **查看日誌**：
  ```bash
  docker logs -f ai-code-review-container
  ```

## 專案結構

- `src/`: 存放靜態網頁原始碼。
- `Dockerfile`: Docker 映像檔建置設定。
- `.dockerignore`: 排除不需要打包進映像檔的檔案。

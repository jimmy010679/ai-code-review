import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>結合 Gemini API 自動化PR審查 與 GCP Cloud Run 自動化部署</h1>
      <p>2026/04/02 (test!)</p>
      <p>AI Code Review: 整合 Gemini API，每當開發者開啟 PR 或更新內容時，系統會自動進行代碼審查。</p>
      <p>自動化流程: 構建完整 CI/CD Pipeline，實現程式碼推送後會自動觸發構建。</p>
      <p>安全性強化: 捨棄傳統靜態密鑰，採用 Workload Identity Federation 實現 GitHub 與 GCP 間的無密鑰認證。</p>
      <p>Image管理: 運用 Next.js Standalone 與 Docker Multi-stage Build 產出輕量化容器映像檔，並存放於 Artifact Registry 進行版本管控。</p>
      <p>Serverless 彈性部署: 利用 Cloud Run 機制實現滾動更新。</p>
    </div>
  );
}

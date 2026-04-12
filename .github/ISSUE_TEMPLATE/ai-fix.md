name: "🤖 AI 自動修復請求"
description: "提交此 Issue 並自動掛載 fix-me 標籤以啟動 Gemini 修復程序"
title: "[Bug] 檔案路徑 - 問題簡述"
labels: ["fix-me"] # 自動幫你掛上標籤，省去手動操作
body:
  - type: textarea
    id: description
    attributes:
      label: "問題描述"
      placeholder: "例如：首頁日期顯示為 2026/04/02，應改為 2026/04/12"
    validations:
      required: true
  - type: input
    id: file-path
    attributes:
      label: "涉及檔案路徑"
      placeholder: "src/app/page.tsx"
    validations:
      required: true
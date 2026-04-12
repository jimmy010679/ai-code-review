name: AI 自動修復請求
description: 提交此 Issue 並掛上 fix-me 標籤以啟動 Gemini 修復程序
title: "[Bug] 路徑 - 簡述問題"
labels: ["fix-me"]
body:
  - type: textarea
    id: bug-description
    attributes:
      label: 問題描述與路徑
      placeholder: 請輸入涉及的檔案路徑與錯誤現象...
    validations:
      required: true
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { execSync } = require("child_process");

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY 未設定");
    process.exit(1);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error("❌ GITHUB_TOKEN 未設定");
    process.exit(1);
  }

  if (!process.env.GEMINI_CODE_REVIEWER_MODEL) {
    console.error("❌ GEMINI_MODEL 未設定");
    process.exit(1);
  }

  const diffPath = process.argv[2];
  if (!fs.existsSync(diffPath) || fs.readFileSync(diffPath, "utf-8").trim() === "") {
    console.log("沒有偵測到代碼變動，跳過 Review。");
    return;
  }

  const diff = fs.readFileSync(diffPath, "utf-8");
  console.log("已讀取 Diff 內容，準備發送至 Gemini...");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_CODE_REVIEWER_MODEL,
    systemInstruction: "你是一位資深前端 Leader，正審核系統的改動。請針對該專案最佳實踐提供精簡建議。"
  });

  const prompt = `請審核以下 Git Diff 並提供 3 個關鍵建議：\n\n${diff}`;
  
  try {
    const result = await model.generateContent(prompt);
    const feedback = result.response.text();
    console.log("Gemini 回傳建議成功。");

    // 透過 GitHub CLI 直接在 PR 留言 (GitHub Action Runner 內置 gh)
    const commentBody = `### 🤖 Gemini AI Code Review\n\n${feedback}`;
    fs.writeFileSync("comment.txt", commentBody);
    
    execSync(`gh pr comment ${process.env.PR_NUMBER} --body-file comment.txt`, {
      env: { ...process.env, GH_TOKEN: process.env.GITHUB_TOKEN }
    });
  } catch (error) {
    console.error("AI Review 失敗:", error);
    process.exit(1); // 讓 Action 顯示失敗，方便除錯
  }
}

main();
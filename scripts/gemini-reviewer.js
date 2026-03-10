const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { execSync } = require("child_process");

async function main() {
  const diffPath = process.argv[2];
  if (!fs.existsSync(diffPath) || fs.readFileSync(diffPath, "utf-8").trim() === "") {
    console.log("沒有偵測到代碼變動，跳過 Review。");
    return;
  }
  
  const diff = fs.readFileSync(diffPath, "utf-8");
  console.log("已讀取 Diff 內容，準備發送至 Gemini...");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // 建議先用 1.5-flash 確保穩定，2026 年後續可再切換 2.0 或更新版本
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "你是一位資深前端 Lead。請針對 Diff 內容提供簡短且具體的改進建議（繁體中文）。"
  });

  try {
    const result = await model.generateContent(`請審核以下改動：\n\n${diff}`);
    const feedback = result.response.text();
    console.log("Gemini 回傳建議成功。");

    const commentBody = `### 🤖 Gemini AI Code Review\n\n${feedback}`;
    fs.writeFileSync("comment.txt", commentBody);
    
    // 使用 GitHub 內置的 gh 指令
    console.log(`準備在 PR #${process.env.PR_NUMBER} 貼上回覆...`);
    execSync(`gh pr comment ${process.env.PR_NUMBER} --body-file comment.txt`, {
      stdio: 'inherit' // 這會讓 gh 的錯誤訊息直接印在 GitHub Action Log 裡
    });
    console.log("PR 回覆貼上成功！");

  } catch (error) {
    console.error("執行過程中發生錯誤:", error);
    process.exit(1); // 讓 Action 顯示失敗，方便除錯
  }
}

main();
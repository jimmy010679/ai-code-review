# 使用輕量級的 Nginx Alpine 映像檔
FROM nginx:alpine

# 將 src 目錄下的內容複製到 Nginx 的預設靜態網頁路徑
COPY src/ /usr/share/nginx/html/

# 暴露 80 埠
EXPOSE 80

# 啟動 Nginx (這是基礎映像檔的預設行為，這裡可以省略或明確寫出)
CMD ["nginx", "-g", "daemon off;"]

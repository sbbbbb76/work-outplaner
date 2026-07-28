# IronShare Pro - 專業健身教練課表與動作庫管理系統

IronShare Pro 是一款專為健身教練與學員設計的訓練課表管理與互動系統。支援教練快速建立運動動作庫、編排學員專屬訓練課表，並能透過專屬連結以「唯讀互動模式」分享給學員進行打卡與訓練紀錄。同時整合 Firebase Firestore 實現跨裝置雲端資料同步，並支援 GitHub Actions 自動化部署至 GitHub Pages。

---

## 🌟 核心功能特色

1. **學員專屬連結與唯讀互動模式**
   - 學員取得課表連結後，預設以「唯讀互動模式」載入課表細節。
   - 學員可直接在線上進行組數打卡（Check）、記錄重量與次數，且無權任意修改教練排定的原始課表結構。
   - 連結在課表變更前永久有效，方便學員隨時開啟練習。

2. **Firebase Firestore 雲端資料同步（免費版支援）**
   - 動作庫 (Exercises)、學員資料 (Clients) 與訓練課表 (Plans) 自動即時同步至雲端資料庫。
   - 支援電腦、平板、手機多裝置間無縫同步，即使更換裝置或清除瀏覽器快照，資料也不會遺失。

3. **自動化 CI/CD 部署 (GitHub Actions)**
   - 內建 `.github/workflows/deploy.yml` 工作流。
   - 當程式碼推送 (Push) 至 `main` 或 `master` 分支時，GitHub Actions 會自動執行 TypeScript 檢查、Vite 打包，並自動部署至 GitHub Pages。

---

## 📂 專案架構說明

```
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions 自動部署腳本 (GitHub Pages)
├── src/
│   ├── components/               # 共用 UI 組件 (導覽列、模態框、Toast 等)
│   ├── data/                     # 初始預設種子資料 (seedData)
│   ├── firebase/                 # Firebase SDK 初始化配置
│   ├── services/                 # Firestore 雲端 CRUD 與即時監聽服務
│   ├── utils/                    # 工具函式 (剪貼簿、影片網址解析等)
│   ├── views/                    # 主要功能頁面 (Dashboard, Library, PlanEditor, PlanViewer)
│   ├── App.tsx                   # 主應用程式邏輯與路由切換
│   ├── main.tsx                  # Vite 進入點
│   └── types.ts                  # TypeScript 資料結構定義
├── firebase-applet-config.json   # Firebase 雲端連接專案設定檔
├── firebase-blueprint.json       # Firestore 資料庫 Schema 藍圖
├── firestore.rules               # Firestore 雲端資料庫存取權限規則
├── vite.config.ts                # Vite 建置設定 (相對路徑 `./` 支援)
├── .gitignore                    # 忽略追蹤的暫存檔與套件目錄
└── README.md                     # 專案說明文件
```

---

## 🔍 如何至 Firebase Console 確認儲存的資料

當系統新增學員、修改動作庫或建立課表時，資料會自動備份至 Firebase Firestore 雲端資料庫。您可以透過以下步驟隨時線上查看：

1. 開啟 [Firebase Console 官方主頁](https://console.firebase.google.com/)。
2. 登入您的 Google 帳號，並點擊進入本專案所連結的 Firebase 專案（例如：`yielding-circle-tds98`）。
3. 於左側選單點選 **Build（建立）** -> **Firestore Database**。
4. 在 **Data（資料）** 頁籤中，即可即時看到以下 3 個 Collections（集合）：
   - `clients`：儲存學員基本資料、訓練目標與備註。
   - `exercises`：儲存動作庫分類、名稱、影片連結與文字說明。
   - `plans`：儲存訓練課表名稱、難易度、動作組合與組數紀錄。
5. 點擊任意文件 (Document)，即可查看具體欄位細節與更新時間點。

---

## 💻 本地開發與建置指令

### 1. 套件說明 (`package.json`)
本專案基於 **React 19** 與 **Vite 6**，主要套件包含：
- **核心庫**：`react`, `react-dom`, `firebase`
- **UI 與圖示庫**：`lucide-react`, `motion`
- **開發與編譯工具**：`typescript`, `@types/react`, `@types/react-dom`, `vite`, `@tailwindcss/vite`

### 2. 安裝依賴套件
```bash
npm install
```

### 3. 啟動本地開發伺服器
```bash
npm run dev
```
啟動後開啟瀏覽器訪問 `http://localhost:3000` 即可預覽與開發。

### 4. 程式碼語法與 TypeScript 型態檢查 (Lint)
```bash
npm run lint
```

### 5. 打包生產環境靜態檔 (Build)
```bash
npm run build
```
打包產物將輸出至 `./dist` 目錄。

### 6. 清理歷史建置檔 (Clean)
```bash
npm run clean
```

---

## 🚀 GitHub Actions 自動部署至 GitHub Pages 操作流程

本專案已建置完整 GitHub Actions 自動化部署流程 (`.github/workflows/deploy.yml`)：

### 1. 將程式碼推送到 GitHub 儲存庫
```bash
git add .
git commit -m "feat: setup package.json, gitignore and github actions deployment"
git push origin main
```

### 2. 開啟 GitHub Pages 權限設定
1. 前往您在 GitHub 上的專案儲存庫頁面 (Repository)。
2. 點擊頂部的 **Settings（設定）** 頁籤。
3. 在左側選單找到 **Pages**。
4. 在 **Build and deployment** 區塊下：
   - 將 **Source** 改選為 **GitHub Actions**。
5. 點擊 GitHub 儲存庫頂部的 **Actions** 頁籤，即可觀察 `.github/workflows/deploy.yml` 部署進度。
6. 部署完成後，GitHub 會為您提供公開存取的站台網址（例如：`https://<YOUR_GITHUB_NAME>.github.io/<REPO_NAME>/`）。

---

## 🛡️ .gitignore 與安全性防護

本專案 `.gitignore` 已完整排除下列檔案，避免私密資訊、暫存快照與第三方套件被誤推送到 GitHub：
- **套件與依賴目錄**：`node_modules/`, `.pnpm-store/`, `.bun/`
- **打包建置產出**：`dist/`, `dist-ssr/`, `build/`, `out/`
- **日誌與快取目錄**：`*.log`, `npm-debug.log*`, `.vite/`, `.cache/`, `.temp/`, `.tmp/`
- **環境變數設定檔**：`.env`, `.env.local`, `.env.*.local`
- **作業系統與 IDE 暫存**：`.DS_Store`, `Thumbs.db`, `Desktop.ini`, `.vscode/*`

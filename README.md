# E-Commerce 後端系統

## 這是一個模擬電商購物車系統的後端架構，負責處理商品資料、用戶管理、購物車與訂單相關的 API。專案採用 Node.js 和 Express 框架開發，為前端提供 RESTful API 支援。

## 環境變數設定

請在專案根目錄建立 `.env` 檔案，並設定以下環境變數：

```env
PORT = 8080
JWT_SECRET = 
PRIVATE_KEY_PATH =
PUBLIC_KEY_PATH = 
```

## 安裝套件

請執行以下指令安裝 package：

```bash
npm install
```

## 目前功能

- **商品 CRUD（建立、讀取、更新、刪除）**

- **用戶註冊與登入（含 JWT 驗證）**

- **購物車管理（加入、移除商品）**

- **訂單建立與查詢**

### 尚未更新

- **支付整合（第三方支付串接）**


## 主要的 package

- express, node.js：後端框架

- sequelize, postgreSQL :資料庫架構

- jsonwebtoken：JWT 驗證 (採用 RS256)

- bcrypt：密碼雜湊加密

- dotenv：環境變數管理

- joi : 驗證格式

---

歡迎提出任何建議使我可以更加完善此功能!

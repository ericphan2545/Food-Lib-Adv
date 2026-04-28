# Food-Lib-Adv — Project Overview

## 1) Tổng quan nhanh

`Food-Lib-Adv` là một web app kiểu **MVC** chạy bằng **Node.js (Express) + EJS + MongoDB (Mongoose)**, gồm:

- **Thư viện món ăn**: lưu món ăn trong MongoDB, có API để lấy danh sách và CRUD (có bảo vệ login cho thao tác ghi).
- **Meal Planner theo tuần**: người dùng chọn món theo ngày/bữa, hệ thống kiểm tra cân bằng cơ bản và lưu local.
- **Hồ sơ cơ thể (BMI/BMR/TDEE/Target kcal)**: tính toán và lưu vào DB (khi đã đăng nhập).
- **AI Planner theo nguyên liệu + BMI**: gọi Gemini để tạo thực đơn 7 ngày, có **fallback rule-based** theo BMI khi AI lỗi/limit/không có key; có **lịch sử AI** và nút **xóa lịch sử**.

## 2) Cách chạy dự án (dev/prod)

### Yêu cầu

- Node.js (khuyến nghị >= 18)
- MongoDB (local hoặc Atlas)

### Cài đặt & chạy

Từ thư mục `Food-Lib-Adv`:

```bash
npm install
npm run dev
```

Mặc định server chạy tại `http://localhost:3000`.

### Biến môi trường

Backend load `.env` tại root dự án (được load trong `backend/app.js`).

Các biến quan trọng:

- **`MONGODB_URI`**: URI MongoDB. Nếu không set sẽ dùng mặc định `mongodb://localhost:27017/food_lib_adv`.
- **`SESSION_SECRET`**:
  - Production: **bắt buộc**.
  - Dev: nếu chưa set, app tự tạo secret ngẫu nhiên cho phiên chạy hiện tại.
- **`PORT`**: tuỳ chọn (default 3000).
- **`NODE_ENV`**: dùng để enforce `SESSION_SECRET` khi production.
- **`GEMINI_API_KEY`**: API key Gemini. Nếu không có / placeholder → tự fallback sang rule-based.

> Lưu ý bảo mật: Không commit `.env` lên git. Nếu lỡ commit rồi, cần rotate key và remove khỏi git history (xem mục “Known issues”).

## 3) Cấu trúc thư mục (high-level)

```
Food-Lib-Adv/
├─ backend/                     # Express app (MVC), routes/controllers/models/views
├─ public/                      # Static assets (CSS/JS/img) được serve qua /public
├─ docs/                        # Tài liệu dự án (file này)
├─ package.json                 # scripts + dependencies
├─ package-lock.json
├─ README.md
├─ AI_MEAL_PLANNER_BLUEPRINT.md # blueprint (có phần không khớp code hiện tại)
└─ analysis_foodlibadv.md       # phân tích code (internal)
```

### Backend (`backend/`)

- **Entrypoint**: `backend/app.js`
- **DB connect**: `backend/config/db.js`
- **Auth middleware**: `backend/middleware/auth.js` (`requireLogin`)
- **Routes**: `backend/routes/*`
- **Controllers**: `backend/controllers/*`
- **Models**: `backend/models/*`
- **Views (EJS)**: `backend/views/*`
- **Seed data**: `backend/data/foodSeed.js`

### Frontend (`public/`)

- **Meal planner UI**: `public/js/meal-planner.js`
- **Dữ liệu tĩnh (fallback)**: `public/js/food-database.js` (window.FOOD_DATABASE)
- **Recipe UI**: `public/js/recipes-ui.js`
- **Favorites**: `public/js/favorites.js`
- **Theme**: `public/js/theme.js`, CSS `public/css/theme.css`

## 4) Luồng chạy tổng quát

### 4.1 Server bootstrap

`backend/app.js` thực hiện:

- Load `.env`
- Setup EJS view engine
- Setup JSON/body parsers
- Setup session store (Mongo-backed)
- Serve static `/public`
- Mount routes:
  - `/api/foods`
  - `/api/profile`
  - `/api/ai`
  - `/users` (login/register/logout)
  - `/` (pages)
- Connect DB và seed foods (`ensureSeeded()`)

### 4.2 Meal Planner page

Trang `meal-planner` render từ `backend/views/pages/meal-planner.ejs` và load JS:

- `public/js/food-database.js`
- `public/js/recipes-ui.js`
- `public/js/meal-planner.js`

JS sẽ:

- Load profile từ server (`GET /api/profile`) nếu đã login
- Load foods từ server (`GET /api/foods`), nếu lỗi thì fallback về `window.FOOD_DATABASE`
- Quản lý mealPlan theo tuần trong `localStorage`
- Mở modal AI để nhập nguyên liệu tuần và gọi `/api/ai/advice`

## 5) API (đúng theo code hiện tại)

### 5.1 Pages (EJS) — yêu cầu login

- `GET /` (home)
- `GET /meal-planner`
- `GET /favorites`

### 5.2 Auth routes

Base path: `/users`

- `GET /users/register`
- `POST /users/register`
- `GET /users/login`
- `POST /users/login`
- `POST /users/logout`

### 5.3 Food REST API

Base path: `/api/foods`

- `GET /api/foods`
  - Query tham khảo: `category`, `meal`, `search`
- `GET /api/foods/:id`
- `POST /api/foods` (**requireLogin**)
- `PUT /api/foods/:id` (**requireLogin**)
- `DELETE /api/foods/:id` (**requireLogin**)

### 5.4 Profile API (BMI/BMR/TDEE)

Base path: `/api/profile` (**requireLogin**)

- `GET /api/profile` → trả về `user.profile`
- `PUT /api/profile` → update profile + tính toán (BMI/BMR/TDEE/targetCalories) server-side

### 5.5 AI API (Gemini + fallback)

Base path: `/api/ai` (**requireLogin**)

- `POST /api/ai/advice`
  - Input: `ingredientsRaw`, `ingredients[]`, `note`, `profile{...}`
  - Output: JSON có `weekPlan` (7 ngày), `bmiSummary`, `shoppingSuggestions`, `notes`, metadata `source`
- `GET /api/ai/history`
  - Output: `history[]` (tối đa 10 item gần nhất phía frontend đang hiển thị)
- `DELETE /api/ai/history`
  - Xóa toàn bộ lịch sử AI (set `aiHistory` về `[]`)

## 6) Database models

### 6.1 `Food` (`backend/models/Food.js`)

Các field chính:

- `id` (Number, unique/index) — để tương thích dữ liệu tĩnh phía client
- `name`, `emoji`
- `calories`, `carbs`, `protein`, `fat`, `fiber`
- `category`: `carbs|protein|fat|fiber|balanced`
- `meal`: `breakfast|lunch|dinner|any`
- `image`, `recipeCategory`, `time`, `difficulty`, `description`
- `ingredients[]`, `instructions[]`

### 6.2 `User` (`backend/models/User.js`)

Các field chính:

- `email`, `username`, `password` (bcrypt hash trong `pre('save')`)
- `profile` (embedded):
  - `gender`, `age`, `height`, `weight`, `activityLevel`
  - `bmi`, `bmiCategory`, `bmr`, `tdee`, `targetCalories`, `goal`
- `aiHistory[]` (embedded):
  - `createdAt`, `source`, `ingredientsRaw`, `note`, `result` (Mixed)

## 7) AI Planner: logic & fallback

### 7.1 Khi nào gọi AI

Frontend (`public/js/meal-planner.js`) gọi `POST /api/ai/advice` khi:

- User đã có `bmi` và `targetCalories`
- User nhập ít nhất 1 nguyên liệu

### 7.2 Khi nào fallback rule-based

Backend (`backend/controllers/aiMealAdviceController.js`) sẽ fallback khi:

- Thiếu `GEMINI_API_KEY` hoặc key placeholder
- Gemini trả về lỗi (429/5xx/timeout, format sai…)
- Kết quả AI không đạt “độ khớp nguyên liệu” (ingredient coverage thấp)

Kết quả fallback trả về `source: "fallback-local"` (frontend hiển thị trạng thái rõ ràng).

### 7.3 Lịch sử AI & xóa lịch sử

- Mỗi lần tạo kế hoạch (AI hoặc fallback) đều có thể lưu vào `user.aiHistory`.
- Frontend có nút **“Xóa lịch sử”** trong modal AI và dùng confirm modal riêng (không dùng `window.confirm`) để tránh bị “lọt z-index” dưới modal AI.

## 8) Những file thường sửa khi phát triển

- **AI/fallback**: `backend/controllers/aiMealAdviceController.js`
- **Routes AI**: `backend/routes/aiRoutes.js`
- **Meal planner UI**: `public/js/meal-planner.js`, `backend/views/pages/meal-planner.ejs`, `public/css/meal-planner.css`
- **Profile/BMI**: `backend/controllers/profileController.js`
- **Foods CRUD/seed**: `backend/controllers/foodController.js`, `backend/data/foodSeed.js`, `backend/models/Food.js`

## 9) Known issues / điểm cần lưu ý

- **`.env` đang tồn tại trong repo**: File `.env` có thể đã bị track bởi git ở quá khứ. Nếu repo public/đưa cho người khác → rủi ro lộ key.
  - Khuyến nghị: tạo `.env.example` (không chứa secret), rotate key, và remove `.env` khỏi tracking (`git rm --cached .env`), đồng thời cân nhắc dọn history nếu đã push public.
- **Blueprint không khớp endpoint**:
  - `AI_MEAL_PLANNER_BLUEPRINT.md` nói `POST /api/ai/meal-plan`
  - Code thực tế đang dùng `POST /api/ai/advice`
- **Rủi ro quota/model Gemini**: code đang thử lần lượt một vài model; tuỳ project/key, có thể gặp `404 Not Found` (model không khả dụng) hoặc `429` (quota/rate limit) → hệ thống sẽ fallback.

## 10) Quick checklist để verify end-to-end

- Chạy MongoDB và set `MONGODB_URI` đúng.
- Đăng ký/đăng nhập.
- Vào `Meal Planner`:
  - Cập nhật BMI/TDEE (lưu server qua `/api/profile`).
  - Thử load foods từ `/api/foods` (nếu API fail sẽ fallback FOOD_DATABASE).
  - Mở AI modal → nhập nguyên liệu → bấm “Tạo thực đơn AI 7 ngày”.
  - Thử xóa lịch sử → confirm modal hiển thị nổi trên AI modal.


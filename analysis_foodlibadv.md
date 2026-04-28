# 📋 Phân Tích Source Code – FoodLibAdv

## 1. Cấu Trúc Thư Mục

```
FoodLibAdv/
├── .env                        # Biến môi trường (MONGODB_URI, SESSION_SECRET)
├── package.json                # Node.js config, scripts: start / dev
├── public/                     # Static assets (CSS, JS, img)
│   ├── css/
│   │   ├── base.css            # Reset + typography
│   │   ├── layout.css          # Grid, section, container
│   │   ├── components.css      # Card, button, modal, filter...
│   │   ├── theme.css           # Light/dark theme variables
│   │   ├── auth.css            # Trang login/register
│   │   ├── favorites.css       # Trang yêu thích
│   │   └── meal-planner.css    # Trang lập thực đơn
│   └── js/
│       ├── food-database.js    # Dữ liệu tĩnh FOOD_DATABASE (client-side)
│       ├── recipes.js          # Logic recipes (fetch + render)
│       ├── recipes-ui.js       # UI helpers cho recipes
│       ├── favorites.js        # Quản lý yêu thích (localStorage)
│       ├── meal-planner.js     # Logic lập thực đơn
│       ├── bmi-checker.js      # Tính BMI phía client
│       ├── nav-indicator.js    # Active nav highlight
│       └── theme.js            # Toggle dark/light mode
└── backend/
    ├── app.js                  # Entry point – express setup, middleware, routes
    ├── config/db.js            # Kết nối MongoDB
    ├── middleware/auth.js      # requireLogin guard
    ├── models/
    │   ├── Food.js             # Mongoose schema cho món ăn
    │   └── User.js             # Mongoose schema + bcrypt + profile
    ├── controllers/
    │   ├── foodController.js   # CRUD food + ensureSeeded
    │   ├── userController.js   # Register/Login/Logout
    │   ├── profileController.js# Get/Update profile + tính BMI/TDEE server-side
    │   └── pageController.js   # Render EJS pages
    ├── routes/
    │   ├── foodRoutes.js       # /api/foods – REST CRUD
    │   ├── profileRoutes.js    # /api/profile – GET/PUT
    │   ├── userRoutes.js       # /users – Auth pages
    │   └── pageRoutes.js       # / – EJS pages
    ├── data/foodSeed.js        # Seed data ban đầu
    └── views/
        ├── partials/
        │   ├── header.ejs
        │   └── footer.ejs
        ├── pages/
        │   ├── index.ejs       # Trang chủ thư viện
        │   ├── favorites.ejs   # Trang yêu thích
        │   └── meal-planner.ejs
        └── users/
            ├── login.ejs
            └── register.ejs
```

---

## 2. Kiểm Tra CRUD – Food API (`/api/foods`)

| Thao tác | Route | Controller | Trạng thái |
|----------|-------|-----------|------------|
| **List** (Read All) | `GET /api/foods` | `listFoods` | ✅ Đúng – filter theo category/meal/search |
| **Get One** (Read) | `GET /api/foods/:id` | `getFood` | ✅ Đúng – validate id, 404 nếu không tìm thấy |
| **Create** | `POST /api/foods` | `createFood` | ✅ Đúng – auto-increment id nếu không truyền |
| **Update** | `PUT /api/foods/:id` | `updateFood` | ✅ Đúng – không cho đổi id, runValidators |
| **Delete** | `DELETE /api/foods/:id` | `deleteFood` | ✅ Đúng – trả về object đã xóa |

> [!NOTE]
> Food CRUD **không có** `requireLogin` guard. Đây là design có chủ ý (API public) nhưng cần xem xét nếu muốn bảo vệ Create/Update/Delete.

---

## 3. Kiểm Tra Auth – User (`/users`)

| Thao tác | Route | Ghi chú |
|----------|-------|---------|
| Register Form | `GET /users/register` | Redirect nếu đã login ✅ |
| Register | `POST /users/register` | Tạo user → redirect login ✅ |
| Login Form | `GET /users/login` | Redirect nếu đã login ✅ |
| Login | `POST /users/login` | Bcrypt compare → set session ✅ |
| Logout | `GET /users/logout` | Destroy session ✅ |

---

## 4. Kiểm Tra Profile API (`/api/profile`)

| Thao tác | Route | Ghi chú |
|----------|-------|---------|
| Get Profile | `GET /api/profile` | Auth-guarded ✅ |
| Update Profile | `PUT /api/profile` | Auth-guarded, tính BMI/TDEE server-side ✅ |

---

## 5. Các Vấn Đề & Điểm Cần Lưu Ý

### 🔴 Lỗi / Rủi Ro

| # | Vị trí | Mô tả |
|---|--------|-------|
| 1 | `foodController.js` L6 | `toPublicFood` dùng destructuring trên raw object nhưng `toObject()` không trả về `__v` nếu lean. Cần kiểm tra đồng nhất giữa `.lean()` và `.toObject()`. |
| 2 | `foodController.js` L77 | `createFood` cho phép client tự set `id` nếu muốn – có thể gây xung đột với seed data hoặc bản ghi hiện có. |
| 3 | `foodRoutes.js` | **Không có auth guard** trên `POST`, `PUT`, `DELETE`. Bất kỳ ai cũng có thể thêm/sửa/xóa món. |
| 4 | `userController.js` L59 | `logout` dùng `GET /users/logout` – nên dùng `POST` để tránh CSRF logout attack. |
| 5 | `header.ejs` | Luôn hiển thị link "Đăng xuất" dù không check `currentUser`. Nếu chưa đăng nhập thì link vẫn hiện. |
| 6 | `index.ejs` filters | Filter theo "Món nước", "Món quay"... là hardcoded UI nhưng Food model chỉ có `category: ['carbs','protein','fat','fiber','balanced']` – **không khớp nhau**. |

### 🟡 Cải Thiện Khuyến Nghị

| # | Vị trí | Đề xuất |
|---|--------|---------|
| 7 | `userController.js` | Nên dùng `$set: { 'profile': ... }` tường minh hơn khi update. |
| 8 | `profileController.js` | `updateProfile` dùng `findByIdAndUpdate` không có `runValidators: true` – validators trong schema không chạy. |
| 9 | `app.js` L5 | Import `{ MongoStore }` nhưng `connect-mongo` v6 export default, nên dùng `require('connect-mongo')` (không destructure). |
| 10 | `db.js` | Nên bắt lỗi kết nối và exit gracefully. |
| 11 | `pageController.js` | `currentUser` đã có từ `res.locals` (set ở app.js L48) nên không cần truyền lại qua render. |
| 12 | `food-database.js` | File JS tĩnh client-side có thể bị lệch với MongoDB (nếu admin thêm món mới qua API). Cần đồng bộ hoặc fetch thuần từ API. |

---

## 6. Đánh Giá Tổng Thể

| Tiêu chí | Đánh giá |
|----------|----------|
| Cấu trúc MVC | ✅ Rõ ràng, đúng pattern |
| CRUD Food | ✅ Đầy đủ 5 operations |
| Auth (Register/Login/Logout) | ✅ Hoạt động đúng |
| Session + MongoDB Store | ✅ Đúng |
| Seed data tự động | ✅ Logic tốt |
| Bảo mật Food API | ⚠️ Thiếu auth guard trên mutating routes |
| Đồng bộ client-server data | ⚠️ `food-database.js` tĩnh có thể lệch DB |
| Validators khi update profile | ⚠️ `runValidators` chưa bật |
| Logout method | ⚠️ Nên POST thay GET |
| Header conditional | ⚠️ Luôn show "Đăng xuất" |
| Filter UI vs DB schema | 🔴 Không khớp |

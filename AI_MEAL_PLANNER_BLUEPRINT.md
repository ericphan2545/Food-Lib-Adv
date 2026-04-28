# AI Meal Planner Blueprint (Food-Lib-Adv)

Tai lieu nay la ban blueprint trien khai AI cho tinh nang lap thuc don tuan trong du an `Food-Lib-Adv`.

Muc tieu la de trien khai nhanh, an toan, co fallback, va co the chay voi provider free.

---

## 1) Muc tieu MVP

- Nguoi dung bam `Tu dong de xuat` trong trang `meal-planner`.
- Backend goi AI de goi y thuc don 7 ngay.
- Backend validate rang buoc dinh duong.
- Frontend render vao lich tuan hien co.
- Neu AI loi thi fallback sang planner local (khong vo he thong).

---

## 2) Kien truc de xuat (Hybrid)

- **Frontend (`meal-planner.js`)**: goi API AI, nhan `weekPlan`, do vao state hien tai.
- **Backend API**: endpoint moi `POST /api/ai/meal-plan`.
- **AI service layer**: tach provider de doi model de dang.
- **Constraint engine**: backend giu quyen quyet dinh cuoi cung.

**Nguyen tac quan trong:**
- AI de xuat, backend kiem soat.
- AI khong duoc phep pha vo rule calo/macro/lap mon.

---

## 3) Huong di tot nhat hien tai

### Lua chon khuyen dung

1. **MVP nhanh**: Gemini free tier.
2. **Free ben vung**: Ollama local.

### Tai sao Hybrid la tot nhat

- AI thuan de bi "bia" hoac sai format.
- Rule trong backend giup ket qua on dinh, de test, de tin cay.
- Co fallback local giup app luon hoat dong.

---

## 4) Cau truc file can tao/sua

### Backend

Tao moi:

- `backend/routes/aiRoutes.js`
- `backend/controllers/aiMealPlanController.js`
- `backend/services/ai/mealPlanAiService.js`
- `backend/services/ai/promptBuilder.js`
- `backend/services/ai/providers/geminiProvider.js`
- `backend/services/ai/providers/ollamaProvider.js`
- `backend/services/ai/validators/mealPlanValidator.js`
- `backend/services/ai/validators/constraintEngine.js`
- `backend/services/ai/fallback/localPlannerFallback.js`

Sua:

- `backend/app.js` (mount route: `app.use('/api/ai', aiRoutes)`)

### Frontend

Sua:

- `public/js/meal-planner.js`
  - tach `autoGenerateMeals()` thanh:
    - `autoGenerateMealsWithAI()`
    - `autoGenerateMealsLocal()`
  - map output AI (`foodId`) ve object mon an trong DB.

### Config

Sua `.env`:

```env
AI_PROVIDER=gemini
AI_TIMEOUT_MS=20000
GEMINI_API_KEY=your_key_here
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 5) API contract chuan

## `POST /api/ai/meal-plan`

### Request

```json
{
  "profile": {
    "gender": "male",
    "age": 25,
    "height": 170,
    "weight": 70,
    "activityLevel": "moderate",
    "targetCalories": 2200,
    "goal": "maintain"
  },
  "preferences": {
    "excludeFoodIds": [12, 18],
    "maxRepeatPerWeek": 2,
    "budgetLevel": "medium",
    "cookingTimePreference": "quick"
  }
}
```

### Response success

```json
{
  "source": "ai",
  "provider": "gemini",
  "weekPlan": {
    "monday": {
      "breakfast": { "foodId": 2, "reason": "..." },
      "lunch": { "foodId": 11, "reason": "..." },
      "dinner": { "foodId": 9, "reason": "..." }
    }
  },
  "summary": {
    "estimatedDailyCalories": 2180,
    "macroRatio": { "carbs": 0.5, "protein": 0.25, "fat": 0.25 },
    "constraintReport": { "passed": true, "warnings": [] }
  }
}
```

### Response fallback

```json
{
  "source": "fallback",
  "provider": "local",
  "weekPlan": {},
  "summary": {
    "constraintReport": {
      "passed": true,
      "warnings": ["AI unavailable, used local planner"]
    }
  }
}
```

---

## 6) Prompt strategy

### System prompt

- Bat buoc AI chi dung mon trong danh sach cho phep.
- Bat buoc tra ve JSON-only (khong markdown, khong text them).
- Bat buoc du 7 ngay x 3 bua.

### Input prompt nen co

- profile + target kcal
- danh sach mon hop le (`id`, `name`, `calories`, `carbs`, `protein`, `fat`, `category`, `meal`)
- constraints:
  - khong lap qua `maxRepeatPerWeek`
  - khong dung mon trong `excludeFoodIds`
  - tong kcal/ngay trong nguong cho phep (vd +-10%)
  - uu tien mon dung bua (`breakfast/lunch/dinner`)

---

## 7) Validation pipeline bat buoc

Trong `mealPlanAiService`, xu ly theo thu tu:

1. Goi AI sinh plan.
2. Parse JSON.
3. Validate schema (khuyen dung `zod`).
4. Constraint check:
   - `foodId` ton tai
   - slot hop le
   - khong lap qua nguong
   - kcal/macro dat nguong
5. Neu fail -> goi mot lan "repair prompt".
6. Van fail -> fallback local planner.
7. Tra ket qua + metadata (`source`, `provider`, `warnings`).

---

## 8) Frontend flow de tich hop

Trong `public/js/meal-planner.js`:

- Nguoi dung bam `Tu dong de xuat`.
- UI vao loading state.
- Goi `POST /api/ai/meal-plan`.
- Map `foodId -> food object` tu `this.foodDatabase`.
- Ghi vao `this.mealPlan[weekX][day][meal]`.
- Goi:
  - `renderCalendar()`
  - `checkNutritionBalance()`
  - `saveData()`
- Hien toast:
  - "Da tao thuc don bang AI"
  - hoac "AI tam khong san sang, da dung goi y mac dinh"

---

## 9) Provider free de add

## Option A: Gemini free tier

- Uu diem: chat luong tot, setup nhanh.
- Nhuoc diem: co quota free.

## Option B: Ollama local

- Uu diem: free hoan toan, privacy tot.
- Nhuoc diem: phu thuoc cau hinh may.

Model local goi y:

- `qwen2.5:7b-instruct`
- `llama3.1:8b-instruct`
- `gemma2:9b` (neu may manh)

---

## 10) Test plan can co

### Schema tests

- AI tra ve text rac -> fallback.
- Thieu ngay/bua -> reject.

### Constraint tests

- Lap mon qua nguong -> reject.
- Kcal lech qua nguong -> reject.

### Integration tests

- Timeout provider -> fallback local.
- API key sai -> fallback local.

### UI tests

- Bam nut AI -> lich duoc cap nhat.
- Refresh page -> du lieu van giu.
- Toast hien dung nguon (`ai`/`fallback`).

---

## 11) Lo trinh trien khai 2-3 ngay

### Day 1

- Tao skeleton route/controller/service.
- Tao validator + constraint engine.
- Ket noi provider chinh (Gemini hoac Ollama).

### Day 2

- Tich hop frontend (`meal-planner.js`).
- Them loading + toast + map foodId.
- Test end-to-end + fallback.

### Day 3 (optional)

- Them provider thu 2.
- Them "explain mode" (ly do chon mon).
- Tinh chinh prompt theo log that.

---

## 12) Khuyen nghi san pham

- Khong dua loi khuyen y khoa chuyen sau.
- Them disclaimer "tham khao, khong thay the tu van bac si".
- Neu BMI/chi so bat thuong -> hien canh bao va goi y gap chuyen gia.

---

## 13) Checklist san sang code

Truoc khi code, can confirm:

- Chon provider dau tien: `gemini` hay `ollama`?
- Muc tieu calo cho phep lech bao nhieu? (vd +-10%)
- Gioi han lap mon/tuan? (vd 2 lan)
- Co danh sach mon can loai tru khong?

Khi 4 muc tren da ro, co the bat dau code endpoint MVP ngay.


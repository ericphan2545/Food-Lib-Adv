/**
 * Meal Planner - Quản lý lập thực đơn tuần
 * NutriPlan Application
 */
const MealPlanner = {
  // ===== STATE MANAGEMENT =====
  userData: {
    gender: null,
    age: null,
    height: null,
    weight: null,
    activityLevel: null,
    bmi: null,
    bmiCategory: null,
    bmr: null,
    tdee: null,
    targetCalories: null,
    goal: null, // "gain" | "maintain" | "lose" | "lose-aggressive"
    mealsPerDay: 3,
    dietaryPreferences: "",
    allergyNotes: "",
  },

  // Cờ đánh dấu user đã đăng nhập (backend sẽ inject qua window.CURRENT_USER)
  get isLoggedIn() {
    return !!(typeof window !== "undefined" && window.CURRENT_USER);
  },

  saveData() {
    const dataToSave = {
      userData: this.userData,
      mealPlan: this.mealPlan,
      currentWeek: this.currentWeek,
      previousWeekFoods: this.previousWeekFoods,
    };
    localStorage.setItem("nutriPlanData", JSON.stringify(dataToSave));

    // Nếu đã đăng nhập thì đồng bộ profile BMI lên server (không chặn UI)
    if (this.isLoggedIn && this.userData.bmi) {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.userData),
      }).catch((err) => console.warn("Không thể lưu profile lên server:", err));
    }
  },

  async loadData() {
    // 1) Ưu tiên tải profile từ server nếu đã login
    if (this.isLoggedIn) {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data && data.profile && data.profile.bmi) {
            this.userData = { ...this.userData, ...data.profile };
          }
        }
      } catch (err) {
        console.warn("Không thể tải profile từ server:", err);
      }
    }

    // 2) Tải meal plan / tuần hiện tại từ localStorage
    const savedData = localStorage.getItem("nutriPlanData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Nếu server chưa có profile thì dùng local
        if (!this.userData.bmi && parsedData.userData) {
          this.userData = { ...this.userData, ...parsedData.userData };
        }
        this.mealPlan = parsedData.mealPlan || {};
        this.currentWeek = parsedData.currentWeek || 1;
        this.previousWeekFoods = parsedData.previousWeekFoods || [];
      } catch (e) {
        console.warn("nutriPlanData bị hỏng, bỏ qua:", e);
      }
    }

    // 3) Cập nhật UI
    const weekDisplay = document.getElementById("currentWeek");
    if (weekDisplay) weekDisplay.textContent = `Tuần ${this.currentWeek}`;

    if (this.userData.bmi) {
      const ageInput = document.getElementById("age");
      const heightInput = document.getElementById("height");
      const weightInput = document.getElementById("weight");
      const mealsPerDayInput = document.getElementById("mealsPerDay");
      const dietaryInput = document.getElementById("dietaryPreferences");
      const allergyInput = document.getElementById("allergyNotes");
      if (ageInput) ageInput.value = this.userData.age || "";
      if (heightInput) heightInput.value = this.userData.height || "";
      if (weightInput) weightInput.value = this.userData.weight || "";
      if (mealsPerDayInput) mealsPerDayInput.value = this.userData.mealsPerDay || 3;
      if (dietaryInput) dietaryInput.value = this.userData.dietaryPreferences || "";
      if (allergyInput) allergyInput.value = this.userData.allergyNotes || "";
      if (this.userData.gender) this.selectGender(this.userData.gender);
      if (this.userData.activityLevel) this.selectActivity(this.userData.activityLevel);
      this.displayBMIResult();
      this.updateNutritionTargets();
    }
  },

  // ===== FOOD DATA LOADING =====
  // Thử tải danh sách món ăn từ REST API (/api/foods).
  // Nếu lỗi thì fallback về window.FOOD_DATABASE (static).
  async loadFoods() {
    try {
      const res = await fetch("/api/foods");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this._foodsCache = data;
          return data;
        }
      }
    } catch (err) {
      console.warn("API /api/foods lỗi, dùng dữ liệu tĩnh:", err);
    }
    this._foodsCache = Array.isArray(window.FOOD_DATABASE) ? window.FOOD_DATABASE : [];
    return this._foodsCache;
  },

  currentWeek: 1,
  mealPlan: {},
  foodUsageCount: {},
  previousWeekFoods: [],
  currentSelectedSlot: null,
  aiLastWeekPlan: null,
  aiHistory: [],

  // ===== CONSTANTS =====
  days: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
  dayNames: {
    monday: "Thứ 2",
    tuesday: "Thứ 3",
    wednesday: "Thứ 4",
    thursday: "Thứ 5",
    friday: "Thứ 6",
    saturday: "Thứ 7",
    sunday: "CN",
  },
  meals: ["breakfast", "lunch", "dinner"],
  mealNames: { breakfast: "Sáng", lunch: "Trưa", dinner: "Tối" },

  _foodsCache: null,
  get foodDatabase() {
    if (this._foodsCache && this._foodsCache.length) return this._foodsCache;
    return typeof FOOD_DATABASE !== "undefined" ? FOOD_DATABASE : [];
  },

  // ===== INITIALIZATION =====
  async init() {
    await this.loadFoods();
    await this.loadData();
    this.initializeMealPlan();
    this.renderCalendar();
    this.bindEvents();
    this.checkNutritionBalance();
    this.initAiModal();
  },

  initializeMealPlan() {
    if (!this.mealPlan[`week${this.currentWeek}`]) {
      this.mealPlan[`week${this.currentWeek}`] = {};
      this.days.forEach((day) => {
        this.mealPlan[`week${this.currentWeek}`][day] = {
          breakfast: null,
          lunch: null,
          dinner: null,
        };
      });
    }
    this.updateFoodUsageCount();
  },

  bindEvents() {
    // Modal Food Selection Backdrop Click
    const foodModal = document.getElementById("foodModal");
    if (foodModal) {
      foodModal.addEventListener("click", (e) => {
        if (e.target === foodModal) this.closeModal();
      });
    }

    // Modal Settings Backdrop Click (MỚI)
    const settingsModal = document.getElementById("settingsModal");
    if (settingsModal) {
      settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) this.closeSettingsModal();
      });
    }

    const aiModal = document.getElementById("aiModal");
    if (aiModal) {
      aiModal.addEventListener("click", (e) => {
        if (e.target === aiModal) this.closeAiModal();
      });
    }
  },

  // ===== AI MODAL (Nguyên liệu tuần + BMI profile) =====
  initAiModal() {
    const modal = document.getElementById("aiModal");
    if (!modal) return;

    const hasSeen = localStorage.getItem("aiModalSeen");
    if (!hasSeen) {
      this.openAiModal();
      localStorage.setItem("aiModalSeen", "1");
    }

    const ingredientsInput = document.getElementById("aiIngredientsInput");
    if (ingredientsInput) {
      ingredientsInput.value = localStorage.getItem("aiWeeklyIngredients") || "";
      ingredientsInput.addEventListener("input", () => {
        localStorage.setItem("aiWeeklyIngredients", ingredientsInput.value);
      });
    }

    this.renderAiProfileSummary();
    this.loadAiHistory();
  },

  openAiModal() {
    const modal = document.getElementById("aiModal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("show"), 10);
    }
  },

  closeAiModal() {
    const modal = document.getElementById("aiModal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  },

  tokenizeIngredients(raw) {
    return String(raw || "")
      .split(/[\n,;|]/g)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 80);
  },

  renderAiProfileSummary() {
    const el = document.getElementById("aiProfileSummary");
    if (!el) return;
    if (!this.userData?.bmi) {
      el.innerHTML = `
        <div class="ai-profile-empty">
          Chưa có dữ liệu BMI/TDEE. Vui lòng bấm "Cập nhật" ở thẻ BMI trước khi tạo thực đơn AI.
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="ai-profile-grid">
        <div><b>BMI</b>: ${this.userData.bmi} (${this.userData.bmiCategory || "--"})</div>
        <div><b>TDEE</b>: ${(this.userData.tdee || 0).toLocaleString()} kcal</div>
        <div><b>Mục tiêu</b>: ${(this.userData.targetCalories || 0).toLocaleString()} kcal/ngày</div>
        <div><b>Macro</b>: C ${(Math.round((this.userData.targetCalories || 0) * this.getMacroRatio().carbs / 4)).toLocaleString()}g | P ${(Math.round((this.userData.targetCalories || 0) * this.getMacroRatio().protein / 4)).toLocaleString()}g | F ${(Math.round((this.userData.targetCalories || 0) * this.getMacroRatio().fat / 9)).toLocaleString()}g</div>
      </div>
    `;
  },

  async requestAiAdvice() {
    const status = document.getElementById("aiAdviceStatus");
    const out = document.getElementById("aiAdviceResult");
    const applyBtn = document.getElementById("applyAiPlanBtn");
    const ingredientsInput = document.getElementById("aiIngredientsInput");
    const noteInput = document.getElementById("aiNoteInput");

    const ingredientsRaw = String(ingredientsInput?.value || "");
    const ingredients = this.tokenizeIngredients(ingredientsRaw);
    const note = String(noteInput?.value || "").trim();

    if (!this.userData?.bmi || !this.userData?.targetCalories) {
      if (status) status.textContent = "Bạn cần cập nhật BMI/TDEE trước khi tạo thực đơn AI.";
      return;
    }
    if (ingredients.length === 0) {
      if (status) status.textContent = "Bạn cần nhập ít nhất 1 nguyên liệu cho cả tuần.";
      return;
    }

    if (status) status.textContent = "Đang gọi AI để tối ưu thực đơn 7 ngày...";
    if (out) out.innerHTML = "";
    if (applyBtn) applyBtn.style.display = "none";

    try {
      const res = await fetch("/api/ai/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientsRaw,
          ingredients,
          note,
          profile: {
            gender: this.userData.gender,
            age: this.userData.age,
            height: this.userData.height,
            weight: this.userData.weight,
            activityLevel: this.userData.activityLevel,
            bmi: this.userData.bmi,
            bmiCategory: this.userData.bmiCategory,
            bmr: this.userData.bmr,
            tdee: this.userData.tdee,
            targetCalories: this.userData.targetCalories,
            goal: this.userData.goal,
            mealsPerDay: Number(this.userData.mealsPerDay || 3),
            dietaryPreferences: this.userData.dietaryPreferences || "",
            allergyNotes: this.userData.allergyNotes || "",
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (status) status.textContent = data?.error || "Không thể lấy tư vấn AI.";
        if (data?.raw && out) {
          out.innerHTML = `<pre style="white-space: pre-wrap; font-size: 0.9rem;">${String(data.raw)}</pre>`;
        }
        return;
      }

      this.aiLastWeekPlan = data?.weekPlan || null;
      if (status) status.textContent = "Đã nhận thực đơn AI.";
      if (out) out.innerHTML = this.renderAiAdvice(data);
      if (applyBtn && this.aiLastWeekPlan) applyBtn.style.display = "inline-flex";
      await this.loadAiHistory();
    } catch (err) {
      console.error("AI advice error:", err);
      if (status) status.textContent = "Lỗi mạng khi gọi AI.";
    }
  },

  async loadAiHistory() {
    const listEl = document.getElementById("aiHistoryList");
    if (!listEl) return;
    if (!this.isLoggedIn) {
      this.aiHistory = [];
      this.renderAiHistoryList();
      return;
    }
    try {
      const res = await fetch("/api/ai/history");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Không tải được lịch sử AI");
      this.aiHistory = Array.isArray(data?.history) ? data.history.slice(0, 10) : [];
    } catch (err) {
      console.warn("loadAiHistory error:", err);
      this.aiHistory = [];
    }
    this.renderAiHistoryList();
  },

  renderAiHistoryList() {
    const listEl = document.getElementById("aiHistoryList");
    if (!listEl) return;
    if (!this.isLoggedIn) {
      listEl.innerHTML = `<div class="ai-history-empty">Đăng nhập để lưu và xem lịch sử gợi ý AI.</div>`;
      return;
    }
    if (!this.aiHistory.length) {
      listEl.innerHTML = `<div class="ai-history-empty">Chưa có lịch sử gợi ý AI.</div>`;
      return;
    }
    listEl.innerHTML = this.aiHistory
      .map((item, idx) => {
        const created = item?.createdAt ? new Date(item.createdAt) : null;
        const dateText = created && !Number.isNaN(created.getTime())
          ? created.toLocaleString("vi-VN")
          : "Không rõ thời gian";
        const source = String(item?.source || "ai");
        const ingredientsRaw = String(item?.ingredientsRaw || "").replace(/\s+/g, " ").trim();
        const preview = ingredientsRaw ? ingredientsRaw.slice(0, 80) : "Không có ghi chú nguyên liệu";
        return `
          <button class="ai-history-item" onclick="openAiHistoryItem(${idx})" type="button">
            <span class="ai-history-top">${dateText} · ${source}</span>
            <span class="ai-history-preview">${preview}${ingredientsRaw.length > 80 ? "..." : ""}</span>
          </button>
        `;
      })
      .join("");
  },

  openAiHistoryItem(index) {
    const item = this.aiHistory?.[index];
    if (!item?.result) return;
    const result = item.result;
    this.aiLastWeekPlan = result?.weekPlan || null;
    const out = document.getElementById("aiAdviceResult");
    const status = document.getElementById("aiAdviceStatus");
    const applyBtn = document.getElementById("applyAiPlanBtn");
    if (out) out.innerHTML = this.renderAiAdvice(result);
    if (status) status.textContent = "Đã mở lại một gợi ý từ lịch sử.";
    if (applyBtn && this.aiLastWeekPlan) applyBtn.style.display = "inline-flex";
  },

  renderAiAdvice(data) {
    const tips = Array.isArray(data?.bmiSummary?.tips) ? data.bmiSummary.tips : [];
    const category = data?.bmiSummary?.category || "--";
    const targetCalories = Number(data?.bmiSummary?.targetCalories || this.userData?.targetCalories || 0);
    const weekPlan = data?.weekPlan || {};
    const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const shopping = Array.isArray(data?.shoppingSuggestions) ? data.shoppingSuggestions : [];
    const notes = Array.isArray(data?.notes) ? data.notes : [];

    const previewRows = daysOrder
      .map((day) => {
        const d = weekPlan?.[day];
        if (!d) return "";
        const breakfast = this.getFoodNameFromAiSlot(d?.breakfast);
        const lunch = this.getFoodNameFromAiSlot(d?.lunch);
        const dinner = this.getFoodNameFromAiSlot(d?.dinner);
        const kcal = Number(d?.totalCalories || 0);
        return `<tr>
          <td style="padding:6px; border-bottom:1px solid rgba(0,0,0,0.06);">${this.dayNames[day]}</td>
          <td style="padding:6px; border-bottom:1px solid rgba(0,0,0,0.06);">${breakfast}</td>
          <td style="padding:6px; border-bottom:1px solid rgba(0,0,0,0.06);">${lunch}</td>
          <td style="padding:6px; border-bottom:1px solid rgba(0,0,0,0.06);">${dinner}</td>
          <td style="padding:6px; border-bottom:1px solid rgba(0,0,0,0.06); text-align:right;">${kcal ? kcal.toLocaleString() : "--"}</td>
        </tr>`;
      })
      .join("");

    return `
      <div style="display:grid; gap: 12px;">
        <div>
          <div style="font-weight: 800;">BMI: ${category} | Mục tiêu: ${targetCalories.toLocaleString()} kcal/ngày</div>
          <ul style="margin: 6px 0 0; padding-left: 18px;">
            ${tips.map((t) => `<li>${t}</li>`).join("")}
          </ul>
        </div>
        <div style="overflow:auto;">
          <table style="width:100%; border-collapse: collapse; font-size: 0.92rem;">
            <thead>
              <tr>
                <th style="text-align:left; padding:6px;">Ngày</th>
                <th style="text-align:left; padding:6px;">Sáng</th>
                <th style="text-align:left; padding:6px;">Trưa</th>
                <th style="text-align:left; padding:6px;">Tối</th>
                <th style="text-align:right; padding:6px;">Kcal/ngày</th>
              </tr>
            </thead>
            <tbody>${previewRows}</tbody>
          </table>
        </div>
        <div>
          <div style="font-weight: 700; margin-bottom: 6px;">Nguyên liệu cần mua thêm (nếu thiếu)</div>
          <ul style="margin: 0; padding-left: 18px;">
            ${(shopping.length ? shopping : ["Không cần mua thêm nhiều, đã ưu tiên nguyên liệu sẵn có."])
              .map((s) => `<li>${s}</li>`)
              .join("")}
          </ul>
        </div>
        ${
          notes.length
            ? `<div><div style="font-weight:700; margin-bottom:6px;">Lưu ý từ AI</div><ul style="margin:0; padding-left:18px;">${notes
                .map((n) => `<li>${n}</li>`)
                .join("")}</ul></div>`
            : ""
        }
        <div style="font-size: 0.9rem; color: var(--text-muted);">
          Lưu ý: gợi ý mang tính tham khảo, không thay thế tư vấn y khoa.
        </div>
      </div>
    `;
  },

  getFoodNameFromAiSlot(slot) {
    const id = Number(slot?.foodId);
    if (!Number.isFinite(id)) return "—";
    const food = this.foodDatabase.find((f) => Number(f.id) === id);
    return food?.name || `Món #${id}`;
  },

  pickFoodForSlotFallback(mealKey, usedIds = new Map(), dayIndex = 0) {
    const pool = this.foodDatabase.filter((f) => !f.meal || f.meal === mealKey || f.meal === "any");
    if (!pool.length) return null;
    const scored = pool
      .map((f) => ({ food: f, used: usedIds.get(f.id) || 0 }))
      .sort((a, b) => a.used - b.used || a.food.id - b.food.id);
    const picked = scored[dayIndex % scored.length]?.food || scored[0].food;
    usedIds.set(picked.id, (usedIds.get(picked.id) || 0) + 1);
    return picked;
  },

  inferCategoryFromMacros(macros = {}) {
    const c = Number(macros?.carbs || 0);
    const p = Number(macros?.protein || 0);
    const f = Number(macros?.fat || 0);
    if (p >= c && p >= f) return "protein";
    if (c >= p && c >= f) return "carbs";
    if (f >= c && f >= p) return "fat";
    return "balanced";
  },

  applyAiPlanToCurrentWeek() {
    if (!this.aiLastWeekPlan) {
      this.showToast("Chưa có dữ liệu thực đơn AI để áp dụng.");
      return;
    }
    this.initializeMealPlan();
    const weekKey = `week${this.currentWeek}`;
    const usedIds = new Map();
    this.days.forEach((day, dayIndex) => {
      const dayPlan = this.aiLastWeekPlan?.[day];
      if (!dayPlan) {
        this.meals.forEach((mealKey, mealIndex) => {
          const fallbackFood = this.pickFoodForSlotFallback(mealKey, usedIds, dayIndex + mealIndex);
          if (fallbackFood) this.mealPlan[weekKey][day][mealKey] = { ...fallbackFood, isAiGenerated: true };
        });
        return;
      }
      this.meals.forEach((mealKey) => {
        const mealData = dayPlan?.[mealKey];
        const foodId = Number(mealData?.foodId);
        const matchedFood = this.foodDatabase.find((f) => Number(f.id) === foodId);
        const fallbackFood = this.pickFoodForSlotFallback(mealKey, usedIds, dayIndex);
        const chosen = matchedFood || fallbackFood;
        if (!chosen) return;
        usedIds.set(chosen.id, (usedIds.get(chosen.id) || 0) + 1);
        this.mealPlan[weekKey][day][mealKey] = { ...chosen, isAiGenerated: true };
      });
    });

    this.updateFoodUsageCount();
    this.renderCalendar();
    this.checkNutritionBalance();
    this.saveData();
    this.closeAiModal();
    this.showToast("Đã áp dụng thực đơn AI vào tuần hiện tại.");
  },

  // ===== SETTINGS MODAL HANDLING (MỚI) =====
  openSettingsModal() {
    const modal = document.getElementById("settingsModal");
    if (modal) {
      modal.style.display = "flex";
      // Thêm timeout nhỏ để CSS transition hoạt động nếu có
      setTimeout(() => modal.classList.add("show"), 10);
    }
  },

  closeSettingsModal() {
    const modal = document.getElementById("settingsModal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  },
  showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.querySelector(".toast-message");
    
    if (toast && toastMsg) {
        if(message) toastMsg.textContent = message;
        
        toast.classList.add("show");
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
  },

  openWarningModal() {
    const modal = document.getElementById("warningModal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("show"), 10);
    }
  },

  closeWarningModal() {
    const modal = document.getElementById("warningModal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  },

  confirmOpenSettings() {
    this.closeWarningModal();
    // Đợi modal cảnh báo đóng xong thì mở modal cài đặt
    setTimeout(() => {
        this.openSettingsModal();
    }, 300);
  },

  // ===== GENDER SELECTION =====
  selectGender(gender) {
    this.userData.gender = gender;
    document.querySelectorAll(".gender-option").forEach((el) => {
      el.classList.toggle("selected", el.dataset.gender === gender);
    });
  },

  // ===== ACTIVITY SELECTION =====
  selectActivity(level) {
    this.userData.activityLevel = level;
    document.querySelectorAll(".activity-option").forEach((el) => {
      el.classList.toggle("selected", el.dataset.level === level);
    });
  },

  // ===== BMI CALCULATION =====
  /**
   * Phân loại BMI theo chuẩn WHO cho người châu Á
   * < 16        : Gầy độ III (nguy hiểm)
   * 16 - <17    : Gầy độ II
   * 17 - <18.5  : Gầy độ I
   * 18.5 - <23  : Bình thường (chuẩn Á Đông)
   * 23 - <25    : Tiền béo phì / Thừa cân nhẹ
   * 25 - <30    : Thừa cân
   * 30 - <35    : Béo phì độ I
   * 35 - <40    : Béo phì độ II
   * ≥ 40        : Béo phì độ III
   */
  classifyBMI(bmi) {
    const b = parseFloat(bmi);
    if (b < 16) return { category: "Gầy độ III (nguy hiểm)", goal: "gain-strong" };
    if (b < 17) return { category: "Gầy độ II", goal: "gain-strong" };
    if (b < 18.5) return { category: "Gầy độ I", goal: "gain" };
    if (b < 23) return { category: "Bình thường", goal: "maintain" };
    if (b < 25) return { category: "Thừa cân nhẹ", goal: "lose-light" };
    if (b < 30) return { category: "Thừa cân", goal: "lose" };
    if (b < 35) return { category: "Béo phì độ I", goal: "lose-strong" };
    if (b < 40) return { category: "Béo phì độ II", goal: "lose-strong" };
    return { category: "Béo phì độ III", goal: "lose-strong" };
  },

  /**
   * Tính calo mục tiêu theo TDEE + mục tiêu BMI.
   * Có enforce ngưỡng an toàn tối thiểu:
   *   - Nam: tối thiểu 1500 kcal
   *   - Nữ : tối thiểu 1200 kcal
   */
  computeTargetCalories(tdee, goal, gender) {
    let target = tdee;
    switch (goal) {
      case "gain-strong": target = tdee + 500; break;
      case "gain":        target = tdee + 300; break;
      case "maintain":    target = tdee;        break;
      case "lose-light":  target = tdee - 300;  break;
      case "lose":        target = tdee - 500;  break;
      case "lose-strong": target = tdee - 700;  break;
    }
    const safeMin = gender === "male" ? 1500 : 1200;
    if (target < safeMin) target = safeMin;
    return Math.round(target);
  },

  calculateBMI() {
    const ageInput = document.getElementById("age");
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const mealsPerDayInput = document.getElementById("mealsPerDay");
    const dietaryInput = document.getElementById("dietaryPreferences");
    const allergyInput = document.getElementById("allergyNotes");

    const age = parseInt(ageInput.value, 10);
    const height = parseInt(heightInput.value, 10);
    const weight = parseFloat(weightInput.value);

    if (
      !this.userData.gender ||
      !this.userData.activityLevel ||
      !age || age < 10 || age > 100 ||
      !height || height < 100 || height > 250 ||
      !weight || weight < 30 || weight > 300
    ) {
      this.openWarningModal();
      return;
    }

    this.userData.age = age;
    this.userData.height = height;
    this.userData.weight = weight;
    this.userData.mealsPerDay = Number(mealsPerDayInput?.value || 3);
    this.userData.dietaryPreferences = String(dietaryInput?.value || "").trim().slice(0, 200);
    this.userData.allergyNotes = String(allergyInput?.value || "").trim().slice(0, 200);

    // 1) BMI
    const heightInMeters = height / 100;
    const bmiNum = weight / (heightInMeters * heightInMeters);
    const bmi = bmiNum.toFixed(1);
    this.userData.bmi = bmi;

    // 2) Phân loại BMI + xác định mục tiêu
    const { category, goal } = this.classifyBMI(bmi);
    this.userData.bmiCategory = category;
    this.userData.goal = goal;

    // 3) BMR (Mifflin-St Jeor)
    let bmr = 0;
    if (this.userData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    bmr = Math.round(bmr);
    this.userData.bmr = bmr;

    // 4) TDEE
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
    const multiplier = activityMultipliers[this.userData.activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);
    this.userData.tdee = tdee;

    // 5) Target calories THEO BMI (không phải luôn luôn -10% như trước)
    const targetCalories = this.computeTargetCalories(tdee, goal, this.userData.gender);
    this.userData.targetCalories = targetCalories;

    // 6) Hiển thị
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };
    set("bmiValue", bmi);
    set("bmiCategory", category);
    set("bmrValue", bmr.toLocaleString());
    set("tdeeValue", tdee.toLocaleString());
    set("targetCalories", targetCalories.toLocaleString());

    const resultCard = document.getElementById("bmiResult");
    if (resultCard) {
      resultCard.style.display = "flex";
      resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    this.updateNutritionTargets();
    this.renderAiProfileSummary();
    this.saveData();
    this.closeSettingsModal();
    this.showToast(
      `BMI ${bmi} (${category}) – Mục tiêu ${targetCalories.toLocaleString()} kcal/ngày`
    );
  },

  displayBMIResult() {
    if (!this.userData.bmi) return;

    // Tính lại category nếu thiếu (phòng khi load từ localStorage cũ)
    if (!this.userData.bmiCategory) {
      const { category, goal } = this.classifyBMI(this.userData.bmi);
      this.userData.bmiCategory = category;
      if (!this.userData.goal) this.userData.goal = goal;
    }

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set("bmiValue", this.userData.bmi);
    set("bmiCategory", this.userData.bmiCategory);
    set("tdeeValue", this.userData.tdee ? this.userData.tdee.toLocaleString() : 0);
    set(
      "targetCalories",
      this.userData.targetCalories ? this.userData.targetCalories.toLocaleString() : 0
    );

    // BMR: tính lại từ userData nếu chưa có
    let bmr = this.userData.bmr;
    if (!bmr && this.userData.weight && this.userData.height && this.userData.age && this.userData.gender) {
      bmr =
        this.userData.gender === "male"
          ? 10 * this.userData.weight + 6.25 * this.userData.height - 5 * this.userData.age + 5
          : 10 * this.userData.weight + 6.25 * this.userData.height - 5 * this.userData.age - 161;
      bmr = Math.round(bmr);
      this.userData.bmr = bmr;
    }
    if (bmr) set("bmrValue", bmr.toLocaleString());

    const resultCard = document.getElementById("bmiResult");
    if (resultCard) resultCard.style.display = "flex";
    this.renderAiProfileSummary();
  },

  /**
   * Phân bổ macro theo mục tiêu BMI (phần trăm calo):
   *   - Giảm cân : protein cao (30%), carb thấp (40%), fat 30% – no đủ, giữ cơ
   *   - Duy trì  : cân bằng 50 / 25 / 25
   *   - Tăng cân : carb cao (55%) để đủ năng lượng, protein 25%, fat 20%
   */
  getMacroRatio() {
    const goal = this.userData.goal || "maintain";
    if (goal.startsWith("lose")) return { carbs: 0.4, protein: 0.3, fat: 0.3 };
    if (goal.startsWith("gain")) return { carbs: 0.55, protein: 0.25, fat: 0.2 };
    return { carbs: 0.5, protein: 0.25, fat: 0.25 };
  },

  updateNutritionTargets() {
    const calories = this.userData.targetCalories;
    if (!calories) return;
    const ratio = this.getMacroRatio();
    const carbs = Math.round((calories * ratio.carbs) / 4);
    const protein = Math.round((calories * ratio.protein) / 4);
    const fat = Math.round((calories * ratio.fat) / 9);
    const fiber = 25;

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setText("totalCarbs", carbs);
    setText("totalProtein", protein);
    setText("totalFat", fat);
    setText("totalFiber", fiber);
  },

  // ===== CALENDAR RENDERING =====
  renderCalendar() {
    const grid = document.getElementById("daysGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(
      today.getDate() - today.getDay() + 1 + (this.currentWeek - 1) * 7
    );

    this.days.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      const dayCol = document.createElement("div");
      dayCol.className = "day-column";
      dayCol.innerHTML = `
                <div class="day-header">
                    <div class="day-name">${this.dayNames[day]}</div>
                    <div class="day-date">${date.getDate()}/${
        date.getMonth() + 1
      }</div>
                </div>
                <div class="meal-slots">
                    ${this.meals
                      .map(
                        (meal) => `
                        <div class="meal-slot ${
                          this.mealPlan[`week${this.currentWeek}`]?.[day]?.[
                            meal
                          ]
                            ? "has-meal"
                            : ""
                        }" 
                             onclick="openFoodModal('${day}', '${meal}')"
                             data-day="${day}" data-meal="${meal}">
                            <div class="meal-slot-label">${
                              this.mealNames[meal]
                            }</div>
                            ${this.renderMealContent(day, meal)}
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
      grid.appendChild(dayCol);
    });
  },

  renderMealContent(day, meal) {
    const mealData = this.mealPlan[`week${this.currentWeek}`]?.[day]?.[meal];

    if (mealData) {
      // Lưu ý: mealData.name phải khớp với tên key trong recipesDB
      const mealNameEncoded = encodeURIComponent(String(mealData.name || ""));
      const detailButton = `<button
        class="detail-meal-btn"
        type="button"
        onclick="event.preventDefault(); event.stopPropagation(); showRecipeDetails(decodeURIComponent('${mealNameEncoded}'))"
        title="Xem công thức"
      >🔍</button>`;
      return `
                <div class="meal-slot-content">
                    <span class="meal-emoji">${mealData.emoji || '🥘'}</span>
                    <div>
                        <div class="meal-name" style="font-weight:600; font-size: 0.9rem;">${mealData.name}</div>
                        <div class="meal-calories" style="font-size: 0.8rem; color: var(--text-muted);">${mealData.calories} kcal</div>
                    </div>
                </div>
                
                <div class="meal-actions" style="display: flex; gap: 5px;">
                    ${detailButton}

                    <button class="remove-meal-btn" 
                            onclick="event.stopPropagation(); removeMeal('${day}', '${meal}')"
                            title="Xóa món">
                        ✕
                    </button>
                </div>
            `;
    }

    return `<div class="add-meal-icon" style="font-size: 1.5rem; color: var(--text-muted);">+</div>`;
  },

  // ===== FOOD MODAL HANDLING =====
  openFoodModal(day, meal) {
    this.currentSelectedSlot = { day, meal };
    document.getElementById(
      "modalTitle"
    ).textContent = `Chọn món ăn - Bữa ${this.mealNames[meal]} - ${this.dayNames[day]}`;
    this.renderFoodGrid("all");

    // --- SỬA ĐOẠN NÀY ---
    const modal = document.getElementById("foodModal");
    if (modal) {
      modal.style.display = "flex"; // Bật hiển thị trước
      setTimeout(() => {
        modal.classList.add("show"); // Thêm class để chạy animation opacity
      }, 10);
    }
  },

  closeModal() {
    // --- SỬA ĐOẠN NÀY ---
    const modal = document.getElementById("foodModal");
    if (modal) {
      modal.classList.remove("show"); // Tắt animation trước
      this.currentSelectedSlot = null;

      // Đợi 300ms cho transition chạy xong rồi mới ẩn hoàn toàn
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  },

  // ===== FILTER & GRID =====
  filterFood(category) {
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.toggle(
        "active",
        tab.textContent.toLowerCase().includes(category) ||
          (category === "all" && tab.textContent === "Tất cả")
      );
    });
    this.renderFoodGrid(category);
  },

  updateFoodUsageCount() {
    this.foodUsageCount = {};
    const weekData = this.mealPlan[`week${this.currentWeek}`];
    if (!weekData) return;
    this.days.forEach((day) => {
      this.meals.forEach((meal) => {
        const mealData = weekData[day]?.[meal];
        if (mealData)
          this.foodUsageCount[mealData.id] =
            (this.foodUsageCount[mealData.id] || 0) + 1;
      });
    });
  },

  renderFoodGrid(category) {
    const grid = document.getElementById("foodGrid");
    if (!grid) return;

    let foods = this.foodDatabase;

    // Filter by category
    if (category !== "all") {
      foods = foods.filter((f) => f.category === category);
    }

    grid.innerHTML = foods
      .map((food) => {
        const usageCount = this.foodUsageCount[food.id] || 0;
        const isDisabled = usageCount >= 2; // Max 2 times per week
        const isUsedPrevWeek = this.previousWeekFoods.includes(food.id);

        return `
                <div class="food-item ${isDisabled ? "disabled" : ""}" 
                     onclick="${isDisabled ? "" : `selectFood(${food.id})`}">
                    ${
                      usageCount > 0
                        ? `<span class="usage-badge">${usageCount}</span>`
                        : ""
                    }
                    <div class="food-item-header">
                        <span class="food-item-emoji">${food.emoji}</span>
                        <span class="food-item-name">${food.name}</span>
                    </div>
                    <div class="food-item-meta">
                        <span class="food-item-calories">${
                          food.calories
                        } kcal</span>
                        ${
                          isUsedPrevWeek
                            ? '<span style="color:#ff9800">⚠️ Tuần trước</span>'
                            : ""
                        }
                    </div>
                    <div class="food-item-nutrients">
                        <span class="nutrient-badge carbs">C: ${
                          food.carbs
                        }g</span>
                        <span class="nutrient-badge protein">P: ${
                          food.protein
                        }g</span>
                        <span class="nutrient-badge fat">F: ${food.fat}g</span>
                    </div>
                </div>
            `;
      })
      .join("");
  },

  // ===== FOOD SELECTION =====
  selectFood(foodId) {
    const food = this.foodDatabase.find((f) => f.id === foodId);
    if (!food || !this.currentSelectedSlot) return;
    const { day, meal } = this.currentSelectedSlot;
    if (!this.mealPlan[`week${this.currentWeek}`]) this.initializeMealPlan();

    this.mealPlan[`week${this.currentWeek}`][day][meal] = { ...food };
    this.updateFoodUsageCount();
    this.renderCalendar();
    this.checkNutritionBalance();
    this.saveData();
    this.closeModal();
  },

  removeMeal(day, meal) {
    if (this.mealPlan[`week${this.currentWeek}`]?.[day]) {
      this.mealPlan[`week${this.currentWeek}`][day][meal] = null;
      this.updateFoodUsageCount();
      this.renderCalendar();
      this.checkNutritionBalance();
      this.saveData();
    }
  },

  checkNutritionBalance() {
    const weekData = this.mealPlan[`week${this.currentWeek}`];
    if (!weekData) return;
    let categories = { carbs: 0, protein: 0, fat: 0, fiber: 0, balanced: 0 };
    let totalMeals = 0;

    this.days.forEach((day) => {
      this.meals.forEach((meal) => {
        const mealData = weekData[day]?.[meal];
        if (mealData) {
          categories[mealData.category]++;
          totalMeals++;
        }
      });
    });

    const warning = document.getElementById("nutritionWarning");
    const warningText = document.getElementById("warningText");

    if (totalMeals < 7) {
      warning.classList.add("hidden");
      return;
    }
    const threshold = totalMeals * 0.6;
    let isImbalanced = false;
    let imbalanceType = "";

    if (categories.carbs > threshold) {
      isImbalanced = true;
      imbalanceType = "Quá nhiều tinh bột! Hãy thêm rau xanh và protein.";
    } else if (categories.protein > threshold) {
      isImbalanced = true;
      imbalanceType = "Quá nhiều đạm! Hãy thêm rau xanh và tinh bột.";
    } else if (categories.fiber > threshold) {
      isImbalanced = true;
      imbalanceType = "Quá nhiều chất xơ! Hãy thêm protein và tinh bột.";
    } else if (categories.fat > threshold) {
      isImbalanced = true;
      imbalanceType = "Quá nhiều chất béo! Hãy cân bằng lại thực đơn.";
    }

    if (isImbalanced) {
      warning.classList.remove("hidden");
      warningText.textContent = imbalanceType;
    } else {
      warning.classList.add("hidden");
    }
  },

  // ===== AUTO GENERATE =====
  /**
   * Lấy ngẫu nhiên 1 phần tử trong mảng (có trọng số nghiêng về món gần calo mục tiêu)
   */
  _pickClosestCalorie(foods, targetKcal, excludeIds = new Set()) {
    const available = foods.filter((f) => !excludeIds.has(f.id));
    if (available.length === 0) return null;

    // Sắp xếp theo độ lệch so với target, lấy 6 món gần nhất rồi random 1
    const sorted = [...available].sort(
      (a, b) => Math.abs(a.calories - targetKcal) - Math.abs(b.calories - targetKcal)
    );
    const pool = sorted.slice(0, Math.min(6, sorted.length));
    return pool[Math.floor(Math.random() * pool.length)];
  },

  /**
   * Sinh thực đơn tuần tự động sao cho:
   *  - Tổng calo/ngày ≈ target (±12%)
   *  - Mỗi món dùng tối đa 2 lần/tuần
   *  - Ưu tiên món không trùng tuần trước
   *  - Phân bổ bữa: Sáng 25%, Trưa 40%, Tối 35%
   */
  autoGenerateMealsLocal() {
    if (!this.userData.targetCalories) {
      this.openWarningModal();
      return;
    }

    this.initializeMealPlan();

    const target = this.userData.targetCalories;
    const mealRatio = { breakfast: 0.25, lunch: 0.4, dinner: 0.35 };

    const prevWeekUsed = new Set(this.previousWeekFoods);
    const weeklyUsage = {};
    const bucket = (mealKey) =>
      this.foodDatabase.filter((f) => !f.meal || f.meal === mealKey);

    this.days.forEach((day) => {
      const usedCategoriesToday = new Set();
      let dayTotal = 0;

      this.meals.forEach((mealKey, idx) => {
        const mealTargetKcal = target * mealRatio[mealKey];

        // Ứng viên: đúng bữa, chưa dùng quá 2 lần, ưu tiên không trùng tuần trước
        let candidates = bucket(mealKey).filter((f) => {
          const usage = weeklyUsage[f.id] || 0;
          return usage < 2;
        });
        if (candidates.length === 0) candidates = [...this.foodDatabase];

        // Ưu tiên món KHÁC tuần trước + KHÁC category đã dùng trong ngày
        let pool = candidates.filter(
          (f) => !prevWeekUsed.has(f.id) && !usedCategoriesToday.has(f.category)
        );
        if (pool.length === 0) {
          pool = candidates.filter((f) => !usedCategoriesToday.has(f.category));
        }
        if (pool.length === 0) pool = candidates;

        // Ở bữa cuối, điều chỉnh target để tổng ngày gần target nhất
        let pickTarget = mealTargetKcal;
        if (idx === this.meals.length - 1) {
          pickTarget = target - dayTotal;
        }

        const picked = this._pickClosestCalorie(pool, pickTarget);
        if (!picked) return;

        this.mealPlan[`week${this.currentWeek}`][day][mealKey] = { ...picked };
        weeklyUsage[picked.id] = (weeklyUsage[picked.id] || 0) + 1;
        usedCategoriesToday.add(picked.category);
        dayTotal += picked.calories;
      });
    });

    this.updateFoodUsageCount();
    this.renderCalendar();
    this.checkNutritionBalance();
    this.saveData();
    this.showToast(
      `Đã tạo thực đơn tuần theo mục tiêu ${target.toLocaleString()} kcal/ngày`
    );
  },

  async autoGenerateMealsWithAI() {
    if (!this.userData.targetCalories || !this.userData.bmi) {
      this.openWarningModal();
      return;
    }
    this.openAiModal();
    await this.requestAiAdvice();
  },

  async autoGenerateMeals() {
    try {
      await this.autoGenerateMealsWithAI();
    } catch (err) {
      console.warn("AI planner failed, fallback local:", err);
      this.autoGenerateMealsLocal();
    }
  },

  // ===== WEEK NAVIGATION =====
  previousWeek() {
    if (this.currentWeek > 1) {
      this.storePreviousWeekFoods();
      this.currentWeek--;
      document.getElementById(
        "currentWeek"
      ).textContent = `Tuần ${this.currentWeek}`;
      this.initializeMealPlan();
      this.renderCalendar();
      this.saveData();
    }
  },

  nextWeek() {
    this.storePreviousWeekFoods();
    this.currentWeek++;
    document.getElementById(
      "currentWeek"
    ).textContent = `Tuần ${this.currentWeek}`;
    this.initializeMealPlan();
    this.renderCalendar();
    this.saveData();
  },

  storePreviousWeekFoods() {
    const weekData = this.mealPlan[`week${this.currentWeek}`];
    if (!weekData) return;
    this.previousWeekFoods = [];
    this.days.forEach((day) => {
      this.meals.forEach((meal) => {
        const mealData = weekData[day]?.[meal];
        if (mealData && !this.previousWeekFoods.includes(mealData.id)) {
          this.previousWeekFoods.push(mealData.id);
        }
      });
    });
  },
};

// ===== THEME MANAGEMENT =====
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
})();

// ===== GLOBAL FUNCTION EXPORTS =====
// Cập nhật thêm các hàm mới vào Window để HTML gọi được
window.openSettingsModal = () => MealPlanner.openSettingsModal();
window.closeSettingsModal = () => MealPlanner.closeSettingsModal();

window.selectGender = (gender) => MealPlanner.selectGender(gender);
window.selectActivity = (level) => MealPlanner.selectActivity(level);
window.calculateBMI = () => MealPlanner.calculateBMI();
window.openFoodModal = (day, meal) => MealPlanner.openFoodModal(day, meal);
window.closeModal = () => MealPlanner.closeModal();
window.filterFood = (category) => MealPlanner.filterFood(category);
window.selectFood = (id) => MealPlanner.selectFood(id);
window.removeMeal = (day, meal) => MealPlanner.removeMeal(day, meal);
window.autoGenerateMeals = () => MealPlanner.autoGenerateMeals();
window.previousWeek = () => MealPlanner.previousWeek();
window.nextWeek = () => MealPlanner.nextWeek();
window.toggleTheme = toggleTheme;
window.openWarningModal = () => MealPlanner.openWarningModal();
window.closeWarningModal = () => MealPlanner.closeWarningModal();
window.confirmOpenSettings = () => MealPlanner.confirmOpenSettings();
window.openAiModal = () => MealPlanner.openAiModal();
window.closeAiModal = () => MealPlanner.closeAiModal();
window.requestAiAdvice = () => MealPlanner.requestAiAdvice();
window.applyAiPlanToCurrentWeek = () => MealPlanner.applyAiPlanToCurrentWeek();
window.openAiHistoryItem = (index) => MealPlanner.openAiHistoryItem(index);

document.addEventListener("DOMContentLoaded", () => {
  MealPlanner.init();
});

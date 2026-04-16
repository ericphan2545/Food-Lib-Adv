// Copied from NutriPlan/public/js/meal-planner.js (plain script)
/**
 * Meal Planner - Quản lý lập thực đơn tuần
 * NutriPlan Application
 */
const MealPlanner = {
  userData: {
    gender: null,
    age: null,
    height: null,
    weight: null,
    activityLevel: null,
    bmi: null,
    tdee: null,
    targetCalories: null,
  },
  saveData() {
    const dataToSave = {
      userData: this.userData,
      mealPlan: this.mealPlan,
      currentWeek: this.currentWeek,
      previousWeekFoods: this.previousWeekFoods
    };
    localStorage.setItem('nutriPlanData', JSON.stringify(dataToSave));
  },
  loadData() {
    const savedData = localStorage.getItem('nutriPlanData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.userData = parsedData.userData || this.userData;
      this.mealPlan = parsedData.mealPlan || {};
      this.currentWeek = parsedData.currentWeek || 1;
      this.previousWeekFoods = parsedData.previousWeekFoods || [];
      const weekDisplay = document.getElementById("currentWeek");
      if (weekDisplay) weekDisplay.textContent = `Tuần ${this.currentWeek}`;
      if (this.userData.bmi) {
        const ageEl = document.getElementById("age");
        const heightEl = document.getElementById("height");
        const weightEl = document.getElementById("weight");
        if (ageEl) ageEl.value = this.userData.age || '';
        if (heightEl) heightEl.value = this.userData.height || '';
        if (weightEl) weightEl.value = this.userData.weight || '';
        this.selectGender(this.userData.gender);
        this.selectActivity(this.userData.activityLevel);
        this.displayBMIResult();
        this.updateNutritionTargets();
      }
    }
  },
  currentWeek: 1,
  mealPlan: {},
  foodUsageCount: {},
  previousWeekFoods: [],
  currentSelectedSlot: null,
  days: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
  dayNames: { monday:"Thứ 2", tuesday:"Thứ 3", wednesday:"Thứ 4", thursday:"Thứ 5", friday:"Thứ 6", saturday:"Thứ 7", sunday:"CN" },
  meals: ["breakfast","lunch","dinner"],
  mealNames: { breakfast:"Sáng", lunch:"Trưa", dinner:"Tối" },
  get foodDatabase() { return typeof FOOD_DATABASE !== 'undefined' ? FOOD_DATABASE : []; },
  init() {
    this.loadData();
    this.initializeMealPlan();
    this.renderCalendar();
    this.bindEvents();
    this.checkNutritionBalance();
  },
  initializeMealPlan() {
    if (!this.mealPlan[`week${this.currentWeek}`]) {
      this.mealPlan[`week${this.currentWeek}`] = {};
      this.days.forEach((day) => {
        this.mealPlan[`week${this.currentWeek}`][day] = { breakfast: null, lunch: null, dinner: null };
      });
    }
    this.updateFoodUsageCount();
  },
  bindEvents() {
    const foodModal = document.getElementById("foodModal");
    if (foodModal) {
      foodModal.addEventListener("click", (e) => { if (e.target === foodModal) this.closeModal(); });
    }
    const settingsModal = document.getElementById("settingsModal");
    if (settingsModal) {
      settingsModal.addEventListener("click", (e) => { if (e.target === settingsModal) this.closeSettingsModal(); });
    }
  },
  openSettingsModal() {
    const modal = document.getElementById("settingsModal");
    if (modal) { modal.style.display = "flex"; setTimeout(() => modal.classList.add("show"), 10); }
  },
  closeSettingsModal() {
    const modal = document.getElementById("settingsModal");
    if (modal) { modal.classList.remove("show"); setTimeout(() => (modal.style.display = "none"), 300); }
  },
  showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.querySelector(".toast-message");
    if (toast && toastMsg) {
      if (message) toastMsg.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
  },
  openWarningModal() {
    const modal = document.getElementById("warningModal");
    if (modal) { modal.style.display = "flex"; setTimeout(() => modal.classList.add("show"), 10); }
  },
  closeWarningModal() {
    const modal = document.getElementById("warningModal");
    if (modal) { modal.classList.remove("show"); setTimeout(() => (modal.style.display = "none"), 300); }
  },
  confirmOpenSettings() {
    this.closeWarningModal();
    setTimeout(() => this.openSettingsModal(), 300);
  },
  selectGender(gender) {
    this.userData.gender = gender;
    document.querySelectorAll(".gender-option").forEach((el) => el.classList.toggle("selected", el.dataset.gender === gender));
  },
  selectActivity(level) {
    this.userData.activityLevel = level;
    document.querySelectorAll(".activity-option").forEach((el) => el.classList.toggle("selected", el.dataset.level === level));
  },
  calculateBMI() {
    const age = parseInt(document.getElementById("age")?.value);
    const height = parseInt(document.getElementById("height")?.value);
    const weight = parseInt(document.getElementById("weight")?.value);
    if (!this.userData.gender || !this.userData.activityLevel || !age || !height || !weight) { this.openWarningModal(); return; }
    this.userData.age = age; this.userData.height = height; this.userData.weight = weight;
    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
    this.userData.bmi = bmi;
    let category = "";
    if (bmi < 18.5) category = "Thiếu cân";
    else if (bmi < 24.9) category = "Bình thường";
    else if (bmi < 29.9) category = "Thừa cân";
    else category = "Béo phì";
    let bmr = 0;
    if (this.userData.gender === "male") bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    else bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = Math.round(bmr * (multipliers[this.userData.activityLevel] || 1.2));
    const targetCalories = Math.round(tdee * 0.9);
    this.userData.tdee = tdee;
    this.userData.targetCalories = targetCalories;
    const bmiValueEl = document.getElementById("bmiValue");
    const bmiCategoryEl = document.getElementById("bmiCategory");
    const bmrValueEl = document.getElementById("bmrValue");
    const tdeeValueEl = document.getElementById("tdeeValue");
    const targetCaloriesEl = document.getElementById("targetCalories");
    const resultCard = document.getElementById("bmiResult");
    if (bmiValueEl) bmiValueEl.innerText = bmi;
    if (bmiCategoryEl) bmiCategoryEl.innerText = category;
    if (bmrValueEl) bmrValueEl.innerText = Math.round(bmr).toLocaleString();
    if (tdeeValueEl) tdeeValueEl.innerText = tdee.toLocaleString();
    if (targetCaloriesEl) targetCaloriesEl.innerText = targetCalories.toLocaleString();
    if (resultCard) resultCard.style.display = "flex";
    this.updateNutritionTargets();
    this.saveData();
    this.closeSettingsModal();
    this.showToast("Đã tính toán BMI & Nhu cầu Calo thành công!");
  },
  displayBMIResult() {
    if (!this.userData.bmi) return;
    const bmiValueEl = document.getElementById("bmiValue");
    const tdeeValueEl = document.getElementById("tdeeValue");
    const targetCaloriesEl = document.getElementById("targetCalories");
    if (bmiValueEl) bmiValueEl.textContent = this.userData.bmi;
    if (tdeeValueEl) tdeeValueEl.textContent = (this.userData.tdee || 0).toLocaleString();
    if (targetCaloriesEl) targetCaloriesEl.textContent = (this.userData.targetCalories || 0).toLocaleString();
    const bmi = parseFloat(this.userData.bmi);
    let category = "";
    if (bmi < 18.5) category = "Thiếu cân";
    else if (bmi < 24.9) category = "Bình thường";
    else if (bmi < 29.9) category = "Thừa cân";
    else category = "Béo phì";
    const categoryEl = document.getElementById("bmiCategory");
    if (categoryEl) categoryEl.textContent = category;
    const resultCard = document.getElementById("bmiResult");
    if (resultCard) resultCard.style.display = "flex";
  },
  updateNutritionTargets() {
    const calories = Number(this.userData.targetCalories || 0);
    const carbs = Math.round((calories * 0.5) / 4);
    const protein = Math.round((calories * 0.25) / 4);
    const fat = Math.round((calories * 0.25) / 9);
    const fiber = 25;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("totalCarbs", carbs);
    set("totalProtein", protein);
    set("totalFat", fat);
    set("totalFiber", fiber);
  },
  renderCalendar() {
    const grid = document.getElementById("daysGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (this.currentWeek - 1) * 7);
    this.days.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dayCol = document.createElement("div");
      dayCol.className = "day-column";
      dayCol.innerHTML = `
        <div class="day-header">
          <div class="day-name">${this.dayNames[day]}</div>
          <div class="day-date">${date.getDate()}/${date.getMonth() + 1}</div>
        </div>
        <div class="meal-slots">
          ${this.meals.map((meal) => `
            <div class="meal-slot ${this.mealPlan[\`week${this.currentWeek}\`]?.[day]?.[meal] ? "has-meal" : ""}"
              onclick="openFoodModal('${day}', '${meal}')"
              data-day="${day}" data-meal="${meal}">
              <div class="meal-slot-label">${this.mealNames[meal]}</div>
              ${this.renderMealContent(day, meal)}
            </div>
          `).join("")}
        </div>
      `;
      grid.appendChild(dayCol);
    });
  },
  renderMealContent(day, meal) {
    const mealData = this.mealPlan[`week${this.currentWeek}`]?.[day]?.[meal];
    if (mealData) {
      return `
        <div class="meal-slot-content">
          <span class="meal-emoji">${mealData.emoji || '🥘'}</span>
          <div>
            <div class="meal-name" style="font-weight:600; font-size: 0.7rem;">${mealData.name}</div>
            <div class="meal-calories" style="font-size: 0.8rem; color: var(--text-muted);">${mealData.calories} kcal</div>
          </div>
        </div>
        <div class="meal-actions" style="display: flex; gap: 5px;">
          <button class="detail-meal-btn" type="button"
            onclick="event.preventDefault(); event.stopPropagation(); showRecipeDetails('${mealData.name}')"
            title="Xem công thức">!</button>
          <button class="remove-meal-btn"
            onclick="event.stopPropagation(); removeMeal('${day}', '${meal}')"
            title="Xóa món">✕</button>
        </div>
      `;
    }
    return `<div class="add-meal-icon" style="font-size: 1.5rem; color: var(--text-muted);">+</div>`;
  },
  openFoodModal(day, meal) {
    this.currentSelectedSlot = { day, meal };
    const titleEl = document.getElementById("modalTitle");
    if (titleEl) titleEl.textContent = `Chọn món ăn - Bữa ${this.mealNames[meal]} - ${this.dayNames[day]}`;
    this.renderFoodGrid("all");
    const modal = document.getElementById("foodModal");
    if (modal) { modal.style.display = "flex"; setTimeout(() => modal.classList.add("show"), 10); }
  },
  closeModal() {
    const modal = document.getElementById("foodModal");
    if (modal) {
      modal.classList.remove("show");
      this.currentSelectedSlot = null;
      setTimeout(() => { modal.style.display = "none"; }, 300);
    }
  },
  filterFood(category) {
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.textContent.toLowerCase().includes(category) || (category === "all" && tab.textContent === "Tất cả"));
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
        if (mealData) this.foodUsageCount[mealData.id] = (this.foodUsageCount[mealData.id] || 0) + 1;
      });
    });
  },
  renderFoodGrid(category) {
    const grid = document.getElementById("foodGrid");
    if (!grid) return;
    let foods = this.foodDatabase;
    if (category !== "all") foods = foods.filter((f) => f.category === category);
    grid.innerHTML = foods.map((food) => {
      const usageCount = this.foodUsageCount[food.id] || 0;
      const isDisabled = usageCount >= 2;
      const isUsedPrevWeek = this.previousWeekFoods.includes(food.id);
      return `
        <div class="food-item ${isDisabled ? "disabled" : ""}" onclick="${isDisabled ? "" : `selectFood(${food.id})`}">
          ${usageCount > 0 ? `<span class="usage-badge">${usageCount}</span>` : ""}
          <div class="food-item-header">
            <span class="food-item-emoji">${food.emoji}</span>
            <span class="food-item-name">${food.name}</span>
          </div>
          <div class="food-item-meta">
            <span class="food-item-calories">${food.calories} kcal</span>
            ${isUsedPrevWeek ? '<span style="color:#ff9800">⚠️ Tuần trước</span>' : ""}
          </div>
          <div class="food-item-nutrients">
            <span class="nutrient-badge carbs">C: ${food.carbs}g</span>
            <span class="nutrient-badge protein">P: ${food.protein}g</span>
            <span class="nutrient-badge fat">F: ${food.fat}g</span>
          </div>
        </div>
      `;
    }).join("");
  },
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
        if (mealData) { categories[mealData.category]++; totalMeals++; }
      });
    });
    const warning = document.getElementById("nutritionWarning");
    const warningText = document.getElementById("warningText");
    if (!warning || !warningText) return;
    if (totalMeals < 7) { warning.classList.add("hidden"); return; }
    const threshold = totalMeals * 0.6;
    let isImbalanced = false;
    let imbalanceType = "";
    if (categories.carbs > threshold) { isImbalanced = true; imbalanceType = "Quá nhiều tinh bột! Hãy thêm rau xanh và protein."; }
    else if (categories.protein > threshold) { isImbalanced = true; imbalanceType = "Quá nhiều đạm! Hãy thêm rau xanh và tinh bột."; }
    else if (categories.fiber > threshold) { isImbalanced = true; imbalanceType = "Quá nhiều chất xơ! Hãy thêm protein và tinh bột."; }
    else if (categories.fat > threshold) { isImbalanced = true; imbalanceType = "Quá nhiều chất béo! Hãy cân bằng lại thực đơn."; }
    if (isImbalanced) { warning.classList.remove("hidden"); warningText.textContent = imbalanceType; }
    else { warning.classList.add("hidden"); }
  },
  autoGenerateMeals() {
    if (!this.userData.targetCalories) { this.openWarningModal(); return; }
    this.initializeMealPlan();
    const usedFoods = new Set(this.previousWeekFoods);
    const weeklyUsage = {};
    this.days.forEach((day) => {
      this.meals.forEach((meal) => {
        let availableFoods = this.foodDatabase.filter((food) => (weeklyUsage[food.id] || 0) < 2 && !usedFoods.has(food.id));
        if (availableFoods.length === 0) availableFoods = this.foodDatabase.filter((food) => (weeklyUsage[food.id] || 0) < 2);
        const currentDayMeals = this.mealPlan[`week${this.currentWeek}`][day];
        const usedCategories = Object.values(currentDayMeals).filter(Boolean).map((m) => m.category);
        let prioritizedFoods = availableFoods.filter((f) => !usedCategories.includes(f.category));
        if (prioritizedFoods.length === 0) prioritizedFoods = availableFoods;
        if (prioritizedFoods.length > 0) {
          const selectedFood = prioritizedFoods[Math.floor(Math.random() * prioritizedFoods.length)];
          this.mealPlan[`week${this.currentWeek}`][day][meal] = { ...selectedFood };
          weeklyUsage[selectedFood.id] = (weeklyUsage[selectedFood.id] || 0) + 1;
        }
      });
    });
    this.updateFoodUsageCount();
    this.renderCalendar();
    this.checkNutritionBalance();
    this.saveData();
  },
  previousWeek() {
    if (this.currentWeek > 1) {
      this.storePreviousWeekFoods();
      this.currentWeek--;
      const weekEl = document.getElementById("currentWeek");
      if (weekEl) weekEl.textContent = `Tuần ${this.currentWeek}`;
      this.initializeMealPlan();
      this.renderCalendar();
      this.saveData();
    }
  },
  nextWeek() {
    this.storePreviousWeekFoods();
    this.currentWeek++;
    const weekEl = document.getElementById("currentWeek");
    if (weekEl) weekEl.textContent = `Tuần ${this.currentWeek}`;
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
        if (mealData && !this.previousWeekFoods.includes(mealData.id)) this.previousWeekFoods.push(mealData.id);
      });
    });
  },
};

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
window.openWarningModal = () => MealPlanner.openWarningModal();
window.closeWarningModal = () => MealPlanner.closeWarningModal();
window.confirmOpenSettings = () => MealPlanner.confirmOpenSettings();

document.addEventListener("DOMContentLoaded", () => {
  MealPlanner.init();
});


/**
 * BMI Checker - Quản lý trang kiểm tra BMI
 */
import "../css/style.css";
const BMIChecker = {
  // User data
  userData: {
    gender: null,
    height: null,
    weight: null,
  },

  // BMI Categories
  categories: {
    underweight: {
      max: 18.5,
      status: "Thiếu cân",
      class: "status-underweight",
    },
    normal: { max: 25, status: "Bình thường", class: "status-normal" },
    overweight: { max: 30, status: "Thừa cân", class: "status-overweight" },
    obese: { max: Infinity, status: "Béo phì", class: "status-obese" },
  },

  // Advice messages
  adviceMessages: {
    underweight:
      "Bạn đang thiếu cân. Hãy tăng cường bổ sung dinh dưỡng với các thực phẩm giàu protein và carbohydrate lành mạnh. Ăn nhiều bữa nhỏ trong ngày và tập thể dục để tăng cơ.",
    normal:
      "Chúc mừng! Bạn có chỉ số BMI lý tưởng. Hãy duy trì chế độ ăn uống cân bằng và tập thể dục đều đặn để giữ gìn sức khỏe.",
    overweight:
      "Bạn đang thừa cân. Hãy giảm lượng calo nạp vào, tăng cường rau xanh và protein, hạn chế đường và tinh bột. Tập thể dục ít nhất 30 phút mỗi ngày.",
    obese:
      "Bạn đang ở mức béo phì. Cần có kế hoạch giảm cân nghiêm túc với chế độ ăn kiêng và tập luyện. Nên tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng.",
  },

  // Food suggestions by BMI category
  foodSuggestions: {
    underweight: [
      "Phở bò",
      "Cơm tấm",
      "Bánh mì thịt",
      "Bún chả",
      "Cháo gà",
      "Trứng chiên",
      "Sữa chua",
      "Chuối",
      "Bơ",
      "Hạt óc chó",
    ],
    normal: [
      "Gỏi cuốn",
      "Canh chua",
      "Cá hấp",
      "Salad",
      "Phở gà",
      "Rau luộc",
      "Trái cây",
      "Đậu hũ",
      "Cơm gạo lứt",
      "Súp rau củ",
    ],
    overweight: [
      "Salad rau",
      "Cá hấp",
      "Ức gà nướng",
      "Rau luộc",
      "Canh rau",
      "Đậu hũ",
      "Trứng luộc",
      "Dưa leo",
      "Cà chua",
      "Bông cải xanh",
    ],
  },

  // Khởi tạo
  init() {
    this.bindGenderSelection();
    this.bindInputValidation();
  },

  // Bind gender selection
  bindGenderSelection() {
    const genderOptions = document.querySelectorAll(".gender-option");
    genderOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const gender = option.getAttribute("data-gender");
        this.selectGender(gender);
      });
    });
  },

  // Bind input validation
  bindInputValidation() {
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");

    if (heightInput) {
      heightInput.addEventListener("input", () => this.validateHeight());
    }
    if (weightInput) {
      weightInput.addEventListener("input", () => this.validateWeight());
    }
  },

  // Select gender
  selectGender(gender) {
    this.userData.gender = gender;

    document.querySelectorAll(".gender-option").forEach((opt) => {
      opt.classList.remove("selected");
    });

    const selectedOption = document.querySelector(`[data-gender="${gender}"]`);
    if (selectedOption) {
      selectedOption.classList.add("selected");
    }

    const btn = document.getElementById("btn-step1");
    if (btn) {
      btn.disabled = false;
    }
  },

  // Validate height input
  validateHeight() {
    const height = document.getElementById("height")?.value;
    const btn = document.getElementById("btn-step2");

    if (height >= 100 && height <= 250) {
      this.userData.height = parseFloat(height);
      if (btn) btn.disabled = false;
    } else {
      if (btn) btn.disabled = true;
    }
  },

  // Validate weight input
  validateWeight() {
    const weight = document.getElementById("weight")?.value;
    const btn = document.getElementById("btn-step3");

    if (weight >= 20 && weight <= 300) {
      this.userData.weight = parseFloat(weight);
      if (btn) btn.disabled = false;
    } else {
      if (btn) btn.disabled = true;
    }
  },

  // Navigate to next step
  nextStep(step) {
    document
      .querySelectorAll(".step")
      .forEach((s) => s.classList.remove("active"));

    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
      targetStep.classList.add("active");
    }

    document.querySelectorAll(".step-dot").forEach((dot, index) => {
      if (index + 1 < step) {
        dot.classList.add("completed");
        dot.classList.remove("active");
      } else if (index + 1 === step) {
        dot.classList.add("active");
        dot.classList.remove("completed");
      } else {
        dot.classList.remove("active", "completed");
      }
    });
  },

  // Navigate to previous step
  prevStep(step) {
    this.nextStep(step);
  },

  // Calculate BMI
  calculateBMI() {
    const heightM = this.userData.height / 100;
    const bmi = this.userData.weight / (heightM * heightM);
    const bmiRounded = bmi.toFixed(1);

    // Display BMI value
    const bmiValueEl = document.getElementById("bmi-value");
    if (bmiValueEl) {
      bmiValueEl.textContent = bmiRounded;
    }

    // Get category
    const category = this.getBMICategory(bmi);

    // Update status display
    this.updateStatusDisplay(category);

    // Update advice
    this.updateAdvice(category);

    // Position pointer on scale
    this.updatePointer(bmi);

    // Calculate nutrition needs
    this.calculateNutrition(bmi, category);

    // Show result step
    this.nextStep(4);
  },

  // Get BMI category
  getBMICategory(bmi) {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obese";
  },

  // Update status display
  updateStatusDisplay(category) {
    const statusEl = document.getElementById("bmi-status");
    if (statusEl) {
      const categoryInfo =
        this.categories[category === "obese" ? "obese" : category];
      statusEl.textContent = categoryInfo.status;
      statusEl.className = `bmi-status ${categoryInfo.class}`;
    }
  },

  // Update advice text
  updateAdvice(category) {
    const adviceEl = document.getElementById("advice-text");
    if (adviceEl) {
      adviceEl.textContent = this.adviceMessages[category];
    }
  },

  // Update pointer position
  updatePointer(bmi) {
    let pointerPosition;

    if (bmi < 18.5) {
      pointerPosition = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
      pointerPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
      pointerPosition = 50 + ((bmi - 25) / 5) * 25;
    } else {
      pointerPosition = Math.min(75 + ((bmi - 30) / 10) * 25, 98);
    }

    const pointerEl = document.getElementById("bmi-pointer");
    if (pointerEl) {
      pointerEl.style.left = `${pointerPosition}%`;
    }
  },

  // Calculate nutrition needs
  calculateNutrition(bmi, category) {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (this.userData.gender === "male") {
      bmr =
        10 * this.userData.weight + 6.25 * this.userData.height - 5 * 25 + 5;
    } else {
      bmr =
        10 * this.userData.weight + 6.25 * this.userData.height - 5 * 25 - 161;
    }

    // Adjust for activity level (assuming moderate activity)
    let tdee = bmr * 1.55;

    // Adjust based on BMI category
    let targetCalories;
    if (category === "underweight") {
      targetCalories = tdee + 500;
    } else if (category === "normal") {
      targetCalories = tdee;
    } else {
      targetCalories = tdee - 500;
    }

    targetCalories = Math.round(targetCalories);

    // Calculate macros based on category
    const macros = this.getMacroRatios(category);
    const protein = Math.round((targetCalories * macros.protein) / 4);
    const carbs = Math.round((targetCalories * macros.carbs) / 4);
    const fat = Math.round((targetCalories * macros.fat) / 9);
    const fiber = this.userData.gender === "male" ? 38 : 25;

    // Update display
    this.updateNutritionDisplay(targetCalories, protein, carbs, fat, fiber);

    // Update food suggestions
    this.updateFoodSuggestions(category);
  },

  // Get macro ratios based on BMI category
  getMacroRatios(category) {
    const ratios = {
      underweight: { protein: 0.2, carbs: 0.5, fat: 0.3 },
      normal: { protein: 0.25, carbs: 0.45, fat: 0.3 },
      overweight: { protein: 0.3, carbs: 0.35, fat: 0.35 },
      obese: { protein: 0.3, carbs: 0.35, fat: 0.35 },
    };
    return ratios[category] || ratios.normal;
  },

  // Update nutrition display
  updateNutritionDisplay(calories, protein, carbs, fat, fiber) {
    const elements = {
      "calorie-value": calories,
      "protein-value": protein,
      "carb-value": carbs,
      "fat-value": fat,
      "fiber-value": fiber,
    };

    for (const [id, value] of Object.entries(elements)) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value;
      }
    }
  },

  // Update food suggestions
  updateFoodSuggestions(category) {
    const foodListEl = document.getElementById("food-suggestions");
    if (!foodListEl) return;

    // Map obese to overweight for food suggestions
    const foodCategory = category === "obese" ? "overweight" : category;
    const foods =
      this.foodSuggestions[foodCategory] || this.foodSuggestions.normal;

    foodListEl.innerHTML = foods
      .map((food) => `<span class="food-tag">${food}</span>`)
      .join("");
  },

  // Go to food library
  goToLibrary() {
    window.location.href = "index.html";
  },

  // Reset form
  resetForm() {
    this.userData = { gender: null, height: null, weight: null };

    // Reset gender selection
    document.querySelectorAll(".gender-option").forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Reset inputs
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    if (heightInput) heightInput.value = "";
    if (weightInput) weightInput.value = "";

    // Reset buttons
    ["btn-step1", "btn-step2", "btn-step3"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = true;
    });

    // Go to first step
    this.nextStep(1);
  },
};

// Khởi tạo khi DOM ready
document.addEventListener("DOMContentLoaded", () => {
  BMIChecker.init();
});

// Export functions cho global scope (để gọi từ onclick trong HTML)
window.selectGender = (gender) => BMIChecker.selectGender(gender);
window.validateHeight = () => BMIChecker.validateHeight();
window.validateWeight = () => BMIChecker.validateWeight();
window.nextStep = (step) => BMIChecker.nextStep(step);
window.prevStep = (step) => BMIChecker.prevStep(step);
window.calculateBMI = () => BMIChecker.calculateBMI();
window.goToLibrary = () => BMIChecker.goToLibrary();
window.resetForm = () => BMIChecker.resetForm();

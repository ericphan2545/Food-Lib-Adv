// Copied from NutriPlan/public/js/recipes.js (kept as plain script)
// ==========================================================================
// 1. CƠ SỞ DỮ LIỆU CÔNG THỨC
// ==========================================================================
const recipesDB = {
  "Cơm gà Hội An": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211bb8eaa78a49193e39bf1374969bb2713.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Cơm gà vàng ươm thơm lừng, thịt gà dai ngọt đặc sản phố Hội.",
    ingredients: ["1 bát gạo", "150g ức gà", "Rau thơm, hành", "Nghệ tươi", "Nước mắm, tiêu"],
    instructions: ["Luộc gà với gừng và hành", "Nấu cơm bằng nước luộc gà và nghệ", "Xé gà trộn với hành phi và gia vị", "Dọn cơm kèm rau thơm và nước mắm"]
  },
  "Phở bò Hà Nội": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512111dfcf065cac26fc487bbc61bf06b3880.jpg",
    category: "Món nước",
    time: "180 phút",
    difficulty: "Khó",
    description: "Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương bò.",
    ingredients: ["200g bánh phở", "150g thịt bò", "Xương bò", "Hành, gừng, quế, hồi", "Rau thơm, giá đỗ"],
    instructions: ["Ninh xương bò với gừng nướng trong 4-5 tiếng", "Thêm quế, hồi, thảo quả vào nước dùng", "Trụng bánh phở, xếp thịt bò lên trên", "Chan nước dùng nóng, thêm hành và rau thơm"]
  },
  "Bún chả Hà Nội": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512118dae424aca7dcc6e03d49502e50564ad.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Thịt nướng than hoa thơm lừng ăn kèm bún và nước mắm chua ngọt.",
    ingredients: ["300g thịt ba chỉ", "200g thịt nạc vai xay", "200g bún tươi", "Nước mắm, đường, tỏi", "Rau sống, dưa góp"],
    instructions: ["Ướp thịt ba chỉ với nước mắm, đường, tỏi băm", "Vo viên thịt xay, ướp gia vị tương tự", "Nướng thịt trên than hoa đến vàng thơm", "Pha nước chấm chua ngọt, thêm ớt tỏi", "Dọn bún kèm thịt nướng, rau sống và nước chấm"]
  },
  "Bánh mì thịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211b890f3c4b0c5a6e2042935529195dbcc.jpg",
    category: "Món mặn",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Ổ bánh mì giòn rụm kẹp pate, thịt nguội đậm đà hương vị Việt.",
    ingredients: ["1 ổ bánh mì", "100g pate gan", "80g chả lụa", "Dưa leo, đồ chua", "Rau mùi, ớt, xì dầu"],
    instructions: ["Nướng giòn bánh mì", "Phết pate đều lên ruột bánh", "Xếp chả lụa, thịt nguội lên", "Thêm dưa leo, đồ chua, rau mùi", "Rưới xì dầu và thêm ớt tùy khẩu vị"]
  },
  "Gỏi cuốn tôm thịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512113b29efa85e5718ada0a48add33674027.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Món cuốn thanh mát với tôm thịt tươi ngon, chấm tương đen béo ngậy.",
    ingredients: ["10 tờ bánh tráng", "200g tôm sú", "150g thịt ba chỉ luộc", "Bún, rau sống, húng quế", "Đậu phộng, tương đen"],
    instructions: ["Luộc tôm và thịt ba chỉ, để nguội thái lát", "Nhúng bánh tráng qua nước ấm", "Xếp rau, bún, thịt, tôm lên bánh", "Cuốn chặt tay từ dưới lên", "Pha nước chấm tương đen với đậu phộng giã"]
  }
};

// ==========================================================================
// 2. RECIPE MANAGER
// ==========================================================================
const RecipeManager = {
  elements: {
    modal: null,
    modalBody: null,
    closeBtn: null,
    foodGrid: null,
    favoritesGrid: null,
    difficultySelect: null,
    timeSelect: null,
    filterBtns: null,
    searchInput: null,
    searchBtn: null,
    resultCount: null
  },
  currentFilters: {
    search: "",
    category: "Tất cả",
    difficulty: "all",
    time: "all"
  },
  init() {
    this.cacheElements();
    this.bindEvents();
    this.renderFoodCards();
  },
  cacheElements() {
    this.elements.modal = document.getElementById("recipe-modal");
    this.elements.modalBody = document.getElementById("modal-body-content");
    this.elements.foodGrid = document.getElementById("food-grid");
    this.elements.favoritesGrid = document.getElementById("favoritesGrid");
    this.elements.difficultySelect = document.getElementById("filter-difficulty");
    this.elements.timeSelect = document.getElementById("filter-time");
    this.elements.filterBtns = document.querySelectorAll(".filter-btn");
    this.elements.searchInput = document.querySelector(".search-input");
    this.elements.searchBtn = document.querySelector(".btn-primary");
    this.elements.resultCount = document.querySelector(".result-count");
  },
  bindEvents() {
    const { modal } = this.elements;
    if (modal) window.addEventListener("click", (e) => { if (e.target === modal) this.closeModal(); });

    const { difficultySelect, timeSelect, filterBtns, searchBtn, searchInput } = this.elements;
    if (difficultySelect) difficultySelect.addEventListener("change", (e) => { this.currentFilters.difficulty = e.target.value; this.renderFoodCards(); });
    if (timeSelect) timeSelect.addEventListener("change", (e) => { this.currentFilters.time = e.target.value; this.renderFoodCards(); });
    if (filterBtns) filterBtns.forEach(btn => btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active")?.classList.remove("active");
      btn.classList.add("active");
      this.currentFilters.category = btn.innerText.trim();
      this.renderFoodCards();
    }));
    const handleSearch = () => {
      if (searchInput) {
        this.currentFilters.search = searchInput.value.trim();
        this.renderFoodCards();
      }
    };
    if (searchBtn) searchBtn.addEventListener("click", handleSearch);
    if (searchInput) searchInput.addEventListener("keyup", (e) => { if (e.key === "Enter") handleSearch(); });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("view-recipe-btn")) {
        const card = e.target.closest(".food-card");
        const foodName = card.querySelector(".food-name").innerText.trim();
        this.showDetails(foodName);
      }
    });
  },
  parseTime(timeString) {
    if (!timeString) return 0;
    const matches = timeString.match(/(\d+)/);
    return matches ? parseInt(matches[0]) : 0;
  },
  isMatch(foodName, recipe) {
    const searchTerm = this.currentFilters.search.toLowerCase();
    if (searchTerm && !foodName.toLowerCase().includes(searchTerm)) return false;
    if (this.currentFilters.category !== "Tất cả" && recipe.category !== this.currentFilters.category) return false;
    if (this.currentFilters.difficulty !== "all" && recipe.difficulty !== this.currentFilters.difficulty) return false;
    if (this.currentFilters.time !== "all") {
      const minutes = this.parseTime(recipe.time);
      if (this.currentFilters.time === "under_30" && minutes >= 30) return false;
      if (this.currentFilters.time === "30_60" && (minutes < 30 || minutes > 60)) return false;
      if (this.currentFilters.time === "over_60" && minutes <= 60) return false;
    }
    return true;
  },
  renderFoodCards() {
    const { foodGrid, resultCount } = this.elements;
    if (!foodGrid) return;
    foodGrid.innerHTML = "";
    let count = 0;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const foodNames = Object.keys(recipesDB);
    for (let foodName in recipesDB) {
      const recipe = recipesDB[foodName];
      if (this.isMatch(foodName, recipe)) {
        count++;
        const foodId = foodNames.indexOf(foodName) + 1;
        const isFav = favorites.includes(foodId);
        const heartStyle = isFav ? 'style="background: #ff6b6b;"' : '';
        const heartClass = isFav ? 'favorited' : '';
        foodGrid.innerHTML += `
          <article class="food-card">
            <div class="image-container" style="overflow:hidden; position:relative;">
              <img src="${recipe.image}" alt="${foodName}" class="food-image">
              <span class="food-category-badge">${recipe.category || "Món Ngon"}</span>
              <div class="food-favorite ${heartClass}" ${heartStyle} data-food-id="${foodId}"><span>❤️</span></div>
            </div>
            <div class="food-content">
              <h3 class="food-name">${foodName}</h3>
              <p class="food-description">${recipe.description || "Món ăn hấp dẫn."}</p>
              <div class="food-meta">
                <span class="food-time">⏱️ ${recipe.time || "30 phút"}</span>
                <span class="food-difficulty">${recipe.difficulty || "Dễ"}</span>
              </div>
              <button class="view-recipe-btn">Xem Công Thức</button>
            </div>
          </article>
        `;
      }
    }
    if (resultCount) resultCount.innerText = `Hiển thị ${count} món ăn`;
    if (count === 0) {
      foodGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <h3>Không tìm thấy món ăn phù hợp</h3>
        <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé!</p>
      </div>`;
    }
  },
  showDetails(foodName) {
    const { modal, modalBody } = this.elements;
    const recipe = recipesDB[foodName];
    const foodNames = Object.keys(recipesDB);
    const foodId = foodNames.indexOf(foodName) + 1;
    if (!recipe || !modal || !modalBody) return;

    const ingredientsHtml = recipe.ingredients.map((item) => `<li>${item}</li>`).join("");
    const instructionsHtml = recipe.instructions.map((step) => `<li>${step}</li>`).join("");

    modalBody.innerHTML = `
      <div class="recipe-detail-layout">
        <div class="recipe-column recipe-col-image">
          <img src="${recipe.image}" alt="${foodName}" class="recipe-detail-image">
        </div>
        <div class="recipe-column recipe-col-content">
          <h2 class="recipe-title-large">${foodName}</h2>
          <div class="recipe-section ingredients-box">
            <h4 class="section-title-small">🛒 Nguyên Liệu:</h4>
            <ul class="recipe-list">${ingredientsHtml}</ul>
          </div>
          <div class="recipe-section">
            <h4 class="section-title-simple">👩‍🍳 Cách Làm:</h4>
            <ol class="recipe-steps">${instructionsHtml}</ol>
          </div>
        </div>
      </div>
    `;

    // close handler
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);

    // hook favorite button in modal header if exists
    const favBtn = document.querySelector("#recipe-modal .food-favorite");
    if (favBtn) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFav = favorites.includes(foodId);
      favBtn.classList.toggle("favorited", isFav);
      favBtn.style.background = isFav ? "#ff6b6b" : "var(--white)";
      favBtn.onclick = (e) => {
        e.stopPropagation();
        favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const idx = favorites.indexOf(foodId);
        if (idx > -1) favorites.splice(idx, 1);
        else favorites.push(foodId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        this.renderFoodCards();
      };
    }
  },
  closeModal() {
    const { modal } = this.elements;
    if (!modal) return;
    modal.classList.remove("show");
    setTimeout(() => { modal.style.display = "none"; }, 300);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  RecipeManager.init();
});

window.closeRecipeModal = () => RecipeManager.closeModal();
window.showRecipeDetails = (name) => RecipeManager.showDetails(name);
window.recipesDB = recipesDB;


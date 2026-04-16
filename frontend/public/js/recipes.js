// Recipes Manager - Backend API Integration
/**
 * Recipes Database and Management
 * Uses backend API instead of localStorage
 */

let recipesDB = {};

// API Utility functions
async function getFavoritesFromAPI() {
  try {
    const response = await fetch('/api/favorites');
    if (response.ok) {
      const data = await response.json();
      return data.favorites || [];
    }
  } catch (error) {
    console.error('Failed to get favorites:', error);
  }
  return [];
}

async function toggleFavoriteToAPI(foodId) {
  try {
    const response = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodId })
    });
    if (response.ok) {
      const data = await response.json();
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      return data.favorites || [];
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
  return [];
}

// Load recipes from API
async function loadRecipesFromAPI() {
  try {
    const response = await fetch('/api/recipes');
    if (response.ok) {
      const recipes = await response.json();
      recipesDB = {};
      recipes.forEach(recipe => {
        recipesDB[recipe.name] = {
          image: recipe.image,
          category: recipe.category,
          time: recipe.time,
          difficulty: recipe.difficulty,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        };
      });
    }
  } catch (error) {
    console.error('Failed to load recipes:', error);
  }
}

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
    category: "T?t c?",
    difficulty: "all",
    time: "all"
  },
  async init() {
    await loadRecipesFromAPI();
    this.cacheElements();
    this.bindEvents();
    this.renderFoodCards();
  },
  syncRecipeModalHeartFromStorage() {
    const el = document.querySelector("#recipe-modal .modal-header .food-favorite[data-food-id]");
    if (!el) return;
    const id = parseInt(el.getAttribute("data-food-id"), 10);
    if (!Number.isInteger(id) || id < 1) return;
    this.updateFavoriteStatus(el, id);
  },
  async updateFavoriteStatus(el, id) {
    const favorites = await getFavoritesFromAPI();
    const isFav = favorites.includes(id);
    el.classList.toggle("favorited", isFav);
    el.style.background = isFav ? "#ff6b6b" : "var(--white)";
    el.setAttribute("aria-pressed", isFav ? "true" : "false");
    el.setAttribute("aria-label", isFav ? "B? kh?i yêu thích" : "Thêm vào yêu thích");
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

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const modalHeart = e.target.closest("#recipe-modal .modal-header .food-favorite[data-food-id]");
      if (!modalHeart) return;
      e.preventDefault();
      modalHeart.click();
    });

    document.addEventListener("click", async (e) => {
      const heart = e.target.closest(".food-favorite[data-food-id]");
      if (heart) {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(heart.getAttribute("data-food-id"), 10);
        if (!Number.isInteger(id) || id < 1) return;
        await toggleFavoriteToAPI(id);
        this.renderFoodCards();
        this.syncRecipeModalHeartFromStorage();
        return;
      }
      const recipeBtn = e.target.closest(".view-recipe-btn");
      if (recipeBtn) {
        const card = recipeBtn.closest(".food-card");
        if (!card) return;
        const nameEl = card.querySelector(".food-name");
        const foodName = nameEl ? nameEl.innerText.trim() : "";
        if (foodName) this.showDetails(foodName);
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
    if (this.currentFilters.category !== "T?t c?" && recipe.category !== this.currentFilters.category) return false;
    if (this.currentFilters.difficulty !== "all" && recipe.difficulty !== this.currentFilters.difficulty) return false;
    if (this.currentFilters.time !== "all") {
      const minutes = this.parseTime(recipe.time);
      if (this.currentFilters.time === "under_30" && minutes >= 30) return false;
      if (this.currentFilters.time === "30_60" && (minutes < 30 || minutes > 60)) return false;
      if (this.currentFilters.time === "over_60" && minutes <= 60) return false;
    }
    return true;
  },
  async renderFoodCards() {
    const { foodGrid, resultCount } = this.elements;
    if (!foodGrid) return;
    foodGrid.innerHTML = "";
    let count = 0;
    const favorites = await getFavoritesFromAPI();
    const foodNames = Object.keys(recipesDB);
    for (let foodName in recipesDB) {
      const recipe = recipesDB[foodName];
      if (this.isMatch(foodName, recipe)) {
        count++;
        const foodId = foodNames.indexOf(foodName) + 1;
        const isFav = favorites.includes(foodId);
        const heartStyle = isFav ? 'style="background: #ff6b6b;"' : '';
        const heartClass = isFav ? 'favorited' : '';
        foodGrid.innerHTML += \
          <article class="food-card">
            <div class="image-container" style="overflow:hidden; position:relative;">
              <img src="\" alt="\" class="food-image">
              <span class="food-category-badge">\</span>
              <div class="food-favorite \" \ data-food-id="\"><span>??</span></div>
            </div>
            <div class="food-content">
              <h3 class="food-name">\</h3>
              <p class="food-description">\</p>
              <div class="food-meta">
                <span class="food-time">?? \</span>
                <span class="food-difficulty">\</span>
              </div>
              <button type="button" class="view-recipe-btn">Xem Công Th?c</button>
            </div>
          </article>
        \;
      }
    }
    if (resultCount) resultCount.innerText = \Hi?n th? \ món an\;
    if (count === 0) {
      foodGrid.innerHTML = \<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <h3>Không tìm th?y món an phù h?p</h3>
        <p>Th? thay d?i b? l?c ho?c t? khóa tìm ki?m nhé!</p>
      </div>\;
    }
  },
  showDetails(foodName) {
    const { modal, modalBody } = this.elements;
    const recipe = recipesDB[foodName];
    const foodNames = Object.keys(recipesDB);
    const foodId = foodNames.indexOf(foodName) + 1;
    if (!recipe || !modal || !modalBody) return;

    const ingredientsHtml = recipe.ingredients.map((item) => \<li>\</li>\).join("");
    const instructionsHtml = recipe.instructions.map((step) => \<li>\</li>\).join("");

    modalBody.innerHTML = \
      <div class="recipe-detail-layout">
        <div class="recipe-column recipe-col-image">
          <img src="\" alt="\" class="recipe-detail-image">
        </div>
        <div class="recipe-column recipe-col-content">
          <h2 class="recipe-title-large">\</h2>
          <div class="recipe-section ingredients-box">
            <h4 class="section-title-small">?? Nguyên Li?u:</h4>
            <ul class="recipe-list">\</ul>
          </div>
          <div class="recipe-section">
            <h4 class="section-title-simple">????? Cách Làm:</h4>
            <ol class="recipe-steps">\</ol>
          </div>
        </div>
      </div>
    \;

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);

    const favBtn = document.querySelector("#recipe-modal .modal-header .food-favorite");
    if (favBtn) {
      favBtn.setAttribute("data-food-id", String(foodId));
      favBtn.setAttribute("role", "button");
      favBtn.setAttribute("tabindex", "0");
      this.syncRecipeModalHeartFromStorage();
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

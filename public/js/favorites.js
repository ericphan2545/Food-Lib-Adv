/**
 * Favorites Page - Display user's favorite foods
 * Canonical recipe source: window.RECIPES_DB (from recipes.js)
 */

function getBasePath() {
  const path = window.location.pathname || "/";
  if (path.startsWith("/NutriPlan/")) return "/NutriPlan/";
  return "/";
}

const imageMap = {};
const FAV_CATEGORY_LABELS = {
  carbs: "Tinh bột",
  protein: "Đạm",
  fat: "Chất béo",
  fiber: "Chất xơ",
  balanced: "Cân bằng",
};
const FAV_FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='20'>Food Library</text></svg>",
);

function getRecipesSource() {
  if (typeof window !== "undefined" && window.RECIPES_DB) {
    return window.RECIPES_DB;
  }
  return {};
}

const Favorites = {
  favoriteIds: [],
  foods: [],

  normalizeIds(ids) {
    if (!Array.isArray(ids)) return [];
    return [...new Set(ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))];
  },

  safeReadFavorites() {
    const storedFavorites = localStorage.getItem("favorites");
    if (!storedFavorites) return [];
    try {
      return JSON.parse(storedFavorites);
    } catch (err) {
      console.warn("favorites trong localStorage không hợp lệ, reset lại:", err);
      localStorage.setItem("favorites", "[]");
      return [];
    }
  },

  async init() {
    await this.loadFoods();
    this.loadFavorites();
    this.renderFavorites();
    window.addEventListener("storage", () => {
      this.loadFavorites();
      this.renderFavorites();
    });
    window.addEventListener("favoritesUpdated", () => {
      this.loadFavorites();
      this.renderFavorites();
    });
  },

  async loadFoods() {
    try {
      const res = await fetch("/api/foods");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          this.foods = data;
          return;
        }
      }
    } catch (err) {
      console.warn("Không thể tải /api/foods:", err);
    }
    this.foods =
      typeof FOOD_DATABASE !== "undefined" && Array.isArray(FOOD_DATABASE)
        ? FOOD_DATABASE
        : [];
    if (this.foods.length === 0) {
      const recipesSource = getRecipesSource();
      this.foods = Object.keys(recipesSource).map((name, index) => ({
        id: index + 1,
        name,
        category: "balanced",
      }));
    }
  },

  loadFavorites() {
    this.favoriteIds = this.normalizeIds(this.safeReadFavorites());
    localStorage.setItem("favorites", JSON.stringify(this.favoriteIds));
  },

  getFavoriteFoods() {
    return this.foods.filter((food) => this.favoriteIds.includes(food.id));
  },

  removeFavorite(foodId) {
    const normalizedFoodId = Number(foodId);
    this.favoriteIds = this.favoriteIds.filter((id) => id !== normalizedFoodId);
    localStorage.setItem("favorites", JSON.stringify(this.favoriteIds));
    this.renderFavorites();
    window.dispatchEvent(
      new CustomEvent("favoritesUpdated", { detail: this.favoriteIds }),
    );
  },

  renderFavorites() {
    const grid = document.getElementById("favoritesGrid");
    if (!grid) return;

    const emptyState = document.getElementById("emptyState");
    const favoriteFoods = this.getFavoriteFoods();
    const resultCount = document.getElementById("favoriteCount");
    const basePath = getBasePath();

    if (favoriteFoods.length === 0) {
      grid.style.display = "none";
      emptyState.style.display = "block";
      resultCount.textContent = "Chưa có món ăn nào được yêu thích";
      return;
    }

    grid.style.display = "grid";
    emptyState.style.display = "none";
    resultCount.textContent = `${favoriteFoods.length} món ăn yêu thích`;
    const recipesSource = getRecipesSource();

    grid.innerHTML = favoriteFoods
      .map((food) => {
        const recipe = recipesSource[food.name] || {};
        let imagePath = recipe.image || FAV_FALLBACK_IMG;
        if (imageMap[food.id]) {
          imagePath = imageMap[food.id];
        } else if (
          imagePath &&
          !imagePath.startsWith("http://") &&
          !imagePath.startsWith("https://")
        ) {
          imagePath = imagePath.startsWith("/") ? imagePath : basePath + imagePath;
        }

        return `
            <article class="food-card">
                <div class="image-container">
                    <img src="${imagePath}" alt="${food.name}" class="food-image">
                    <span class="food-category-badge">${recipe.category || FAV_CATEGORY_LABELS[food.category] || "Món ngon"}</span>
                    <div class="food-favorite favorited" data-food-id="${food.id}" style="background: #ff6b6b; cursor: pointer;">
                        <span>❤️</span>
                    </div>
                </div>
                <div class="food-content">
                    <h3 class="food-name">${food.name}</h3>
                    <p class="food-description">${recipe.description || "Món ăn đang được cập nhật công thức."}</p>
                    <div class="food-meta">
                        <span class="food-time">⏱️ ${recipe.time || "Chưa cập nhật"}</span>
                        <span class="food-difficulty">${recipe.difficulty || "N/A"}</span>
                    </div>
                    <button class="view-recipe-btn">Xem Công Thức</button>
                </div>
            </article>
        `;
      })
      .join("");

    this.bindFavoriteButtons();
  },

  bindFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll(".food-favorite[data-food-id]");
    favoriteButtons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const foodId = parseInt(newBtn.getAttribute("data-food-id"), 10);
        this.removeFavorite(foodId);
      });
    });

    const detailButtons = document.querySelectorAll(".view-recipe-btn");
    detailButtons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = newBtn.closest(".food-card");
        const foodName = card?.querySelector(".food-name")?.innerText?.trim();
        if (foodName && typeof window.showRecipeDetails === "function") {
          window.showRecipeDetails(foodName);
        }
      });
    });
  },
};

window.Favorites = Favorites;
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("favoritesGrid")) {
    Favorites.init().catch((err) => console.error("Favorites init error:", err));
  }
});

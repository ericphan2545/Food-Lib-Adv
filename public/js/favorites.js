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

function getRecipesSource() {
  if (typeof window !== "undefined" && window.RECIPES_DB) {
    return window.RECIPES_DB;
  }
  return {};
}

function toFoodDatabase(recipesSource) {
  const foodIdByName =
    typeof FOOD_DATABASE !== "undefined" && Array.isArray(FOOD_DATABASE)
      ? new Map(FOOD_DATABASE.map((food) => [food.name, food.id]))
      : new Map();

  return Object.entries(recipesSource).map(([name, data], index) => {
    const stableId = foodIdByName.get(name);
    return {
      id: Number.isFinite(stableId) ? stableId : index + 1,
      name,
      ...data,
    };
  });
}

const Favorites = {
  favoriteIds: [],

  init() {
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

  loadFavorites() {
    const storedFavorites = localStorage.getItem("favorites");
    this.favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
  },

  getFavoriteFoods() {
    const recipesSource = getRecipesSource();
    const foodDatabase = toFoodDatabase(recipesSource);
    return foodDatabase.filter((food) => this.favoriteIds.includes(food.id));
  },

  removeFavorite(foodId) {
    this.favoriteIds = this.favoriteIds.filter((id) => id !== foodId);
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
      resultCount.textContent = "";
      return;
    }

    grid.style.display = "grid";
    emptyState.style.display = "none";
    resultCount.textContent = "";

    grid.innerHTML = favoriteFoods
      .map((food) => {
        let imagePath = food.image;
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
                    <span class="food-category-badge">${food.category}</span>
                    <div class="food-favorite favorited" data-food-id="${food.id}" style="background: #ff6b6b; cursor: pointer;">
                        <span>❤️</span>
                    </div>
                </div>
                <div class="food-content">
                    <h3 class="food-name">${food.name}</h3>
                    <p class="food-description">${food.description}</p>
                    <div class="food-meta">
                        <span class="food-time">⏱️ ${food.time}</span>
                        <span class="food-difficulty">${food.difficulty}</span>
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
  },
};

window.Favorites = Favorites;
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("favoritesGrid")) {
    Favorites.init();
  }
});

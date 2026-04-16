// Favorites page renderer (adapted from NutriPlan/js/favorites.js)
(function () {
  function getRecipesArray() {
    const names = Object.keys(window.recipesDB || {});
    return names.map((name, idx) => ({
      id: idx + 1,
      name,
      ...window.recipesDB[name],
    }));
  }

  const Favorites = {
    favoriteIds: [],
    init() {
      this.loadFavorites();
      this.render();
      window.addEventListener("storage", () => {
        this.loadFavorites();
        this.render();
      });
      window.addEventListener("favoritesUpdated", () => {
        this.loadFavorites();
        this.render();
      });
    },
    loadFavorites() {
      const stored = localStorage.getItem("favorites");
      this.favoriteIds = stored ? JSON.parse(stored) : [];
    },
    getFavoriteFoods() {
      const all = getRecipesArray();
      return all.filter((food) => this.favoriteIds.includes(food.id));
    },
    removeFavorite(foodId) {
      this.favoriteIds = this.favoriteIds.filter((id) => id !== foodId);
      localStorage.setItem("favorites", JSON.stringify(this.favoriteIds));
      window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: this.favoriteIds }));
      this.render();
    },
    render() {
      const grid = document.getElementById("favoritesGrid");
      if (!grid) return;
      const emptyState = document.getElementById("emptyState");
      const resultCount = document.getElementById("favoriteCount");
      const favorites = this.getFavoriteFoods();

      if (!favorites.length) {
        grid.style.display = "none";
        if (emptyState) emptyState.style.display = "block";
        if (resultCount) resultCount.textContent = "Chưa có món ăn nào được yêu thích";
        return;
      }

      grid.style.display = "grid";
      if (emptyState) emptyState.style.display = "none";
      if (resultCount) resultCount.textContent = `Bạn có ${favorites.length} món yêu thích`;

      grid.innerHTML = favorites
        .map((food) => {
          return `
            <article class="food-card">
              <div class="image-container" style="overflow:hidden; position:relative;">
                <img src="${food.image}" alt="${food.name}" class="food-image">
                <span class="food-category-badge">${food.category || "Món ngon"}</span>
                <div class="food-favorite favorited" data-food-id="${food.id}" style="background: #ff6b6b; cursor: pointer;">
                  <span>❤️</span>
                </div>
              </div>
              <div class="food-content">
                <h3 class="food-name">${food.name}</h3>
                <p class="food-description">${food.description || ""}</p>
                <div class="food-meta">
                  <span class="food-time">⏱️ ${food.time || ""}</span>
                  <span class="food-difficulty">${food.difficulty || ""}</span>
                </div>
                <button class="view-recipe-btn" data-recipe-name="${food.name}">Xem Công Thức</button>
              </div>
            </article>
          `;
        })
        .join("");

      // remove favorite
      grid.querySelectorAll(".food-favorite[data-food-id]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = parseInt(btn.getAttribute("data-food-id"), 10);
          this.removeFavorite(id);
        });
      });

      // open recipe modal (delegated)
      grid.querySelectorAll(".view-recipe-btn[data-recipe-name]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = btn.getAttribute("data-recipe-name");
          if (typeof window.showRecipeDetails === "function") window.showRecipeDetails(name);
        });
      });
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    Favorites.init();
  });
})();


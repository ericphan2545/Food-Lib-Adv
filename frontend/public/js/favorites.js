// Trang Yêu thích — đồng bộ localStorage với recipes.js (mảng id số nguyên dương)
(function () {
  function normalizeFavoriteIds(raw) {
    try {
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(data)) return [];
      return data
        .map((x) => (typeof x === "number" ? x : parseInt(String(x), 10)))
        .filter((n) => Number.isInteger(n) && n > 0);
    } catch {
      return [];
    }
  }

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
      this.favoriteIds = normalizeFavoriteIds(stored || "[]");
      if (stored) {
        const normalized = JSON.stringify(this.favoriteIds);
        if (normalized !== stored) localStorage.setItem("favorites", normalized);
      }
    },
    getFavoriteFoods() {
      const all = getRecipesArray();
      return all.filter((food) => this.favoriteIds.includes(food.id));
    },
    render() {
      const grid = document.getElementById("favoritesGrid");
      if (!grid) return;
      const emptyState = document.getElementById("emptyState");
      const resultCount = document.getElementById("favoriteCount");
      const favorites = this.getFavoriteFoods();

      if (!favorites.length) {
        grid.style.display = "none";
        grid.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        if (resultCount) resultCount.textContent = "Chưa có món ăn nào được yêu thích";
        return;
      }

      grid.style.display = "grid";
      if (emptyState) emptyState.style.display = "none";
      if (resultCount) resultCount.textContent = `${favorites.length} món đang lưu`;

      grid.innerHTML = favorites
        .map(
          (food) => `
            <article class="food-card food-card--favorite">
              <div class="image-container">
                <img src="${food.image}" alt="${food.name}" class="food-image">
                <span class="food-category-badge">${food.category || "Món ngon"}</span>
                <div class="food-favorite favorited" data-food-id="${food.id}" title="Nhấn để bỏ khỏi yêu thích" role="button" tabindex="0">
                  <span aria-hidden="true">❤️</span>
                </div>
              </div>
              <div class="food-content">
                <h3 class="food-name">${food.name}</h3>
                <p class="food-description">${food.description || ""}</p>
                <div class="food-meta">
                  <span class="food-time">⏱️ ${food.time || "—"}</span>
                  <span class="food-difficulty">${food.difficulty || "—"}</span>
                </div>
                <button type="button" class="view-recipe-btn" data-recipe-name="${food.name}">Xem công thức</button>
              </div>
            </article>
          `
        )
        .join("");
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    Favorites.init();
  });
})();

// Favorites Management - Backend API Integration
/**
 * Favorites Page
 * Uses backend API instead of localStorage
 */

async function getFavoriteFoods() {
  try {
    const favResponse = await fetch('/api/favorites');
    if (!favResponse.ok) return [];
    const favData = await favResponse.json();
    const favoritesIds = favData.favorites || [];

    const foodsResponse = await fetch('/api/foods');
    if (!foodsResponse.ok) return [];
    const allFoods = await foodsResponse.json();

    return allFoods
      .map((food, idx) => ({ ...food, id: idx + 1 }))
      .filter(food => favoritesIds.includes(food.id));
  } catch (error) {
    console.error('Failed to get favorite foods:', error);
    return [];
  }
}

const Favorites = {
  favoriteIds: [],
  init() {
    this.loadFavorites();
    this.render();
    window.addEventListener("favoritesUpdated", () => {
      this.loadFavorites();
      this.render();
    });
  },
  async loadFavorites() {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        this.favoriteIds = data.favorites || [];
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  },
  async getFavoriteFoods() {
    try {
      const foodsResponse = await fetch('/api/foods');
      if (!foodsResponse.ok) return [];
      const allFoods = await foodsResponse.json();

      return allFoods
        .map((food) => ({ ...food, id: food.foodId }))
        .filter((food) => this.favoriteIds.includes(food.id));
    } catch (error) {
      console.error('Failed to get favorite foods:', error);
      return [];
    }
  },
  async render() {
    const grid = document.getElementById("favoritesGrid");
    if (!grid) return;
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("favoriteCount");
    
    const favorites = await this.getFavoriteFoods();

    if (!favorites.length) {
      grid.style.display = "none";
      grid.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      if (resultCount) resultCount.textContent = "Chua có món an nào du?c yêu thích";
      return;
    }

    grid.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";
    if (resultCount) resultCount.textContent = \\ món dang luu\;

    grid.innerHTML = favorites
      .map(
        (food) => \
          <article class="food-card food-card--favorite">
            <div class="image-container">
              <img src="\" alt="\" class="food-image">
              <span class="food-category-badge">\</span>
              <div class="food-favorite favorited" data-food-id="\" title="Nh?n d? b? kh?i yêu thích" role="button" tabindex="0">
                <span aria-hidden="true">??</span>
              </div>
            </div>
            <div class="food-content">
              <h3 class="food-name">\</h3>
              <p class="food-description">\</p>
              <div class="food-meta">
                <span class="food-time">?? \</span>
                <span class="food-difficulty">\</span>
              </div>
              <button type="button" class="view-recipe-btn" data-recipe-name="\">Xem công th?c</button>
            </div>
          </article>
        \
      )
      .join("");

    grid.addEventListener("click", async (e) => {
      const heart = e.target.closest(".food-favorite[data-food-id]");
      if (heart) {
        e.preventDefault();
        e.stopPropagation();
        const foodId = parseInt(heart.getAttribute("data-food-id"), 10);
        try {
          const response = await fetch('/api/favorites/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foodId })
          });
          if (response.ok) {
            window.dispatchEvent(new CustomEvent('favoritesUpdated'));
          }
        } catch (error) {
          console.error('Failed to remove favorite:', error);
        }
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Favorites.init();
});

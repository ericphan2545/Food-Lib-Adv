// ==========================================================================
// RECIPE MANAGER UI LOGIC
// Uses /api/foods as canonical data source and RECIPES_DB for recipe details.
// ==========================================================================
const recipeDetailsDb = (typeof window !== "undefined" && window.RECIPES_DB) ? window.RECIPES_DB : {};
const CATEGORY_LABELS = {
    carbs: "Tinh bột",
    protein: "Đạm",
    fat: "Chất béo",
    fiber: "Chất xơ",
    balanced: "Cân bằng"
};
const FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='20'>Food Library</text></svg>"
);

const RecipeManager = {
    foods: [],
    foodById: new Map(),
    foodByName: new Map(),
    currentModalFoodId: null,
    // Lưu trữ các DOM elements cần thiết
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

    // State: Lưu trạng thái lọc hiện tại
    currentFilters: {
        search: "",
        category: "all",
        difficulty: "all",
        time: "all"
    },

    async loadFoods() {
        try {
            const res = await fetch("/api/foods");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    this.foods = data;
                    this.foodById = new Map(data.map((food) => [food.id, food]));
                    this.foodByName = new Map(data.map((food) => [food.name, food]));
                    return;
                }
            }
        } catch (err) {
            console.warn("Không thể tải /api/foods:", err);
        }

        if (typeof FOOD_DATABASE !== "undefined" && Array.isArray(FOOD_DATABASE)) {
            this.foods = FOOD_DATABASE;
            this.foodById = new Map(FOOD_DATABASE.map((food) => [food.id, food]));
            this.foodByName = new Map(FOOD_DATABASE.map((food) => [food.name, food]));
            return;
        }

        const fallbackFoods = Object.keys(recipeDetailsDb).map((name, index) => ({
            id: index + 1,
            name,
            category: "balanced",
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0
        }));
        this.foods = fallbackFoods;
        this.foodById = new Map(fallbackFoods.map((food) => [food.id, food]));
        this.foodByName = new Map(fallbackFoods.map((food) => [food.name, food]));
    },

    getFoodIdByName(foodName) {
        const match = this.foodByName.get(foodName);
        if (match && Number.isFinite(match.id)) return match.id;
        const fallbackNames = Object.keys(recipeDetailsDb);
        const fallbackIndex = fallbackNames.indexOf(foodName);
        return fallbackIndex >= 0 ? fallbackIndex + 1 : null;
    },

    // --- KHỞI TẠO ---
    async init() {
        await this.loadFoods();
        this.cacheElements();
        this.bindEvents();
        this.renderFoodCards();
    },

    // --- CACHE DOM ELEMENTS ---
    cacheElements() {
        this.elements.modal = document.getElementById("recipe-modal");
        this.elements.modalBody = document.getElementById("modal-body-content");
        this.elements.closeBtn = document.querySelector("#recipe-modal .modal-close");
        this.elements.foodGrid = document.getElementById("food-grid");
        this.elements.favoritesGrid = document.getElementById("favoritesGrid");
        this.elements.difficultySelect = document.getElementById("filter-difficulty");
        this.elements.timeSelect = document.getElementById("filter-time");
        this.elements.filterBtns = document.querySelectorAll(".filter-btn");
        this.elements.searchInput = document.querySelector(".search-input");
        this.elements.searchBtn = document.querySelector(".btn-primary");
        this.elements.resultCount = document.querySelector(".result-count");
    },

    // --- BIND EVENTS ---
    bindEvents() {
        this.bindModalEvents();
        this.bindSearchAndFilterEvents();
        this.bindGridEvents();
        window.addEventListener("favoritesUpdated", () => {
            this.refreshFavoriteIndicators();
            this.syncModalFavoriteBtn();
        });
        window.addEventListener("storage", () => {
            this.refreshFavoriteIndicators();
            this.syncModalFavoriteBtn();
        });
    },

    getFavorites() {
        let raw = [];
        try {
            raw = JSON.parse(localStorage.getItem("favorites") || "[]");
        } catch (err) {
            console.warn("favorites trong localStorage không hợp lệ, reset lại:", err);
            localStorage.setItem("favorites", "[]");
        }
        if (!Array.isArray(raw)) return [];
        return [...new Set(raw.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))];
    },

    saveFavorites(favorites) {
        const normalized = [...new Set(favorites.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))];
        localStorage.setItem("favorites", JSON.stringify(normalized));
        return normalized;
    },

    bindModalEvents() {
        const { modal, closeBtn } = this.elements;
        if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
        if (modal) window.addEventListener("click", (e) => {
            if (e.target === modal) this.closeModal();
        });
    },

    bindGridEvents() {
        const getFoodIdFromCard = (card) => {
            if (!card) return null;
            const heart = card.querySelector(".food-favorite");
            const idAttr = heart?.getAttribute?.("data-food-id");
            const id = Number(idAttr);
            if (Number.isFinite(id) && id > 0) return id;

            const foodName = card?.querySelector?.(".food-name")?.innerText?.trim?.();
            const foodNames = Object.keys(recipeDetailsDb);
            const idx = foodNames.indexOf(foodName);
            return idx >= 0 ? idx + 1 : null;
        };

        const toggleFavoriteById = (foodId, heartEl) => {
            let favorites = this.getFavorites();
            const index = favorites.indexOf(foodId);
            const isFav = index >= 0;

            if (isFav) favorites.splice(index, 1);
            else favorites.push(foodId);

            favorites = this.saveFavorites(favorites);

            if (heartEl) {
                if (!isFav) {
                    heartEl.classList.add("favorited");
                    heartEl.style.background = "#ff6b6b";
                } else {
                    heartEl.classList.remove("favorited");
                    heartEl.style.background = "var(--white)";
                }
            }

            window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: favorites }));
        };

        const handleGridClick = (e) => {
            const heart = e.target.closest?.(".food-favorite");
            if (heart) {
                e.preventDefault();
                e.stopPropagation();
                const card = heart.closest(".food-card");
                const foodId = Number(heart.getAttribute("data-food-id")) || getFoodIdFromCard(card);
                if (!foodId) return;
                toggleFavoriteById(foodId, heart);
                return;
            }

            const viewBtn = e.target.closest?.(".view-recipe-btn");
            if (viewBtn) {
                const card = viewBtn.closest(".food-card");
                const foodName = card?.querySelector?.(".food-name")?.innerText?.trim?.();
                if (foodName) this.showDetails(foodName);
            }
        };

        if (this.elements.foodGrid) this.elements.foodGrid.addEventListener("click", handleGridClick);
        if (this.elements.favoritesGrid) this.elements.favoritesGrid.addEventListener("click", handleGridClick);
    },

    bindSearchAndFilterEvents() {
        const { difficultySelect, timeSelect, filterBtns, searchBtn, searchInput } = this.elements;

        if (difficultySelect) difficultySelect.addEventListener("change", (e) => {
            this.currentFilters.difficulty = e.target.value;
            this.renderFoodCards();
        });

        if (timeSelect) timeSelect.addEventListener("change", (e) => {
            this.currentFilters.time = e.target.value;
            this.renderFoodCards();
        });

        if (filterBtns) filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelector(".filter-btn.active")?.classList.remove("active");
                btn.classList.add("active");
                this.currentFilters.category = btn.dataset.category || "all";
                this.renderFoodCards();
            });
        });

        const handleSearch = () => {
            if (searchInput) {
                this.currentFilters.search = searchInput.value.trim();
                this.renderFoodCards();
            }
        };

        if (searchBtn) searchBtn.addEventListener("click", handleSearch);
        if (searchInput) searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") handleSearch();
        });
    },

    showDetails(foodName) {
        const { modal, modalBody } = this.elements;
        const recipe = recipeDetailsDb[foodName];
        const food = this.foodByName.get(foodName);
        const foodId = this.getFoodIdByName(foodName);
        this.currentModalFoodId = foodId;

        if (modal && modalBody) {
            const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
            const instructions = Array.isArray(recipe?.instructions) ? recipe.instructions : [];
            const ingredientsHtml = ingredients.map((item) => `<li>${item}</li>`).join("");
            const instructionsHtml = instructions.map((step) => `<li>${step}</li>`).join("");

            let nutritionHtml = "";
            if (food) {
                nutritionHtml = `
                    <div class="nutrition-box-under-img">
                        <h4 class="nutrition-title-small">Dinh dưỡng (1 khẩu phần)</h4>
                        <div class="nutrition-grid-small">
                            <div class="nutri-item">
                                <span class="nutri-val">${food.calories ?? 0}</span>
                                <span class="nutri-label">Kcal</span>
                            </div>
                            <div class="nutri-item">
                                <span class="nutri-val">${food.carbs ?? 0}g</span>
                                <span class="nutri-label">Carbs</span>
                            </div>
                            <div class="nutri-item">
                                <span class="nutri-val">${food.protein ?? 0}g</span>
                                <span class="nutri-label">Protein</span>
                            </div>
                            <div class="nutri-item">
                                <span class="nutri-val">${food.fat ?? 0}g</span>
                                <span class="nutri-label">Fat</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            const imageSrc = recipe?.image || FALLBACK_IMG;
            const contentHtml = recipe
                ? `
                    <div class="recipe-section ingredients-box">
                        <h4 class="section-title-small">🛒 Nguyên Liệu:</h4>
                        <ul class="recipe-list">${ingredientsHtml}</ul>
                    </div>
                    <div class="recipe-section">
                        <h4 class="section-title-simple">👩‍🍳 Cách Làm:</h4>
                        <ol class="recipe-steps">${instructionsHtml}</ol>
                    </div>
                `
                : `
                    <div class="recipe-section">
                        <p>Chưa có công thức chi tiết cho món này, nhưng dữ liệu dinh dưỡng đã được đồng bộ từ API.</p>
                    </div>
                `;

            modalBody.innerHTML = `
                <div class="recipe-detail-layout">
                    <div class="recipe-column recipe-col-image">
                        <img src="${imageSrc}" alt="${foodName}" class="recipe-detail-image">
                        ${nutritionHtml}
                    </div>
                    <div class="recipe-column recipe-col-content">
                        <h2 class="recipe-title-large">${foodName}</h2>
                        ${contentHtml}
                    </div>
                </div>
            `;

            this.handleModalFavoriteBtn(foodId);

            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
            document.body.style.overflow = "hidden";
        }
    },

    closeModal() {
        const { modal } = this.elements;
        if (modal) {
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }, 300);
        }
        this.currentModalFoodId = null;
    },

    handleModalFavoriteBtn(foodId) {
        const oldBtn = document.querySelector("#recipe-modal .food-favorite");
        if (oldBtn) {
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);

            let favorites = this.getFavorites();
            const isFavorite = favorites.includes(foodId);
            newBtn.setAttribute("data-food-id", String(foodId));

            if (isFavorite) {
                newBtn.classList.add("favorited");
                newBtn.style.background = "#ff6b6b";
            } else {
                newBtn.classList.remove("favorited");
                newBtn.style.background = "var(--white)";
            }

            newBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                favorites = RecipeManager.getFavorites();
                const index = favorites.indexOf(foodId);

                if (index > -1) {
                    favorites.splice(index, 1);
                    this.classList.remove("favorited");
                    this.style.background = "var(--white)";
                } else {
                    favorites.push(foodId);
                    this.classList.add("favorited");
                    this.style.background = "#ff6b6b";
                }
                favorites = RecipeManager.saveFavorites(favorites);
                window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: favorites }));
                window.dispatchEvent(new Event("storage"));
            });
        }
    },

    syncModalFavoriteBtn() {
        const modalBtn = document.querySelector("#recipe-modal .food-favorite");
        if (!modalBtn || !this.currentModalFoodId) return;
        const favorites = this.getFavorites();
        const isFav = favorites.includes(this.currentModalFoodId);
        if (isFav) {
            modalBtn.classList.add("favorited");
            modalBtn.style.background = "#ff6b6b";
        } else {
            modalBtn.classList.remove("favorited");
            modalBtn.style.background = "var(--white)";
        }
    },

    refreshFavoriteIndicators() {
        const { foodGrid } = this.elements;
        if (!foodGrid) return;
        const favorites = this.getFavorites();
        const heartEls = foodGrid.querySelectorAll(".food-favorite[data-food-id]");
        heartEls.forEach((heartEl) => {
            const id = Number(heartEl.getAttribute("data-food-id"));
            if (!Number.isFinite(id) || id <= 0) return;
            const isFav = favorites.includes(id);
            if (isFav) {
                heartEl.classList.add("favorited");
                heartEl.style.background = "#ff6b6b";
            } else {
                heartEl.classList.remove("favorited");
                heartEl.style.background = "var(--white)";
            }
        });
    },

    parseTime(timeString) {
        if (!timeString) return 0;
        const matches = timeString.match(/(\d+)/);
        return matches ? parseInt(matches[0], 10) : 0;
    },

    isMatch(food, recipe) {
        const foodName = food.name || "";
        const searchTerm = this.currentFilters.search.toLowerCase();
        if (searchTerm && !foodName.toLowerCase().includes(searchTerm)) return false;
        if (this.currentFilters.category !== "all" && food.category !== this.currentFilters.category) return false;
        if (this.currentFilters.difficulty !== "all" && recipe && recipe.difficulty !== this.currentFilters.difficulty) return false;
        if (this.currentFilters.difficulty !== "all" && !recipe) return false;
        if (this.currentFilters.time !== "all") {
            if (!recipe) return false;
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
        const favorites = this.getFavorites();

        for (const food of this.foods) {
            const foodName = food.name;
            const recipe = recipeDetailsDb[foodName] || null;
            if (this.isMatch(food, recipe)) {
                count++;
                const foodId = food.id;
                const isFav = favorites.includes(foodId);
                const heartStyle = isFav ? 'style="background: #ff6b6b;"' : "";
                const heartClass = isFav ? "favorited" : "";
                const displayCategory = recipe?.category || CATEGORY_LABELS[food.category] || "Món ngon";
                const displayDescription = recipe?.description || "Món ăn hấp dẫn.";
                const displayTime = recipe?.time || "Chưa cập nhật";
                const displayDifficulty = recipe?.difficulty || "N/A";
                const imageSrc = recipe?.image || FALLBACK_IMG;

                const cardHTML = `
                    <article class="food-card">
                        <div class="image-container">
                            <img src="${imageSrc}" alt="${foodName}" class="food-image">
                            <span class="food-category-badge">${displayCategory}</span>
                            <div class="food-favorite ${heartClass}" data-food-id="${foodId}" ${heartStyle}><span>❤️</span></div>
                        </div>
                        <div class="food-content">
                            <h3 class="food-name">${foodName}</h3>
                            <p class="food-description">${displayDescription}</p>
                            <div class="food-meta">
                                <span class="food-time">⏱️ ${displayTime}</span>
                                <span class="food-difficulty">${displayDifficulty}</span>
                            </div>
                            <button class="view-recipe-btn">Xem Công Thức</button>
                        </div>
                    </article>
                `;
                foodGrid.innerHTML += cardHTML;
            }
        }

        if (resultCount) resultCount.innerText = `Hiển thị ${count} món ăn`;

        if (count === 0) {
            foodGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <h3>Không tìm thấy món ăn phù hợp 😢</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé!</p>
            </div>`;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    RecipeManager.init();
});

window.showRecipeDetails = (name) => RecipeManager.showDetails(name);
window.closeRecipeModal = () => RecipeManager.closeModal();

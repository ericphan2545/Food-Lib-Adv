// ==========================================================================
// RECIPE MANAGER UI LOGIC
// Depends on window.RECIPES_DB from recipes.js
// ==========================================================================
const recipesDB = (typeof window !== "undefined" && window.RECIPES_DB) ? window.RECIPES_DB : {};

const RecipeManager = {
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
        category: "Tất cả",
        difficulty: "all",
        time: "all"
    },

    getFoodIdByName(foodName) {
        if (typeof FOOD_DATABASE !== "undefined" && Array.isArray(FOOD_DATABASE)) {
            const match = FOOD_DATABASE.find((f) => f.name === foodName);
            if (match && Number.isFinite(match.id)) return match.id;
        }
        const fallbackNames = Object.keys(recipesDB);
        const fallbackIndex = fallbackNames.indexOf(foodName);
        return fallbackIndex >= 0 ? fallbackIndex + 1 : null;
    },

    // --- KHỞI TẠO ---
    init() {
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
            const foodNames = Object.keys(recipesDB);
            const idx = foodNames.indexOf(foodName);
            return idx >= 0 ? idx + 1 : null;
        };

        const toggleFavoriteById = (foodId, heartEl) => {
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const index = favorites.indexOf(foodId);
            const isFav = index >= 0;

            if (isFav) favorites.splice(index, 1);
            else favorites.push(foodId);

            localStorage.setItem("favorites", JSON.stringify(favorites));

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
                this.currentFilters.category = btn.innerText.trim();
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
        const recipe = recipesDB[foodName];
        const foodId = this.getFoodIdByName(foodName);

        if (recipe && modal && modalBody) {
            const ingredientsHtml = recipe.ingredients.map((item) => `<li>${item}</li>`).join("");
            const instructionsHtml = recipe.instructions.map((step) => `<li>${step}</li>`).join("");

            let nutritionHtml = "";
            if (typeof FOOD_DATABASE !== "undefined") {
                const nutritionData = FOOD_DATABASE.find((f) => f.name === foodName);
                if (nutritionData) {
                    nutritionHtml = `
                        <div class="nutrition-box-under-img">
                            <h4 class="nutrition-title-small">Dinh dưỡng (1 khẩu phần)</h4>
                            <div class="nutrition-grid-small">
                                <div class="nutri-item">
                                    <span class="nutri-val">${nutritionData.calories}</span>
                                    <span class="nutri-label">Kcal</span>
                                </div>
                                <div class="nutri-item">
                                    <span class="nutri-val">${nutritionData.carbs}g</span>
                                    <span class="nutri-label">Carbs</span>
                                </div>
                                <div class="nutri-item">
                                    <span class="nutri-val">${nutritionData.protein}g</span>
                                    <span class="nutri-label">Protein</span>
                                </div>
                                <div class="nutri-item">
                                    <span class="nutri-val">${nutritionData.fat}g</span>
                                    <span class="nutri-label">Fat</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            modalBody.innerHTML = `
                <div class="recipe-detail-layout">
                    <div class="recipe-column recipe-col-image">
                        <img src="${recipe.image}" alt="${foodName}" class="recipe-detail-image">
                        ${nutritionHtml}
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

            this.handleModalFavoriteBtn(foodId);

            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
            document.body.style.overflow = "hidden";
        } else {
            alert(`Chưa có công thức cho món này: ${foodName}`);
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
    },

    handleModalFavoriteBtn(foodId) {
        const oldBtn = document.querySelector("#recipe-modal .food-favorite");
        if (oldBtn) {
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const isFavorite = favorites.includes(foodId);

            if (isFavorite) {
                newBtn.classList.add("favorited");
                newBtn.style.background = "#ff6b6b";
            } else {
                newBtn.classList.remove("favorited");
                newBtn.style.background = "var(--white)";
            }

            newBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                favorites = JSON.parse(localStorage.getItem("favorites")) || [];
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
                localStorage.setItem("favorites", JSON.stringify(favorites));
                window.dispatchEvent(new CustomEvent("favoritesUpdated"));
                window.dispatchEvent(new Event("storage"));
            });
        }
    },

    parseTime(timeString) {
        if (!timeString) return 0;
        const matches = timeString.match(/(\d+)/);
        return matches ? parseInt(matches[0], 10) : 0;
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

        for (const foodName in recipesDB) {
            const recipe = recipesDB[foodName];
            if (this.isMatch(foodName, recipe)) {
                count++;
                const foodId = this.getFoodIdByName(foodName);
                const isFav = favorites.includes(foodId);
                const heartStyle = isFav ? 'style="background: #ff6b6b;"' : "";
                const heartClass = isFav ? "favorited" : "";

                const cardHTML = `
                    <article class="food-card">
                        <div class="image-container">
                            <img src="${recipe.image}" alt="${foodName}" class="food-image">
                            <span class="food-category-badge">${recipe.category || "Món Ngon"}</span>
                            <div class="food-favorite ${heartClass}" data-food-id="${foodId}" ${heartStyle}><span>❤️</span></div>
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

/**
 * Food Library - Quản lý trang thư viện món ăn
 */
import "../css/style.css";
const FoodLibrary = {
  // DOM Elements
  elements: {
    filterBtns: null,
    favoriteBtns: null,
    searchInput: null,
    searchBtn: null,
    foodCards: null,
    resultCount: null,
  },

  // Khởi tạo
  init() {
    this.cacheElements();
    this.bindEvents();
    this.updateFavoriteStates(); // Cập nhật trạng thái yêu thích khi trang load
    
    // Lắng nghe sự kiện cập nhật favorites từ các trang khác
    window.addEventListener('favoritesUpdated', () => {
      this.updateFavoriteStates();
    });
    
    // Lắng nghe storage event (khi có thay đổi từ tab khác)
    window.addEventListener('storage', () => {
      this.updateFavoriteStates();
    });
  },

  // Cache các DOM elements
  cacheElements() {
    this.elements.filterBtns = document.querySelectorAll(".filter-btn");
    this.elements.favoriteBtns = document.querySelectorAll(".food-favorite");
    this.elements.searchInput = document.querySelector(".search-input");
    this.elements.searchBtn = document.querySelector(".btn-primary");
    this.elements.foodCards = document.querySelectorAll(".food-card");
    this.elements.resultCount = document.querySelector(".result-count");
  },

  // Bind tất cả events
  bindEvents() {
    this.bindFilterButtons();
    this.bindFavoriteButtons();
    this.bindSearch();
  },

  // Xử lý filter buttons
  bindFilterButtons() {
    const { filterBtns } = this.elements;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class từ tất cả buttons
        filterBtns.forEach((b) => b.classList.remove("active"));
        // Add active class cho button được click
        btn.classList.add("active");

        // Lọc món ăn theo category
        this.filterByCategory(btn.textContent.trim());
      });
    });
  },

  // Lọc món ăn theo category
  filterByCategory(category) {
    const { foodCards, resultCount } = this.elements;
    let visibleCount = 0;

    foodCards.forEach((card) => {
      const cardCategory = card
        .querySelector(".food-category-badge")
        ?.textContent.trim();

      if (category === "Tất cả" || cardCategory === category) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultCount) {
      resultCount.textContent = `Hiển thị ${visibleCount} món ăn`;
    }
  },

  // Xử lý favorite buttons
  bindFavoriteButtons() {
    const { favoriteBtns } = this.elements;

    favoriteBtns.forEach((btn, index) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleFavorite(btn, index + 1); // Food ID is 1-8 based on card position
      });
    });
  },

  // Cập nhật trạng thái yêu thích khi trang load
  updateFavoriteStates() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const { favoriteBtns } = this.elements;

    favoriteBtns.forEach((btn, index) => {
      const foodId = index + 1;
      if (favorites.includes(foodId)) {
        btn.classList.add("favorited");
        btn.style.background = "#ff6b6b";
      } else {
        btn.classList.remove("favorited");
        btn.style.background = "var(--white)";
      }
    });
  },

  // Toggle trạng thái favorite
  toggleFavorite(btn, foodId) {
    const isActive = btn.classList.contains("favorited");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isActive) {
      btn.classList.remove("favorited");
      btn.style.background = "var(--white)";
      // Remove from favorites
      favorites = favorites.filter((id) => id !== foodId);
    } else {
      btn.classList.add("favorited");
      btn.style.background = "#ff6b6b";
      // Add to favorites
      if (!favorites.includes(foodId)) {
        favorites.push(foodId);
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  },

  // Xử lý search
  bindSearch() {
    const { searchInput, searchBtn } = this.elements;

    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.performSearch());
    }

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performSearch();
        }
      });

      // Search khi người dùng ngừng gõ (debounce)
      let debounceTimer;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => this.performSearch(), 300);
      });
    }
  },

  // Thực hiện tìm kiếm
  performSearch() {
    const { searchInput, foodCards, resultCount } = this.elements;
    const searchTerm = searchInput?.value.toLowerCase().trim() || "";
    let visibleCount = 0;

    foodCards.forEach((card) => {
      const foodName =
        card.querySelector(".food-name")?.textContent.toLowerCase() || "";
      const foodDesc =
        card.querySelector(".food-description")?.textContent.toLowerCase() ||
        "";

      if (foodName.includes(searchTerm) || foodDesc.includes(searchTerm)) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultCount) {
      resultCount.textContent = `Hiển thị ${visibleCount} món ăn`;
    }
  },

  // Reset tất cả filters và search
  reset() {
    const { filterBtns, searchInput, foodCards, resultCount } = this.elements;

    // Reset filter buttons
    filterBtns.forEach((btn, index) => {
      btn.classList.toggle("active", index === 0);
    });

    // Reset search input
    if (searchInput) {
      searchInput.value = "";
    }

    // Show all cards
    foodCards.forEach((card) => {
      card.style.display = "flex";
    });

    // Update count
    if (resultCount) {
      resultCount.textContent = `Hiển thị ${foodCards.length} món ăn`;
    }
  },
};

// Khởi tạo khi DOM ready
document.addEventListener("DOMContentLoaded", () => {
  FoodLibrary.init();
});

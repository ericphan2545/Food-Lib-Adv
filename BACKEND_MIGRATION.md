# Food Library - Backend Migration Complete

## Overview

All client-side logic from the `frontend/public/js` folder has been successfully moved to the backend. The application now uses server-side data persistence with MongoDB instead of localStorage.

## Changes Summary

### Backend Structure
- **Models**: Food, Recipe, MealPlan, User (updated)
- **Controllers**: foodController, favoritesController, mealPlanController
- **Routes**: apiRoutes for all CRUD operations
- **API Endpoints**: /api/* for all data operations

### Frontend Changes
All JavaScript files now make API calls instead of using localStorage:

1. **food-database.js** - Fetches food list from `/api/foods`
2. **recipes.js** - Loads recipes from `/api/recipes`, manages favorites via API
3. **favorites.js** - Displays and manages user favorites from backend
4. **meal-planner.js** - Saves all meal planning data to `/api/meal-plans/*`
5. **theme.js** - Remains client-side (localStorage)
6. **nav-indicator.js** - Remains client-side (no persistence needed)

### New Files Created

Backend:
- `backend/models/Food.js`
- `backend/models/Recipe.js`
- `backend/models/MealPlan.js`
- `backend/controllers/foodController.js`
- `backend/controllers/favoritesController.js`
- `backend/controllers/mealPlanController.js`
- `backend/routes/apiRoutes.js`
- `seed.js` (data initialization script)

### Updated  Files

- `backend/app.js` - Added API routes
- `backend/models/User.js` - Added favorites array field

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Before running the application, populate MongoDB with food and recipe data:

```bash
node seed.js
```

This will:
- Connect to MongoDB (uses MONGODB_URI from .env)
- Clear existing Food and Recipe collections
- Insert all food items and recipes
- Close connection

### 3. Start Application
```bash
npm start
```

The application will:
- Run on PORT from .env (default 3000)
- Load backend API routes at `/api/*`
- Serve frontend static files
- Handle user authentication/sessions

## API Endpoints

### Food & Recipes
- `GET /api/foods` - Get all foods with nutritional info
- `GET /api/foods/:id` - Get specific food by ID
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:name` - Get recipe by name
- `GET /api/recipes/search?search=X&category=Y&difficulty=Z&time=W` - Search recipes

### Favorites (requires login)
- `GET /api/favorites` - Get user's favorite food IDs
- `POST /api/favorites/add` - Add favorite (body: `{foodId}`)
- `POST /api/favorites/remove` - Remove favorite (body: `{foodId}`)
- `POST /api/favorites/toggle` - Toggle favorite (body: `{foodId}`)

### Meal Planning (requires login)
- `GET /api/meal-plans` - Get user's meal plan data
- `POST /api/meal-plans/update` - Update complete meal plan
- `POST /api/meal-plans/save-meal` - Save meal to slot
- `POST /api/meal-plans/remove-meal` - Remove meal from slot
- `POST /api/meal-plans/calculate-bmi` - Calculate BMI/TDEE
- `POST /api/meal-plans/auto-generate` - Auto-generate weekly meal plan

## Data Flow

### Favorites Example
1. User clicks heart icon on recipes page
2. Frontend calls `/api/favorites/toggle`
3. Backend updates User model favorites array
4. Frontend updates UI based on response

### Meal Planning Example
1. User selects food for meal slot
2. Frontend calls `/api/meal-plans/save-meal`
3. Backend saves to MealPlan collection
4. Next login loads saved meal plan from `/api/meal-plans`

## Key Improvements

✅ **User-Specific Data**: Each user has their own favorites and meal plans
✅ **Data Persistence**: All data survives browser refresh and session logout
✅ **Server-Side Validation**: Input validation occurs on backend
✅ **Security**: Session-based authentication for personalized endpoints
✅ **Scalability**: Database structure supports multiple users
✅ **Sync**: All clients owned by same user see consistent data

## Frontend Logic Maintained

### Client-Side Logic (No Changes)
- **Theme Toggle**: Light/dark mode using localStorage
- **Navigation Indicator**: Active link highlighting
- **UI Rendering**: All meal planner, favorite cards, recipe modal rendering
- **BMI Calculations**: All nutritional math done on frontend
- **Local State**: Temporary UI state during interactions

### Moved to Backend
- **Favorites Storage**: Now in User model
- **Meal Plan Storage**: Now in MealPlan model
- **Recipe Data**: Now in Recipe model
- **Food Database**: Now in Food model

## Project Status

🎉 **Complete** - All logic successfully moved from client-side to backend while maintaining full functionality.

## Notes

- Seed script populates 41 food items and 5 detailed recipes
- All timestamps recorded when data is created/updated
- User authentication middleware (`requireLogin`) protects personalized endpoints
- Theme and navigation logic remain client-side for performance
- All API endpoints return JSON responses

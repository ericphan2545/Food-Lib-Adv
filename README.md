# FoodLibAdv

Food library and weekly meal-planner app built with Express + EJS + MongoDB.

## Tech Stack

- Backend: Node.js, Express, Mongoose
- View: EJS templates
- Storage: MongoDB (foods, users, profile)
- Session: `express-session` + `connect-mongo`

## Project Structure

```text
backend/
  app.js
  config/
  controllers/
  data/
  middleware/
  models/
  routes/
  views/
public/
  css/
  js/
```

## Scripts

- `npm run dev`: start development server with nodemon
- `npm start`: start production mode

## Environment Variables

Create `.env` in project root:

```env
MONGODB_URI=mongodb://localhost:27017/food_lib_adv
SESSION_SECRET=your_session_secret
PORT=3000
```

## Refactor Direction

Current priority:

1. Keep one canonical source for food/recipe data.
2. Split large frontend scripts into smaller modules by concern.
3. Replace inline `onclick` handlers with delegated listeners.
4. Extract shared EJS partials for header/footer.

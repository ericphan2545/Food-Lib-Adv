const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Food = require("./backend/models/Food");
const Recipe = require("./backend/models/Recipe");

const foodDatabase = [
  { id: 1, name: "Cơm gà Hội An", emoji: "🍗", calories: 580, carbs: 65, protein: 32, fat: 18, fiber: 2, category: "balanced", meal: "lunch" },
  { id: 2, name: "Phở bò Hà Nội", emoji: "🍜", calories: 450, carbs: 65, protein: 25, fat: 10, fiber: 2, category: "balanced", meal: "breakfast" },
  { id: 3, name: "Bún chả Hà Nội", emoji: "🥓", calories: 520, carbs: 55, protein: 28, fat: 20, fiber: 4, category: "protein", meal: "lunch" },
  { id: 4, name: "Bánh mì thịt", emoji: "🥖", calories: 380, carbs: 45, protein: 15, fat: 16, fiber: 3, category: "balanced", meal: "breakfast" },
  { id: 5, name: "Gỏi cuốn tôm thịt", emoji: "🦐", calories: 180, carbs: 25, protein: 12, fat: 4, fiber: 6, category: "fiber", meal: "dinner" },
  { id: 6, name: "Bún bò Huế", emoji: "🍜", calories: 480, carbs: 52, protein: 28, fat: 18, fiber: 3, category: "balanced", meal: "breakfast" },
  { id: 7, name: "Cá kho tộ", emoji: "🐟", calories: 300, carbs: 10, protein: 35, fat: 12, fiber: 1, category: "protein", meal: "dinner" },
  { id: 8, name: "Thịt kho tàu", emoji: "🍲", calories: 450, carbs: 5, protein: 25, fat: 35, fiber: 0, category: "fat", meal: "dinner" },
  { id: 9, name: "Canh chua cá", emoji: "🥣", calories: 150, carbs: 10, protein: 15, fat: 5, fiber: 4, category: "balanced", meal: "dinner" },
  { id: 10, name: "Chả giò (Nem rán)", emoji: "🌯", calories: 350, carbs: 30, protein: 10, fat: 20, fiber: 2, category: "fat", meal: "lunch" },
  { id: 11, name: "Cơm tấm sườn bì chả", emoji: "🍛", calories: 650, carbs: 75, protein: 35, fat: 22, fiber: 3, category: "balanced", meal: "lunch" },
  { id: 12, name: "Mì Quảng", emoji: "🍜", calories: 500, carbs: 60, protein: 25, fat: 15, fiber: 3, category: "balanced", meal: "lunch" },
  { id: 13, name: "Bánh xèo", emoji: "🥞", calories: 550, carbs: 45, protein: 20, fat: 30, fiber: 5, category: "fat", meal: "dinner" },
  { id: 14, name: "Hủ tiếu Nam Vang", emoji: "🍜", calories: 420, carbs: 50, protein: 22, fat: 12, fiber: 2, category: "balanced", meal: "breakfast" },
  { id: 15, name: "Bò lúc lắc", emoji: "🥩", calories: 400, carbs: 10, protein: 35, fat: 25, fiber: 2, category: "protein", meal: "dinner" },
  { id: 16, name: "Gà nướng muối ớt", emoji: "🍗", calories: 350, carbs: 5, protein: 40, fat: 18, fiber: 1, category: "protein", meal: "dinner" },
  { id: 17, name: "Lẩu thái hải sản", emoji: "🥘", calories: 450, carbs: 30, protein: 35, fat: 22, fiber: 6, category: "balanced", meal: "dinner" },
  { id: 18, name: "Cháo lòng", emoji: "🥣", calories: 400, carbs: 40, protein: 20, fat: 18, fiber: 1, category: "balanced", meal: "breakfast" },
  { id: 19, name: "Bún riêu cua", emoji: "🍜", calories: 350, carbs: 48, protein: 18, fat: 9, fiber: 3, category: "balanced", meal: "breakfast" },
  { id: 20, name: "Xôi gà", emoji: "🍚", calories: 420, carbs: 55, protein: 20, fat: 14, fiber: 2, category: "carbs", meal: "breakfast" },
  { id: 21, name: "Bánh cuốn", emoji: "🍥", calories: 300, carbs: 42, protein: 12, fat: 10, fiber: 2, category: "carbs", meal: "breakfast" },
  { id: 22, name: "Bún đậu mắm tôm", emoji: "🥗", calories: 600, carbs: 65, protein: 30, fat: 25, fiber: 5, category: "balanced", meal: "lunch" },
  { id: 23, name: "Bánh canh cua", emoji: "🍜", calories: 400, carbs: 45, protein: 20, fat: 12, fiber: 2, category: "balanced", meal: "breakfast" },
  { id: 24, name: "Cơm chiên dương châu", emoji: "🍛", calories: 550, carbs: 70, protein: 18, fat: 22, fiber: 3, category: "carbs", meal: "lunch" },
  { id: 25, name: "Gà kho gừng", emoji: "🍲", calories: 350, carbs: 5, protein: 35, fat: 20, fiber: 1, category: "protein", meal: "dinner" },
  { id: 26, name: "Tôm rim mặn ngọt", emoji: "🦐", calories: 250, carbs: 10, protein: 30, fat: 10, fiber: 0, category: "protein", meal: "dinner" },
  { id: 27, name: "Canh khổ qua nhồi thịt", emoji: "🥣", calories: 150, carbs: 10, protein: 15, fat: 8, fiber: 3, category: "balanced", meal: "dinner" },
  { id: 28, name: "Thịt heo quay", emoji: "🍖", calories: 600, carbs: 5, protein: 25, fat: 50, fiber: 0, category: "fat", meal: "lunch" },
  { id: 29, name: "Vịt nấu chao", emoji: "🍲", calories: 550, carbs: 30, protein: 25, fat: 35, fiber: 4, category: "fat", meal: "dinner" },
  { id: 30, name: "Chè đậu xanh", emoji: "🍧", calories: 300, carbs: 50, protein: 8, fat: 6, fiber: 4, category: "carbs", meal: "dinner" },
  { id: 31, name: "Bánh flan", emoji: "🍮", calories: 200, carbs: 25, protein: 8, fat: 8, fiber: 0, category: "fat", meal: "dinner" },
  { id: 32, name: "Chè ba màu", emoji: "🍧", calories: 350, carbs: 60, protein: 10, fat: 8, fiber: 5, category: "carbs", meal: "lunch" },
  { id: 33, name: "Sườn xào chua ngọt", emoji: "🍖", calories: 500, carbs: 20, protein: 30, fat: 35, fiber: 2, category: "protein", meal: "dinner" },
  { id: 34, name: "Đậu hũ sốt cà", emoji: "🥘", calories: 220, carbs: 18, protein: 15, fat: 12, fiber: 4, category: "protein", meal: "lunch" },
  { id: 35, name: "Cá chiên xù", emoji: "🐟", calories: 400, carbs: 30, protein: 25, fat: 20, fiber: 1, category: "protein", meal: "lunch" },
  { id: 36, name: "Rau muống xào tỏi", emoji: "🥬", calories: 120, carbs: 10, protein: 5, fat: 8, fiber: 6, category: "fiber", meal: "dinner" },
  { id: 37, name: "Súp cua", emoji: "🥣", calories: 200, carbs: 15, protein: 15, fat: 8, fiber: 2, category: "balanced", meal: "breakfast" },
  { id: 38, name: "Bò né", emoji: "🍳", calories: 550, carbs: 30, protein: 35, fat: 35, fiber: 2, category: "protein", meal: "breakfast" },
  { id: 39, name: "Gỏi gà xé phay", emoji: "🥗", calories: 250, carbs: 15, protein: 30, fat: 10, fiber: 6, category: "protein", meal: "dinner" },
  { id: 40, name: "Bánh bột lọc", emoji: "🥟", calories: 300, carbs: 45, protein: 10, fat: 10, fiber: 1, category: "carbs", meal: "lunch" },
  { id: 41, name: "Cơm cháy chà bông", emoji: "🍘", calories: 450, carbs: 60, protein: 15, fat: 20, fiber: 1, category: "carbs", meal: "lunch" },
];

const recipes = [
  {
    name: "Cơm gà Hội An",
    image: "https://sf-static.upanhlaylink.com/img/image_20251211bb8eaa78a49193e39bf1374969bb2713.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Cơm gà vàng ươm thơm lừng, thịt gà dai ngọt đặc sản phố Hội.",
    ingredients: ["1 bát gạo", "150g ức gà", "Rau thơm, hành", "Nghệ tươi", "Nước mắm, tiêu"],
    instructions: ["Luộc gà với gừng và hành", "Nấu cơm bằng nước luộc gà và nghệ", "Xé gà trộn với hành phi và gia vị", "Dọn cơm kèm rau thơm và nước mắm"],
  },
  {
    name: "Phở bò Hà Nội",
    image: "https://sf-static.upanhlaylink.com/img/image_202512111dfcf065cac26fc487bbc61bf06b3880.jpg",
    category: "Món nước",
    time: "180 phút",
    difficulty: "Khó",
    description: "Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương bò.",
    ingredients: ["200g bánh phở", "150g thịt bò", "Xương bò", "Hành, gừng, quế, hồi", "Rau thơm, giá đỗ"],
    instructions: ["Ninh xương bò với gừng nướng trong 4-5 tiếng", "Thêm quế, hồi, thảo quả vào nước dùng", "Trụng bánh phở, xếp thịt bò lên trên", "Chan nước dùng nóng, thêm hành và rau thơm"],
  },
  {
    name: "Bún chả Hà Nội",
    image: "https://sf-static.upanhlaylink.com/img/image_202512118dae424aca7dcc6e03d49502e50564ad.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Thịt nướng than hoa thơm lừng ăn kèm bún và nước mắm chua ngọt.",
    ingredients: ["300g thịt ba chỉ", "200g thịt nạc vai xay", "200g bún tươi", "Nước mắm, đường, tỏi", "Rau sống, dưa góp"],
    instructions: ["Ướp thịt ba chỉ với nước mắm, đường, tỏi băm", "Vo viên thịt xay, ướp gia vị tương tự", "Nướng thịt trên than hoa đến vàng thơm", "Pha nước chấm chua ngọt, thêm ớt tỏi", "Dọn bún kèm thịt nướng, rau sống và nước chấm"],
  },
  {
    name: "Bánh mì thịt",
    image: "https://sf-static.upanhlaylink.com/img/image_20251211b890f3c4b0c5a6e2042935529195dbcc.jpg",
    category: "Món mặn",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Ổ bánh mì giòn rụm kẹp pate, thịt nguội đậm đà hương vị Việt.",
    ingredients: ["1 ổ bánh mì", "100g pate gan", "80g chả lụa", "Dưa leo, đồ chua", "Rau mùi, ớt, xì dầu"],
    instructions: ["Nướng giòn bánh mì", "Phết pate đều lên ruột bánh", "Xếp chả lụa, thịt nguội lên", "Thêm dưa leo, đồ chua, rau mùi", "Rưới xì dầu và thêm ớt tùy khẩu vị"],
  },
  {
    name: "Gỏi cuốn tôm thịt",
    image: "https://sf-static.upanhlaylink.com/img/image_202512113b29efa85e5718ada0a48add33674027.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Món cuốn thanh mát với tôm thịt tươi ngon, chấm tương đen béo ngậy.",
    ingredients: ["10 tờ bánh tráng", "200g tôm sú", "150g thịt ba chỉ luộc", "Bún, rau sống, húng quế", "Đậu phộng, tương đen"],
    instructions: ["Luộc tôm và thịt ba chỉ, để nguội thái lát", "Nhúng bánh tráng qua nước ấm", "Xếp rau, bún, thịt, tôm lên bánh", "Cuốn chặt tay từ dưới lên", "Pha nước chấm tương đen với đậu phộng giã"],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food_lib_adv");
    console.log("Connected to MongoDB");

    // Clear existing data
    await Food.deleteMany({});
    await Recipe.deleteMany({});
    console.log("Cleared existing data");

    // Insert food data
    const foods = foodDatabase.map((f) => ({
      foodId: f.id,
      name: f.name,
      emoji: f.emoji,
      calories: f.calories,
      carbs: f.carbs,
      protein: f.protein,
      fat: f.fat,
      fiber: f.fiber,
      category: f.category,
      meal: f.meal,
    }));

    await Food.insertMany(foods);
    console.log(`Inserted ${foods.length} foods`);

    // Insert recipe data
    await Recipe.insertMany(recipes);
    console.log(`Inserted ${recipes.length} recipes`);

    console.log("Database seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();

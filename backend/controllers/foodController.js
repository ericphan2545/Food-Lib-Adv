const Food = require('../models/Food');
const foodSeed = require('../data/foodSeed');

function toPublicFood(foodDoc) {
  if (!foodDoc) return null;
  const source =
    typeof foodDoc.toObject === 'function'
      ? foodDoc.toObject({ versionKey: false })
      : foodDoc;
  const { _id, __v, createdAt, updatedAt, ...rest } = source;
  return rest;
}

function parseFoodId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

/**
 * Nếu database chưa có món nào thì seed từ file foodSeed.
 * Được gọi 1 lần khi app start.
 */
async function ensureSeeded() {
  const count = await Food.estimatedDocumentCount();
  if (count === 0) {
    await Food.insertMany(foodSeed, { ordered: false });
    // eslint-disable-next-line no-console
    console.log(`[Food] Seeded ${foodSeed.length} món ăn vào MongoDB.`);
  } else if (count < foodSeed.length) {
    // Bổ sung thêm các id còn thiếu (đồng bộ khi có món mới)
    const existingIds = (await Food.find({}, { id: 1, _id: 0 })).map((f) => f.id);
    const missing = foodSeed.filter((f) => !existingIds.includes(f.id));
    if (missing.length) {
      await Food.insertMany(missing, { ordered: false });
      // eslint-disable-next-line no-console
      console.log(`[Food] Đã bổ sung ${missing.length} món mới vào MongoDB.`);
    }
  }
}

async function listFoods(req, res) {
  try {
    const { category, meal, search } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (meal) query.meal = meal;
    if (search) query.name = { $regex: String(search).trim(), $options: 'i' };

    const foods = await Food.find(query).sort({ id: 1 }).lean();
    const cleaned = foods.map(({ _id, __v, createdAt, updatedAt, ...rest }) => rest);
    res.json(cleaned);
  } catch (err) {
    console.error('[Food] listFoods error:', err);
    res.status(500).json({ error: 'Không lấy được danh sách món ăn' });
  }
}

async function getFood(req, res) {
  try {
    const id = parseFoodId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID món ăn không hợp lệ' });

    const food = await Food.findOne({ id }).lean();
    if (!food) return res.status(404).json({ error: 'Không tìm thấy món' });
    res.json(toPublicFood(food));
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
}

async function createFood(req, res) {
  try {
    const max = await Food.findOne({}).sort({ id: -1 }).lean();
    const nextId = (max?.id || 0) + 1;
    const payload = { ...req.body };
    delete payload.id;
    const food = await Food.create({ ...payload, id: nextId });
    res.status(201).json(toPublicFood(food.toObject()));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateFood(req, res) {
  try {
    const id = parseFoodId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID món ăn không hợp lệ' });

    if (req.body.id !== undefined && Number(req.body.id) !== id) {
      return res.status(400).json({ error: 'Không được thay đổi ID món ăn' });
    }

    const payload = { ...req.body };
    delete payload.id;

    const updated = await Food.findOneAndUpdate(
      { id },
      payload,
      { new: true, runValidators: true },
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Không tìm thấy món' });
    res.json(toPublicFood(updated));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteFood(req, res) {
  try {
    const id = parseFoodId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID món ăn không hợp lệ' });

    const deleted = await Food.findOneAndDelete({ id }).lean();
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy món' });

    res.json({ message: 'Đã xóa món ăn', food: toPublicFood(deleted) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { ensureSeeded, listFoods, getFood, createFood, updateFood, deleteFood };

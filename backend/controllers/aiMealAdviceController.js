const { GoogleGenerativeAI } = require('@google/generative-ai');
const Food = require('../models/Food');
const User = require('../models/User');

function normalizeIngredients(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((x) => String(x || '').trim())
      .filter(Boolean)
      .slice(0, 50);
  }
  return String(raw)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 50);
}

function parseIngredientsText(rawText) {
  if (!rawText) return [];
  return String(rawText)
    .split(/[\n,;|]/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 80);
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function classifyBMIText(bmi) {
  const b = Number(bmi);
  if (!Number.isFinite(b)) return 'Chưa xác định';
  if (b < 18.5) return 'Thiếu cân';
  if (b < 23) return 'Bình thường';
  if (b < 25) return 'Thừa cân nhẹ';
  if (b < 30) return 'Thừa cân';
  return 'Béo phì';
}

function normalizeTextForMatch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const INGREDIENT_STOPWORDS = new Set([
  'kg',
  'g',
  'gram',
  'grams',
  'ml',
  'l',
  'lit',
  'qua',
  'trai',
  'bat',
  'to',
  'hop',
  'goi',
  'muong',
  'thia',
  'it',
  'nhieu',
  'mot',
  'hai',
  'ba',
  'bon',
  'nam',
  'co',
  'va',
  'voi',
  'tuoi',
  'song',
  'chin',
  'ngot',
  'man',
]);

function sanitizeIngredientToken(token) {
  return String(token || '')
    .replace(/[0-9]/g, '')
    .replace(/[^\p{L}\s]/gu, ' ')
    .trim();
}

function buildIngredientKeywords(ingredients = []) {
  const keywords = new Set();
  ingredients.forEach((item) => {
    const text = normalizeTextForMatch(sanitizeIngredientToken(item)).trim();
    if (!text) return;
    if (!INGREDIENT_STOPWORDS.has(text) && text.length >= 2) keywords.add(text);
    text
      .split(/\s+/g)
      .map((x) => x.trim().replace(/[0-9]/g, ''))
      .filter((x) => x.length >= 2 && !INGREDIENT_STOPWORDS.has(x))
      .forEach((word) => keywords.add(word));
  });
  return Array.from(keywords).slice(0, 120);
}

function getBmiFallbackStrategy(bmi, targetCalories) {
  const b = Number(bmi);
  const category = classifyBMIText(b);
  const hasTarget = Number.isFinite(Number(targetCalories)) && Number(targetCalories) > 0;
  const kcal = hasTarget
    ? Number(targetCalories)
    : b < 18.5
      ? 2300
      : b < 23
        ? 2000
        : b < 25
          ? 1800
          : b < 30
            ? 1650
            : 1500;

  let mealRatios = { breakfast: 0.3, lunch: 0.4, dinner: 0.3 };
  let categoryWeights = { protein: 1.1, fiber: 0.8, balanced: 1, carbs: 1, fat: 0.7 };
  if (category === 'Thiếu cân') {
    mealRatios = { breakfast: 0.3, lunch: 0.4, dinner: 0.3 };
    categoryWeights = { protein: 1.15, fiber: 0.8, balanced: 1.1, carbs: 1.05, fat: 0.9 };
  } else if (category === 'Bình thường') {
    mealRatios = { breakfast: 0.28, lunch: 0.37, dinner: 0.35 };
    categoryWeights = { protein: 1.1, fiber: 1, balanced: 1.1, carbs: 0.95, fat: 0.85 };
  } else if (category === 'Thừa cân nhẹ') {
    mealRatios = { breakfast: 0.27, lunch: 0.38, dinner: 0.35 };
    categoryWeights = { protein: 1.2, fiber: 1.2, balanced: 1.05, carbs: 0.8, fat: 0.7 };
  } else if (category === 'Thừa cân' || category === 'Béo phì') {
    mealRatios = { breakfast: 0.28, lunch: 0.4, dinner: 0.32 };
    categoryWeights = { protein: 1.25, fiber: 1.25, balanced: 1.05, carbs: 0.75, fat: 0.6 };
  }

  return {
    category,
    targetCalories: kcal,
    mealTargets: {
      breakfast: Math.round(kcal * mealRatios.breakfast),
      lunch: Math.round(kcal * mealRatios.lunch),
      dinner: Math.round(kcal * mealRatios.dinner),
    },
    categoryWeights,
  };
}

function scoreIngredientMatch(food, ingredientKeywords) {
  if (!food || !ingredientKeywords?.length) return { score: 0, matches: [] };
  const haystack = normalizeTextForMatch([food.name, ...(food.ingredients || [])].join(' '));
  const matches = [];
  let score = 0;
  ingredientKeywords.forEach((kw) => {
    if (kw.length < 2 || INGREDIENT_STOPWORDS.has(kw)) return;
    if (haystack.includes(kw)) {
      matches.push(kw);
      score += kw.length >= 5 ? 2 : 1;
    }
  });
  return { score: Math.min(score, 10), matches: matches.slice(0, 3) };
}

function pickRuleBasedFood(pool, options) {
  const { targetMealCalories, ingredientKeywords, strategy, used } = options;
  if (!Array.isArray(pool) || !pool.length) return null;

  const ranked = pool
    .map((food) => {
      const calories = Number(food?.calories) || 0;
      const macroBalance = strategy.categoryWeights[food?.category] || 1;
      const diffRatio = targetMealCalories > 0 ? Math.abs(calories - targetMealCalories) / targetMealCalories : 0;
      const calorieScore = Math.max(0, 1.2 - diffRatio); // 0..1.2
      const ingredientMatch = scoreIngredientMatch(food, ingredientKeywords);
      const usedCount = used.get(food.id) || 0;
      const totalScore =
        calorieScore * 50 +
        macroBalance * 24 +
        ingredientMatch.score * 9 -
        usedCount * 12 -
        (calories > targetMealCalories * 1.6 ? 20 : 0);
      return { food, totalScore, ingredientMatch };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.food.id - b.food.id);

  return ranked[0];
}

function evaluateWeekPlanIngredientFit(weekPlan, foodIndex, ingredientKeywords) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];
  let totalMeals = 0;
  let matchedMeals = 0;
  days.forEach((day) => {
    meals.forEach((meal) => {
      const foodId = Number(weekPlan?.[day]?.[meal]?.foodId);
      if (!Number.isFinite(foodId)) return;
      totalMeals += 1;
      const food = foodIndex.byId.get(foodId);
      if (!food) return;
      const match = scoreIngredientMatch(food, ingredientKeywords);
      if (match.score > 0) matchedMeals += 1;
    });
  });
  const coverage = totalMeals > 0 ? matchedMeals / totalMeals : 0;
  return { coverage, matchedMeals, totalMeals };
}

function buildFoodIndex(foods = []) {
  const byId = new Map();
  const byMeal = { breakfast: [], lunch: [], dinner: [] };
  foods.forEach((food) => {
    byId.set(Number(food.id), food);
    if (food.meal === 'breakfast' || food.meal === 'lunch' || food.meal === 'dinner') {
      byMeal[food.meal].push(food);
    } else {
      byMeal.breakfast.push(food);
      byMeal.lunch.push(food);
      byMeal.dinner.push(food);
    }
  });
  return { byId, byMeal };
}

function pickFallbackFoodId(byMeal, mealKey, idx, used = new Map()) {
  const pool = byMeal[mealKey] || [];
  if (!pool.length) return null;
  const scored = pool
    .map((f) => ({ food: f, used: used.get(f.id) || 0 }))
    .sort((a, b) => a.used - b.used || a.food.id - b.food.id);
  const picked = scored[idx % scored.length]?.food || scored[0].food;
  used.set(picked.id, (used.get(picked.id) || 0) + 1);
  return picked.id;
}

function ensureWeekPlanShape(weekPlan, foodIndex) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];
  const used = new Map();
  const normalized = {};
  days.forEach((day) => {
    const source = weekPlan?.[day] || {};
    normalized[day] = {};
    meals.forEach((meal, idx) => {
      const item = source?.[meal] || {};
      const parsedId = Number(item?.foodId);
      const validId = foodIndex.byId.has(parsedId)
        ? parsedId
        : pickFallbackFoodId(foodIndex.byMeal, meal, idx, used);
      normalized[day][meal] = {
        foodId: validId,
        reason: String(item?.reason || 'Phù hợp mục tiêu và nguyên liệu tuần').trim().slice(0, 180),
      };
    });
    normalized[day].totalCalories = meals.reduce((sum, meal) => {
      const foodId = normalized[day][meal]?.foodId;
      const food = foodIndex.byId.get(foodId);
      return sum + (Number(food?.calories) || 0);
    }, 0);
  });
  return normalized;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFriendlyAiErrorMessage(reason) {
  const text = String(reason || '').toLowerCase();
  if (!text) return 'AI tạm thời chưa sẵn sàng, hệ thống đã dùng gợi ý dự phòng.';
  if (text.includes('quota') || text.includes('too many requests') || text.includes('429')) {
    return 'AI đang vượt giới hạn sử dụng tạm thời, hệ thống đã chuyển sang gợi ý dự phòng.';
  }
  if (text.includes('503') || text.includes('service unavailable') || text.includes('high demand')) {
    return 'AI đang quá tải, hệ thống đã chuyển sang gợi ý dự phòng.';
  }
  if (text.includes('json')) {
    return 'AI trả dữ liệu chưa đúng định dạng, hệ thống đã dùng gợi ý dự phòng ổn định hơn.';
  }
  return 'AI tạm thời chưa sẵn sàng, hệ thống đã dùng gợi ý dự phòng.';
}

async function saveAiHistory(userId, payload) {
  if (!userId || !payload) return;
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          aiHistory: {
            $each: [payload],
            $slice: -20,
          },
        },
      },
      { returnDocument: 'before' },
    );
  } catch (err) {
    console.warn('[AI] không lưu được history:', err?.message || err);
  }
}

function normalizeAiResponse(parsed, profile, bmi, targetCalories, foodIndex, source = 'gemini') {
  const weekPlan = ensureWeekPlanShape(parsed?.weekPlan, foodIndex);
  return {
    source,
    bmiSummary: {
      category: parsed?.bmiSummary?.category || profile?.bmiCategory || classifyBMIText(bmi),
      targetCalories: Number(parsed?.bmiSummary?.targetCalories) || targetCalories || 0,
      tips: Array.isArray(parsed?.bmiSummary?.tips) ? parsed.bmiSummary.tips.slice(0, 8) : [],
    },
    weekPlan,
    shoppingSuggestions: Array.isArray(parsed?.shoppingSuggestions) ? parsed.shoppingSuggestions.slice(0, 12) : [],
    notes: Array.isArray(parsed?.notes) ? parsed.notes.slice(0, 8) : [],
  };
}

function createLocalFallbackPlan({ bmi, targetCalories, ingredients, profile, reason, foodIndex }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const strategy = getBmiFallbackStrategy(bmi, targetCalories);
  const ingredientKeywords = buildIngredientKeywords(ingredients);
  const used = new Map();
  const usedIngredientKeywords = new Set();

  const weekPlan = {};
  days.forEach((day) => {
    const breakfastPick = pickRuleBasedFood(foodIndex.byMeal.breakfast || [], {
      targetMealCalories: strategy.mealTargets.breakfast,
      ingredientKeywords,
      strategy,
      used,
    });
    const lunchPick = pickRuleBasedFood(foodIndex.byMeal.lunch || [], {
      targetMealCalories: strategy.mealTargets.lunch,
      ingredientKeywords,
      strategy,
      used,
    });
    const dinnerPick = pickRuleBasedFood(foodIndex.byMeal.dinner || [], {
      targetMealCalories: strategy.mealTargets.dinner,
      ingredientKeywords,
      strategy,
      used,
    });

    [breakfastPick, lunchPick, dinnerPick].forEach((pickItem) => {
      if (pickItem?.food?.id) used.set(pickItem.food.id, (used.get(pickItem.food.id) || 0) + 1);
      (pickItem?.ingredientMatch?.matches || []).forEach((x) => usedIngredientKeywords.add(x));
    });

    const buildReason = (pickItem, mealName) => {
      if (!pickItem?.food?.id) return `Ưu tiên món ${mealName} có trong hệ thống cho kế hoạch dự phòng.`;
      const matched = pickItem?.ingredientMatch?.matches || [];
      const matchedText = matched.length ? `, tận dụng ${matched.join(', ')}` : '';
      return `Theo BMI ${strategy.category} và mục tiêu ${strategy.mealTargets[mealName]} kcal/bữa ${mealName}${matchedText}.`;
    };

    weekPlan[day] = {
      breakfast: {
        foodId: breakfastPick?.food?.id || pickFallbackFoodId(foodIndex.byMeal, 'breakfast', 0, used),
        reason: buildReason(breakfastPick, 'breakfast'),
      },
      lunch: {
        foodId: lunchPick?.food?.id || pickFallbackFoodId(foodIndex.byMeal, 'lunch', 1, used),
        reason: buildReason(lunchPick, 'lunch'),
      },
      dinner: {
        foodId: dinnerPick?.food?.id || pickFallbackFoodId(foodIndex.byMeal, 'dinner', 2, used),
        reason: buildReason(dinnerPick, 'dinner'),
      },
    };
  });

  const missingIngredientCount = Math.max(0, ingredientKeywords.length - usedIngredientKeywords.size);
  const shoppingSuggestions = [
    missingIngredientCount > 0
      ? `Thiếu khoảng ${missingIngredientCount} nguyên liệu khớp món, nên bổ sung thực phẩm tươi cho cả tuần.`
      : 'Nguyên liệu hiện có đủ tốt để xoay vòng trong tuần.',
    strategy.category === 'Thiếu cân'
      ? 'Ưu tiên thêm tinh bột tốt và đạm nạc (gạo lứt, khoai lang, trứng, ức gà).'
      : 'Ưu tiên thêm rau xanh, đạm nạc và giảm món chiên nhiều dầu.',
    'Chuẩn bị 2-3 món sơ chế sẵn để giữ đúng thực đơn khi bận.',
  ];

  return normalizeAiResponse(
    {
      bmiSummary: {
        category: profile?.bmiCategory || strategy.category,
        targetCalories: strategy.targetCalories,
        tips: [
          'AI đang quá tải nên hệ thống dùng rule BMI dự phòng để tạo thực đơn.',
          `Mục tiêu năng lượng ngày: khoảng ${strategy.targetCalories} kcal.`,
          `Phân bổ bữa: sáng ${strategy.mealTargets.breakfast} - trưa ${strategy.mealTargets.lunch} - tối ${strategy.mealTargets.dinner} kcal.`,
          'Điều chỉnh khẩu phần +/-10% theo mức vận động thực tế trong ngày.',
        ],
      },
      weekPlan,
      shoppingSuggestions,
      notes: [getFriendlyAiErrorMessage(reason)],
    },
    profile,
    bmi,
    targetCalories,
    foodIndex,
    'fallback-local',
  );
}

async function requestGeminiWithRetry(genAI, prompt) {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result?.response?.text?.() || '';
      } catch (err) {
        lastError = err;
        const status = Number(err?.status) || 0;
        const retriable = [429, 500, 502, 503, 504].includes(status);
        if (!retriable) throw err;
        if (attempt < 2) {
          await sleep(700 * attempt);
        }
      }
    }
  }

  throw lastError || new Error('AI provider unavailable');
}

exports.getAdvice = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const profile = req.body?.profile || {};
    const bmi = safeNumber(profile?.bmi ?? req.body?.bmi);
    const targetCalories = safeNumber(profile?.targetCalories) || null;
    const ingredientsFromList = normalizeIngredients(req.body?.ingredients);
    const ingredientsFromText = parseIngredientsText(req.body?.ingredientsRaw);
    const ingredients = (ingredientsFromText.length ? ingredientsFromText : ingredientsFromList).slice(0, 80);
    const note = String(req.body?.note || '').trim().slice(0, 500);
    const allergyNotes = String(profile?.allergyNotes || '').trim().slice(0, 300);
    const dietaryPreferences = String(profile?.dietaryPreferences || '').trim().slice(0, 300);
    const mealsPerDay = Math.max(3, Math.min(4, Number(profile?.mealsPerDay || 3)));

    if (!bmi || bmi < 10 || bmi > 60) {
      return res.status(400).json({ error: 'BMI không hợp lệ (10 - 60)' });
    }
    if (ingredients.length === 0) {
      return res.status(400).json({ error: 'Bạn cần chọn/nhập ít nhất 1 nguyên liệu' });
    }

    const foods = await Food.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ id: 1 }).lean();
    if (!foods.length) {
      return res.status(500).json({ error: 'Chưa có dữ liệu món ăn trong database' });
    }
    const foodIndex = buildFoodIndex(foods);

    if (!apiKey || apiKey.includes('your_gemini_api_key_here')) {
      const fallback = createLocalFallbackPlan({
        bmi,
        targetCalories,
        ingredients,
        profile,
        reason: 'Thiếu GEMINI_API_KEY, hệ thống chuyển sang rule BMI dự phòng.',
        foodIndex,
      });
      await saveAiHistory(req.session?.user?.id, {
        createdAt: new Date(),
        source: fallback.source,
        ingredientsRaw: String(req.body?.ingredientsRaw || '').slice(0, 1200),
        note: String(req.body?.note || '').slice(0, 400),
        result: fallback,
      });
      return res.json(fallback);
    }

    const foodBrief = foods
      .map((f) => `${f.id}|${f.name}|meal=${f.meal}|kcal=${f.calories}|cat=${f.category}`)
      .join('\n');

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
Bạn là trợ lý dinh dưỡng cho ứng dụng lập thực đơn.

Thông tin người dùng:
- BMI: ${bmi}
- Phân loại BMI: ${profile?.bmiCategory || classifyBMIText(bmi)}
- Mục tiêu calo/ngày: ${targetCalories || 'chưa cung cấp'}
- Giới tính: ${profile?.gender || 'không rõ'}
- Tuổi: ${profile?.age || 'không rõ'}
- Chiều cao: ${profile?.height || 'không rõ'} cm
- Cân nặng: ${profile?.weight || 'không rõ'} kg
- Mức vận động: ${profile?.activityLevel || 'không rõ'}
- Số bữa/ngày: ${mealsPerDay}
- Nguyên liệu hiện có: ${ingredients.join(', ')}
${dietaryPreferences ? `- Chế độ ăn: ${dietaryPreferences}` : ''}
${allergyNotes ? `- Dị ứng/không ăn: ${allergyNotes}` : ''}
${note ? `- Ghi chú: ${note}` : ''}

Yêu cầu:
1) Đưa ra tư vấn ngắn gọn theo BMI (mục tiêu, cảnh báo nếu cần) (3-6 gạch đầu dòng).
2) Tạo thực đơn 7 ngày (thứ 2 đến CN), mỗi ngày có 3 bữa: breakfast, lunch, dinner.
3) Ưu tiên dùng nguyên liệu sẵn có. Chỉ thêm nguyên liệu ngoài danh sách khi thật sự cần.
4) Mỗi bữa cần có calories và macro ước tính.
5) Nếu thiếu nguyên liệu cho tuần, liệt kê ngắn gọn những món nên mua thêm.
6) Trả về JSON hợp lệ, không markdown.
7) CỰC KỲ QUAN TRỌNG: chỉ chọn món trong danh sách allowedFoods bằng foodId. Không tự tạo món mới.

Trả về đúng JSON (không markdown, không thêm chữ ngoài JSON) theo schema:
{
  "bmiSummary": {
    "category": string,
    "targetCalories": number,
    "tips": string[]
  },
  "weekPlan": {
    "monday": {
      "breakfast": {
        "foodId": number,
        "reason": string
      },
      "lunch": { ... },
      "dinner": { ... }
    },
    "tuesday": { ... },
    "wednesday": { ... },
    "thursday": { ... },
    "friday": { ... },
    "saturday": { ... },
    "sunday": { ... }
  },
  "shoppingSuggestions": string[],
  "notes": string[]
}

allowedFoods:
${foodBrief}
`;

    const text = await requestGeminiWithRetry(genAI, prompt);

    // Gemini đôi khi vẫn kèm text -> cố gắng parse đoạn JSON đầu tiên
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    const jsonSlice = firstBrace >= 0 && lastBrace > firstBrace ? text.slice(firstBrace, lastBrace + 1) : text;

    let parsed;
    try {
      parsed = JSON.parse(jsonSlice);
    } catch (e) {
      const fallback = createLocalFallbackPlan({
        bmi,
        targetCalories,
        ingredients,
        profile,
        reason: 'AI trả về dữ liệu sai định dạng JSON.',
        foodIndex,
      });
      await saveAiHistory(req.session?.user?.id, {
        createdAt: new Date(),
        source: fallback.source,
        ingredientsRaw: String(req.body?.ingredientsRaw || '').slice(0, 1200),
        note: String(req.body?.note || '').slice(0, 400),
        result: fallback,
      });
      return res.json(fallback);
    }
    const normalized = normalizeAiResponse(parsed, profile, bmi, targetCalories, foodIndex);
    const ingredientFit = evaluateWeekPlanIngredientFit(
      normalized.weekPlan,
      foodIndex,
      buildIngredientKeywords(ingredients),
    );
    if (ingredientFit.totalMeals > 0 && ingredientFit.coverage < 0.2) {
      const fallback = createLocalFallbackPlan({
        bmi,
        targetCalories,
        ingredients,
        profile,
        reason: `AI gợi ý chưa bám sát nguyên liệu (${ingredientFit.matchedMeals}/${ingredientFit.totalMeals} bữa khớp), chuyển sang rule BMI.`,
        foodIndex,
      });
      await saveAiHistory(req.session?.user?.id, {
        createdAt: new Date(),
        source: fallback.source,
        ingredientsRaw: String(req.body?.ingredientsRaw || '').slice(0, 1200),
        note: String(req.body?.note || '').slice(0, 400),
        result: fallback,
      });
      return res.json(fallback);
    }
    await saveAiHistory(req.session?.user?.id, {
      createdAt: new Date(),
      source: normalized.source,
      ingredientsRaw: String(req.body?.ingredientsRaw || '').slice(0, 1200),
      note: String(req.body?.note || '').slice(0, 400),
      result: normalized,
    });
    return res.json(normalized);
  } catch (err) {
    console.error('[AI] advice error:', err);
    const status = Number(err?.status) || 500;
    const msg =
      err?.message ||
      err?.statusText ||
      'Lỗi AI server';
    let fallbackFoodIndex = buildFoodIndex([]);
    try {
      const foods = await Food.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ id: 1 }).lean();
      fallbackFoodIndex = buildFoodIndex(foods);
    } catch (e) {
      console.warn('[AI] không tải được foods cho fallback:', e?.message || e);
    }

    const fallback = createLocalFallbackPlan({
      bmi: safeNumber(req.body?.profile?.bmi ?? req.body?.bmi) || 22,
      targetCalories: safeNumber(req.body?.profile?.targetCalories) || 1800,
      ingredients:
        parseIngredientsText(req.body?.ingredientsRaw).length > 0
          ? parseIngredientsText(req.body?.ingredientsRaw)
          : normalizeIngredients(req.body?.ingredients),
      profile: req.body?.profile || {},
      reason: status >= 400 ? msg : 'Unknown error',
      foodIndex: fallbackFoodIndex,
    });
    await saveAiHistory(req.session?.user?.id, {
      createdAt: new Date(),
      source: fallback.source,
      ingredientsRaw: String(req.body?.ingredientsRaw || '').slice(0, 1200),
      note: String(req.body?.note || '').slice(0, 400),
      result: fallback,
    });
    return res.json(fallback);
  }
};

exports.getHistory = async (req, res) => {
  try {
    if (!req.session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.session.user.id, { aiHistory: 1, _id: 0 }).lean();
    const rows = Array.isArray(user?.aiHistory) ? user.aiHistory : [];
    const history = rows
      .slice()
      .reverse()
      .map((item, index) => ({
        id: index + 1,
        createdAt: item?.createdAt || null,
        source: item?.source || 'gemini',
        ingredientsRaw: String(item?.ingredientsRaw || ''),
        note: String(item?.note || ''),
        result: item?.result || {},
      }));
    return res.json({ history });
  } catch (err) {
    console.error('[AI] getHistory error:', err);
    return res.status(500).json({ error: 'Không thể lấy lịch sử AI' });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    if (!req.session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
    await User.findByIdAndUpdate(
      req.session.user.id,
      { $set: { aiHistory: [] } },
      { returnDocument: 'before' },
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[AI] clearHistory error:', err);
    return res.status(500).json({ error: 'Không thể xóa lịch sử AI' });
  }
};


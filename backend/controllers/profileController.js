const User = require('../models/User');

/**
 * Tính BMI + BMR + TDEE + target calo ngay trên server.
 * Đảm bảo logic không bị giả mạo từ client (bảo vệ tính toàn vẹn).
 */
function classifyBMI(bmi) {
  if (bmi < 16) return { category: 'Gầy độ III (nguy hiểm)', goal: 'gain-strong' };
  if (bmi < 17) return { category: 'Gầy độ II', goal: 'gain-strong' };
  if (bmi < 18.5) return { category: 'Gầy độ I', goal: 'gain' };
  if (bmi < 23) return { category: 'Bình thường', goal: 'maintain' };
  if (bmi < 25) return { category: 'Thừa cân nhẹ', goal: 'lose-light' };
  if (bmi < 30) return { category: 'Thừa cân', goal: 'lose' };
  if (bmi < 35) return { category: 'Béo phì độ I', goal: 'lose-strong' };
  if (bmi < 40) return { category: 'Béo phì độ II', goal: 'lose-strong' };
  return { category: 'Béo phì độ III', goal: 'lose-strong' };
}

function computeTarget(tdee, goal, gender) {
  let t = tdee;
  if (goal === 'gain-strong') t = tdee + 500;
  else if (goal === 'gain') t = tdee + 300;
  else if (goal === 'lose-light') t = tdee - 300;
  else if (goal === 'lose') t = tdee - 500;
  else if (goal === 'lose-strong') t = tdee - 700;
  const safeMin = gender === 'male' ? 1500 : 1200;
  return Math.max(safeMin, Math.round(t));
}

function computeProfile(body) {
  const gender = body.gender;
  const age = Number(body.age);
  const height = Number(body.height);
  const weight = Number(body.weight);
  const activityLevel = body.activityLevel;

  const hm = height / 100;
  const bmi = +(weight / (hm * hm)).toFixed(1);
  const { category, goal } = classifyBMI(bmi);

  let bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  bmr = Math.round(bmr);

  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[activityLevel] || 1.2;
  const tdee = Math.round(bmr * mult);
  const targetCalories = computeTarget(tdee, goal, gender);

  return {
    gender,
    age,
    height,
    weight,
    activityLevel,
    bmi,
    bmiCategory: category,
    bmr,
    tdee,
    targetCalories,
    goal,
  };
}

async function getProfile(req, res) {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.session.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ profile: user.profile || {} });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateProfile(req, res) {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

    const { gender, age, height, weight, activityLevel } = req.body;
    if (
      gender == null ||
      age == null ||
      height == null ||
      weight == null ||
      activityLevel == null ||
      String(gender).trim() === '' ||
      String(age).trim?.() === '' ||
      String(height).trim?.() === '' ||
      String(weight).trim?.() === '' ||
      String(activityLevel).trim() === ''
    ) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    if (!['male', 'female'].includes(gender)) {
      return res.status(400).json({ error: 'Giới tính không hợp lệ' });
    }

    const ageNum = Number(age);
    const heightNum = Number(height);
    const weightNum = Number(weight);

    // Bug 1 fix: chặn NaN/Infinity trước khi so sánh range
    if (!Number.isFinite(ageNum) || !Number.isFinite(heightNum) || !Number.isFinite(weightNum)) {
      return res.status(400).json({ error: 'Tuổi/chiều cao/cân nặng phải là số hợp lệ' });
    }

    if (
      ageNum < 10 ||
      ageNum > 100 ||
      heightNum < 100 ||
      heightNum > 250 ||
      weightNum < 30 ||
      weightNum > 300
    ) {
      return res.status(400).json({ error: 'Giá trị không nằm trong khoảng an toàn' });
    }

    const profile = computeProfile({
      gender,
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      activityLevel,
    });
    const user = await User.findByIdAndUpdate(
      req.session.user.id,
      { profile },
      { new: true },
    ).lean();

    // Bug 2 fix: user có thể null nếu record bị xoá giữa chừng
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ profile: user.profile });
  } catch (err) {
    console.error('[Profile] updateProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getProfile, updateProfile };

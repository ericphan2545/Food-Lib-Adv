/**
 * Favorites Page - Display user's favorite foods
 * NutriPlan Application
 */

// Import images so Vite can process them correctly

// Helper function to get base path
function getBasePath() {
  // Try to get from import.meta.env (Vite)
  if (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) {
    return import.meta.env.BASE_URL;
  }
  // Fallback: detect from current path
  const path = window.location.pathname;
  if (path.startsWith("/NutriPlan/")) {
    return "/NutriPlan/";
  }
  return "/";
}

// Image mapping - maps food ID to imported image URL
// (Giữ lại để tương thích ngược nếu cần, dù dữ liệu mới dùng URL online)
const imageMap = {
};

// 1. DỮ LIỆU GỐC TỪ RECIPES.JS
// (Copy toàn bộ recipesDB vào đây để làm nguồn dữ liệu chính)
const recipesData = {
  "Cơm gà Hội An": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211bb8eaa78a49193e39bf1374969bb2713.jpg",
    category: "Món chính",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Cơm gà vàng ươm thơm lừng, thịt gà dai ngọt đặc sản phố Hội.",
    ingredients: [
      "1 bát gạo",
      "150g ức gà",
      "Rau thơm, hành",
      "Nghệ tươi",
      "Nước mắm, tiêu",
    ],
    instructions: [
      "Luộc gà với gừng và hành",
      "Nấu cơm bằng nước luộc gà và nghệ",
      "Xé gà trộn với hành phi và gia vị",
      "Dọn cơm kèm rau thơm và nước mắm",
    ],
  },
  "Phở bò Hà Nội": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512111dfcf065cac26fc487bbc61bf06b3880.jpg",
    category: "Món nước",
    time: "180 phút",
    difficulty: "Khó",
    description: "Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương bò.",
    ingredients: [
      "200g bánh phở",
      "150g thịt bò",
      "Xương bò",
      "Hành, gừng, quế, hồi",
      "Rau thơm, giá đỗ",
    ],
    instructions: [
      "Ninh xương bò với gừng nướng trong 4-5 tiếng",
      "Thêm quế, hồi, thảo quả vào nước dùng",
      "Trụng bánh phở, xếp thịt bò lên trên",
      "Chan nước dùng nóng, thêm hành và rau thơm",
    ],
  },
  "Bún chả Hà Nội": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512118dae424aca7dcc6e03d49502e50564ad.jpg",
    category: "Món bún",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Thịt nướng than hoa thơm lừng ăn kèm bún và nước mắm chua ngọt.",
    ingredients: [
      "300g thịt ba chỉ",
      "200g thịt nạc vai xay",
      "200g bún tươi",
      "Nước mắm, đường, tỏi",
      "Rau sống, dưa góp",
    ],
    instructions: [
      "Ướp thịt ba chỉ với nước mắm, đường, tỏi băm",
      "Vo viên thịt xay, ướp gia vị tương tự",
      "Nướng thịt trên than hoa đến vàng thơm",
      "Pha nước chấm chua ngọt, thêm ớt tỏi",
      "Dọn bún kèm thịt nướng, rau sống và nước chấm",
    ],
  },
  "Bánh mì thịt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211b890f3c4b0c5a6e2042935529195dbcc.jpg",
    category: "Đồ ăn nhanh",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Ổ bánh mì giòn rụm kẹp pate, thịt nguội đậm đà hương vị Việt.",
    ingredients: [
      "1 ổ bánh mì",
      "100g pate gan",
      "80g chả lụa",
      "Dưa leo, đồ chua",
      "Rau mùi, ớt, xì dầu",
    ],
    instructions: [
      "Nướng giòn bánh mì",
      "Phết pate đều lên ruột bánh",
      "Xếp chả lụa, thịt nguội lên",
      "Thêm dưa leo, đồ chua, rau mùi",
      "Rưới xì dầu và thêm ớt tùy khẩu vị",
    ],
  },
  "Gỏi cuốn tôm thịt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512113b29efa85e5718ada0a48add33674027.jpg",
    category: "Khai vị",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Món cuốn thanh mát với tôm thịt tươi ngon, chấm tương đen béo ngậy.",
    ingredients: [
      "10 tờ bánh tráng",
      "200g tôm sú",
      "150g thịt ba chỉ luộc",
      "Bún, rau sống, húng quế",
      "Đậu phộng, tương đen",
    ],
    instructions: [
      "Luộc tôm và thịt ba chỉ, để nguội thái lát",
      "Nhúng bánh tráng qua nước ấm",
      "Xếp rau, bún, thịt, tôm lên bánh",
      "Cuốn chặt tay từ dưới lên",
      "Pha nước chấm tương đen với đậu phộng giã",
    ],
  },
  "Bún bò Huế": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211a65a9d7e75c2950b772061f5d4240959.jpg",
    category: "Món nước",
    time: "120 phút",
    difficulty: "Khó",
    description: "Hương vị cay nồng đặc trưng cố đô với sả và mắm ruốc.",
    ingredients: [
      "300g bún tươi",
      "200g bắp bò",
      "100g giò heo",
      "Sả, ớt, mắm ruốc",
      "Rau muống, bắp chuối",
    ],
    instructions: [
      "Ninh xương và giò heo trong 2 tiếng",
      "Phi sả và ớt, thêm mắm ruốc tạo màu",
      "Cho bắp bò vào hầm mềm",
      "Trụng bún, xếp thịt, chan nước dùng nóng",
      "Ăn kèm rau muống, bắp chuối bào",
    ],
  },
  "Cá kho tộ": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121101c1ece6f4c310b83388e44e8a426d88.jpg",
    category: "Món mặn",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Cá kho đậm đà, màu cánh gián đẹp mắt, cực kỳ đưa cơm.",
    ingredients: [
      "500g cá lóc hoặc cá basa",
      "Nước màu (caramel)",
      "Nước mắm, đường, tiêu",
      "Hành lá, ớt, tỏi",
      "Nước dừa tươi",
    ],
    instructions: [
      "Cắt cá thành khúc, ướp với nước mắm và tiêu",
      "Thắng nước màu trong nồi đất",
      "Xếp cá vào, thêm nước dừa và gia vị",
      "Kho lửa nhỏ 30-40 phút cho cá thấm",
      "Rắc hành lá và tiêu trước khi tắt bếp",
    ],
  },
  "Thịt kho tàu": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211f75b0d44512fe25e88f9dd3fe35c47cb.jpg",
    category: "Món mặn",
    time: "90 phút",
    difficulty: "Trung bình",
    description: "Thịt kho mềm rục, trứng vịt thấm vị, món ăn không thể thiếu ngày Tết.",
    ingredients: [
      "500g thịt ba chỉ",
      "6 quả trứng vịt",
      "Nước dừa tươi",
      "Nước mắm, đường, tỏi",
      "Hành tím, tiêu",
    ],
    instructions: [
      "Cắt thịt miếng vuông, ướp với nước mắm và tỏi",
      "Luộc và bóc vỏ trứng vịt",
      "Thắng nước màu, cho thịt vào đảo đều",
      "Thêm nước dừa, hầm lửa nhỏ 1 tiếng",
      "Cho trứng vào kho thêm 15 phút",
    ],
  },
  "Canh chua cá": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211a9a226403aae0ac8bc0c76af0924ff60.jpg",
    category: "Món canh",
    time: "35 phút",
    difficulty: "Trung bình",
    description: "Vị chua thanh của me và dứa kết hợp với cá tươi ngon.",
    ingredients: [
      "400g cá lóc",
      "200g dứa (thơm)",
      "Cà chua, đậu bắp, giá",
      "Me, rau om, ngò gai",
      "Nước mắm, đường",
    ],
    instructions: [
      "Phi tỏi thơm, cho cà chua vào xào",
      "Đổ nước, thêm me và dứa nấu sôi",
      "Cho cá vào nấu chín",
      "Thêm đậu bắp, giá, nêm gia vị",
      "Rắc rau om, ngò gai trước khi tắt bếp",
    ],
  },
  "Chả giò (Nem rán)": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211da36eabaf4ee0d560de48168b94a5a13.jpg",
    category: "Khai vị",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Những cuốn chả giò vàng ruộm, giòn tan với nhân thịt tôm đầy đặn.",
    ingredients: [
      "200g thịt heo xay",
      "100g tôm băm",
      "Miến, mộc nhĩ, cà rốt",
      "Bánh tráng nem",
      "Trứng, hành, tiêu",
    ],
    instructions: [
      "Trộn thịt, tôm với miến, mộc nhĩ, cà rốt bào",
      "Nêm gia vị, thêm trứng để kết dính",
      "Cuốn nhân vào bánh tráng chặt tay",
      "Chiên ngập dầu đến vàng giòn",
      "Ăn kèm nước mắm chua ngọt và rau sống",
    ],
  },
  "Cơm tấm sườn bì chả": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512115f00d28a72c4e0461d63cb9102b90340.jpg",
    category: "Món chính",
    time: "75 phút",
    difficulty: "Trung bình",
    description: "Sườn nướng thơm phức ăn cùng cơm tấm Sài Gòn đặc trưng.",
    ingredients: [
      "1 bát cơm tấm",
      "1 miếng sườn nướng",
      "Bì heo, chả trứng",
      "Đồ chua, dưa leo",
      "Mỡ hành, nước mắm",
    ],
    instructions: [
      "Ướp sườn với sả, tỏi, nước mắm, mật ong",
      "Nướng sườn trên than hoặc lò",
      "Trộn bì với thính gạo",
      "Hấp chả trứng",
      "Dọn cơm với sườn, bì, chả và mỡ hành",
    ],
  },
  "Mì Quảng": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512111cd4ebc0fe6f5edb840fe4c940c89ec1.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Đặc sản Quảng Nam với nước lèo sệt đậm đà và bánh đa giòn tan.",
    ingredients: [
      "300g mì Quảng",
      "200g tôm, 150g thịt heo",
      "Đậu phộng rang, bánh tráng",
      "Rau sống, hành lá",
      "Nghệ, dầu điều",
    ],
    instructions: [
      "Xào tôm và thịt với nghệ và dầu điều",
      "Thêm nước, nấu thành nước lèo sệt",
      "Trụng mì, xếp ra tô",
      "Chan nước lèo, thêm tôm thịt",
      "Rắc đậu phộng, ăn kèm bánh tráng và rau",
    ],
  },
  "Bánh xèo": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211227bda212912ca66f4fdcc51c15b7bd0.jpg",
    category: "Món bánh",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Bánh xèo vàng ươm, vỏ giòn tan, nhân tôm thịt đầy ắp.",
    ingredients: [
      "200g bột bánh xèo",
      "200g tôm, 150g thịt ba chỉ",
      "Giá đỗ, hành lá",
      "Nước cốt dừa, nghệ",
      "Rau sống, nước mắm chua ngọt",
    ],
    instructions: [
      "Pha bột với nước cốt dừa và nghệ",
      "Xào tôm thịt sơ qua",
      "Đổ bột vào chảo nóng, thêm nhân và giá",
      "Đậy nắp, chiên đến giòn vàng",
      "Gập đôi bánh, ăn kèm rau và nước chấm",
    ],
  },
  "Hủ tiếu Nam Vang": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121163ea3d4e399a9dc8564c7d012ee19235.jpg",
    category: "Món nước",
    time: "90 phút",
    difficulty: "Khó",
    description: "Nước dùng ngọt thanh từ xương, ăn kèm tôm, gan và thịt băm.",
    ingredients: [
      "200g hủ tiếu khô",
      "100g thịt heo, 100g tôm",
      "Gan, tim heo",
      "Giá, hẹ, hành phi",
      "Xương heo ninh",
    ],
    instructions: [
      "Ninh xương heo lấy nước dùng trong",
      "Trụng hủ tiếu, xếp ra tô",
      "Xếp thịt, tôm, gan, tim lên trên",
      "Chan nước dùng nóng",
      "Rắc hành phi, ăn kèm giá và hẹ",
    ],
  },
  "Bò lúc lắc": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512114690676a46bf3fc17ee07ec6c451e858.jpg",
    category: "Món xào",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Thịt bò mềm mọng nước, xào nhanh lửa lớn với rau củ.",
    ingredients: [
      "300g thịt bò thăn",
      "Tỏi, hành tây",
      "Xì dầu, dầu hào",
      "Tiêu đen, bơ",
      "Cà chua, xà lách",
    ],
    instructions: [
      "Cắt bò thành hạt lựu, ướp xì dầu và tiêu",
      "Đun nóng chảo với bơ và tỏi",
      "Cho bò vào xào lửa lớn nhanh tay",
      "Thêm hành tây, nêm dầu hào",
      "Dọn kèm cà chua, xà lách và cơm trắng",
    ],
  },
  "Gà nướng muối ớt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512116a7638a4b19fca2c111d86388ffa5f94.jpg",
    category: "Món nướng",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Gà nướng da giòn, thịt cay nồng vị muối ớt sả.",
    ingredients: [
      "1 con gà ta (1.2kg)",
      "Muối hạt, ớt bột",
      "Sả, tỏi, gừng",
      "Mật ong, nước mắm",
      "Lá chanh",
    ],
    instructions: [
      "Làm sạch gà, chặt miếng vừa ăn",
      "Ướp gà với muối, ớt, sả, tỏi băm",
      "Để ngấm gia vị 30 phút",
      "Nướng gà trên than hoặc lò 200°C",
      "Phết mật ong, nướng thêm 5 phút cho vàng",
    ],
  },
  "Lẩu thái hải sản": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211f684b0d880c4157c38e2e6063856a4de.jpg",
    category: "Lẩu",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Nồi lẩu chua cay đậm đà, ngập tràn hải sản tươi ngon.",
    ingredients: [
      "500g hải sản các loại",
      "Nấm, đậu hũ, rau",
      "Sả, riềng, lá chanh",
      "Ớt, nước cốt chanh",
      "Nước mắm, sa tế",
    ],
    instructions: [
      "Nấu nước dùng với sả, riềng, lá chanh",
      "Thêm sa tế và ớt tạo vị cay",
      "Cho hải sản, nấm, đậu hũ vào",
      "Nêm nước mắm và nước cốt chanh",
      "Nhúng rau và bún ăn kèm",
    ],
  },
  "Cháo lòng": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512114a8f617e9ab5e1a1211de1521e00a984.jpg",
    category: "Cháo/Súp",
    time: "90 phút",
    difficulty: "Khó",
    description: "Cháo sánh mịn nấu từ nước luộc lòng, ăn kèm dồi trường giòn sật.",
    ingredients: [
      "200g gạo",
      "300g lòng heo các loại",
      "Huyết heo",
      "Hành lá, gừng, tiêu",
      "Giá, rau mùi, quẩy",
    ],
    instructions: [
      "Làm sạch lòng với muối và giấm",
      "Luộc lòng với gừng, thái lát",
      "Nấu cháo nhừ với nước luộc lòng",
      "Xếp lòng và huyết lên cháo",
      "Rắc hành, tiêu, ăn kèm quẩy và giá",
    ],
  },
  "Bún riêu cua": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121121c7774ff5ecf909e54251366bdd3aa7.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Vị ngọt thanh của cua đồng hòa quyện với vị chua dịu của cà chua.",
    ingredients: [
      "300g bún tươi",
      "200g cua đồng",
      "Cà chua, đậu hũ chiên",
      "Mắm tôm, me",
      "Rau muống, hành lá",
    ],
    instructions: [
      "Giã cua, lọc lấy nước và gạch",
      "Nấu nước cua sôi, gạch nổi lên thành riêu",
      "Xào cà chua, thêm nước cua và me",
      "Cho đậu hũ chiên vào",
      "Trụng bún, chan nước riêu, thêm mắm tôm",
    ],
  },
  "Xôi gà": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211cb476ff00d1f5fa213c65106ea2d2d01.jpg",
    category: "Món xôi",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Xôi dẻo thơm nấu cùng nước gà, ăn kèm gà xé và hành phi.",
    ingredients: [
      "300g gạo nếp",
      "200g thịt gà",
      "Hành phi, mỡ gà",
      "Nước mắm, tiêu",
      "Dưa leo, rau mùi",
    ],
    instructions: [
      "Ngâm gạo nếp 4 tiếng, để ráo",
      "Luộc gà, lấy nước trộn vào nếp",
      "Hấp xôi chín dẻo",
      "Xé gà, trộn với mỡ gà và gia vị",
      "Dọn xôi với gà xé, hành phi và dưa leo",
    ],
  },
  "Bánh cuốn": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121195bf6ac219dc8a3be5d7b0e123e07848.jpg",
    category: "Món bánh",
    time: "45 phút",
    difficulty: "Khó",
    description: "Bánh tráng mỏng tang, nhân thịt mộc nhĩ, chấm nước mắm cà cuống.",
    ingredients: [
      "300g bột gạo",
      "150g thịt heo xay",
      "Mộc nhĩ, hành khô",
      "Chả lụa, hành phi",
      "Nước mắm chua ngọt",
    ],
    instructions: [
      "Xào thịt với mộc nhĩ và hành",
      "Tráng bột mỏng trên vải hấp",
      "Cho nhân vào, cuộn lại",
      "Xếp bánh ra đĩa, rắc hành phi",
      "Ăn kèm chả lụa và nước mắm chua ngọt",
    ],
  },
  "Bún đậu mắm tôm": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121178444a3dabd4ecb8fc67c5af6bc0b3cd.jpg",
    category: "Món bún",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Mẹt bún đậu đầy đủ với đậu rán giòn, chả cốm và mắm tôm dậy mùi.",
    ingredients: [
      "300g bún lá",
      "200g đậu hũ chiên",
      "Chả cốm, nem chua",
      "Thịt luộc, dồi",
      "Mắm tôm, quất",
    ],
    instructions: [
      "Chiên đậu hũ vàng giòn",
      "Luộc thịt, thái lát",
      "Cắt bún thành miếng vừa ăn",
      "Pha mắm tôm với quất và đường",
      "Bày tất cả ra đĩa, chấm mắm tôm",
    ],
  },
  "Bánh canh cua": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512115361c7b706d799f8e3957fc6a7389637.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Sợi bánh canh dai ngon trong nước dùng cua sền sệt, đậm đà.",
    ingredients: [
      "300g bánh canh bột lọc",
      "200g thịt cua",
      "Trứng cút, chả lụa",
      "Hành, tiêu, nước mắm",
      "Rau mùi, hành phi",
    ],
    instructions: [
      "Nấu nước dùng từ vỏ cua",
      "Thêm thịt cua vào, nêm gia vị",
      "Cho bánh canh vào nấu mềm",
      "Thêm trứng cút và chả lụa",
      "Rắc hành phi và tiêu trước khi ăn",
    ],
  },
  "Cơm chiên dương châu": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211c701c21a5816dd847fae54e9dadf7494.jpg",
    category: "Món cơm",
    time: "25 phút",
    difficulty: "Dễ",
    description: "Cơm chiên tơi xốp, đầy màu sắc với rau củ, lạp xưởng và tôm.",
    ingredients: [
      "2 bát cơm nguội",
      "100g tôm, 100g lạp xưởng",
      "2 quả trứng",
      "Đậu Hà Lan, cà rốt",
      "Hành lá, xì dầu",
    ],
    instructions: [
      "Xào trứng chín, để riêng",
      "Xào tôm và lạp xưởng thái hạt lựu",
      "Cho cơm vào xào lửa lớn",
      "Thêm rau củ, trứng, nêm xì dầu",
      "Rắc hành lá, đảo đều và dọn ra",
    ],
  },
  "Gà kho gừng": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211263a254f56c7e07cf47066d4fd21625f.jpg",
    category: "Món mặn",
    time: "40 phút",
    difficulty: "Dễ",
    description: "Món ăn gia đình ấm cúng với vị cay ấm của gừng thấm vào thịt gà.",
    ingredients: [
      "500g thịt gà",
      "100g gừng tươi",
      "Nước mắm, đường",
      "Hành tím, tỏi",
      "Tiêu, ớt",
    ],
    instructions: [
      "Chặt gà miếng vừa, ướp nước mắm",
      "Thái gừng sợi, phi thơm với dầu",
      "Cho gà vào xào săn",
      "Thêm nước, kho lửa nhỏ 30 phút",
      "Nêm gia vị, rắc tiêu và hành",
    ],
  },
  "Tôm rim mặn ngọt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512111e13f344eaf045019ebb74124195a30d.jpg",
    category: "Món mặn",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Tôm săn chắc, vỏ bóng lưỡng, vị mặn ngọt hài hòa đưa cơm.",
    ingredients: [
      "400g tôm sú",
      "Nước mắm, đường",
      "Tỏi, ớt, hành",
      "Tiêu đen",
      "Dầu ăn",
    ],
    instructions: [
      "Cắt râu tôm, rửa sạch để ráo",
      "Phi tỏi thơm, cho tôm vào xào",
      "Thêm nước mắm và đường rim",
      "Đảo đều đến khi tôm săn và bóng",
      "Rắc tiêu và hành lá, tắt bếp",
    ],
  },
  "Canh khổ qua nhồi thịt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211d6d4e18f3c6cf76a98aa98bfdd3c2a38.jpg",
    category: "Món canh",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Món canh thanh nhiệt, vị đắng nhẹ của khổ qua hòa cùng vị ngọt thịt.",
    ingredients: [
      "2 quả khổ qua",
      "200g thịt heo xay",
      "Mộc nhĩ, miến",
      "Hành, tiêu, nước mắm",
      "Hành lá",
    ],
    instructions: [
      "Cắt khổ qua khúc, bỏ ruột",
      "Trộn thịt với mộc nhĩ, miến, gia vị",
      "Nhồi thịt vào khổ qua",
      "Nấu nước sôi, cho khổ qua vào",
      "Hầm 25 phút, nêm nước mắm",
    ],
  },
  "Thịt heo quay": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512113fafb630e8dc20dd4c2eff63e5d7f7db.jpg",
    category: "Món quay",
    time: "90 phút",
    difficulty: "Khó",
    description: "Thịt quay bì giòn rụm, thịt mềm thơm hương ngũ vị hương.",
    ingredients: [
      "1kg thịt ba chỉ",
      "Ngũ vị hương, muối",
      "Giấm, bột nở",
      "Tỏi, hành tím",
      "Mật ong",
    ],
    instructions: [
      "Luộc sơ thịt, để ráo nước",
      "Ướp mặt thịt với ngũ vị hương và tỏi",
      "Xoa giấm và muối lên da",
      "Để tủ lạnh qua đêm cho da khô",
      "Quay ở 220°C đến khi da giòn vàng",
    ],
  },
  "Vịt nấu chao": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512112849a7e45781df0b26b31d740e3d0854.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Vịt nấu chao thơm lừng, béo ngậy, khoai môn dẻo bùi.",
    ingredients: [
      "1/2 con vịt",
      "Chao đỏ",
      "Khoai môn, nấm rơm",
      "Sả, gừng, tỏi",
      "Rau muống, bún",
    ],
    instructions: [
      "Chặt vịt miếng, ướp với chao và sả",
      "Xào vịt săn, thêm nước hầm",
      "Cho khoai môn vào nấu mềm",
      "Thêm nấm rơm, nêm gia vị",
      "Ăn kèm bún và rau muống",
    ],
  },
  "Chè đậu xanh": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211890d01a4143a4d9b04ba39d2a32203ae.jpg",
    category: "Tráng miệng",
    time: "40 phút",
    difficulty: "Dễ",
    description: "Chè đậu xanh ngọt mát, thêm chút nước cốt dừa béo ngậy.",
    ingredients: [
      "200g đậu xanh cà vỏ",
      "100g đường",
      "Nước cốt dừa",
      "Bột năng, muối",
      "Lá dứa",
    ],
    instructions: [
      "Ngâm đậu xanh 2 tiếng, hấp chín",
      "Nấu nước đường với lá dứa",
      "Cho đậu vào, khuấy tan",
      "Nấu nước cốt dừa với chút muối",
      "Múc chè ra bát, rưới nước cốt dừa",
    ],
  },
  "Bánh flan": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512110deb1e4e0a95e5143aa0e03245a87301.jpg",
    category: "Tráng miệng",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Bánh flan mềm mịn, thơm mùi trứng sữa và sốt caramel đắng nhẹ.",
    ingredients: [
      "4 quả trứng",
      "400ml sữa tươi",
      "100g đường",
      "Vani",
      "Nước caramel",
    ],
    instructions: [
      "Thắng đường thành caramel, đổ vào khuôn",
      "Đánh trứng với sữa và đường",
      "Thêm vani, lọc hỗn hợp qua rây",
      "Đổ vào khuôn, hấp cách thủy 30 phút",
      "Để nguội, úp ngược ra đĩa",
    ],
  },
  "Chè ba màu": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121104f19aa9721eff2bffe60f2f24fc2da2.jpg",
    category: "Tráng miệng",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Ly chè bắt mắt với đậu xanh, đậu đỏ và thạch, giải nhiệt ngày hè.",
    ingredients: [
      "Đậu xanh, đậu đỏ",
      "Thạch, nước cốt dừa",
      "Đường, đá bào",
      "Sữa đặc",
      "Hạt lựu",
    ],
    instructions: [
      "Nấu chín đậu xanh và đậu đỏ riêng",
      "Cắt thạch thành hạt lựu",
      "Xếp lớp đậu và thạch vào ly",
      "Rưới nước cốt dừa và sữa đặc",
      "Thêm đá bào lên trên",
    ],
  },
  "Sườn xào chua ngọt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512111a7d332b3aeaacb2627f20015e34eb67.jpg",
    category: "Món mặn",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Sườn non mềm thấm sốt chua ngọt đậm đà, màu sắc hấp dẫn.",
    ingredients: [
      "500g sườn non",
      "Cà chua, dứa, ớt chuông",
      "Tương cà, giấm",
      "Đường, nước mắm",
      "Hành, tỏi",
    ],
    instructions: [
      "Chặt sườn miếng, ướp gia vị",
      "Chiên sườn vàng, để riêng",
      "Xào cà chua và dứa với sốt chua ngọt",
      "Cho sườn vào đảo đều",
      "Thêm ớt chuông, nêm vừa ăn",
    ],
  },
  "Đậu hũ sốt cà": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211fe68743bfab49703a9d91b42a17ee666.jpg",
    category: "Món chay/mặn",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Đậu hũ chiên vàng hòa quyện trong sốt cà chua đỏ mọng.",
    ingredients: [
      "300g đậu hũ non",
      "2 quả cà chua",
      "Hành, tỏi",
      "Nước mắm, đường",
      "Hành lá, tiêu",
    ],
    instructions: [
      "Cắt đậu hũ miếng vuông, chiên vàng",
      "Phi tỏi, xào cà chua nhuyễn",
      "Nêm nước mắm, đường tạo sốt",
      "Cho đậu hũ vào sốt, đảo nhẹ",
      "Rắc hành lá và tiêu",
    ],
  },
  "Cá chiên xù": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211f5b3c12af77cba6bbc0174bce28a7e4d.jpg",
    category: "Món chiên",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Cá phi lê giòn rụm bên ngoài, mềm ngọt bên trong.",
    ingredients: [
      "400g cá phi lê",
      "Bột chiên xù",
      "Trứng, bột mì",
      "Sốt mayonnaise",
      "Chanh, rau sống",
    ],
    instructions: [
      "Cắt cá miếng vừa, ướp muối tiêu",
      "Lăn cá qua bột mì, trứng, bột xù",
      "Chiên ngập dầu đến vàng giòn",
      "Vớt ra để ráo dầu",
      "Ăn kèm sốt mayonnaise và chanh",
    ],
  },
  "Rau muống xào tỏi": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121179bd5c6a9d893b0cab560dbe87b32e51.jpg",
    category: "Món rau",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Rau muống xanh mướt, giòn sần sật dậy mùi tỏi phi thơm.",
    ingredients: [
      "300g rau muống",
      "5 tép tỏi",
      "Dầu ăn",
      "Nước mắm, đường",
      "Ớt (tùy chọn)",
    ],
    instructions: [
      "Nhặt rau muống, rửa sạch để ráo",
      "Băm nhỏ tỏi, phi vàng thơm",
      "Cho rau vào xào lửa lớn nhanh tay",
      "Nêm nước mắm và chút đường",
      "Đảo đều, tắt bếp khi rau vừa chín",
    ],
  },
  "Súp cua": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211dde2e1fb24afbdc3eb3cd03476d508ef.jpg",
    category: "Khai vị",
    time: "40 phút",
    difficulty: "Trung bình",
    description: "Chén súp nóng hổi, sánh đặc với thịt cua và trứng.",
    ingredients: [
      "200g thịt cua",
      "2 quả trứng",
      "Bắp, nấm rơm",
      "Bột năng, hành",
      "Tiêu, dầu mè",
    ],
    instructions: [
      "Nấu nước dùng với xương gà",
      "Thêm bắp và nấm rơm vào",
      "Cho thịt cua, khuấy bột năng tạo sánh",
      "Đánh trứng, rưới từ từ vào súp",
      "Rắc tiêu, hành và dầu mè",
    ],
  },
  "Bò né": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121104b3de0fd17ea25990338d4aeb3c2e1a.jpg",
    category: "Món chính",
    time: "20 phút",
    difficulty: "Trung bình",
    description: "Bò né nóng hổi trên chảo gang, ăn kèm trứng ốp la và bánh mì.",
    ingredients: [
      "150g thịt bò",
      "2 quả trứng ốp la",
      "Pate, xúc xích",
      "Bánh mì, bơ",
      "Hành tây, đồ chua",
    ],
    instructions: [
      "Ướp bò với tiêu và dầu hào",
      "Đun nóng chảo gang với bơ",
      "Áp chảo bò, chiên trứng ốp la",
      "Xếp pate, xúc xích lên chảo",
      "Dọn kèm bánh mì và đồ chua",
    ],
  },
  "Gỏi gà xé phay": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211cb2599c53497463495c2293bdd5010c1.jpg",
    category: "Gỏi/Nộm",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Gà xé trộn gỏi chua ngọt, giòn ngon, thanh mát.",
    ingredients: [
      "300g ức gà",
      "Bắp cải, hành tây",
      "Rau răm, đậu phộng",
      "Nước mắm, chanh, đường",
      "Ớt, tỏi",
    ],
    instructions: [
      "Luộc gà chín, xé sợi nhỏ",
      "Bào mỏng bắp cải và hành tây",
      "Pha nước mắm chua ngọt với tỏi ớt",
      "Trộn gà với rau, rưới nước mắm",
      "Rắc đậu phộng và rau răm",
    ],
  },
  "Bánh bột lọc": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211c3ea18548b1ec7c3ae5e386725c4a217.jpg",
    category: "Món bánh",
    time: "60 phút",
    difficulty: "Khó",
    description: "Bánh bột lọc trong veo, dai dai với nhân tôm thịt đậm đà.",
    ingredients: [
      "200g bột năng",
      "200g tôm",
      "Thịt ba chỉ",
      "Hành phi, nước mắm",
      "Lá chuối",
    ],
    instructions: [
      "Nhào bột năng với nước sôi",
      "Xào tôm thịt với gia vị làm nhân",
      "Cán bột mỏng, gói nhân vào",
      "Hấp bánh trong lá chuối 15 phút",
      "Ăn kèm nước mắm chua ngọt",
    ],
  },
  "Cơm cháy chà bông": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512114b6932d347f15ec934be8f4569cce316.jpg",
    category: "Ăn vặt",
    time: "40 phút",
    difficulty: "Trung bình",
    description: "Cơm cháy giòn rụm phủ đầy chà bông và mỡ hành béo ngậy.",
    ingredients: [
      "2 bát cơm nguội",
      "100g chà bông",
      "Mỡ hành",
      "Dầu ăn",
      "Nước mắm me",
    ],
    instructions: [
      "Nén cơm thành miếng dẹt",
      "Chiên cơm trong dầu nóng đến giòn",
      "Vớt ra để ráo dầu",
      "Phủ chà bông và mỡ hành lên",
      "Ăn kèm nước mắm me",
    ],
  },
  "Ốc len xào dừa": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512119d990e4e1422e192eb124e75a066cf10.jpg",
    category: "Hải sản",
    time: "30 phút",
    difficulty: "Trung bình",
    description: "Ốc len béo ngậy ngập trong nước cốt dừa thơm nức mũi.",
    ingredients: [
      "500g ốc len",
      "Nước cốt dừa",
      "Sả, ớt, lá chanh",
      "Nước mắm, đường",
      "Rau răm",
    ],
    instructions: [
      "Ngâm ốc với nước vo gạo, rửa sạch",
      "Phi sả và ớt thơm",
      "Cho ốc vào xào, thêm nước cốt dừa",
      "Nêm nước mắm, đường, thêm lá chanh",
      "Đảo đều, rắc rau răm",
    ],
  },
  "Bún mắm": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211a88863468ef32057c05df468253f6ef6.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Đặc sản miền Tây với hương vị mắm cá linh đặc trưng.",
    ingredients: [
      "300g bún tươi",
      "Mắm cá linh",
      "Tôm, mực, thịt quay",
      "Cà tím, đậu bắp",
      "Rau sống, chanh",
    ],
    instructions: [
      "Nấu nước dùng từ mắm cá linh",
      "Cho cà tím, đậu bắp vào nấu chín",
      "Luộc tôm, mực riêng",
      "Trụng bún, xếp hải sản và thịt quay",
      "Chan nước mắm, ăn kèm rau sống",
    ],
  },
  "Cháo vịt": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512113d066527f0294204aa7c5a25aa89b33f.jpg",
    category: "Cháo/Súp",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Cháo vịt ngọt lịm, thịt vịt chấm nước mắm gừng ấm bụng.",
    ingredients: [
      "1/2 con vịt",
      "200g gạo",
      "Gừng, hành tím",
      "Rau mùi, hành lá",
      "Tiêu, nước mắm",
    ],
    instructions: [
      "Làm sạch vịt, luộc với gừng",
      "Lấy nước luộc nấu cháo",
      "Chặt vịt miếng, phi hành tím",
      "Múc cháo ra tô, xếp thịt vịt lên",
      "Rắc hành, rau mùi, tiêu",
    ],
  },
  "Bánh tráng trộn": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_202512119fca0f73897e157b77c82629d9c3ec23.jpg",
    category: "Ăn vặt",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Món ăn vặt quốc dân với đủ vị chua cay mặn ngọt.",
    ingredients: [
      "200g bánh tráng cắt sợi",
      "Trứng cút, khô bò",
      "Xoài xanh, rau răm",
      "Đậu phộng, hành phi",
      "Sốt me, tương ớt",
    ],
    instructions: [
      "Cắt nhỏ bánh tráng",
      "Luộc trứng cút, bổ đôi",
      "Trộn bánh tráng với khô bò, xoài",
      "Thêm sốt me và tương ớt",
      "Rắc đậu phộng, hành phi, rau răm",
    ],
  },
  "Mì xào hải sản": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121144387b387f9a1b42706f7f522ff67585.jpg",
    category: "Món xào",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Mì xào dai ngon, thấm vị hải sản và rau củ tươi.",
    ingredients: [
      "200g mì vàng",
      "200g hải sản tổng hợp",
      "Cải ngọt, cà rốt",
      "Xì dầu, dầu hào",
      "Tỏi, hành",
    ],
    instructions: [
      "Trụng mì qua nước sôi, để ráo",
      "Xào hải sản với tỏi, để riêng",
      "Xào mì với xì dầu lửa lớn",
      "Thêm rau củ và hải sản vào",
      "Nêm dầu hào, đảo đều",
    ],
  },
  "Chè trôi nước": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211cb07e79103153c0aef15ad995208f73a.jpg",
    category: "Tráng miệng",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Viên chè trắng ngần, dẻo thơm quyện cùng nước đường gừng ấm nồng.",
    ingredients: [
      "200g bột nếp",
      "100g đậu xanh",
      "Gừng, đường",
      "Nước cốt dừa",
      "Mè rang",
    ],
    instructions: [
      "Nấu nhân đậu xanh với đường",
      "Nhào bột nếp, bọc nhân vo tròn",
      "Luộc bánh trong nước sôi đến nổi",
      "Nấu nước đường gừng",
      "Múc bánh ra, chan nước gừng và cốt dừa",
    ],
  },
  "Thịt bò xào ớt chuông": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211cdab62bf0079c899207c7fc1900b615e.jpg",
    category: "Món xào",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Món xào nhanh gọn, giàu dinh dưỡng và màu sắc bắt mắt.",
    ingredients: [
      "250g thịt bò",
      "2 quả ớt chuông",
      "Hành tây, tỏi",
      "Xì dầu, dầu hào",
      "Tiêu, dầu mè",
    ],
    instructions: [
      "Thái bò lát mỏng, ướp xì dầu và tiêu",
      "Cắt ớt chuông và hành tây miếng vuông",
      "Xào bò lửa lớn nhanh tay, để riêng",
      "Xào ớt chuông và hành tây",
      "Cho bò vào, nêm dầu hào, rưới dầu mè",
    ],
  },
  "Canh bí đỏ nấu tôm": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121136d58b4b9a72326933a7cebd81386703.jpg",
    category: "Món canh",
    time: "25 phút",
    difficulty: "Dễ",
    description: "Canh bí đỏ ngọt bùi, bổ dưỡng nấu cùng tôm tươi.",
    ingredients: [
      "300g bí đỏ",
      "150g tôm tươi",
      "Hành lá, rau mùi",
      "Nước mắm, tiêu",
      "Hành tím phi",
    ],
    instructions: [
      "Gọt vỏ bí đỏ, cắt miếng vừa",
      "Lột vỏ tôm, ướp chút muối",
      "Nấu nước sôi, cho bí vào nấu mềm",
      "Thêm tôm, nêm nước mắm",
      "Rắc hành lá, rau mùi và tiêu",
    ],
  },
  "Xôi xéo": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_2025121179d2f731d6a1ad78841c1b654a0ac75d.jpg",
    category: "Món xôi",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Xôi xéo vàng ươm gói lá sen, phủ đậu xanh và hành phi thơm nức.",
    ingredients: [
      "300g gạo nếp",
      "100g đậu xanh",
      "Hành phi, mỡ gà",
      "Nghệ, muối",
      "Ruốc, pate (tùy chọn)",
    ],
    instructions: [
      "Ngâm nếp và đậu xanh qua đêm",
      "Hấp nếp với nghệ tạo màu vàng",
      "Hấp đậu xanh riêng, tán nhuyễn",
      "Xếp xôi ra đĩa, rắc đậu xanh lên",
      "Rưới mỡ gà, hành phi, thêm ruốc",
    ],
  },
  "Cà ri gà": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211ad04e1549ff99516864bf4137284470e.jpg",
    category: "Món nước",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Cà ri gà béo ngậy nước cốt dừa, chấm bánh mì cực ngon.",
    ingredients: [
      "500g thịt gà",
      "Khoai tây, cà rốt",
      "Bột cà ri, sả",
      "Nước cốt dừa",
      "Bánh mì hoặc bún",
    ],
    instructions: [
      "Chặt gà miếng, ướp bột cà ri và sả",
      "Xào gà săn với dầu ăn",
      "Thêm khoai tây, cà rốt và nước",
      "Hầm 30 phút đến khi mềm",
      "Đổ nước cốt dừa, nấu thêm 10 phút",
    ],
  },
  "Nem nướng Nha Trang": {
    image:
      "https://sf-static.upanhlaylink.com/img/image_20251211a0301f470a1bfac7c3c99fc31e2d9c0e.jpg",
    category: "Món nướng",
    time: "50 phút",
    difficulty: "Khó",
    description: "Nem nướng thơm phức ăn kèm rau sống và nước chấm sệt đặc biệt.",
    ingredients: [
      "400g thịt heo xay",
      "Mỡ heo, tỏi",
      "Bánh tráng, bún",
      "Rau sống, dưa leo",
      "Nước chấm đặc biệt",
    ],
    instructions: [
      "Xay thịt với mỡ, tỏi và gia vị",
      "Vo viên hoặc xiên que",
      "Nướng trên than hoa đến vàng",
      "Cuốn nem với bánh tráng, bún, rau",
      "Chấm nước mắm pha đặc biệt",
    ],
  },
};

// 2. CHUYỂN ĐỔI DỮ LIỆU SANG DẠNG MẢNG CHO FAVORITES.JS
// Food database for reference (Generated from recipesData)
const foodDatabase = Object.entries(recipesData).map(([name, data], index) => {
  return {
    id: index + 1, // Tạo ID số tự động (1, 2, 3...)
    name: name, // Lấy tên từ key của object
    ...data, // Copy toàn bộ dữ liệu (image, category, time, etc.)
  };
});

const Favorites = {
  init() {
    this.loadFavorites();
    this.renderFavorites();
    // Thêm event listener cho storage để cập nhật khi có thay đổi từ trang khác
    window.addEventListener("storage", () => {
      this.loadFavorites();
      this.renderFavorites();
    });
  },

  loadFavorites() {
    const storedFavorites = localStorage.getItem("favorites");
    this.favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
  },

  getFavoriteFoods() {
    return foodDatabase.filter((food) => this.favoriteIds.includes(food.id));
  },

  removeFavorite(foodId) {
    this.favoriteIds = this.favoriteIds.filter((id) => id !== foodId);
    localStorage.setItem("favorites", JSON.stringify(this.favoriteIds));
    this.renderFavorites();
    // Dispatch custom event để các trang khác có thể cập nhật
    window.dispatchEvent(
      new CustomEvent("favoritesUpdated", { detail: this.favoriteIds })
    );
  },

  renderFavorites() {
    const grid = document.getElementById("favoritesGrid");
    // --- THÊM DÒNG NÀY ---
    if (!grid) return; // Nếu không có lưới (đang ở trang chủ) thì dừng lại, không vẽ gì cả
    // --------------------

    const emptyState = document.getElementById("emptyState");
    const favoriteFoods = this.getFavoriteFoods();
    //const grid = document.getElementById("favoritesGrid");
    //const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("favoriteCount");
    const basePath = getBasePath();

    if (favoriteFoods.length === 0) {
      grid.style.display = "none";
      emptyState.style.display = "block";
      resultCount.textContent = "";
      return;
    }

    grid.style.display = "grid";
    emptyState.style.display = "none";
    resultCount.textContent = ``;

    grid.innerHTML = favoriteFoods
      .map((food) => {
        // Get image path: use imported image if available, otherwise use original path with base path
        let imagePath = food.image;
        if (imageMap[food.id]) {
          // Use imported image URL (already processed by Vite with correct base path)
          imagePath = imageMap[food.id];
        } else if (
          !imagePath.startsWith("http://") &&
          !imagePath.startsWith("https://")
        ) {
          // For external images or images not in the map, add base path
          imagePath = imagePath.startsWith("/")
            ? imagePath
            : basePath + imagePath;
        }

        return `
            <article class="food-card">
                <div class="image-container">
                    <img src="${imagePath}" alt="${food.name}" class="food-image">
                    <span class="food-category-badge">${food.category}</span>
                    <div class="food-favorite favorited" data-food-id="${food.id}" style="background: #ff6b6b; cursor: pointer;">
                        <span>❤️</span>
                    </div>
                </div>
                <div class="food-content">
                    <h3 class="food-name">${food.name}</h3>
                    <p class="food-description">${food.description}</p>
                    <div class="food-meta">
                        <span class="food-time">⏱️ ${food.time}</span>
                        <span class="food-difficulty">${food.difficulty}</span>
                    </div>
                    <button class="view-recipe-btn">Xem Công Thức</button>
                </div>
            </article>
        `;
      })
      .join("");

    // Thêm event listener cho các nút yêu thích sau khi render
    this.bindFavoriteButtons();
  },

  // Bind event listeners cho các nút yêu thích
  bindFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll(
      ".food-favorite[data-food-id]"
    );
    favoriteButtons.forEach((btn) => {
      // Remove existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      // Add click event
      newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const foodId = parseInt(newBtn.getAttribute("data-food-id"));
        this.removeFavorite(foodId);
      });
    });
  },
};

window.Favorites = Favorites;
// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("favoritesGrid")) {
        Favorites.init();
    }
});
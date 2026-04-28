// ==========================================================================
// 1. CƠ SỞ DỮ LIỆU CÔNG THỨC (GIỮ NGUYÊN DỮ LIỆU CŨ CỦA BẠN)
// ==========================================================================
const recipesDB = {
  "Cơm gà Hội An": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211bb8eaa78a49193e39bf1374969bb2713.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Cơm gà vàng ươm thơm lừng, thịt gà dai ngọt đặc sản phố Hội.",
    ingredients: ["1 bát gạo", "150g ức gà", "Rau thơm, hành", "Nghệ tươi", "Nước mắm, tiêu"],
    instructions: ["Luộc gà với gừng và hành", "Nấu cơm bằng nước luộc gà và nghệ", "Xé gà trộn với hành phi và gia vị", "Dọn cơm kèm rau thơm và nước mắm"]
  },
  "Phở bò Hà Nội": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512111dfcf065cac26fc487bbc61bf06b3880.jpg",
    category: "Món nước",
    time: "180 phút",
    difficulty: "Khó",
    description: "Món ăn quốc hồn quốc túy với nước dùng thanh ngọt từ xương bò.",
    ingredients: ["200g bánh phở", "150g thịt bò", "Xương bò", "Hành, gừng, quế, hồi", "Rau thơm, giá đỗ"],
    instructions: ["Ninh xương bò với gừng nướng trong 4-5 tiếng", "Thêm quế, hồi, thảo quả vào nước dùng", "Trụng bánh phở, xếp thịt bò lên trên", "Chan nước dùng nóng, thêm hành và rau thơm"]
  },
  "Bún chả Hà Nội": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512118dae424aca7dcc6e03d49502e50564ad.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Thịt nướng than hoa thơm lừng ăn kèm bún và nước mắm chua ngọt.",
    ingredients: ["300g thịt ba chỉ", "200g thịt nạc vai xay", "200g bún tươi", "Nước mắm, đường, tỏi", "Rau sống, dưa góp"],
    instructions: ["Ướp thịt ba chỉ với nước mắm, đường, tỏi băm", "Vo viên thịt xay, ướp gia vị tương tự", "Nướng thịt trên than hoa đến vàng thơm", "Pha nước chấm chua ngọt, thêm ớt tỏi", "Dọn bún kèm thịt nướng, rau sống và nước chấm"]
  },
  "Bánh mì thịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211b890f3c4b0c5a6e2042935529195dbcc.jpg",
    category: "Món mặn",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Ổ bánh mì giòn rụm kẹp pate, thịt nguội đậm đà hương vị Việt.",
    ingredients: ["1 ổ bánh mì", "100g pate gan", "80g chả lụa", "Dưa leo, đồ chua", "Rau mùi, ớt, xì dầu"],
    instructions: ["Nướng giòn bánh mì", "Phết pate đều lên ruột bánh", "Xếp chả lụa, thịt nguội lên", "Thêm dưa leo, đồ chua, rau mùi", "Rưới xì dầu và thêm ớt tùy khẩu vị"]
  },
  "Gỏi cuốn tôm thịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512113b29efa85e5718ada0a48add33674027.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Món cuốn thanh mát với tôm thịt tươi ngon, chấm tương đen béo ngậy.",
    ingredients: ["10 tờ bánh tráng", "200g tôm sú", "150g thịt ba chỉ luộc", "Bún, rau sống, húng quế", "Đậu phộng, tương đen"],
    instructions: ["Luộc tôm và thịt ba chỉ, để nguội thái lát", "Nhúng bánh tráng qua nước ấm", "Xếp rau, bún, thịt, tôm lên bánh", "Cuốn chặt tay từ dưới lên", "Pha nước chấm tương đen với đậu phộng giã"]
  },
  "Bún bò Huế": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211a65a9d7e75c2950b772061f5d4240959.jpg",
    category: "Món nước",
    time: "120 phút",
    difficulty: "Khó",
    description: "Hương vị cay nồng đặc trưng cố đô với sả và mắm ruốc.",
    ingredients: ["300g bún tươi", "200g bắp bò", "100g giò heo", "Sả, ớt, mắm ruốc", "Rau muống, bắp chuối"],
    instructions: ["Ninh xương và giò heo trong 2 tiếng", "Phi sả và ớt, thêm mắm ruốc tạo màu", "Cho bắp bò vào hầm mềm", "Trụng bún, xếp thịt, chan nước dùng nóng", "Ăn kèm rau muống, bắp chuối bào"]
  },
  "Cá kho tộ": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121101c1ece6f4c310b83388e44e8a426d88.jpg",
    category: "Món mặn",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Cá kho đậm đà, màu cánh gián đẹp mắt, cực kỳ đưa cơm.",
    ingredients: ["500g cá lóc hoặc cá basa", "Nước màu (caramel)", "Nước mắm, đường, tiêu", "Hành lá, ớt, tỏi", "Nước dừa tươi"],
    instructions: ["Cắt cá thành khúc, ướp với nước mắm và tiêu", "Thắng nước màu trong nồi đất", "Xếp cá vào, thêm nước dừa và gia vị", "Kho lửa nhỏ 30-40 phút cho cá thấm", "Rắc hành lá và tiêu trước khi tắt bếp"]
  },
  "Thịt kho tàu": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211f75b0d44512fe25e88f9dd3fe35c47cb.jpg",
    category: "Món mặn",
    time: "90 phút",
    difficulty: "Trung bình",
    description: "Thịt kho mềm rục, trứng vịt thấm vị, món ăn không thể thiếu ngày Tết.",
    ingredients: ["500g thịt ba chỉ", "6 quả trứng vịt", "Nước dừa tươi", "Nước mắm, đường, tỏi", "Hành tím, tiêu"],
    instructions: ["Cắt thịt miếng vuông, ướp với nước mắm và tỏi", "Luộc và bóc vỏ trứng vịt", "Thắng nước màu, cho thịt vào đảo đều", "Thêm nước dừa, hầm lửa nhỏ 1 tiếng", "Cho trứng vào kho thêm 15 phút"]
  },
  "Canh chua cá": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211a9a226403aae0ac8bc0c76af0924ff60.jpg",
    category: "Món nước",
    time: "35 phút",
    difficulty: "Trung bình",
    description: "Vị chua thanh của me và dứa kết hợp với cá tươi ngon.",
    ingredients: ["400g cá lóc", "200g dứa (thơm)", "Cà chua, đậu bắp, giá", "Me, rau om, ngò gai", "Nước mắm, đường"],
    instructions: ["Phi tỏi thơm, cho cà chua vào xào", "Đổ nước, thêm me và dứa nấu sôi", "Cho cá vào nấu chín", "Thêm đậu bắp, giá, nêm gia vị", "Rắc rau om, ngò gai trước khi tắt bếp"]
  },
  "Chả giò (Nem rán)": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211da36eabaf4ee0d560de48168b94a5a13.jpg",
    category: "Món mặn",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Những cuốn chả giò vàng ruộm, giòn tan với nhân thịt tôm đầy đặn.",
    ingredients: ["200g thịt heo xay", "100g tôm băm", "Miến, mộc nhĩ, cà rốt", "Bánh tráng nem", "Trứng, hành, tiêu"],
    instructions: ["Trộn thịt, tôm với miến, mộc nhĩ, cà rốt bào", "Nêm gia vị, thêm trứng để kết dính", "Cuốn nhân vào bánh tráng chặt tay", "Chiên ngập dầu đến vàng giòn", "Ăn kèm nước mắm chua ngọt và rau sống"]
  },
  "Cơm tấm sườn bì chả": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512115f00d28a72c4e0461d63cb9102b90340.jpg",
    category: "Món mặn",
    time: "75 phút",
    difficulty: "Trung bình",
    description: "Sườn nướng thơm phức ăn cùng cơm tấm Sài Gòn đặc trưng.",
    ingredients: ["1 bát cơm tấm", "1 miếng sườn nướng", "Bì heo, chả trứng", "Đồ chua, dưa leo", "Mỡ hành, nước mắm"],
    instructions: ["Ướp sườn với sả, tỏi, nước mắm, mật ong", "Nướng sườn trên than hoặc lò", "Trộn bì với thính gạo", "Hấp chả trứng", "Dọn cơm với sườn, bì, chả và mỡ hành"]
  },
  "Mì Quảng": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512111cd4ebc0fe6f5edb840fe4c940c89ec1.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Đặc sản Quảng Nam với nước lèo sệt đậm đà và bánh đa giòn tan.",
    ingredients: ["300g mì Quảng", "200g tôm, 150g thịt heo", "Đậu phộng rang, bánh tráng", "Rau sống, hành lá", "Nghệ, dầu điều"],
    instructions: ["Xào tôm và thịt với nghệ và dầu điều", "Thêm nước, nấu thành nước lèo sệt", "Trụng mì, xếp ra tô", "Chan nước lèo, thêm tôm thịt", "Rắc đậu phộng, ăn kèm bánh tráng và rau"]
  },
  "Bánh xèo": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211227bda212912ca66f4fdcc51c15b7bd0.jpg",
    category: "Món mặn",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Bánh xèo vàng ươm, vỏ giòn tan, nhân tôm thịt đầy ắp.",
    ingredients: ["200g bột bánh xèo", "200g tôm, 150g thịt ba chỉ", "Giá đỗ, hành lá", "Nước cốt dừa, nghệ", "Rau sống, nước mắm chua ngọt"],
    instructions: ["Pha bột với nước cốt dừa và nghệ", "Xào tôm thịt sơ qua", "Đổ bột vào chảo nóng, thêm nhân và giá", "Đậy nắp, chiên đến giòn vàng", "Gập đôi bánh, ăn kèm rau và nước chấm"]
  },
  "Hủ tiếu Nam Vang": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121163ea3d4e399a9dc8564c7d012ee19235.jpg",
    category: "Món nước",
    time: "90 phút",
    difficulty: "Khó",
    description: "Nước dùng ngọt thanh từ xương, ăn kèm tôm, gan và thịt băm.",
    ingredients: ["200g hủ tiếu khô", "100g thịt heo, 100g tôm", "Gan, tim heo", "Giá, hẹ, hành phi", "Xương heo ninh"],
    instructions: ["Ninh xương heo lấy nước dùng trong", "Trụng hủ tiếu, xếp ra tô", "Xếp thịt, tôm, gan, tim lên trên", "Chan nước dùng nóng", "Rắc hành phi, ăn kèm giá và hẹ"]
  },
  "Bò lúc lắc": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512114690676a46bf3fc17ee07ec6c451e858.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Thịt bò mềm mọng nước, xào nhanh lửa lớn với rau củ.",
    ingredients: ["300g thịt bò thăn", "Tỏi, hành tây", "Xì dầu, dầu hào", "Tiêu đen, bơ", "Cà chua, xà lách"],
    instructions: ["Cắt bò thành hạt lựu, ướp xì dầu và tiêu", "Đun nóng chảo với bơ và tỏi", "Cho bò vào xào lửa lớn nhanh tay", "Thêm hành tây, nêm dầu hào", "Dọn kèm cà chua, xà lách và cơm trắng"]
  },
  "Gà nướng muối ớt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512116a7638a4b19fca2c111d86388ffa5f94.jpg",
    category: "Món quay",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Gà nướng da giòn, thịt cay nồng vị muối ớt sả.",
    ingredients: ["1 con gà ta (1.2kg)", "Muối hạt, ớt bột", "Sả, tỏi, gừng", "Mật ong, nước mắm", "Lá chanh"],
    instructions: ["Làm sạch gà, chặt miếng vừa ăn", "Ướp gà với muối, ớt, sả, tỏi băm", "Để ngấm gia vị 30 phút", "Nướng gà trên than hoặc lò 200°C", "Phết mật ong, nướng thêm 5 phút cho vàng"]
  },
  "Lẩu thái hải sản": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211f684b0d880c4157c38e2e6063856a4de.jpg",
    category: "Món nước",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Nồi lẩu chua cay đậm đà, ngập tràn hải sản tươi ngon.",
    ingredients: ["500g hải sản các loại", "Nấm, đậu hũ, rau", "Sả, riềng, lá chanh", "Ớt, nước cốt chanh", "Nước mắm, sa tế"],
    instructions: ["Nấu nước dùng với sả, riềng, lá chanh", "Thêm sa tế và ớt tạo vị cay", "Cho hải sản, nấm, đậu hũ vào", "Nêm nước mắm và nước cốt chanh", "Nhúng rau và bún ăn kèm"]
  },
  "Cháo lòng": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512114a8f617e9ab5e1a1211de1521e00a984.jpg",
    category: "Món nước",
    time: "90 phút",
    difficulty: "Khó",
    description: "Cháo sánh mịn nấu từ nước luộc lòng, ăn kèm dồi trường giòn sật.",
    ingredients: ["200g gạo", "300g lòng heo các loại", "Huyết heo", "Hành lá, gừng, tiêu", "Giá, rau mùi, quẩy"],
    instructions: ["Làm sạch lòng với muối và giấm", "Luộc lòng với gừng, thái lát", "Nấu cháo nhừ với nước luộc lòng", "Xếp lòng và huyết lên cháo", "Rắc hành, tiêu, ăn kèm quẩy và giá"]
  },
  "Bún riêu cua": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121121c7774ff5ecf909e54251366bdd3aa7.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Vị ngọt thanh của cua đồng hòa quyện với vị chua dịu của cà chua.",
    ingredients: ["300g bún tươi", "200g cua đồng", "Cà chua, đậu hũ chiên", "Mắm tôm, me", "Rau muống, hành lá"],
    instructions: ["Giã cua, lọc lấy nước và gạch", "Nấu nước cua sôi, gạch nổi lên thành riêu", "Xào cà chua, thêm nước cua và me", "Cho đậu hũ chiên vào", "Trụng bún, chan nước riêu, thêm mắm tôm"]
  },
  "Xôi gà": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211cb476ff00d1f5fa213c65106ea2d2d01.jpg",
    category: "Món mặn",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Xôi dẻo thơm nấu cùng nước gà, ăn kèm gà xé và hành phi.",
    ingredients: ["300g gạo nếp", "200g thịt gà", "Hành phi, mỡ gà", "Nước mắm, tiêu", "Dưa leo, rau mùi"],
    instructions: ["Ngâm gạo nếp 4 tiếng, để ráo", "Luộc gà, lấy nước trộn vào nếp", "Hấp xôi chín dẻo", "Xé gà, trộn với mỡ gà và gia vị", "Dọn xôi với gà xé, hành phi và dưa leo"]
  },
  "Bánh cuốn": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121195bf6ac219dc8a3be5d7b0e123e07848.jpg",
    category: "Món mặn",
    time: "45 phút",
    difficulty: "Khó",
    description: "Bánh tráng mỏng tang, nhân thịt mộc nhĩ, chấm nước mắm cà cuống.",
    ingredients: ["300g bột gạo", "150g thịt heo xay", "Mộc nhĩ, hành khô", "Chả lụa, hành phi", "Nước mắm chua ngọt"],
    instructions: ["Xào thịt với mộc nhĩ và hành", "Tráng bột mỏng trên vải hấp", "Cho nhân vào, cuộn lại", "Xếp bánh ra đĩa, rắc hành phi", "Ăn kèm chả lụa và nước mắm chua ngọt"]
  },
  "Bún đậu mắm tôm": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121178444a3dabd4ecb8fc67c5af6bc0b3cd.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Mẹt bún đậu đầy đủ với đậu rán giòn, chả cốm và mắm tôm dậy mùi.",
    ingredients: ["300g bún lá", "200g đậu hũ chiên", "Chả cốm, nem chua", "Thịt luộc, dồi", "Mắm tôm, quất"],
    instructions: ["Chiên đậu hũ vàng giòn", "Luộc thịt, thái lát", "Cắt bún thành miếng vừa ăn", "Pha mắm tôm với quất và đường", "Bày tất cả ra đĩa, chấm mắm tôm"]
  },
  "Bánh canh cua": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512115361c7b706d799f8e3957fc6a7389637.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Sợi bánh canh dai ngon trong nước dùng cua sền sệt, đậm đà.",
    ingredients: ["300g bánh canh bột lọc", "200g thịt cua", "Trứng cút, chả lụa", "Hành, tiêu, nước mắm", "Rau mùi, hành phi"],
    instructions: ["Nấu nước dùng từ vỏ cua", "Thêm thịt cua vào, nêm gia vị", "Cho bánh canh vào nấu mềm", "Thêm trứng cút và chả lụa", "Rắc hành phi và tiêu trước khi ăn"]
  },
  "Cơm chiên dương châu": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211c701c21a5816dd847fae54e9dadf7494.jpg",
    category: "Món mặn",
    time: "25 phút",
    difficulty: "Dễ",
    description: "Cơm chiên tơi xốp, đầy màu sắc với rau củ, lạp xưởng và tôm.",
    ingredients: ["2 bát cơm nguội", "100g tôm, 100g lạp xưởng", "2 quả trứng", "Đậu Hà Lan, cà rốt", "Hành lá, xì dầu"],
    instructions: ["Xào trứng chín, để riêng", "Xào tôm và lạp xưởng thái hạt lựu", "Cho cơm vào xào lửa lớn", "Thêm rau củ, trứng, nêm xì dầu", "Rắc hành lá, đảo đều và dọn ra"]
  },
  "Gà kho gừng": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211263a254f56c7e07cf47066d4fd21625f.jpg",
    category: "Món mặn",
    time: "40 phút",
    difficulty: "Dễ",
    description: "Món ăn gia đình ấm cúng với vị cay ấm của gừng thấm vào thịt gà.",
    ingredients: ["500g thịt gà", "100g gừng tươi", "Nước mắm, đường", "Hành tím, tỏi", "Tiêu, ớt"],
    instructions: ["Chặt gà miếng vừa, ướp nước mắm", "Thái gừng sợi, phi thơm với dầu", "Cho gà vào xào săn", "Thêm nước, kho lửa nhỏ 30 phút", "Nêm gia vị, rắc tiêu và hành"]
  },
  "Tôm rim mặn ngọt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512111e13f344eaf045019ebb74124195a30d.jpg",
    category: "Món mặn",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Tôm săn chắc, vỏ bóng lưỡng, vị mặn ngọt hài hòa đưa cơm.",
    ingredients: ["400g tôm sú", "Nước mắm, đường", "Tỏi, ớt, hành", "Tiêu đen", "Dầu ăn"],
    instructions: ["Cắt râu tôm, rửa sạch để ráo", "Phi tỏi thơm, cho tôm vào xào", "Thêm nước mắm và đường rim", "Đảo đều đến khi tôm săn và bóng", "Rắc tiêu và hành lá, tắt bếp"]
  },
  "Canh khổ qua nhồi thịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211d6d4e18f3c6cf76a98aa98bfdd3c2a38.jpg",
    category: "Món nước",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Món canh thanh nhiệt, vị đắng nhẹ của khổ qua hòa cùng vị ngọt thịt.",
    ingredients: ["2 quả khổ qua", "200g thịt heo xay", "Mộc nhĩ, miến", "Hành, tiêu, nước mắm", "Hành lá"],
    instructions: ["Cắt khổ qua khúc, bỏ ruột", "Trộn thịt với mộc nhĩ, miến, gia vị", "Nhồi thịt vào khổ qua", "Nấu nước sôi, cho khổ qua vào", "Hầm 25 phút, nêm nước mắm"]
  },
  "Thịt heo quay": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512113fafb630e8dc20dd4c2eff63e5d7f7db.jpg",
    category: "Món quay",
    time: "90 phút",
    difficulty: "Khó",
    description: "Thịt quay bì giòn rụm, thịt mềm thơm hương ngũ vị hương.",
    ingredients: ["1kg thịt ba chỉ", "Ngũ vị hương, muối", "Giấm, bột nở", "Tỏi, hành tím", "Mật ong"],
    instructions: ["Luộc sơ thịt, để ráo nước", "Ướp mặt thịt với ngũ vị hương và tỏi", "Xoa giấm và muối lên da", "Để tủ lạnh qua đêm cho da khô", "Quay ở 220°C đến khi da giòn vàng"]
  },
  "Vịt nấu chao": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512112849a7e45781df0b26b31d740e3d0854.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Vịt nấu chao thơm lừng, béo ngậy, khoai môn dẻo bùi.",
    ingredients: ["1/2 con vịt", "Chao đỏ", "Khoai môn, nấm rơm", "Sả, gừng, tỏi", "Rau muống, bún"],
    instructions: ["Chặt vịt miếng, ướp với chao và sả", "Xào vịt săn, thêm nước hầm", "Cho khoai môn vào nấu mềm", "Thêm nấm rơm, nêm gia vị", "Ăn kèm bún và rau muống"]
  },
  "Chè đậu xanh": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211890d01a4143a4d9b04ba39d2a32203ae.jpg",
    category: "Món tráng miệng",
    time: "40 phút",
    difficulty: "Dễ",
    description: "Chè đậu xanh ngọt mát, thêm chút nước cốt dừa béo ngậy.",
    ingredients: ["200g đậu xanh cà vỏ", "100g đường", "Nước cốt dừa", "Bột năng, muối", "Lá dứa"],
    instructions: ["Ngâm đậu xanh 2 tiếng, hấp chín", "Nấu nước đường với lá dứa", "Cho đậu vào, khuấy tan", "Nấu nước cốt dừa với chút muối", "Múc chè ra bát, rưới nước cốt dừa"]
  },
  "Bánh flan": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512110deb1e4e0a95e5143aa0e03245a87301.jpg",
    category: "Món tráng miệng",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Bánh flan mềm mịn, thơm mùi trứng sữa và sốt caramel đắng nhẹ.",
    ingredients: ["4 quả trứng", "400ml sữa tươi", "100g đường", "Vani", "Nước caramel"],
    instructions: ["Thắng đường thành caramel, đổ vào khuôn", "Đánh trứng với sữa và đường", "Thêm vani, lọc hỗn hợp qua rây", "Đổ vào khuôn, hấp cách thủy 30 phút", "Để nguội, úp ngược ra đĩa"]
  },
  "Chè ba màu": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121104f19aa9721eff2bffe60f2f24fc2da2.jpg",
    category: "Món tráng miệng",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Ly chè bắt mắt với đậu xanh, đậu đỏ và thạch, giải nhiệt ngày hè.",
    ingredients: ["Đậu xanh, đậu đỏ", "Thạch, nước cốt dừa", "Đường, đá bào", "Sữa đặc", "Hạt lựu"],
    instructions: ["Nấu chín đậu xanh và đậu đỏ riêng", "Cắt thạch thành hạt lựu", "Xếp lớp đậu và thạch vào ly", "Rưới nước cốt dừa và sữa đặc", "Thêm đá bào lên trên"]
  },
  "Sườn xào chua ngọt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512111a7d332b3aeaacb2627f20015e34eb67.jpg",
    category: "Món mặn",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Sườn non mềm thấm sốt chua ngọt đậm đà, màu sắc hấp dẫn.",
    ingredients: ["500g sườn non", "Cà chua, dứa, ớt chuông", "Tương cà, giấm", "Đường, nước mắm", "Hành, tỏi"],
    instructions: ["Chặt sườn miếng, ướp gia vị", "Chiên sườn vàng, để riêng", "Xào cà chua và dứa với sốt chua ngọt", "Cho sườn vào đảo đều", "Thêm ớt chuông, nêm vừa ăn"]
  },
  "Đậu hũ sốt cà": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211fe68743bfab49703a9d91b42a17ee666.jpg",
    category: "Món mặn",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Đậu hũ chiên vàng hòa quyện trong sốt cà chua đỏ mọng.",
    ingredients: ["300g đậu hũ non", "2 quả cà chua", "Hành, tỏi", "Nước mắm, đường", "Hành lá, tiêu"],
    instructions: ["Cắt đậu hũ miếng vuông, chiên vàng", "Phi tỏi, xào cà chua nhuyễn", "Nêm nước mắm, đường tạo sốt", "Cho đậu hũ vào sốt, đảo nhẹ", "Rắc hành lá và tiêu"]
  },
  "Cá chiên xù": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211f5b3c12af77cba6bbc0174bce28a7e4d.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Cá phi lê giòn rụm bên ngoài, mềm ngọt bên trong.",
    ingredients: ["400g cá phi lê", "Bột chiên xù", "Trứng, bột mì", "Sốt mayonnaise", "Chanh, rau sống"],
    instructions: ["Cắt cá miếng vừa, ướp muối tiêu", "Lăn cá qua bột mì, trứng, bột xù", "Chiên ngập dầu đến vàng giòn", "Vớt ra để ráo dầu", "Ăn kèm sốt mayonnaise và chanh"]
  },
  "Rau muống xào tỏi": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121179bd5c6a9d893b0cab560dbe87b32e51.jpg",
    category: "Món mặn",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Rau muống xanh mướt, giòn sần sật dậy mùi tỏi phi thơm.",
    ingredients: ["300g rau muống", "5 tép tỏi", "Dầu ăn", "Nước mắm, đường", "Ớt (tùy chọn)"],
    instructions: ["Nhặt rau muống, rửa sạch để ráo", "Băm nhỏ tỏi, phi vàng thơm", "Cho rau vào xào lửa lớn nhanh tay", "Nêm nước mắm và chút đường", "Đảo đều, tắt bếp khi rau vừa chín"]
  },
  "Súp cua": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211dde2e1fb24afbdc3eb3cd03476d508ef.jpg",
    category: "Món nước",
    time: "40 phút",
    difficulty: "Trung bình",
    description: "Chén súp nóng hổi, sánh đặc với thịt cua và trứng.",
    ingredients: ["200g thịt cua", "2 quả trứng", "Bắp, nấm rơm", "Bột năng, hành", "Tiêu, dầu mè"],
    instructions: ["Nấu nước dùng với xương gà", "Thêm bắp và nấm rơm vào", "Cho thịt cua, khuấy bột năng tạo sánh", "Đánh trứng, rưới từ từ vào súp", "Rắc tiêu, hành và dầu mè"]
  },
  "Bò né": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121104b3de0fd17ea25990338d4aeb3c2e1a.jpg",
    category: "Món mặn",
    time: "20 phút",
    difficulty: "Trung bình",
    description: "Bò né nóng hổi trên chảo gang, ăn kèm trứng ốp la và bánh mì.",
    ingredients: ["150g thịt bò", "2 quả trứng ốp la", "Pate, xúc xích", "Bánh mì, bơ", "Hành tây, đồ chua"],
    instructions: ["Ướp bò với tiêu và dầu hào", "Đun nóng chảo gang với bơ", "Áp chảo bò, chiên trứng ốp la", "Xếp pate, xúc xích lên chảo", "Dọn kèm bánh mì và đồ chua"]
  },
  "Gỏi gà xé phay": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211cb2599c53497463495c2293bdd5010c1.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Gà xé trộn gỏi chua ngọt, giòn ngon, thanh mát.",
    ingredients: ["300g ức gà", "Bắp cải, hành tây", "Rau răm, đậu phộng", "Nước mắm, chanh, đường", "Ớt, tỏi"],
    instructions: ["Luộc gà chín, xé sợi nhỏ", "Bào mỏng bắp cải và hành tây", "Pha nước mắm chua ngọt với tỏi ớt", "Trộn gà với rau, rưới nước mắm", "Rắc đậu phộng và rau răm"]
  },
  "Bánh bột lọc": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211c3ea18548b1ec7c3ae5e386725c4a217.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Khó",
    description: "Bánh bột lọc trong veo, dai dai với nhân tôm thịt đậm đà.",
    ingredients: ["200g bột năng", "200g tôm", "Thịt ba chỉ", "Hành phi, nước mắm", "Lá chuối"],
    instructions: ["Nhào bột năng với nước sôi", "Xào tôm thịt với gia vị làm nhân", "Cán bột mỏng, gói nhân vào", "Hấp bánh trong lá chuối 15 phút", "Ăn kèm nước mắm chua ngọt"]
  },
  "Cơm cháy chà bông": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512114b6932d347f15ec934be8f4569cce316.jpg",
    category: "Món mặn",
    time: "40 phút",
    difficulty: "Trung bình",
    description: "Cơm cháy giòn rụm phủ đầy chà bông và mỡ hành béo ngậy.",
    ingredients: ["2 bát cơm nguội", "100g chà bông", "Mỡ hành", "Dầu ăn", "Nước mắm me"],
    instructions: ["Nén cơm thành miếng dẹt", "Chiên cơm trong dầu nóng đến giòn", "Vớt ra để ráo dầu", "Phủ chà bông và mỡ hành lên", "Ăn kèm nước mắm me"]
  },
  "Ốc len xào dừa": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512119d990e4e1422e192eb124e75a066cf10.jpg",
    category: "Món mặn",
    time: "30 phút",
    difficulty: "Trung bình",
    description: "Ốc len béo ngậy ngập trong nước cốt dừa thơm nức mũi.",
    ingredients: ["500g ốc len", "Nước cốt dừa", "Sả, ớt, lá chanh", "Nước mắm, đường", "Rau răm"],
    instructions: ["Ngâm ốc với nước vo gạo, rửa sạch", "Phi sả và ớt thơm", "Cho ốc vào xào, thêm nước cốt dừa", "Nêm nước mắm, đường, thêm lá chanh", "Đảo đều, rắc rau răm"]
  },
  "Bún mắm": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211a88863468ef32057c05df468253f6ef6.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Đặc sản miền Tây với hương vị mắm cá linh đặc trưng.",
    ingredients: ["300g bún tươi", "Mắm cá linh", "Tôm, mực, thịt quay", "Cà tím, đậu bắp", "Rau sống, chanh"],
    instructions: ["Nấu nước dùng từ mắm cá linh", "Cho cà tím, đậu bắp vào nấu chín", "Luộc tôm, mực riêng", "Trụng bún, xếp hải sản và thịt quay", "Chan nước mắm, ăn kèm rau sống"]
  },
  "Cháo vịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512113d066527f0294204aa7c5a25aa89b33f.jpg",
    category: "Món nước",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Cháo vịt ngọt lịm, thịt vịt chấm nước mắm gừng ấm bụng.",
    ingredients: ["1/2 con vịt", "200g gạo", "Gừng, hành tím", "Rau mùi, hành lá", "Tiêu, nước mắm"],
    instructions: ["Làm sạch vịt, luộc với gừng", "Lấy nước luộc nấu cháo", "Chặt vịt miếng, phi hành tím", "Múc cháo ra tô, xếp thịt vịt lên", "Rắc hành, rau mùi, tiêu"]
  },
  "Bánh tráng trộn": {
    image: "https://sf-static.upanhlaylink.com/img/image_202512119fca0f73897e157b77c82629d9c3ec23.jpg",
    category: "Món mặn",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Món ăn vặt quốc dân với đủ vị chua cay mặn ngọt.",
    ingredients: ["200g bánh tráng cắt sợi", "Trứng cút, khô bò", "Xoài xanh, rau răm", "Đậu phộng, hành phi", "Sốt me, tương ớt"],
    instructions: ["Cắt nhỏ bánh tráng", "Luộc trứng cút, bổ đôi", "Trộn bánh tráng với khô bò, xoài", "Thêm sốt me và tương ớt", "Rắc đậu phộng, hành phi, rau răm"]
  },
  "Mì xào hải sản": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121144387b387f9a1b42706f7f522ff67585.jpg",
    category: "Món mặn",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Mì xào dai ngon, thấm vị hải sản và rau củ tươi.",
    ingredients: ["200g mì vàng", "200g hải sản tổng hợp", "Cải ngọt, cà rốt", "Xì dầu, dầu hào", "Tỏi, hành"],
    instructions: ["Trụng mì qua nước sôi, để ráo", "Xào hải sản với tỏi, để riêng", "Xào mì với xì dầu lửa lớn", "Thêm rau củ và hải sản vào", "Nêm dầu hào, đảo đều"]
  },
  "Chè trôi nước": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211cb07e79103153c0aef15ad995208f73a.jpg",
    category: "Món tráng miệng",
    time: "50 phút",
    difficulty: "Trung bình",
    description: "Viên chè trắng ngần, dẻo thơm quyện cùng nước đường gừng ấm nồng.",
    ingredients: ["200g bột nếp", "100g đậu xanh", "Gừng, đường", "Nước cốt dừa", "Mè rang"],
    instructions: ["Nấu nhân đậu xanh với đường", "Nhào bột nếp, bọc nhân vo tròn", "Luộc bánh trong nước sôi đến nổi", "Nấu nước đường gừng", "Múc bánh ra, chan nước gừng và cốt dừa"]
  },
  "Thịt bò xào ớt chuông": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211cdab62bf0079c899207c7fc1900b615e.jpg",
    category: "Món mặn",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Món xào nhanh gọn, giàu dinh dưỡng và màu sắc bắt mắt.",
    ingredients: ["250g thịt bò", "2 quả ớt chuông", "Hành tây, tỏi", "Xì dầu, dầu hào", "Tiêu, dầu mè"],
    instructions: ["Thái bò lát mỏng, ướp xì dầu và tiêu", "Cắt ớt chuông và hành tây miếng vuông", "Xào bò lửa lớn nhanh tay, để riêng", "Xào ớt chuông và hành tây", "Cho bò vào, nêm dầu hào, rưới dầu mè"]
  },
  "Canh bí đỏ nấu tôm": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121136d58b4b9a72326933a7cebd81386703.jpg",
    category: "Món nước",
    time: "25 phút",
    difficulty: "Dễ",
    description: "Canh bí đỏ ngọt bùi, bổ dưỡng nấu cùng tôm tươi.",
    ingredients: ["300g bí đỏ", "150g tôm tươi", "Hành lá, rau mùi", "Nước mắm, tiêu", "Hành tím phi"],
    instructions: ["Gọt vỏ bí đỏ, cắt miếng vừa", "Lột vỏ tôm, ướp chút muối", "Nấu nước sôi, cho bí vào nấu mềm", "Thêm tôm, nêm nước mắm", "Rắc hành lá, rau mùi và tiêu"]
  },
  "Xôi xéo": {
    image: "https://sf-static.upanhlaylink.com/img/image_2025121179d2f731d6a1ad78841c1b654a0ac75d.jpg",
    category: "Món mặn",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Xôi xéo vàng ươm gói lá sen, phủ đậu xanh và hành phi thơm nức.",
    ingredients: ["300g gạo nếp", "100g đậu xanh", "Hành phi, mỡ gà", "Nghệ, muối", "Ruốc, pate (tùy chọn)"],
    instructions: ["Ngâm nếp và đậu xanh qua đêm", "Hấp nếp với nghệ tạo màu vàng", "Hấp đậu xanh riêng, tán nhuyễn", "Xếp xôi ra đĩa, rắc đậu xanh lên", "Rưới mỡ gà, hành phi, thêm ruốc"]
  },
  "Cà ri gà": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211ad04e1549ff99516864bf4137284470e.jpg",
    category: "Món nước",
    time: "45 phút",
    difficulty: "Trung bình",
    description: "Cà ri gà béo ngậy nước cốt dừa, chấm bánh mì cực ngon.",
    ingredients: ["500g thịt gà", "Khoai tây, cà rốt", "Bột cà ri, sả", "Nước cốt dừa", "Bánh mì hoặc bún"],
    instructions: ["Chặt gà miếng, ướp bột cà ri và sả", "Xào gà săn với dầu ăn", "Thêm khoai tây, cà rốt và nước", "Hầm 30 phút đến khi mềm", "Đổ nước cốt dừa, nấu thêm 10 phút"]
  },
  "Nem nướng Nha Trang": {
    image: "https://sf-static.upanhlaylink.com/img/image_20251211a0301f470a1bfac7c3c99fc31e2d9c0e.jpg",
    category: "Món quay",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Nem nướng thơm lừng, cuốn cùng bánh tráng và rau sống.",
    ingredients: ["400g thịt heo xay", "Mỡ heo, tỏi", "Bánh tráng, bún", "Rau sống, dưa leo", "Nước chấm đặc biệt"],
    instructions: ["Xay thịt với mỡ, tỏi và gia vị", "Vo viên hoặc xiên que", "Nướng trên than hoa đến vàng", "Cuốn nem với bánh tráng, bún, rau", "Chấm nước mắm pha đặc biệt"]
  },
  // ===== NHÓM BỔ SUNG – EAT CLEAN / ĐẠM NẠC / ÍT CALO =====
  "Ức gà áp chảo": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604289a2aaf80417b6ca8609e1e6e41dd36c6.jpg",
    category: "Đạm",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Ức gà áp chảo vàng giòn bên ngoài, mềm ngọt bên trong, thích hợp eat clean.",
    ingredients: ["200g ức gà", "Muối, tiêu", "Dầu ô liu", "Tỏi băm", "Rau xà lách"],
    instructions: ["Ướp ức gà với muối, tiêu và tỏi 15 phút", "Đun nóng chảo với dầu ô liu", "Áp chảo mỗi mặt 5-6 phút lửa vừa", "Để nghỉ 3 phút rồi thái lát", "Dọn kèm rau xà lách"]
  },
  "Cá hồi nướng": {
    image: "https://sf-static.upanhlaylink.com/img/image_2026042891116d3582cdcaa597c10119bab5450d.jpg",
    category: "Đạm",
    time: "25 phút",
    difficulty: "Dễ",
    description: "Cá hồi nướng thơm béo, giàu omega-3, tốt cho sức khỏe tim mạch.",
    ingredients: ["200g phi lê cá hồi", "Chanh, tỏi", "Dầu ô liu, muối, tiêu", "Thì là tươi", "Rau củ nướng kèm"],
    instructions: ["Ướp cá hồi với chanh, tỏi, muối tiêu 15 phút", "Làm nóng lò ở 200°C", "Đặt cá lên khay, rưới dầu ô liu", "Nướng 12-15 phút đến chín vừa", "Rắc thì là, dọn kèm rau củ nướng"]
  },
  "Trứng luộc (2 quả)": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604282aea3d5bab4d6ffe01d2e2e9e5f70bf1.jpg",
    category: "Đạm",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Trứng luộc chín vừa, lòng đào mềm mịn, món ăn nhanh giàu protein.",
    ingredients: ["2 quả trứng gà", "Nước", "Muối", "Đá lạnh"],
    instructions: ["Cho trứng vào nồi nước lạnh", "Đun sôi, hạ lửa nhỏ đậy nắp 7 phút", "Vớt trứng ngâm ngay vào nước đá", "Bóc vỏ khi nguội", "Rắc chút muối tiêu, thưởng thức"]
  },
  "Yến mạch sữa hạnh nhân": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428b7871845f530da1489ed3561f0e5a562.jpg",
    category: "Cân bằng",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Yến mạch nấu sữa hạnh nhân béo thơm, bổ dưỡng cho bữa sáng lành mạnh.",
    ingredients: ["50g yến mạch", "200ml sữa hạnh nhân", "Mật ong", "Trái cây tươi", "Hạt chia"],
    instructions: ["Đun sữa hạnh nhân nóng", "Cho yến mạch vào khuấy đều 3-4 phút", "Tắt bếp, thêm mật ong", "Múc ra bát, thêm trái cây tươi", "Rắc hạt chia lên trên"]
  },
  "Salad ức gà": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604282714f6b7e97dcb8465d02a3aa10b3b5f.jpg",
    category: "Cân bằng",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Salad ức gà tươi mát, giàu protein và chất xơ, hoàn hảo cho eat clean.",
    ingredients: ["150g ức gà nướng", "Xà lách, cà chua bi", "Dưa leo, bắp ngô", "Sốt dầu giấm", "Hạt điều rang"],
    instructions: ["Nướng hoặc áp chảo ức gà, thái lát", "Rửa sạch rau, cắt miếng vừa ăn", "Trộn rau với dưa leo, cà chua, bắp", "Xếp gà lên trên, rưới sốt dầu giấm", "Rắc hạt điều rang"]
  },
  "Salad cá ngừ": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428ea86043b62522d7ec731eb732d9843fa.jpg",
    category: "Đạm",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Salad cá ngừ thanh đạm, giàu protein và omega-3, dễ làm nhanh gọn.",
    ingredients: ["1 hộp cá ngừ ngâm dầu", "Xà lách, cà chua", "Hành tây, dưa leo", "Chanh, dầu ô liu", "Tiêu, muối"],
    instructions: ["Vớt cá ngừ, xé tơi nhẹ", "Cắt rau củ miếng vừa ăn", "Trộn đều cá ngừ với rau củ", "Pha sốt chanh dầu ô liu, rưới lên", "Rắc tiêu, trộn nhẹ và dọn ra"]
  },
  "Sữa chua Hy Lạp + trái cây": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604285e245a4213ba45156f9aaab61a955dd8.jpg",
    category: "Cân bằng",
    time: "5 phút",
    difficulty: "Dễ",
    description: "Sữa chua Hy Lạp béo mịn kết hợp trái cây tươi, bữa sáng nhanh bổ dưỡng.",
    ingredients: ["200g sữa chua Hy Lạp", "Chuối, dâu tây", "Granola", "Mật ong", "Hạt óc chó"],
    instructions: ["Múc sữa chua vào bát", "Cắt trái cây miếng nhỏ", "Xếp trái cây lên sữa chua", "Rắc granola và hạt óc chó", "Rưới mật ong, thưởng thức ngay"]
  },
  "Chuối + bơ đậu phộng": {
    image: "https://sf-static.upanhlaylink.com/img/image_2026042801085d79758a3fd28bc139c981e2e380.jpg",
    category: "Cân bằng",
    time: "5 phút",
    difficulty: "Dễ",
    description: "Chuối chín ngọt phết bơ đậu phộng béo bùi, món ăn vặt healthy nhanh gọn.",
    ingredients: ["2 quả chuối chín", "2 muỗng bơ đậu phộng", "Mật ong", "Hạt chia", "Quế bột"],
    instructions: ["Bổ đôi chuối theo chiều dọc", "Phết bơ đậu phộng lên mặt chuối", "Rưới mật ong lên trên", "Rắc hạt chia và quế bột", "Ăn ngay hoặc để đông lạnh 30 phút"]
  },
  "Cơm gạo lứt + đậu hũ": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604283696b9c1f41bcad9d07b21a15ca92e94.jpg",
    category: "Cân bằng",
    time: "40 phút",
    difficulty: "Dễ",
    description: "Cơm gạo lứt dẻo thơm ăn kèm đậu hũ chiên vàng, bữa chay dinh dưỡng.",
    ingredients: ["150g gạo lứt", "200g đậu hũ", "Xì dầu, tỏi", "Rau xào kèm", "Dầu mè"],
    instructions: ["Vo gạo lứt, nấu cơm với tỷ lệ 1:1.5", "Cắt đậu hũ miếng vuông, chiên vàng", "Pha sốt xì dầu tỏi", "Rưới sốt lên đậu hũ chiên", "Dọn cơm kèm đậu hũ và rau xào"]
  },
  "Khoai lang luộc": {
    image: "https://sf-static.upanhlaylink.com/img/image_2026042846a52b2bfbeb5a83c17825eed2114577.jpg",
    category: "Tinh bột",
    time: "25 phút",
    difficulty: "Dễ",
    description: "Khoai lang luộc bùi ngọt tự nhiên, giàu chất xơ và vitamin A.",
    ingredients: ["2 củ khoai lang", "Nước", "Muối"],
    instructions: ["Rửa sạch khoai lang, giữ nguyên vỏ", "Cho vào nồi nước lạnh, thêm chút muối", "Đun sôi, hạ lửa vừa luộc 20 phút", "Kiểm tra chín bằng que tăm", "Vớt ra để nguội, bóc vỏ thưởng thức"]
  },
  "Bắp luộc": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428d68584bb895306b5d4946e5fb915150f.jpg",
    category: "Tinh bột",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Bắp luộc ngọt lịm, thơm mùi lá dứa, món ăn vặt dân dã quen thuộc.",
    ingredients: ["2 trái bắp ngọt", "Nước", "Lá dứa", "Muối"],
    instructions: ["Bóc vỏ bắp, rửa sạch", "Đun nước sôi với lá dứa và chút muối", "Cho bắp vào luộc 15-18 phút", "Vớt ra để ráo nước", "Ăn nóng hoặc để nguội đều ngon"]
  },
  "Bơ (1 quả)": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604284714663fb28ad78fc61e3583fe4f2111.jpg",
    category: "Chất béo",
    time: "5 phút",
    difficulty: "Dễ",
    description: "Quả bơ chín mềm béo ngậy, giàu chất béo tốt và vitamin E.",
    ingredients: ["1 quả bơ chín", "Sữa đặc hoặc mật ong", "Đá viên"],
    instructions: ["Bổ đôi quả bơ, bỏ hạt", "Dùng muỗng múc thịt bơ ra bát", "Thêm sữa đặc hoặc mật ong tùy thích", "Có thể xay sinh tố với đá", "Thưởng thức ngay khi còn tươi"]
  },
  "Canh rong biển đậu hũ": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604286be402032d10407bb6c237ba81da43d1.jpg",
    category: "Chất xơ",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Canh rong biển thanh mát, đậu hũ mềm mịn, giàu khoáng chất.",
    ingredients: ["50g rong biển khô", "200g đậu hũ non", "Hành lá, gừng", "Nước dùng rau củ", "Muối, tiêu"],
    instructions: ["Ngâm rong biển 10 phút, rửa sạch", "Cắt đậu hũ thành miếng nhỏ", "Đun nước dùng sôi, cho rong biển vào", "Thêm đậu hũ, nấu nhẹ 5 phút", "Nêm muối tiêu, rắc hành lá"]
  },
  "Canh cải nấu thịt bằm": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604282897893f0b060855f086d52319bb8673.jpg",
    category: "Cân bằng",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Canh cải xanh nấu thịt bằm ngọt thanh, món canh gia đình đơn giản.",
    ingredients: ["200g cải ngọt", "100g thịt heo bằm", "Hành, tỏi", "Nước mắm, tiêu", "Hành lá"],
    instructions: ["Rửa sạch cải, cắt khúc", "Phi tỏi, xào thịt bằm săn", "Đổ nước vào đun sôi", "Cho cải vào nấu chín tới", "Nêm nước mắm, rắc hành lá và tiêu"]
  },
  "Bông cải xanh luộc": {
    image: "https://sf-static.upanhlaylink.com/img/image_2026042869acda6f97cb9bad62ac4d12e5be93aa.jpg",
    category: "Chất xơ",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Bông cải xanh luộc giòn ngọt, giữ nguyên dưỡng chất, tốt cho sức khỏe.",
    ingredients: ["300g bông cải xanh", "Nước", "Muối", "Đá lạnh", "Dầu hào (chấm kèm)"],
    instructions: ["Tách bông cải thành nhánh nhỏ, rửa sạch", "Đun nước sôi với chút muối", "Luộc bông cải 2-3 phút giữ giòn", "Vớt ra ngâm nước đá ngay", "Vớt ra đĩa, chấm dầu hào"]
  },
  "Salad trộn rau mầm": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428b188258820afab768205e0ad565bd9ae.jpg",
    category: "Chất xơ",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Salad rau mầm tươi mát giòn ngọt, giàu enzyme và vitamin tự nhiên.",
    ingredients: ["100g rau mầm tổng hợp", "Cà chua bi, dưa leo", "Cà rốt bào sợi", "Sốt mè rang", "Hạt vừng"],
    instructions: ["Rửa sạch rau mầm, để ráo", "Cắt cà chua bi đôi, dưa leo lát mỏng", "Bào sợi cà rốt", "Trộn tất cả với sốt mè rang", "Rắc hạt vừng lên trên"]
  },
  "Súp bí đỏ": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428c9da138b1a96ba4436aac9bd9f9bd829.jpg",
    category: "Chất xơ",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Súp bí đỏ mịn màng, ngọt tự nhiên, ấm bụng và giàu beta-carotene.",
    ingredients: ["400g bí đỏ", "1 củ hành tây", "Tỏi, bơ", "Nước dùng gà", "Kem tươi"],
    instructions: ["Gọt vỏ bí đỏ, cắt miếng nhỏ", "Phi hành tây và tỏi với bơ", "Cho bí vào xào, đổ nước dùng hầm mềm", "Xay nhuyễn bằng máy xay", "Múc ra bát, rưới kem tươi"]
  },
  "Gỏi ngó sen tôm thịt": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604282b201f41a6ebb5819d8eb314e90010aa.jpg",
    category: "Cân bằng",
    time: "30 phút",
    difficulty: "Trung bình",
    description: "Gỏi ngó sen giòn sần sật, tôm thịt tươi ngon, chua ngọt hài hòa.",
    ingredients: ["200g ngó sen", "100g tôm, 100g thịt ba chỉ", "Cà rốt, rau răm", "Đậu phộng rang", "Nước mắm, chanh, đường, ớt"],
    instructions: ["Luộc tôm và thịt, thái lát", "Ngâm ngó sen nước chanh, vớt ráo", "Bào sợi cà rốt, trộn đều", "Pha nước mắm chua ngọt", "Trộn tất cả, rắc đậu phộng và rau răm"]
  },
  // ===== NHÓM MÓN NGON ĐA DẠNG =====
  "Bò kho bánh mì": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428e402989ddc95316febbde668c885396b.jpg",
    category: "Cân bằng",
    time: "90 phút",
    difficulty: "Trung bình",
    description: "Bò kho sánh đặc thơm lừng sả ớt, chấm bánh mì giòn cực đã.",
    ingredients: ["300g bắp bò", "Cà rốt, khoai tây", "Sả, gừng, quế, hồi", "Bột cà ri, sa tế", "Bánh mì, rau thơm"],
    instructions: ["Cắt bò miếng vuông, ướp gia vị", "Phi sả gừng, xào bò săn", "Thêm nước, hầm lửa nhỏ 1 tiếng", "Cho cà rốt, khoai tây vào hầm mềm", "Ăn kèm bánh mì nóng giòn"]
  },
  "Cháo gà": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428a8426a6b328c5b0cea03828b8d42b1e2.jpg",
    category: "Cân bằng",
    time: "45 phút",
    difficulty: "Dễ",
    description: "Cháo gà nóng hổi ngọt lịm, thịt gà mềm thấm vị, ấm bụng ngày mưa.",
    ingredients: ["150g gạo", "200g thịt gà", "Gừng, hành tím", "Hành lá, rau mùi", "Nước mắm, tiêu"],
    instructions: ["Luộc gà với gừng, lấy nước luộc", "Nấu cháo bằng nước luộc gà đến nhừ", "Xé gà thành sợi nhỏ", "Múc cháo ra tô, xếp gà lên", "Rắc hành lá, rau mùi, tiêu"]
  },
  "Cháo trắng trứng muối": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604284089cf1e27a592c9235acc338bca57df.jpg",
    category: "Tinh bột",
    time: "30 phút",
    difficulty: "Dễ",
    description: "Cháo trắng thanh đạm ăn kèm trứng muối bùi béo, đơn giản mà ngon.",
    ingredients: ["100g gạo", "2 quả trứng muối", "Hành phi", "Nước mắm", "Hành lá"],
    instructions: ["Nấu cháo trắng nhừ mịn", "Luộc trứng muối, bổ đôi", "Múc cháo ra tô, đặt trứng muối lên", "Rắc hành phi và hành lá", "Nêm nước mắm tùy khẩu vị"]
  },
  "Bún thịt nướng": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428ca238cef29f7cee3996c0751acb6f626.jpg",
    category: "Cân bằng",
    time: "40 phút",
    difficulty: "Trung bình",
    description: "Bún thịt nướng thơm phức, rau sống giòn mát, nước mắm chua ngọt đậm đà.",
    ingredients: ["200g thịt heo", "200g bún tươi", "Rau sống, giá, dưa leo", "Đậu phộng rang", "Nước mắm, tỏi, ớt"],
    instructions: ["Ướp thịt với sả, tỏi, nước mắm, mật ong", "Nướng thịt trên bếp than hoặc lò", "Trụng bún, xếp ra tô với rau sống", "Thái thịt nướng, xếp lên bún", "Rưới nước mắm, rắc đậu phộng"]
  },
  "Cơm gạo lứt cá hồi": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428dfbfab33078cccac7f4ca6eb44ef5f88.jpg",
    category: "Cân bằng",
    time: "35 phút",
    difficulty: "Trung bình",
    description: "Cơm gạo lứt dẻo bùi kết hợp cá hồi áp chảo, bữa ăn healthy chuẩn mực.",
    ingredients: ["150g gạo lứt", "150g phi lê cá hồi", "Rau củ hấp", "Xì dầu, chanh", "Mè rang"],
    instructions: ["Nấu cơm gạo lứt", "Ướp cá hồi muối tiêu, áp chảo 3 phút mỗi mặt", "Hấp rau củ kèm", "Xếp cơm, cá hồi, rau ra đĩa", "Rưới xì dầu chanh, rắc mè"]
  },
  "Gà hấp lá chanh": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604284e0d76ca3a7920ddfd28d979865c7b08.jpg",
    category: "Đạm",
    time: "35 phút",
    difficulty: "Trung bình",
    description: "Gà hấp thơm ngát lá chanh, thịt ngọt dai, chấm muối tiêu chanh tuyệt vời.",
    ingredients: ["500g thịt gà", "Lá chanh, sả", "Gừng, hành", "Muối, tiêu, chanh", "Rau thơm"],
    instructions: ["Chặt gà miếng, ướp muối tiêu và gừng", "Xếp lá chanh và sả dưới đáy xửng", "Đặt gà lên, hấp 25 phút lửa vừa", "Pha muối tiêu chanh làm nước chấm", "Dọn gà kèm rau thơm và nước chấm"]
  },
  "Tôm hấp bia": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604281b581228c0e700cea9b921bda9eb945c.jpg",
    category: "Đạm",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Tôm hấp bia tươi ngọt, thấm vị bia nhẹ, đơn giản mà sang.",
    ingredients: ["500g tôm sú", "1 lon bia", "Sả, gừng", "Muối tiêu chanh", "Rau răm"],
    instructions: ["Rửa sạch tôm, cắt râu", "Xếp sả gừng dưới đáy nồi", "Đặt tôm lên, đổ bia vào", "Đậy nắp, hấp lửa lớn 8-10 phút", "Dọn ra, chấm muối tiêu chanh"]
  },
  "Mực xào cần tỏi": {
    image: "https://sf-static.upanhlaylink.com/img/image_2026042895f8ef71ebc6d779d0ff4a7342704fc2.jpg",
    category: "Đạm",
    time: "15 phút",
    difficulty: "Trung bình",
    description: "Mực xào giòn sần sật cùng cần tây thơm, tỏi phi vàng dậy mùi.",
    ingredients: ["300g mực ống", "200g cần tây", "Tỏi, ớt", "Dầu hào, xì dầu", "Tiêu, dầu mè"],
    instructions: ["Làm sạch mực, khứa hình mắt cáo", "Cắt cần tây khúc vừa ăn", "Phi tỏi thơm, cho mực vào xào lửa lớn nhanh", "Thêm cần tây, nêm dầu hào xì dầu", "Đảo đều, rưới dầu mè, tắt bếp"]
  },
  "Đậu que xào thịt bò": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604287572fd921411f9c57b9f73f2b911129d.jpg",
    category: "Cân bằng",
    time: "20 phút",
    difficulty: "Dễ",
    description: "Đậu que giòn xanh xào cùng thịt bò mềm ngọt, món nhà đơn giản đưa cơm.",
    ingredients: ["200g đậu que", "150g thịt bò", "Tỏi, hành", "Dầu hào, xì dầu", "Tiêu"],
    instructions: ["Cắt đậu que khúc ngắn, luộc sơ", "Thái bò lát mỏng, ướp xì dầu tiêu", "Phi tỏi, xào bò lửa lớn nhanh tay", "Cho đậu que vào đảo đều", "Nêm dầu hào, rắc tiêu"]
  },
  "Canh rau ngót thịt bằm": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428572c0c6138d80c5410b48bb2e10c9806.jpg",
    category: "Cân bằng",
    time: "15 phút",
    difficulty: "Dễ",
    description: "Canh rau ngót nấu thịt bằm ngọt thanh mát, bổ dưỡng cho cả nhà.",
    ingredients: ["200g rau ngót", "100g thịt heo bằm", "Hành, tỏi", "Nước mắm", "Tiêu"],
    instructions: ["Rửa rau ngót, vặt lá", "Vo viên thịt bằm nhỏ", "Đun nước sôi, thả viên thịt vào", "Cho rau ngót vào nấu chín tới", "Nêm nước mắm, rắc tiêu"]
  },
  "Phở gà": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428ee29e341c8940099e5e97ba0ff5a6e41.jpg",
    category: "Cân bằng",
    time: "60 phút",
    difficulty: "Trung bình",
    description: "Phở gà thanh ngọt, nước dùng trong veo thơm mùi gà ta và gia vị.",
    ingredients: ["200g bánh phở", "200g thịt gà", "Xương gà, gừng, hành", "Rau thơm, giá đỗ", "Nước mắm, tiêu"],
    instructions: ["Ninh xương gà với gừng nướng lấy nước dùng", "Luộc gà chín, xé sợi", "Trụng bánh phở, xếp ra tô", "Xếp gà xé lên, chan nước dùng nóng", "Thêm hành, rau thơm, giá đỗ"]
  },
  "Bánh mì trứng ốp la": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428704595b1d451b9de4da012170358623e.jpg",
    category: "Cân bằng",
    time: "10 phút",
    difficulty: "Dễ",
    description: "Bánh mì giòn rụm kẹp trứng ốp la, bữa sáng nhanh gọn đầy năng lượng.",
    ingredients: ["1 ổ bánh mì", "2 quả trứng", "Đồ chua, dưa leo", "Xì dầu, tiêu", "Bơ"],
    instructions: ["Nướng bánh mì giòn", "Chiên trứng ốp la với bơ", "Bổ bánh mì, xếp trứng vào", "Thêm đồ chua, dưa leo", "Rưới chút xì dầu, rắc tiêu"]
  },
  "Sinh tố chuối yến mạch": {
    image: "https://sf-static.upanhlaylink.com/img/image_202604280c4fe0f818d6d3ed87ea42060166a8be.jpg",
    category: "Tinh bột",
    time: "5 phút",
    difficulty: "Dễ",
    description: "Sinh tố chuối yến mạch béo mịn, no lâu, lý tưởng cho bữa sáng bận rộn.",
    ingredients: ["1 quả chuối chín", "30g yến mạch", "200ml sữa tươi", "Mật ong", "Đá viên"],
    instructions: ["Cho chuối, yến mạch, sữa vào máy xay", "Thêm mật ong và đá viên", "Xay nhuyễn 30 giây", "Rót ra ly", "Thưởng thức ngay khi còn lạnh"]
  },
  "Cá diêu hồng hấp gừng": {
    image: "https://sf-static.upanhlaylink.com/img/image_20260428561434fc8055717abd9382cca2adf424.jpg",
    category: "Đạm",
    time: "30 phút",
    difficulty: "Trung bình",
    description: "Cá diêu hồng hấp gừng thơm ngọt, giữ nguyên vị tươi, thanh đạm bổ dưỡng.",
    ingredients: ["1 con cá diêu hồng (500g)", "Gừng thái sợi", "Hành lá, rau mùi", "Nước mắm, đường", "Dầu ăn nóng"],
    instructions: ["Làm sạch cá, khứa vài đường", "Xếp gừng sợi lên cá", "Hấp cá 15-18 phút lửa lớn", "Rưới nước mắm đường, rắc hành", "Dội dầu nóng lên hành gừng cho thơm"]
  },
  "Thịt bò né trứng": {
    "image": "https://sf-static.upanhlaylink.com/img/image_202604280a4c1dfd31d4aceb81b4bc981435580c.jpg",
    "category": "Đạm",
    "time": "15 phút",
    "difficulty": "Dễ",
    "description": "Bò né nóng hổi, thịt bò mềm hòa quyện cùng trứng ốp la béo ngậy, ăn kèm bánh mì giòn.",
    "ingredients": ["200g thịt bò thăn", "1-2 quả trứng gà", "Pate, phô mai", "Hành tây, bơ", "Gia vị: dầu hào, nước tương, tỏi"],
    "instructions": ["Thái mỏng bò, ướp với dầu hào và tỏi", "Làm nóng chảo gang, cho bơ và hành tây vào phi thơm", "Cho bò vào né nhanh tay trên lửa lớn", "Đập thêm trứng và cho pate vào", "Tắt bếp khi trứng còn lòng đào và thưởng thức"]
  },
  "Bún cá Châu Đốc": {
    "image": "https://sf-static.upanhlaylink.com/img/image_202604285c5ad2583bb1e5d93c34760a846c0b14.jpg",
    "category": "Món nước",
    "time": "60 phút",
    "difficulty": "Khó",
    "description": "Đặc sản miền Tây với nước dùng đậm đà vị mắm linh, cá lóc vàng ươm màu nghệ.",
    "ingredients": ["1 con cá lóc", "Bún tươi", "Ngải bún, nghệ tươi, sả", "Mắm linh, mắm sặc", "Rau đắng, bông điên điển"],
    "instructions": ["Luộc cá với sả và nghệ, sau đó gỡ lấy thịt", "Xào thịt cá với bột nghệ cho săn và thơm", "Nấu nước dùng từ xương ống và nước luộc cá, dầm thêm mắm linh/sặc", "Nêm nếm gia vị và ngải bún giã nhuyễn", "Cho bún vào tô, xếp cá lên và chan nước dùng"]
  },
  "Mì ý sốt bò bằm": {
    "image": "https://sf-static.upanhlaylink.com/img/image_2026042859dba279112c889a916be94d9cc5a06a.jpg",
    "category": "Tinh bột",
    "time": "30 phút",
    "difficulty": "Trung bình",
    "description": "Món ăn kiểu Ý phổ biến với sợi mì dai mềm và sốt cà chua thịt bò đậm đà.",
    "ingredients": ["200g mì Spaghetti", "150g thịt bò xay", "2 quả cà chua", "Hành tây, tỏi, lá húng quế", "Tương cà, phô mai bột"],
    "instructions": ["Luộc mì với chút muối và dầu ăn khoảng 8-10 phút", "Phi thơm tỏi hành tây, cho thịt bò vào xào săn", "Cho cà chua băm và tương cà vào nấu thành sốt sệt", "Nêm muối, đường, hạt nêm vừa ăn", "Cho mì ra đĩa, rưới sốt và rắc phô mai lên trên"]
  },
  "Pizza hải sản (1 phần)": {
    "image": "https://sf-static.upanhlaylink.com/img/image_202604288997fa38e94cf9a4c33ded734c8adf49.jpg",
    "category": "Tinh bột",
    "time": "45 phút",
    "difficulty": "Trung bình",
    "description": "Bánh pizza giòn rụm với tôm, mực tươi ngon và lớp phô mai tan chảy.",
    "ingredients": ["Đế pizza làm sẵn", "Tôm, mực thái khoanh", "Ớt chuông, hành tây", "Phô mai Mozzarella bào", "Sốt cà chua"],
    "instructions": ["Sơ chế hải sản, xào sơ cho rút bớt nước", "Phết một lớp sốt cà chua lên đế bánh", "Xếp hải sản, hành tây và ớt chuông lên bề mặt", "Phủ kín bằng phô mai Mozzarella", "Nướng ở 200°C trong khoảng 10-15 phút đến khi vàng giòn"]
  },
  "Xà lách trộn dầu giấm": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428413f67e1e5a90bd164e3e8a050621920.jpg",
    "category": "Rau củ",
    "time": "10 phút",
    "difficulty": "Dễ",
    "description": "Món khai vị tươi mát, giúp cân bằng hương vị cho bữa ăn nhiều dầu mỡ.",
    "ingredients": ["Xà lách, cà chua, dưa leo", "Hành tây", "Giấm gạo, đường, muối", "Dầu olive, tiêu"],
    "instructions": ["Rửa sạch rau củ, cắt miếng vừa ăn", "Pha hỗn hợp: giấm, đường, muối, dầu olive và tiêu", "Cho rau vào tô lớn, rưới hỗn hợp nước sốt lên", "Trộn nhẹ tay để rau không bị nát", "Để khoảng 5 phút cho thấm rồi trình bày ra đĩa"]
  },
  "Cơm âm phủ Huế": {
    "image": "https://sf-static.upanhlaylink.com/img/image_202604286ac5cbcd1eba7d36a714e81ed84ecf09.jpg",
    "category": "Tinh bột",
    "time": "45 phút",
    "difficulty": "Trung bình",
    "description": "Món cơm cung đình Huế rực rỡ sắc màu với nhiều nguyên liệu được thái chỉ tinh tế.",
    "ingredients": ["Cơm trắng", "Thịt xá xíu, chả lụa", "Trứng chiên, tôm cháy", "Dưa leo, rau thơm", "Nước mắm chua ngọt"],
    "instructions": ["Nấu cơm dẻo và để nguội bớt", "Thái chỉ các nguyên liệu: xá xíu, chả lụa, trứng chiên, dưa leo", "Xếp cơm vào giữa đĩa lớn", "Bày các nguyên liệu xung quanh tạo thành vòng tròn màu sắc", "Khi ăn trộn đều với nước mắm chua ngọt"]
  },
  "Miến gà xé": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428e512a6ee4942f829b1c5cddd0003f473.jpg",
    "category": "Món nước",
    "time": "30 phút",
    "difficulty": "Dễ",
    "description": "Miến dong dai giòn cùng thịt gà ngọt thanh, nước dùng trong vắt thơm mùi hành lá.",
    "ingredients": ["Ức gà hoặc đùi gà", "Miến dong", "Nấm mèo, nấm hương", "Hành phi, rau răm", "Gia vị: hạt nêm, tiêu"],
    "instructions": ["Luộc gà chín, vớt ra để nguội rồi xé sợi", "Ngâm miến và nấm cho nở, nấm thái chỉ", "Nấu nước dùng từ nước luộc gà, cho nấm vào đun sôi", "Trần miến qua nước sôi rồi cho vào tô", "Xếp gà lên trên, chan nước dùng, rắc hành phi và rau răm"]
  },
  "Bánh đa cua Hải Phòng": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428c55ed7b28819ab09dbefc87c76d37178.jpg",
    "category": "Món nước",
    "time": "50 phút",
    "difficulty": "Trung bình",
    "description": "Đặc sản đất Cảng với sợi bánh đa đỏ đặc trưng và riêu cua đồng béo ngậy.",
    "ingredients": ["Bánh đa đỏ", "Cua đồng xay", "Chả lá lốt, tôm", "Rau muống hoặc rau nhút", "Gạch cua, hành khô"],
    "instructions": ["Lọc nước cua, đun lửa nhỏ để lấy riêu", "Phi hành thơm, xào gạch cua cho màu đẹp rồi đổ vào nồi nước", "Chần bánh đa đỏ và rau muống cho vào tô", "Thêm chả lá lốt, tôm và riêu cua lên trên", "Chan nước dùng nóng hổi và thưởng thức với quẩy"]
  },
  "Cơm gà luộc rau củ": {
    "image": "https://sf-static.upanhlaylink.com/img/image_202604285dc210d8c06655f801b273e3537e9608.jpg",
    "category": "Tinh bột",
    "time": "40 phút",
    "difficulty": "Dễ",
    "description": "Bữa cơm lành mạnh với cơm nấu nước dùng gà và các loại rau củ luộc thanh đạm.",
    "ingredients": ["1/2 con gà ta", "Gạo tẻ", "Cà rốt, bông cải xanh, đậu que", "Gừng, nghệ", "Nước tương hoặc muối tiêu chanh"],
    "instructions": ["Luộc gà với gừng và nghệ để da vàng đẹp", "Dùng nước luộc gà để nấu cơm cho thơm và béo", "Rau củ cắt miếng vừa ăn, luộc chín tới", "Gà luộc chặt miếng hoặc xé nhỏ", "Bày cơm, gà và rau củ ra đĩa, ăn kèm nước chấm"]
  },
  "Đậu hũ non hấp nấm": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428ce635f80427b6d5e642c29d91dce05d7.jpg",
    "category": "Chay",
    "time": "20 phút",
    "difficulty": "Dễ",
    "description": "Món chay thanh tịnh với đậu hũ mềm mịn và nấm hương thơm lừng.",
    "ingredients": ["1 hộp đậu hũ non", "Nấm đông cô, nấm kim châm", "Hành lá, ớt", "Dầu hào chay, nước tương, đường"],
    "instructions": ["Cắt đậu hũ thành khoanh tròn hoặc miếng vuông", "Nấm rửa sạch, thái nhỏ", "Xếp nấm lên trên đậu hũ, rưới hỗn hợp dầu hào và nước tương", "Hấp cách thủy trong khoảng 10-12 phút", "Rắc hành lá lên trên và dùng nóng"]
  },
  "Cá basa kho tiêu": {
    "image": "https://sf-static.upanhlaylink.com/img/image_202604283990ef985b0c44311654c9369cb9af12.jpg",
    "category": "Đạm",
    "time": "25 phút",
    "difficulty": "Dễ",
    "description": "Cá basa béo ngậy, kho keo với nước màu dừa và nhiều tiêu đen cay nồng.",
    "ingredients": ["300g cá basa (cắt khoanh)", "Tiêu đen hạt, tiêu bột", "Nước mắm, nước màu dừa", "Hành lá, ớt", "Đường, tỏi băm"],
    "instructions": ["Ướp cá với nước mắm, đường, nước màu và tiêu trong 15 phút", "Phi tỏi thơm, cho cá vào trở đều hai mặt cho săn", "Thêm chút nước lọc, kho lửa nhỏ đến khi nước sệt lại", "Cho thêm nhiều tiêu bột và ớt trái", "Tắt bếp, rắc hành lá"]
  },
  "Gà xào nấm đông cô": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428eb87f48c256087473c828f5bb4442bd0.jpg",
    "category": "Đạm",
    "time": "25 phút",
    "difficulty": "Dễ",
    "description": "Thịt gà dai ngọt xào cùng nấm đông cô thơm phức, rất bắt cơm.",
    "ingredients": ["250g thịt đùi gà", "10 tai nấm đông cô khô", "Gừng, tỏi băm", "Dầu hào, hạt nêm, tiêu"],
    "instructions": ["Gà thái miếng vừa ăn, nấm đông cô ngâm nở thái đôi", "Ướp gà với dầu hào và gia vị", "Phi thơm gừng và tỏi, cho gà vào xào săn", "Cho nấm vào xào chung, thêm chút nước nếu bị khô", "Xào đến khi nấm chín và thấm gia vị thì tắt bếp"]
  },
  "Bún gạo lứt trộn thịt bò": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428ff6cea201e6cf56b2d8ee0bb19703619.jpg",
    "category": "Healthy",
    "time": "20 phút",
    "difficulty": "Dễ",
    "description": "Lựa chọn tuyệt vời cho chế độ ăn Eat Clean với bún gạo lứt giàu chất xơ.",
    "ingredients": ["Bún gạo lứt khô", "150g thịt bò", "Rau mầm, xà lách, cà rốt", "Đậu phộng rang", "Nước tương tỏi ớt"],
    "instructions": ["Luộc bún gạo lứt khoảng 5-7 phút rồi xả nước lạnh", "Thịt bò thái mỏng, xào nhanh với tỏi", "Cà rốt bào sợi, rau rửa sạch", "Cho bún vào tô, xếp bò và rau củ lên", "Rưới nước tương, rắc đậu phộng và trộn đều"]
  },
  "Trứng cuộn rau củ": {
    "image": "https://sf-static.upanhlaylink.com/img/image_20260428288fd272e37c0d2ceafe71d645b78806.jpg",
    "category": "Đạm",
    "time": "15 phút",
    "difficulty": "Dễ",
    "description": "Món ăn đẹp mắt, dễ làm, bổ sung vitamin từ rau củ cho trẻ nhỏ và gia đình.",
    "ingredients": ["3 quả trứng gà", "Cà rốt, hành tây, hành lá băm nhỏ", "Muối, tiêu", "Dầu ăn"],
    "instructions": ["Đánh tan trứng với rau củ băm và gia vị", "Làm nóng chảo với một chút dầu", "Đổ một lớp trứng mỏng, khi trứng hơi đông thì cuộn lại", "Đẩy cuộn trứng sang một bên, đổ tiếp lớp trứng mới nối vào", "Lặp lại đến khi hết trứng, lấy ra cắt miếng vừa ăn"]
  },
  "Soup lơ xào tỏi": {
    "image": "https://sf-static.upanhlaylink.com/img/image_2026042809fb54a94e86c05c009256ead571c895.jpg",
    "category": "Rau củ",
    "time": "15 phút",
    "difficulty": "Dễ",
    "description": "Súp lơ giòn ngọt, thơm lừng mùi tỏi phi, giữ trọn dưỡng chất.",
    "ingredients": ["1 cây súp lơ xanh/trắng", "Tỏi băm nhiều", "Dầu ăn, hạt nêm, dầu hào"],
    "instructions": ["Súp lơ cắt miếng, ngâm muối rồi rửa sạch", "Chần sơ súp lơ qua nước sôi để khi xào nhanh chín và giữ màu", "Phi thơm tỏi băm, cho súp lơ vào xào lửa lớn", "Nêm dầu hào và hạt nêm cho vừa miệng", "Tắt bếp khi súp lơ vừa chín tới để giữ độ giòn"]
  },
  "Sườn non hầm rau củ": {
    "image": "https://sf-static.upanhlaylink.com/img/image_2026042848ee342e12c09dd64f253883072b3428.jpg",
    "category": "Đạm",
    "time": "45 phút",
    "difficulty": "Trung bình",
    "description": "Canh sườn ngọt thanh, rau củ chín mềm, bổ dưỡng cho cả nhà.",
    "ingredients": ["300g sườn non", "Khoai tây, cà rốt, su su", "Hành ngò", "Gia vị: muối, đường, hạt nêm"],
    "instructions": ["Sườn chặt miếng, chần qua nước sôi để khử mùi", "Hầm sườn với nước lọc khoảng 20 phút cho hơi mềm", "Cho khoai tây, cà rốt, su su vào hầm chung", "Khi rau củ chín mềm, nêm lại gia vị cho vừa ăn", "Múc ra tô, rắc thêm hành ngò và tiêu"]
  }
};

// Canonical recipe source for other scripts (favorites, etc.)
if (typeof window !== "undefined") {
    window.RECIPES_DB = recipesDB;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = recipesDB;
}
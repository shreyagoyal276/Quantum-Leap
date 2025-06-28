// // trendingNotifier.js
// const Notification = require('./models/notification.model.js');

// const trendingFoods = [
//   "Harry Potter Kinder Joy",
//   "Peri Peri Maggi",
//   "Lays Sizzlin' Hot Chips",
//   "Bournvita Fills Cereal",
//   "Biscoff Spread",
//   "Amul Kool Café Mocha",
//   "Frozen Momos",
//   "Nutella B-Ready Bars",
//   "Cheese Garlic Bread Mix",
//   "Frooti Mini Packs",
//   "Yogabar Breakfast Bars",
//   "Oreo Waffle Rolls",
//   "Korean Ramen Pack",
//   "Nacho Cheese Doritos",
//   "Paper Boat Aam Panna",
//   "Mini Samosa Party Pack",
//   "Bubble Tea DIY Kit",
//   "Belgian Choco Pancakes",
//   "Haldiram's Chaat Kit",
//   "Cold Coffee Premix Sachets"
// ];


// async function fetchTrendingFoodMock() {
//   try {
//     const today = new Date().toISOString().split("T")[0];

//     // Check if a trending notification already exists today
//     const alreadyNotified = await Notification.findOne({
//       type: 'trending',
//       date: { $gte: new Date(today) }
//     });

//     if (alreadyNotified) {
//       console.log("Trending food notification already sent today.");
//       return;
//     }

//     const randomIndex = Math.floor(Math.random() * trendingFoods.length);
//     const trendingItem = trendingFoods[randomIndex];

//     const message = `Trending Food: ${trendingItem} is trending today!`;

//     await Notification.create({
//       type: 'trending',
//       message,
//       date: new Date()
//     });

//     console.log("Trending food notification created:", message);
//   } catch (err) {
//     console.error("Trending food notifier error:", err.message);
//   }
// }

// module.exports = fetchTrendingFoodMock;

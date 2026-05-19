// =============================================
// data.js — MessMate AI
//
// This is your "database" of messes.
// In a real app, this would come from a server.
// For now, we keep it as a JS array of objects.
// =============================================

const DEFAULT_MESSES = [
  {
    id: 1,
    name: "Saravana Mess",
    area: "Anna Nagar West",
    distance: "0.3 km",
    price: 65,
    rating: 4.5,
    type: "veg",
    isOpen: true,
    crowd: "busy",
    phone: "919840011234",
    menu: [
      { item: "Rice + Sambar",  available: "yes" },
      { item: "Chapati (2)",    available: "yes" },
      { item: "Rasam Rice",     available: "low" },
      { item: "Curd Rice",      available: "low" },
      { item: "Pongal",         available: "no"  },
    ],
    reviews: [
      { rating: 5, text: "Always fast and hot food!" },
      { rating: 4, text: "Good but slightly crowded." }
    ]
  },
  {
    id: 2,
    name: "Sri Murugan Bhavan",
    area: "Anna Nagar East",
    distance: "0.7 km",
    price: 80,
    rating: 4.2,
    type: "both",
    isOpen: true,
    crowd: "quiet",
    phone: "919840155678",
    menu: [
      { item: "Meals (full)",   available: "yes" },
      { item: "Parotta + Kurma",available: "yes" },
      { item: "Egg Curry Rice", available: "yes" },
      { item: "Dosa (2)",       available: "low" },
    ],
    reviews: [
      { rating: 4, text: "Excellent non-veg options." }
    ]
  },
  {
    id: 3,
    name: "Vasantha Bhavan",
    area: "Anna Nagar",
    distance: "1.1 km",
    price: 55,
    rating: 4.0,
    type: "veg",
    isOpen: true,
    crowd: "quiet",
    phone: "919876543210",
    menu: [
      { item: "Mini Meals",     available: "yes" },
      { item: "Idli Sambar",    available: "yes" },
      { item: "Vada (2)",       available: "low" },
      { item: "Poori (2)",      available: "no"  },
    ],
    reviews: [
      { rating: 4, text: "Very cheap and good quality." },
      { rating: 4, text: "Peaceful environment." }
    ]
  },
  {
    id: 4,
    name: "Anna Mess",
    area: "2nd Avenue",
    distance: "1.4 km",
    price: 70,
    rating: 3.8,
    type: "both",
    isOpen: false,
    crowd: "quiet",
    phone: "919000012345",
    menu: [
      { item: "Rice Meals",     available: "no" },
      { item: "Parotta Set",    available: "no" },
    ],
    reviews: [
      { rating: 3, text: "Okay food, sometimes closed." },
      { rating: 4, text: "Good when it's open." }
    ]
  },
  {
    id: 5,
    name: "Sri Krishna Sweets & Canteen",
    area: "Anna Nagar West",
    distance: "0.5 km",
    price: 50,
    rating: 4.7,
    type: "veg",
    isOpen: true,
    crowd: "busy",
    phone: "919444455555",
    menu: [
      { item: "Ghee Roast Dosa", available: "yes" },
      { item: "Filter Coffee",   available: "yes" },
      { item: "Sambar Vadai",    available: "yes" },
    ],
    reviews: [
      { rating: 5, text: "The filter coffee is world-class!" }
    ]
  },
  {
    id: 6,
    name: "Karaikudi Chettinad Mess",
    area: "Anna Nagar East",
    distance: "0.9 km",
    price: 95,
    rating: 4.6,
    type: "both",
    isOpen: true,
    crowd: "busy",
    phone: "919888877777",
    menu: [
      { item: "Chicken Biryani", available: "yes" },
      { item: "Chettinad Meals", available: "yes" },
      { item: "Mutton Chukka",   available: "low" },
    ],
    reviews: [
      { rating: 5, text: "Authentic spicy Chettinad flavors." }
    ]
  },
  {
    id: 7,
    name: "A2B Adyar Ananda Bhavan",
    area: "1st Avenue",
    distance: "1.2 km",
    price: 110,
    rating: 4.3,
    type: "veg",
    isOpen: true,
    crowd: "quiet",
    phone: "919777766666",
    menu: [
      { item: "Special Veg Meals", available: "yes" },
      { item: "Rava Onion Dosa",   available: "yes" },
      { item: "Kailash Parbat Chaat", available: "low" },
    ],
    reviews: [
      { rating: 4, text: "Slightly premium price, but pure hygienic veg." }
    ]
  },
  {
    id: 8,
    name: "Midnight Biryani Hub",
    area: "Anna Nagar East",
    distance: "2.1 km",
    price: 120,
    rating: 4.1,
    type: "both",
    isOpen: true,
    crowd: "busy",
    phone: "919666655555",
    menu: [
      { item: "Kuska Rice Combo", available: "yes" },
      { item: "Tandoori Chicken", available: "yes" },
      { item: "Midnight Spl Briyani", available: "yes" },
    ],
    reviews: [
      { rating: 4, text: "Saved my hunger at 1 AM multiple times." }
    ]
  },
  {
    id: 9,
    name: "Namma Chennai Canteen",
    area: "3rd Avenue",
    distance: "0.8 km",
    price: 45,
    rating: 4.4,
    type: "veg",
    isOpen: true,
    crowd: "quiet",
    phone: "919555544444",
    menu: [
      { item: "Sambar Rice",   available: "yes" },
      { item: "Lemon Rice",    available: "yes" },
      { item: "Curd Rice Set", available: "yes" },
    ],
    reviews: [
      { rating: 5, text: "Extremely pocket friendly! Perfect for students." }
    ]
  },
  {
    id: 10,
    name: "Sardarji Punjabi Dhaba",
    area: "Anna Nagar East",
    distance: "1.6 km",
    price: 85,
    rating: 4.0,
    type: "both",
    isOpen: true,
    crowd: "quiet",
    phone: "919222233333",
    menu: [
      { item: "Butter Naan Set", available: "yes" },
      { item: "Paneer Butter Masala", available: "yes" },
      { item: "Lassi (Glass)",   available: "low" },
    ],
    reviews: [
      { rating: 4, text: "Excellent North Indian food, highly recommend Naan." }
    ]
  }
];

// Offline caching logic with upgrade support
let MESSES = [];
try {
  const cached = localStorage.getItem('messMateData');
  if (cached && JSON.parse(cached).length >= 10) {
    MESSES = JSON.parse(cached);
  } else {
    MESSES = [...DEFAULT_MESSES];
    localStorage.setItem('messMateData', JSON.stringify(MESSES));
  }
} catch (e) {
  MESSES = [...DEFAULT_MESSES];
}

// Global initialization function to fetch from Supabase if configured
async function initMesses() {
  if (typeof fetchMessesFromDB === 'function') {
    const liveData = await fetchMessesFromDB();
    if (liveData && liveData.length > 0) {
      // Merge live fetched canteens with our premium defaults to avoid low mess density!
      const merged = [...liveData];
      DEFAULT_MESSES.forEach(defMess => {
        if (!merged.some(m => m.name.toLowerCase() === defMess.name.toLowerCase())) {
          merged.push(defMess);
        }
      });
      MESSES = merged;
      saveMessesToCache();
      console.log("Synced messes with Supabase and supplemented with defaults!");
    }
  }
}

// Function to save messes back to cache and Supabase
async function saveMessesToCache() {
  localStorage.setItem('messMateData', JSON.stringify(MESSES));
}

async function saveMessToDB(messId) {
  const mess = getMessById(messId);
  if (mess && typeof updateMessInDB === 'function') {
    await updateMessInDB(messId, {
      rating: mess.rating,
      reviews: mess.reviews,
      menu: mess.menu,
      crowd: mess.crowd,
      isOpen: mess.isOpen,
      price: mess.price
    });
  }
}

function getMessById(id) {
  return MESSES.find(mess => mess.id === id);
}

function filterMesses(filter, messes = MESSES) {
  if (filter === 'all')   return messes;
  if (filter === 'veg')   return messes.filter(m => m.type === 'veg');
  if (filter === 'cheap') return messes.filter(m => m.price < 80);
  if (filter === 'nearby') return messes.filter(m => m.distanceKm <= 1.0);
  if (filter === 'open')  return messes.filter(m => m.isOpen);
  if (filter === 'quiet') return messes.filter(m => m.crowd === 'quiet');
  return messes;
}

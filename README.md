# 🌱 Pflanzkalender PWA

A Progressive Web App (PWA) for managing planting calendars with monthly overview for garden and plant activities.

![License](https://img.shields.io/badge/license-MIT-green)
![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-black)

## Live

- **Web App:** [https://s540d.github.io/Pflanzkalender/](https://s540d.github.io/Pflanzkalender/)

Also available on Google Play Store.

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| React Native + Expo | Cross-platform framework |
| React Native Web | Web support |
| React Navigation (Stack Navigator) | Navigation |
| React Context / Hooks | State management |
| AsyncStorage | Local data storage |
| GitHub Pages | Web deployment |

## 📋 Setup

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (optional, installed automatically)

### Local Development

```bash
# Clone repository
git clone https://github.com/s540d/Pflanzkalender.git
cd Pflanzkalender

# Install dependencies
npm install

# Start web version
npm run web

# iOS (macOS only)
npm run ios

# Android
npm run android
```

The app opens automatically in the browser at `http://localhost:8081`.

## 📦 PWA Deployment (GitHub Pages)

```bash
# Deploy to GitHub Pages (builds automatically)
npm run deploy
```

## 🎯 Features

- 📅 **Planting calendar** with half-month resolution (24 half-months)
- 📱 **Responsive design** - automatic adaptation on small displays (3 months with navigation)
- 📌 **Fixed plant name column** - stays visible during horizontal scrolling
- 🌿 **32 predefined plants** in three categories (crops, flowers, trees)
- 🌱 **Plant management** - dedicated screen for adding and deleting plants
- 🗂️ **Category filter** – filter calendar and agenda by crops / flowers / trees
- 📍 **Location recommendations** – sun, partial shade, shade per plant
- 🌍 **Multilingual** - German/English switching
- 🎨 **Color-coded activities** with consistent color scheme
- 💬 **Tooltips** - hover over activities shows details (Web)
- 📊 **Agenda view** with horizontal scrolling and compact columns
- 🎯 **Compact layout** - activities in the same row when no overlap
- 📍 **Current period highlighted** - gray background for current half-month
- 🖱️ **Interactive activities** - click to edit and delete
- 💾 **Local data storage** without login
- 🌓 **Dark/Light Mode** with system theme option
- 📴 **Offline-capable** - PWA with service worker

## 📱 PWA Installation

The app can be installed as a PWA:

1. Open the app in a browser (Chrome, Safari, Firefox)
2. Click "Add to Home Screen"
3. The app appears as a standalone app on your device

## 📖 Usage

### Calendar view (📅)
- **Desktop:** Shows all 24 half-months at a glance
- **Mobile:** Shows 3 months (6 half-months) with ← → navigation
- **Sticky header:** Table header stays visible while scrolling
- **Click activities:** Opens edit dialog
- **Click empty cells:** Add new activity for that month

### Agenda view (📋)
Three-column overview with horizontal scrolling:
- **Left:** Activities from the previous period
- **Middle:** Current activities (current half-month)
- **Right:** Upcoming activities (next period)

### Plant management (🌱)
Central screen for managing all plants:
- **Add new plant:** Large button at the top
- **Plant list:** Overview with name, notes, and activity count
- **Delete:** Each plant can be deleted individually

### Settings (⋮)
- **Theme:** Switch between light/dark/system
- **Language:** German ⇄ English
- **Export data:** As JSON file
- **Support:** Ko-fi link
- **Feedback:** Email to devsven@posteo.de

## 🌿 Predefined Plants

The app includes 32 researched plants with typical activities in three categories:

**Crops (21):** Tomatoes, cucumbers, peppers, zucchini, lettuce, carrots, radishes, potatoes, onions, garlic, spinach, pumpkin, strawberries, raspberries, basil, parsley, chives

**Flowers (10):** Roses, lavender, tulips, sunflowers, dahlias, geraniums, hydrangeas, peonies, chrysanthemums, marigolds

**Trees (5):** Apple tree, pear tree, cherry tree, plum, hazelnut

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. Commercial use is excluded.

## 💖 Support

If you like this app, you can support me:

☕ [Ko-fi](https://ko-fi.com/devsven)

## 🐛 Bug Reports

Please report bugs as [GitHub Issues](https://github.com/s540d/Pflanzkalender/issues).

## 👨‍💻 Author

**Sven Strohkark**

- GitHub: [@s540d](https://github.com/s540d)
- Email: devsven@posteo.de
- Ko-fi: [ko-fi.com/devsven](https://ko-fi.com/devsven)

---

🌱 **Made with ❤️ for gardeners and plant lovers**

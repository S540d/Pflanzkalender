# Pflanzkalender

A planting calendar Progressive Web App — monthly overview for garden and plant activities with 32 predefined plants.

## Live

- Web: [https://s540d.github.io/Pflanzkalender/](https://s540d.github.io/Pflanzkalender/)
- Android: [Google Play](https://play.google.com/store/apps/details?id=io.github.s540d.pflanzkalender&referrer=utm_source%3Dgithub_readme%26utm_medium%3Dreferral%26utm_campaign%3Dweb_presence) (Trusted Web Activity)

## Tech Stack

| Technology            | Role                              |
| --------------------- | --------------------------------- |
| React Native + Expo   | Cross-platform framework (SDK 56) |
| expo-router           | File-based routing, bottom tabs   |
| React Native Web      | Web support                       |
| React Context / Hooks | State management                  |
| AsyncStorage          | Local data storage                |
| GitHub Pages          | Web deployment                    |
| Bubblewrap / TWA      | Android Play Store packaging      |

## Features

- **Planting calendar** — half-month resolution (24 half-months per year)
- **Agenda preview** — 7-column overview (previous, current period plus 5 upcoming half-months)
- **32 predefined plants** — crops, flowers, and trees with typical activities
- **Plant management** — add, edit, and delete custom plants, with search
- **Category filter** — filter by crops / flowers / trees
- **Climate recommendations** — location-aware tips for hot and dry spots
- **Location recommendations** — sun, partial shade, shade per plant
- **Drag & Drop** — reorder activities in the calendar (mouse and touch)
- **Interactive activities** — click to edit or delete, shift periods earlier/later
- **Current period highlighted** — visually marked in calendar and agenda
- **Templates** — community starter templates, export/import planting plans as a file, share via QR code
- **Tooltips** — hover over activities shows details (Web)
- **Dark/Light mode** with system theme option
- **Offline-capable** — PWA with service worker
- **Local data storage** — no login required, no personal data collected
- **8 languages** — German, English, Spanish, French, Italian, Dutch, Polish, Portuguese

## Predefined Plants

**Crops (21):** Tomatoes, cucumbers, peppers, zucchini, lettuce, carrots, radishes, potatoes, onions, garlic, spinach, pumpkin, strawberries, raspberries, basil, parsley, chives

**Flowers (10):** Roses, lavender, tulips, sunflowers, dahlias, geraniums, hydrangeas, peonies, chrysanthemums, marigolds

**Trees (5):** Apple tree, pear tree, cherry tree, plum, hazelnut

## License

MIT License — see [LICENSE](LICENSE).

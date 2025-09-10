# Image Gallery App

A **React Native** image gallery app built with **Expo** and **TypeScript**.  
Features include infinite scrolling, pull-to-refresh, image zooming, favorites, theming, and offline caching.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

_Add screenshots or a GIF demo of the app here._

---

## Features

### Home Gallery

- Infinite scrolling and pagination
- Pull-to-refresh functionality
- Sorting by date, name, size, or popularity
- Error handling and retry option

### Image Modal

- Pinch-to-zoom
- Double-tap to zoom
- Swipe to navigate images
- Share and save images
- Favorite/unfavorite images

### Favorites

- Add/remove favorites
- Persistent storage with AsyncStorage
- Modal preview of favorite images

### Settings

- Light/Dark theme toggle
- Theme persistence across app restarts

### Optimizations

- Skeleton loading placeholders
- Batched state updates
- Windowed FlatList for smooth scrolling

---

## Tech Stack

- **React Native** (Expo Managed Workflow)
- **TypeScript**
- **React Navigation** (Stack & Bottom Tabs)
- **Reanimated & Gesture Handler** for smooth gestures and animations
- **AsyncStorage** for persistent favorites and theme storage
- **Expo Image** for efficient image rendering

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/image-gallery-app.git
cd image-gallery-app
```

---

## Install dependencies:

npm install

# or

yarn install

## Run the app:

npx expo start

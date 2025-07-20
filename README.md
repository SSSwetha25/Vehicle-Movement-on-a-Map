# 🚌 Real-Time Bus Tracker Simulation

A responsive and animated bus tracking simulation built with React, Leaflet, and custom dummy GPS data. The app visually tracks a vehicle along a path on the map, leaving behind a real-time trace.

## 🔗 Live Demo

[Click here to view the deployed project](https://vehicle-movement-on-a-map-8vb9.vercel.app/)

> ✅ Smooth marker animations  
> ✅ Hoverable bus marker popup with details  
> ✅ Real-time green trace path  
> ✅ Clean, responsive UI with Poppins font

---

## ✨ Features

- 🗺️ **Live Map View** with OpenStreetMap tiles
- 🚍 **Custom Bus Marker** that moves based on JSON coordinates
- 🧭 **Dynamic Trace Line** shows previously visited locations
- 🪄 **Smooth Animation** between coordinates
- 🪟 **Popup Details** on hover with:
  - Timestamp
  - Location
  - Speed, Distance
  - Battery Status
- 🎮 **Play/Pause Controls** for simulation

---

## 🧰 Tech Stack & Dependencies

| Purpose            | Package Name                        |
| ------------------ | ----------------------------------- |
| Frontend Framework | `React`, `Vite`                     |
| Maps & Routing     | `react-leaflet`, `leaflet`          |
| Animations         | Custom JS (`requestAnimationFrame`) |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/SSSwetha25/Vehicle-Movement-on-a-Map.git
cd bus-tracker-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3.Run Locally

```bash
npm run dev
```

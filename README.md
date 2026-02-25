<div align="center">

# Temples Worldwide

An interactive 3D globe visualization showing temples of
The Church of Jesus Christ of Latter-day Saints around the world.

[**View Live Demo**](https://templesworldwide.netlify.app/)

</div>

## Overview

Explore temple locations globally using an immersive Mapbox GL JS 3D globe view. Rotate, zoom, and interact with the globe to discover temples across different regions.

## Features

- 🌍 Interactive 3D globe with continuous rotation
- 🏛️ Temple locations marked on the globe (coming soon)
- 📍 Click on markers for temple details (coming soon)
- 🔍 Zoom and pan to explore regions
- 📱 Responsive on desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Mapbox account and access token

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd temples-worldwide
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Mapbox access token:
   - Copy `.env.example` to `.env`
   - Add your Mapbox token
   - Get a free token at [mapbox.com](https://www.mapbox.com/)

4. Start the dev server:
```bash
npm run dev
```

5. Open `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

### Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Mapbox GL JS** - Interactive map library
- **ESLint** - Code linting

## Planned Features

- [ ] Add temple location data with coordinates
- [ ] Implement temple markers on the globe
- [ ] Create temple info popups (name, date, address, photo, status)
- [ ] Add search functionality
- [ ] Implement filtering by region or status
- [ ] Add temple statistics dashboard
- [ ] Include historical timeline of temple dedications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational and non-commercial use.

## Acknowledgments

- Temple data sourced from publicly available information
- Built with [Mapbox GL JS](https://www.mapbox.com/)
- Inspired by the global reach of The Church of Jesus Christ of Latter-day Saints

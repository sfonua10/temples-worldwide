# Temples Worldwide

An interactive 3D globe visualization showing temples of The Church of Jesus Christ of Latter-day Saints around the world.

## Overview

This project provides an immersive way to explore temple locations globally using Mapbox GL JS with a 3D globe view. Users can interact with the globe to discover temples in different regions and learn more about each location.

## Features

- 🌍 Interactive 3D globe with continuous rotation
- 🏛️ Temple locations marked on the globe (coming soon)
- 📍 Click on temple markers to view detailed information (coming soon)
- 🔍 Zoom and pan to explore specific regions
- 📱 Responsive design for desktop and mobile devices

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
   - Replace `your_mapbox_access_token_here` with your actual Mapbox token
   - You can get a free token at [https://www.mapbox.com/](https://www.mapbox.com/)

4. Run the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

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
- [ ] Create popup components with temple information:
  - Temple name
  - Dedication date
  - Address
  - Photo
  - Operating status
- [ ] Add search functionality to find specific temples
- [ ] Implement filtering by region or status
- [ ] Add temple statistics dashboard
- [ ] Include historical timeline of temple dedications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational and non-commercial use.

## Acknowledgments

- Temple data sourced from publicly available information
- Built with Mapbox GL JS
- Inspired by the global reach of The Church of Jesus Christ of Latter-day Saints# temples-worldwide

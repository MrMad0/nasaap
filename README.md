# NASA Space Apps Challenge - Image Explorer

A React-based image viewer built with OpenSeadragon for exploring high-resolution NASA imagery with annotations and AI analysis capabilities.

## Day 1: Core Foundation ✅

### Features Implemented
- **React + Vite** project setup for fast development
- **OpenSeadragon** integration for smooth pan/zoom of tiled images
- **Responsive layout** with sidebar and large viewer area
- **Demo image** (highsmith.dzi) for testing viewer functionality

### Project Structure
```
src/
├── App.jsx          # Main component with OpenSeadragon viewer
├── App.css          # Layout and styling
├── index.css        # Global styles
└── main.jsx         # React entry point
```

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Test the viewer:**
   - Open browser to `http://localhost:5173`
   - Pan by dragging the image
   - Zoom with mouse wheel or double-click
   - Use navigation controls in the viewer

### Next Steps (Future Days)
- [ ] Integrate NASA imagery APIs
- [ ] Add annotation tools
- [ ] Implement AI analysis features
- [ ] Add search and filtering
- [ ] Enhanced UI/UX

### Branch Strategy
- `main` - Stable releases
- `feature/nasa-api` - NASA imagery integration
- `feature/annotations` - Annotation tools
- `feature/ai-analysis` - AI features
- `hotfix/*` - Bug fixes
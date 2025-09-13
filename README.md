# NASA Space Apps Challenge - Image Explorer

A React-based image viewer built with OpenSeadragon for exploring high-resolution NASA imagery with annotations and AI analysis capabilities.

## Day 1: Core Foundation ✅

### Features Implemented
- **React + Vite** project setup for fast development
- **OpenSeadragon** integration for smooth pan/zoom of tiled images
- **Responsive layout** with sidebar and large viewer area
- **Demo image** (highsmith.dzi) for testing viewer functionality

## Day 2: Data & Annotation ✅

### Backend (Django)
- **Django REST Framework** API for annotation management
- **Annotation model** with shape types (rectangle, circle, polygon, point)
- **CORS configuration** for React frontend integration
- **SQLite database** with migrations
- **REST endpoints**: GET, POST, PUT, DELETE for annotations

### Frontend (React)
- **NASA Blue Marble image** from NASA Earth Observatory
- **Drawing tools** for creating rectangle and circle annotations
- **Annotation form** with label input and save functionality
- **Annotations list** in sidebar with click-to-highlight
- **API integration** with axios for CRUD operations
- **Real-time updates** when saving/deleting annotations

### Project Structure
```
src/
├── App.jsx          # Main component with OpenSeadragon viewer
├── App.css          # Layout and styling
├── index.css        # Global styles
└── main.jsx         # React entry point
```

### Getting Started

#### Backend (Django)
1. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start Django server:**
   ```bash
   python manage.py runserver
   ```
   - API available at: `http://localhost:8000/api/annotations/`

#### Frontend (React)
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Test the application:**
   - Open browser to `http://localhost:5173`
   - View NASA Blue Marble image
   - Use drawing tools to create annotations
   - Save annotations with labels
   - Click saved annotations to highlight them

### API Endpoints
- `GET /api/annotations/` - List all annotations
- `POST /api/annotations/` - Create new annotation
- `GET /api/annotations/{id}/` - Get specific annotation
- `PUT /api/annotations/{id}/` - Update annotation
- `DELETE /api/annotations/{id}/` - Delete annotation

### Next Steps (Future Days)
- [ ] **Day 3:** AI analysis features (object detection, classification)
- [ ] **Day 4:** Advanced NASA imagery integration (GIBS, Earthdata)
- [ ] **Day 5:** User authentication and collaboration features
- [ ] **Day 6:** Enhanced UI/UX and mobile optimization

### Branch Strategy
- `main` - Stable releases
- `feature/nasa-api` - NASA imagery integration
- `feature/annotations` - Annotation tools
- `feature/ai-analysis` - AI features
- `hotfix/*` - Bug fixes
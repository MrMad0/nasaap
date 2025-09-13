import { useEffect, useRef, useState } from 'react'
import OpenSeadragon from 'openseadragon'
import axios from 'axios'
import './App.css'

function App() {
  const viewerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [annotations, setAnnotations] = useState([])
  const [currentAnnotation, setCurrentAnnotation] = useState(null)
  const [drawingMode, setDrawingMode] = useState('rectangle')
  const [annotationForm, setAnnotationForm] = useState({ label: '', shape_type: 'rectangle' })
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState(null)
  const [overlay, setOverlay] = useState(null)
  const viewer = useRef(null)

  // API base URL
  const API_BASE = 'http://localhost:8000/api/annotations'

  useEffect(() => {
    if (viewerRef.current) {
      const osdViewer = OpenSeadragon({
        id: "openseadragon-viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: {
          type: "image",
          url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200412.3x5400x2700.jpg",
          buildPyramid: true
        },
        minZoomLevel: 0.5,
        maxZoomLevel: 10,
        zoomPerClick: 2,
        zoomPerScroll: 1.2,
        showNavigationControl: true,
        showSequenceControl: false,
        showFullPageControl: false,
        showHomeControl: true,
        showZoomControl: true,
        showRotationControl: false,
        showFlipControl: false,
        showNavigator: false,
        sequenceMode: false,
        referenceStripSize: 100,
        referenceStripPosition: "BOTTOM_LEFT",
        referenceStripScroll: "HORIZONTAL",
        showReferenceStrip: false,
        collectionMode: false,
        collectionRows: 1,
        collectionColumns: 0,
        collectionLayout: "horizontal",
        collectionTileSize: 800,
        collectionTileMargin: 80,
        gestureSettingsMouse: {
          clickToZoom: true,
          dblClickToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
          flickMinSpeed: 120,
          flickMomentum: 0.25,
          pinchRotate: false
        },
        gestureSettingsTouch: {
          clickToZoom: true,
          dblClickToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
          flickMinSpeed: 120,
          flickMomentum: 0.25,
          pinchRotate: false
        },
        gestureSettingsPen: {
          clickToZoom: true,
          dblClickToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
          flickMinSpeed: 120,
          flickMomentum: 0.25,
          pinchRotate: false
        },
        animationTime: 1.2,
        springStiffness: 5.0,
        imageLoaderLimit: 5,
        maxImageCacheCount: 200,
        timeout: 120000,
        useCanvas: true
      })

      viewer.current = osdViewer

      // Add event handlers
      osdViewer.addHandler('open-failed', function(event) {
        console.error('Failed to open image:', event);
        setError('Failed to load image. Trying fallback...');
        osdViewer.open({
          type: "image",
          url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80",
          buildPyramid: true
        });
      });

      osdViewer.addHandler('open', function(event) {
        console.log('Image loaded successfully');
        setLoading(false);
        setError(null);
        loadAnnotations();
      });

      osdViewer.addHandler('tile-loaded', function(event) {
        setLoading(false);
      });

      // Add drawing event handlers
      osdViewer.addHandler('canvas-click', function(event) {
        if (isDrawing) {
          handleCanvasClick(event);
        }
      });

      osdViewer.addHandler('canvas-drag', function(event) {
        if (isDrawing) {
          handleCanvasDrag(event);
        }
      });

      return () => {
        osdViewer.destroy()
      }
    }
  }, [])

  // Load annotations from API
  const loadAnnotations = async () => {
    try {
      const response = await axios.get(API_BASE);
      setAnnotations(response.data);
      drawAnnotations(response.data);
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  }

  // Draw annotations on the viewer
  const drawAnnotations = (annotationList) => {
    if (!viewer.current) return;

    // Clear existing overlays
    if (overlay) {
      viewer.current.removeOverlay(overlay);
    }

    annotationList.forEach(annotation => {
      const overlay = viewer.current.addOverlay({
        id: `annotation-${annotation.id}`,
        x: annotation.coordinates[0],
        y: annotation.coordinates[1],
        width: annotation.coordinates[2] - annotation.coordinates[0],
        height: annotation.coordinates[3] - annotation.coordinates[1],
        className: 'annotation-overlay',
        placement: OpenSeadragon.Placement.TOP_LEFT
      });

      // Add click handler to overlay
      overlay.element.addEventListener('click', () => {
        setCurrentAnnotation(annotation);
      });
    });
  }

  // Handle canvas click for drawing
  const handleCanvasClick = (event) => {
    const point = event.position;
    if (!startPoint) {
      setStartPoint(point);
    } else {
      // Finish drawing
      finishDrawing(point);
    }
  }

  // Handle canvas drag for drawing
  const handleCanvasDrag = (event) => {
    if (startPoint && isDrawing) {
      // Update preview rectangle
      const currentPoint = event.position;
      // This would update a preview overlay
    }
  }

  // Finish drawing and show form
  const finishDrawing = (endPoint) => {
    if (!startPoint) return;

    const coordinates = [
      Math.min(startPoint.x, endPoint.x),
      Math.min(startPoint.y, endPoint.y),
      Math.max(startPoint.x, endPoint.x),
      Math.max(startPoint.y, endPoint.y)
    ];

    setCurrentAnnotation({
      coordinates,
      shape_type: drawingMode,
      label: ''
    });

    setStartPoint(null);
    setIsDrawing(false);
  }

  // Save annotation
  const saveAnnotation = async () => {
    if (!currentAnnotation || !currentAnnotation.label.trim()) {
      alert('Please enter a label for the annotation');
      return;
    }

    try {
      const response = await axios.post(API_BASE, {
        ...currentAnnotation,
        label: currentAnnotation.label.trim()
      });

      setAnnotations([...annotations, response.data]);
      setCurrentAnnotation(null);
      loadAnnotations(); // Reload to redraw all annotations
    } catch (error) {
      console.error('Error saving annotation:', error);
      alert('Error saving annotation');
    }
  }

  // Delete annotation
  const deleteAnnotation = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}/`);
      setAnnotations(annotations.filter(ann => ann.id !== id));
      loadAnnotations(); // Reload to redraw
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  }

  // Start drawing mode
  const startDrawing = (shapeType) => {
    setDrawingMode(shapeType);
    setIsDrawing(true);
    setStartPoint(null);
    setCurrentAnnotation(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h2>NASA Image Explorer</h2>
        
        {/* Drawing Tools */}
        <div className="drawing-tools">
          <h3>Drawing Tools</h3>
          <div className="tool-buttons">
            <button 
              className={drawingMode === 'rectangle' ? 'active' : ''}
              onClick={() => startDrawing('rectangle')}
            >
              Rectangle
            </button>
            <button 
              className={drawingMode === 'circle' ? 'active' : ''}
              onClick={() => startDrawing('circle')}
            >
              Circle
            </button>
          </div>
          {isDrawing && (
            <p className="drawing-instruction">
              Click and drag to draw a {drawingMode}
            </p>
          )}
        </div>

        {/* Annotation Form */}
        {currentAnnotation && (
          <div className="annotation-form">
            <h3>Save Annotation</h3>
            <input
              type="text"
              placeholder="Enter annotation label..."
              value={annotationForm.label}
              onChange={(e) => setAnnotationForm({...annotationForm, label: e.target.value})}
            />
            <div className="form-buttons">
              <button onClick={saveAnnotation}>Save</button>
              <button onClick={() => setCurrentAnnotation(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Annotations List */}
        <div className="annotations-list">
          <h3>Saved Annotations ({annotations.length})</h3>
          {annotations.length === 0 ? (
            <p>No annotations yet. Draw something to get started!</p>
          ) : (
            <div className="annotations">
              {annotations.map(annotation => (
                <div 
                  key={annotation.id} 
                  className={`annotation-item ${currentAnnotation?.id === annotation.id ? 'active' : ''}`}
                  onClick={() => setCurrentAnnotation(annotation)}
                >
                  <div className="annotation-info">
                    <strong>{annotation.label}</strong>
                    <span className="annotation-type">{annotation.shape_type}</span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnnotation(annotation.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="viewer-container">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading NASA image...</p>
          </div>
        )}
        {error && (
          <div className="error-overlay">
            <p>{error}</p>
          </div>
        )}
        <div 
          id="openseadragon-viewer" 
          ref={viewerRef}
          className="openseadragon-viewer"
        ></div>
      </div>
    </div>
  )
}

export default App
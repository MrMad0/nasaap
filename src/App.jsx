import { useEffect, useRef, useState } from 'react'
import OpenSeadragon from 'openseadragon'
import './App.css'

function App() {
  const viewerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: {
          type: "image",
          url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4000&q=80",
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
        // Additional settings for better zoom experience
        animationTime: 1.2,
        springStiffness: 5.0,
        imageLoaderLimit: 5,
        maxImageCacheCount: 200,
        timeout: 120000,
        useCanvas: true
      })

      // Add event handlers
      viewer.addHandler('open-failed', function(event) {
        console.error('Failed to open image:', event);
        setError('Failed to load image. Trying fallback...');
        // Try fallback image
        viewer.open({
          type: "image",
          url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80",
          buildPyramid: true
        });
      });

      viewer.addHandler('open', function(event) {
        console.log('Image loaded successfully');
        setLoading(false);
        setError(null);
      });

      viewer.addHandler('tile-loaded', function(event) {
        setLoading(false);
      });

      return () => {
        viewer.destroy()
      }
    }
  }, [])

  return (
    <div className="app">
      <div className="sidebar">
        <h2>NASA Image Explorer</h2>
        <p>Sidebar placeholder for future features:</p>
        <ul>
          <li>Image metadata</li>
          <li>Annotation tools</li>
          <li>AI analysis</li>
          <li>Search filters</li>
        </ul>
      </div>
      <div className="viewer-container">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading image...</p>
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
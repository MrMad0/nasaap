import { useEffect, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import './App.css'

function App() {
  const viewerRef = useRef(null)

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: {
          type: "image",
          url: "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi"
        },
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
        }
      })

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
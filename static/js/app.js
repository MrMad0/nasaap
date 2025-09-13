// Global variables
let viewer = null;
let isDrawing = false;
let drawingMode = 'rectangle';
let startPoint = null;
let currentAnnotation = null;
let annotations = [];

// API base URL
const API_BASE = '/api/';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeViewer();
    setupEventListeners();
    loadAnnotations();
    
    // Set default drawing mode
    setDrawingMode('rectangle');
});

// Initialize OpenSeadragon viewer
function initializeViewer() {
    viewer = OpenSeadragon({
        id: "openseadragon-viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: {
            type: "image",
            url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/earth_lights_lrg.jpg",
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
    });

    // Add event handlers
    viewer.addHandler('open-failed', function(event) {
        console.error('Failed to open image:', event);
        showError('Failed to load image. Trying fallback...');
        viewer.open({
            type: "image",
            url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200412.3x5400x2700.jpg",
            buildPyramid: true
        });
    });

    viewer.addHandler('open', function(event) {
        console.log('Image loaded successfully');
        hideLoading();
        hideError();
    });

    viewer.addHandler('tile-loaded', function(event) {
        hideLoading();
    });

    // Add drawing event handlers - wait for canvas to be ready
    viewer.addHandler('open', function() {
        const canvas = viewer.canvas;
        
        canvas.addEventListener('mousedown', function(event) {
            if (isDrawing) {
                event.preventDefault();
                handleMouseDown(event);
            }
        });

        canvas.addEventListener('mousemove', function(event) {
            if (isDrawing && startPoint) {
                event.preventDefault();
                handleMouseMove(event);
            }
        });

        canvas.addEventListener('mouseup', function(event) {
            if (isDrawing && startPoint) {
                event.preventDefault();
                handleMouseUp(event);
            }
        });
    });
}

// Setup event listeners for UI elements
function setupEventListeners() {
    // Drawing tool buttons
    document.getElementById('rectangle-btn').addEventListener('click', function() {
        setDrawingMode('rectangle');
    });

    document.getElementById('circle-btn').addEventListener('click', function() {
        setDrawingMode('circle');
    });

    // Annotation form buttons
    document.getElementById('save-annotation').addEventListener('click', saveAnnotation);
    document.getElementById('cancel-annotation').addEventListener('click', cancelAnnotation);
}

// Set drawing mode
function setDrawingMode(mode) {
    drawingMode = mode;
    isDrawing = true;
    startPoint = null;
    currentAnnotation = null;
    
    // Update UI
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-shape="${mode}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    const instruction = document.getElementById('drawing-instruction');
    if (instruction) {
        instruction.style.display = 'block';
        instruction.textContent = `Click and drag to draw a ${mode}`;
    }
    
    hideAnnotationForm();
    
    console.log(`Drawing mode set to: ${mode}`);
}

// Handle mouse down for drawing
function handleMouseDown(event) {
    console.log('Mouse down event triggered');
    const rect = viewer.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const point = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x, y));
    startPoint = point;
    console.log('Start point set:', startPoint);
}

// Handle mouse move for drawing preview
function handleMouseMove(event) {
    if (!startPoint) return;
    
    const rect = viewer.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const currentPoint = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x, y));
    updatePreviewOverlay(startPoint, currentPoint);
}

// Handle mouse up to finish drawing
function handleMouseUp(event) {
    if (!startPoint) return;
    
    const rect = viewer.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const endPoint = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x, y));
    finishDrawing(startPoint, endPoint);
}

// Update preview overlay during drawing
function updatePreviewOverlay(start, current) {
    // Remove existing preview overlay
    viewer.removeOverlay('preview-overlay');

    // Create preview overlay
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);

    if (width > 0.01 && height > 0.01) {
        viewer.addOverlay({
            id: 'preview-overlay',
            x: x,
            y: y,
            width: width,
            height: height,
            className: 'preview-overlay',
            placement: OpenSeadragon.Placement.TOP_LEFT
        });
    }
}

// Finish drawing and show form
function finishDrawing(start, end) {
    if (!start || !end) return;

    // Remove preview overlay
    viewer.removeOverlay('preview-overlay');

    const coordinates = [
        Math.min(start.x, end.x),
        Math.min(start.y, end.y),
        Math.max(start.x, end.x),
        Math.max(start.y, end.y)
    ];

    // Only create annotation if it has meaningful size
    if (Math.abs(coordinates[2] - coordinates[0]) > 0.01 && 
        Math.abs(coordinates[3] - coordinates[1]) > 0.01) {
        
        currentAnnotation = {
            coordinates: coordinates,
            shape_type: drawingMode,
            label: ''
        };
        
        showAnnotationForm();
    }

    startPoint = null;
    isDrawing = false;
    document.getElementById('drawing-instruction').style.display = 'none';
}

// Show annotation form
function showAnnotationForm() {
    document.getElementById('annotation-form').style.display = 'block';
    document.getElementById('annotation-label').focus();
}

// Hide annotation form
function hideAnnotationForm() {
    document.getElementById('annotation-form').style.display = 'none';
    document.getElementById('annotation-label').value = '';
}

// Save annotation
async function saveAnnotation() {
    const label = document.getElementById('annotation-label').value.trim();
    
    if (!currentAnnotation || !label) {
        alert('Please enter a label for the annotation');
        return;
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                ...currentAnnotation,
                label: label
            })
        });

        if (response.ok) {
            const savedAnnotation = await response.json();
            annotations.push(savedAnnotation);
            updateAnnotationsList();
            drawAnnotations();
            hideAnnotationForm();
            currentAnnotation = null;
        } else {
            throw new Error('Failed to save annotation');
        }
    } catch (error) {
        console.error('Error saving annotation:', error);
        alert('Error saving annotation');
    }
}

// Cancel annotation
function cancelAnnotation() {
    hideAnnotationForm();
    currentAnnotation = null;
    isDrawing = false;
    startPoint = null;
    document.getElementById('drawing-instruction').style.display = 'none';
}

// Load annotations from API
async function loadAnnotations() {
    try {
        const response = await fetch(API_BASE);
        if (response.ok) {
            annotations = await response.json();
            updateAnnotationsList();
            drawAnnotations();
        }
    } catch (error) {
        console.error('Error loading annotations:', error);
    }
}

// Update annotations list in sidebar
function updateAnnotationsList() {
    const container = document.getElementById('annotations-container');
    const count = document.getElementById('annotation-count');
    
    count.textContent = annotations.length;
    
    if (annotations.length === 0) {
        container.innerHTML = '<p>No annotations yet. Draw something to get started!</p>';
        return;
    }
    
    container.innerHTML = annotations.map(annotation => `
        <div class="annotation-item" data-id="${annotation.id}">
            <div class="annotation-info">
                <strong>${annotation.label}</strong>
                <span class="annotation-type">${annotation.shape_type}</span>
            </div>
            <button class="delete-btn" onclick="deleteAnnotation(${annotation.id})">×</button>
        </div>
    `).join('');
    
    // Add click handlers for annotation items
    container.querySelectorAll('.annotation-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            highlightAnnotation(id);
        });
    });
}

// Draw annotations on the viewer
function drawAnnotations() {
    // Clear existing overlays
    annotations.forEach(annotation => {
        viewer.removeOverlay(`annotation-${annotation.id}`);
    });
    
    annotations.forEach(annotation => {
        const overlay = viewer.addOverlay({
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
            highlightAnnotation(annotation.id);
        });
    });
}

// Highlight annotation
function highlightAnnotation(id) {
    // Remove active class from all items
    document.querySelectorAll('.annotation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected item
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.classList.add('active');
    }
}

// Delete annotation
async function deleteAnnotation(id) {
    if (!confirm('Are you sure you want to delete this annotation?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        
        if (response.ok) {
            annotations = annotations.filter(ann => ann.id !== id);
            updateAnnotationsList();
            drawAnnotations();
        } else {
            throw new Error('Failed to delete annotation');
        }
    } catch (error) {
        console.error('Error deleting annotation:', error);
        alert('Error deleting annotation');
    }
}

// Utility functions
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-overlay').style.display = 'block';
}

function hideError() {
    document.getElementById('error-overlay').style.display = 'none';
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

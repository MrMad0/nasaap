// NASA Image Viewer - Clean version without drawing tools
let viewer = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing NASA Image Viewer...');
    initializeViewer();
});

// Initialize OpenSeadragon viewer
function initializeViewer() {
    showLoading();
    console.log('Starting viewer initialization...');
    
    // Check if there's a selected image from gallery
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get('image_id');
    console.log('Image ID from URL:', imageId);
    
    let imageTileSource = {
        type: "image",
        url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=4000&q=80",
        buildPyramid: true
    };
    
    // If image ID is provided, load the selected image
    if (imageId) {
        console.log('Loading selected image with ID:', imageId);
        loadSelectedImage(imageId).then(imageUrl => {
            if (imageUrl) {
                console.log('Loaded image URL:', imageUrl);
                imageTileSource.url = imageUrl;
            } else {
                console.log('Failed to load image, using fallback');
            }
            createViewer(imageTileSource);
        }).catch(error => {
            console.error('Error loading selected image:', error);
            createViewer(imageTileSource);
        });
    } else {
        console.log('No image ID provided, using default image');
        createViewer(imageTileSource);
    }
}

// Load selected image from gallery API
async function loadSelectedImage(imageId) {
    try {
        console.log('Fetching image data from API...');
        const response = await fetch(`/api/gallery/${imageId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageData = await response.json();
        console.log('Image data received:', imageData);
        return imageData.image_url;
    } catch (error) {
        console.error('Failed to load selected image:', error);
        return null;
    }
}



// Create the OpenSeadragon viewer
function createViewer(tileSources) {
    console.log('Creating OpenSeadragon viewer with source:', tileSources);
    
    try {    

        viewer = OpenSeadragon({            
            id: "openseadragon-viewer",

            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",

            tileSources: tileSources,            

            minZoomLevel: 0.5,            

            maxZoomLevel: 10,           

            zoomPerClick: 2,            

            zoomPerScroll: 1.2,            

            showNavigationControl: true,            

            showHomeControl: true,            

            showZoomControl: true,            

            animationTime: 1.2,            

            springStiffness: 5.0,            

            timeout: 30000,            

            useCanvas: true,            

            preserveViewport: false,            

            visibilityRatio: 0.5,            

            constrainDuringPan: false,            

            wrapHorizontal: false,            

            wrapVertical: false,            

            immediateRender: false,            

            blendTime: 0.5,            

            alwaysBlend: false,            

            autoHideControls: true,            

            showFullPageControl: false,            

            showRotationControl: false,            

        });       



        // Add event handlers        // Add event handlers

        viewer.addHandler('open-failed', function(event) {

            console.error('Failed to open image:', event);            

            showError('Failed to load image. Trying fallback...');          

                        

            // Try fallback image            // Try fallback image

            viewer.open({            

                type: "image",               

                url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80",                

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

                

        viewer.addHandler('tile-load-failed', function(event) {        

            console.error('Tile load failed:', event);            

        });      

                

        console.log('OpenSeadragon viewer created successfully');        

        
    } catch (error) {
        console.error('Error creating viewer:', error);
        showError('Error initializing viewer: ' + error.message);
    }
}

// Show loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}



// Show error message
function showError(message) {
    const errorOverlay = document.getElementById('error-overlay');
    const errorMessage = document.getElementById('error-message');
    if (errorOverlay && errorMessage) {
        errorMessage.textContent = message;
        errorOverlay.style.display = 'flex';
    }
    console.error(message);
}

// Hide error overlay
function hideError() {
    const errorOverlay = document.getElementById('error-overlay');
    if (errorOverlay) {
        errorOverlay.style.display = 'none';
    }
}

// Retry loading image
function retryLoad() {
    hideError();
    initializeViewer();
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

// Gallery JavaScript functionality
class GalleryManager {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentFilter = {
            search: '',
            category: '',
            source: ''
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadImages();
    }
    
    bindEvents() {
        // Search and filter events
        document.getElementById('search-btn').addEventListener('click', () => {
            this.handleSearch();
        });
        
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        document.getElementById('category-filter').addEventListener('change', () => {
            this.handleFilter();
        });
        
        document.getElementById('source-filter').addEventListener('change', () => {
            this.handleFilter();
        });
        
        // Pagination events
        document.getElementById('prev-page').addEventListener('click', () => {
            this.prevPage();
        });
        
        document.getElementById('next-page').addEventListener('click', () => {
            this.nextPage();
        });
    }
    
    async loadImages() {
        this.showLoading();
        try {
            const response = await fetch('/api/gallery/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.images = await response.json();
            this.filteredImages = [...this.images];
            this.hideLoading();
            this.renderGallery();
            this.updatePagination();
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to load images: ' + error.message);
            console.error('Error loading images:', error);
        }
    }
    
    handleSearch() {
        this.currentFilter.search = document.getElementById('search-input').value.toLowerCase();
        this.applyFilters();
    }
    
    handleFilter() {
        this.currentFilter.category = document.getElementById('category-filter').value;
        this.currentFilter.source = document.getElementById('source-filter').value;
        this.currentFilter.search = document.getElementById('search-input').value.toLowerCase();
        this.applyFilters();
    }
    
    applyFilters() {
        this.filteredImages = this.images.filter(image => {
            const matchesSearch = !this.currentFilter.search || 
                image.title.toLowerCase().includes(this.currentFilter.search) ||
                image.description.toLowerCase().includes(this.currentFilter.search);
            
            const matchesCategory = !this.currentFilter.category || 
                image.category === this.currentFilter.category;
            
            const matchesSource = !this.currentFilter.source || 
                image.source === this.currentFilter.source;
            
            return matchesSearch && matchesCategory && matchesSource;
        });
        
        this.currentPage = 1;
        this.renderGallery();
        this.updatePagination();
    }
    
    renderGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        
        if (this.filteredImages.length === 0) {
            galleryGrid.innerHTML = '<p class="no-images">No images found matching your criteria.</p>';
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageImages = this.filteredImages.slice(startIndex, endIndex);
        
        galleryGrid.innerHTML = pageImages.map(image => this.createImageCard(image)).join('');
        
        // Add click events to gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const imageId = item.dataset.imageId;
                this.selectImage(imageId);
            });
        });
    }
    
    createImageCard(image) {
        const imageUrl = image.thumbnail_url || image.image_url;
        const truncatedDescription = image.description.length > 100 
            ? image.description.substring(0, 100) + '...' 
            : image.description;
        
        return `
            <div class="gallery-item" data-image-id="${image.id}">
                <div class="gallery-item-image">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="${image.title}" onerror="this.style.display='none'; this.parentNode.innerHTML='Image not available';">` :
                        'No image available'
                    }
                </div>
                <div class="gallery-item-content">
                    <h3 class="gallery-item-title">${image.title}</h3>
                    <p class="gallery-item-description">${truncatedDescription}</p>
                    <div class="gallery-item-meta">
                        <span class="gallery-item-source">${image.source}</span>
                        ${image.category ? `<span class="gallery-item-category">${image.category}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    selectImage(imageId) {
        // Redirect to the viewer with the selected image
        window.location.href = `/viewer/?image_id=${imageId}`;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredImages.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        prevBtn.style.opacity = this.currentPage === 1 ? '0.5' : '1';
        nextBtn.style.opacity = this.currentPage === totalPages ? '0.5' : '1';
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderGallery();
            this.updatePagination();
            this.scrollToTop();
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredImages.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderGallery();
            this.updatePagination();
            this.scrollToTop();
        }
    }
    
    scrollToTop() {
        document.querySelector('.gallery-grid').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    showLoading() {
        document.getElementById('loading-spinner').style.display = 'block';
        document.getElementById('gallery-grid').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('gallery-grid').style.display = 'grid';
    }
    
    showError(message) {
        document.getElementById('error-text').textContent = message;
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('gallery-grid').style.display = 'none';
    }
    
    showSuccessMessage(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    getCSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return '';
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});

// Add some sample NASA images when the page loads (for demo purposes)
window.addEventListener('load', () => {
    // Check if we need to add sample data
    setTimeout(async () => {
        try {
            const response = await fetch('/api/gallery/');
            const images = await response.json();
            
            if (images.length === 0) {
                // Add sample NASA images
                const sampleImages = [
                    {
                        title: "Earth from Space - Blue Marble",
                        description: "This spectacular 'blue marble' image is the most detailed true-color image of the entire Earth to date.",
                        image_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                        thumbnail_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        source: "NASA",
                        category: "Earth"
                    },
                    {
                        title: "Galaxy Deep Field",
                        description: "One of the most important images in astronomy, showing thousands of galaxies in a tiny patch of sky.",
                        image_url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                        thumbnail_url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        source: "NASA",
                        category: "Space"
                    },
                    {
                        title: "Mars Surface Landscape",
                        description: "High-resolution image showing the Martian landscape with its distinctive red terrain.",
                        image_url: "https://images.unsplash.com/photo-1582639590398-912d1b0d1d9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                        thumbnail_url: "https://images.unsplash.com/photo-1582639590398-912d1b0d1d9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        source: "NASA",
                        category: "Mars"
                    },
                    {
                        title: "International Space Station",
                        description: "The International Space Station orbiting Earth at approximately 400 kilometers altitude.",
                        image_url: "https://images.unsplash.com/photo-1446776876353-d04a10e4e0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                        thumbnail_url: "https://images.unsplash.com/photo-1446776876353-d04a10e4e0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        source: "NASA",
                        category: "Satellites"
                    },
                    {
                        title: "Moon Surface",
                        description: "Detailed view of the lunar surface showing craters and the Moon's distinctive gray landscape.",
                        image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                        thumbnail_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        source: "NASA",
                        category: "Moon"
                    },
                    {
                        title: "Nebula Star Formation",
                        description: "A colorful nebula showing a star-forming region where new stars are born from gas and dust.",
                        image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
                        thumbnail_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                        source: "NASA",
                        category: "Space"
                    }
                ];
                
                // Add sample images to the database
                for (const imageData of sampleImages) {
                    try {
                        await fetch('/api/gallery/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCsrfToken()
                            },
                            body: JSON.stringify(imageData)
                        });
                    } catch (error) {
                        console.log('Could not add sample image:', error);
                    }
                }
                
                // Reload the gallery
                if (window.galleryManager) {
                    window.galleryManager.loadImages();
                }
            }
        } catch (error) {
            console.log('Could not check/add sample images:', error);
        }
    }, 1000);
});

function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}
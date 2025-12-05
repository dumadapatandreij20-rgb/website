// Initialize Data
let memories = {
    photos: [
        {
            id: 1,
            title: "Beach Sunset",
            date: "2023-07-15",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            caption: "Beautiful sunset at the beach with family",
            tags: ["family", "travel", "summer"],
            category: "family"
        },
        {
            id: 2,
            title: "Birthday Celebration",
            date: "2023-05-20",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            caption: "Best birthday party ever!",
            tags: ["celebration", "friends"],
            category: "celebration"
        }
    ],
    videos: [
        {
            id: 1,
            title: "Christmas Morning",
            date: "2022-12-25",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Kids opening presents on Christmas morning",
            tags: ["family", "celebration"],
            category: "family"
        }
    ],
    journals: [
        {
            id: 1,
            title: "First Day of Summer",
            date: "2023-06-21",
            content: "What a wonderful day! The weather was perfect and we spent the entire day at the park. The kids had so much fun playing on the swings...",
            tags: ["everyday", "family"],
            category: "everyday"
        }
    ]
};

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterTags = document.querySelectorAll('.filter-tag');
const sortSelect = document.getElementById('sort-select');
const photoGallery = document.getElementById('photo-gallery');
const videoGallery = document.getElementById('video-gallery');
const journalContainer = document.getElementById('journal-container');
const timelineContainer = document.getElementById('timeline-container');
const musicToggle = document.getElementById('music-toggle');
const volumeSlider = document.getElementById('volume-slider');
const backgroundMusic = document.getElementById('background-music');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAllMemories();
    setupEventListeners();
    updateCounts();
    animateElements();
    
    // Set music volume
    backgroundMusic.volume = volumeSlider.value;
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.hash) {
                e.preventDefault();
                const target = document.querySelector(link.hash);
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') performSearch();
    });
    
    // Filter tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            filterMemories(tag.dataset.filter);
        });
    });
    
    // Sort
    sortSelect.addEventListener('change', () => {
        sortMemories(sortSelect.value);
    });
    
    // Music controls
    musicToggle.addEventListener('click', toggleMusic);
    volumeSlider.addEventListener('input', (e) => {
        backgroundMusic.volume = e.target.value;
        updateMusicButton();
    });
    
    // Modal
    const modal = document.getElementById('image-modal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });
    
    window.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Load Memories
function loadAllMemories() {
    loadPhotos();
    loadVideos();
    loadJournals();
    loadTimeline();
}

function loadPhotos() {
    photoGallery.innerHTML = memories.photos.map(photo => `
        <div class="photo-card" data-category="${photo.category}" data-id="${photo.id}">
            <img src="${photo.image}" alt="${photo.title}" class="photo-image">
            <div class="photo-overlay">
                <h3>${photo.title}</h3>
                <p>${photo.caption}</p>
            </div>
            <div class="photo-info">
                <div class="photo-date">
                    <i class="far fa-calendar"></i> ${formatDate(photo.date)}
                </div>
                <div class="photo-caption">${photo.title}</div>
                <div class="photo-tags">
                    ${photo.tags.map(tag => `<span class="photo-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click events to photos
    document.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', function() {
            const photo = memories.photos.find(p => p.id == this.dataset.id);
            showImageModal(photo.image, photo.caption);
        });
    });
}

function loadVideos() {
    videoGallery.innerHTML = memories.videos.map(video => `
        <div class="video-card" data-category="${video.category}">
            <iframe class="video-player" 
                    src="${video.url}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p class="photo-date">
                    <i class="far fa-calendar"></i> ${formatDate(video.date)}
                </p>
                <p>${video.description}</p>
                <div class="photo-tags">
                    ${video.tags.map(tag => `<span class="photo-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function loadJournals() {
    journalContainer.innerHTML = memories.journals.map(journal => `
        <div class="journal-card" data-category="${journal.category}">
            <div class="journal-header">
                <span class="journal-date">${formatDate(journal.date)}</span>
                <div class="photo-tags">
                    ${journal.tags.map(tag => `<span class="photo-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <h3 class="journal-title">${journal.title}</h3>
            <p class="journal-content">${journal.content}</p>
            <div class="journal-meta">
                <span><i class="far fa-clock"></i> 5 min read</span>
                <span><i class="far fa-heart"></i> 12 likes</span>
            </div>
        </div>
    `).join('');
}

function loadTimeline() {
    // Combine all memories for timeline
    const allMemories = [
        ...memories.photos.map(p => ({...p, type: 'photo'})),
        ...memories.videos.map(v => ({...v, type: 'video'})),
        ...memories.journals.map(j => ({...j, type: 'journal'}))
    ];
    
    // Sort by date (newest first)
    allMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    timelineContainer.innerHTML = allMemories.map((memory, index) => `
        <div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-date">${formatDate(memory.date)}</div>
                <h4>${memory.title}</h4>
                <p>${memory.type === 'photo' ? '📷 Photo' : memory.type === 'video' ? '🎥 Video' : '📖 Journal'}</p>
                <p>${memory.caption || memory.description || memory.content.substring(0, 100)}...</p>
                <div class="photo-tags">
                    ${memory.tags.map(tag => `<span class="photo-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Helper Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showImageModal(imageSrc, caption) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('modal-caption');
    
    modal.style.display = "block";
    modalImg.src = imageSrc;
    captionText.innerHTML = caption;
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter photos
    document.querySelectorAll('.photo-card, .video-card, .journal-card').forEach(card => {
        const title = card.querySelector('h3, .journal-title')?.textContent.toLowerCase() || '';
        const content = card.querySelector('p, .journal-content')?.textContent.toLowerCase() || '';
        
        if(title.includes(searchTerm) || content.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterMemories(category) {
    const elements = document.querySelectorAll('.photo-card, .video-card, .journal-card');
    
    elements.forEach(element => {
        if(category === 'all' || element.dataset.category === category) {
            element.style.display = 'block';
            element.style.animation = 'fadeInUp 0.5s ease';
        } else {
            element.style.display = 'none';
        }
    });
}

function sortMemories(sortBy) {
    // This would be implemented based on your sorting logic
    console.log(`Sorting by: ${sortBy}`);
    // You would sort the memories array and re-render
}

function updateCounts() {
    document.getElementById('photo-count').textContent = memories.photos.length;
    document.getElementById('video-count').textContent = memories.videos.length;
    document.getElementById('journal-count').textContent = memories.journals.length;
    document.getElementById('total-memories').textContent = 
        memories.photos.length + memories.videos.length + memories.journals.length;
}

function toggleMusic() {
    if(backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music: ON</span>';
    } else {
        backgroundMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music: OFF</span>';
    }
}

function updateMusicButton() {
    if(backgroundMusic.paused) {
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music: OFF</span>';
    } else {
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music: ON</span>';
    }
}

function animateElements() {
    // Add animation to cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.photo-card, .video-card, .journal-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if(section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Export memories for admin panel
if(typeof module !== 'undefined') {
    module.exports = memories;
}
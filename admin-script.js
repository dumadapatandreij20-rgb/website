// Admin Panel JavaScript
class MemoryAdmin {
    constructor() {
        this.memories = this.loadMemories();
        this.currentTab = 'dashboard';
        this.initialize();
    }

    initialize() {
        this.setupTabNavigation();
        this.loadDashboard();
        this.loadManagementLists();
        this.setupEventListeners();
        this.setupFileUpload();
    }

    loadMemories() {
        const savedMemories = localStorage.getItem('memoryGalleryData');
        if (savedMemories) {
            return JSON.parse(savedMemories);
        }
        
        // Default sample data
        return {
            photos: [
                {
                    id: 1,
                    title: "Beach Sunset",
                    date: "2023-07-15",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                    caption: "Beautiful sunset at the beach with family",
                    tags: ["family", "travel", "summer"],
                    category: "family"
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
                    content: "What a wonderful day! The weather was perfect...",
                    tags: ["everyday", "family"],
                    category: "everyday"
                }
            ]
        };
    }

    saveMemories() {
        localStorage.setItem('memoryGalleryData', JSON.stringify(this.memories));
        this.showNotification('Changes saved successfully!', 'success');
    }

    setupTabNavigation() {
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        // Hide all tabs
        document.querySelectorAll('.admin-tab').forEach(t => {
            t.classList.remove('active');
        });
        
        // Show selected tab
        const tabElement = document.getElementById(`${tab}-tab`);
        if (tabElement) {
            tabElement.classList.add('active');
            document.getElementById('admin-title').textContent = this.getTabTitle(tab);
        }
        
        this.currentTab = tab;
        
        // Refresh tab content
        if (tab === 'dashboard') {
            this.loadDashboard();
        } else if (tab === 'photos') {
            this.loadPhotoList();
        } else if (tab === 'videos') {
            this.loadVideoList();
        } else if (tab === 'journals') {
            this.loadJournalList();
        }
    }

    getTabTitle(tab) {
        const titles = {
            'dashboard': 'Dashboard',
            'photos': 'Manage Photos',
            'videos': 'Manage Videos',
            'journals': 'Manage Journals',
            'upload': 'Upload Files',
            'settings': 'Settings'
        };
        return titles[tab] || 'Admin Panel';
    }

    loadDashboard() {
        // Update counts
        document.getElementById('admin-photo-count').textContent = this.memories.photos.length;
        document.getElementById('admin-video-count').textContent = this.memories.videos.length;
        document.getElementById('admin-journal-count').textContent = this.memories.journals.length;
        document.getElementById('admin-total-count').textContent = 
            this.memories.photos.length + this.memories.videos.length + this.memories.journals.length;
        
        // Load activity
        this.loadActivity();
    }

    loadActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        const activities = [
            { icon: 'fa-plus', text: 'Added new photo "Beach Sunset"', time: '2 hours ago' },
            { icon: 'fa-edit', text: 'Updated journal "First Day of Summer"', time: 'Yesterday' },
            { icon: 'fa-upload', text: 'Uploaded 3 new videos', time: '2 days ago' },
            { icon: 'fa-trash', text: 'Deleted old photo', time: '1 week ago' }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas ${activity.icon}"></i>
                <div>
                    <p>${activity.text}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }

    loadManagementLists() {
        this.loadPhotoList();
        this.loadVideoList();
        this.loadJournalList();
    }

    loadPhotoList() {
        const photoList = document.getElementById('photo-list');
        if (!photoList) return;
        
        photoList.innerHTML = this.memories.photos.map(photo => `
            <div class="manage-item" data-id="${photo.id}">
                <img src="${photo.image}" alt="${photo.title}">
                <h4>${photo.title}</h4>
                <p>${photo.caption}</p>
                <div class="item-meta">
                    <small><i class="far fa-calendar"></i> ${this.formatDate(photo.date)}</small>
                    <small><i class="fas fa-tags"></i> ${photo.tags.join(', ')}</small>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="admin.editPhoto(${photo.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="admin.deletePhoto(${photo.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadVideoList() {
        const videoList = document.getElementById('video-list');
        if (!videoList) return;
        
        videoList.innerHTML = this.memories.videos.map(video => `
            <div class="manage-item" data-id="${video.id}">
                <div class="video-preview">
                    <i class="fas fa-video"></i>
                </div>
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <div class="item-meta">
                    <small><i class="far fa-calendar"></i> ${this.formatDate(video.date)}</small>
                    <small><i class="fas fa-tags"></i> ${video.tags.join(', ')}</small>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="admin.editVideo(${video.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="admin.deleteVideo(${video.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadJournalList() {
        const journalList = document.getElementById('journal-list');
        if (!journalList) return;
        
        journalList.innerHTML = this.memories.journals.map(journal => `
            <div class="manage-item" data-id="${journal.id}">
                <h4>${journal.title}</h4>
                <p>${journal.content.substring(0, 100)}...</p>
                <div class="item-meta">
                    <small><i class="far fa-calendar"></i> ${this.formatDate(journal.date)}</small>
                    <small><i class="fas fa-tags"></i> ${journal.tags.join(', ')}</small>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="admin.editJournal(${journal.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="admin.deleteJournal(${journal.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('save-all');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveMemories());
        }

        // Export button
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Modal forms
        this.setupModalForms();
    }

    setupModalForms() {
        const photoForm = document.getElementById('photo-form');
        if (photoForm) {
            photoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPhotoFromForm(photoForm);
            });
        }

        const videoForm = document.getElementById('video-form');
        if (videoForm) {
            videoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addVideoFromForm(videoForm);
            });
        }

        const journalForm = document.getElementById('journal-form');
        if (journalForm) {
            journalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addJournalFromForm(journalForm);
            });
        }
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-upload');
        const uploadProgress = document.getElementById('upload-progress');
        const uploadQueue = document.getElementById('upload-queue');

        if (!uploadArea || !fileInput) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            uploadArea.style.borderColor = '#FFB6C1';
            uploadArea.style.backgroundColor = '#FFF8F8';
        }

        function unhighlight() {
            uploadArea.style.borderColor = '#E6E6FA';
            uploadArea.style.backgroundColor = 'white';
        }

        // Handle file selection
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Handle drop
        uploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFiles(files);
        });
    }

    handleFiles(files) {
        const uploadQueue = document.getElementById('upload-queue');
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.addToUploadQueue(file);
            this.simulateUpload(file);
        }
    }

    addToUploadQueue(file) {
        const uploadQueue = document.getElementById('upload-queue');
        const fileId = Date.now() + Math.random();
        
        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item';
        queueItem.id = `file-${fileId}`;
        queueItem.innerHTML = `
            <div class="queue-info">
                <div class="queue-icon">
                    <i class="${this.getFileIcon(file.type)}"></i>
                </div>
                <div>
                    <strong>${file.name}</strong>
                    <small>${this.formatFileSize(file.size)}</small>
                </div>
            </div>
            <div class="queue-status status-pending">Pending</div>
        `;
        
        uploadQueue.appendChild(queueItem);
    }

    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'fas fa-image';
        if (fileType.startsWith('video/')) return 'fas fa-video';
        if (fileType.startsWith('audio/')) return 'fas fa-music';
        return 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    simulateUpload(file) {
        const fileId = `file-${Date.now()}`;
        const statusElement = document.querySelector(`#${fileId} .queue-status`);
        
        if (statusElement) {
            statusElement.className = 'queue-status status-uploading';
            statusElement.textContent = 'Uploading...';
            
            // Simulate upload delay
            setTimeout(() => {
                statusElement.className = 'queue-status status-complete';
                statusElement.textContent = 'Complete';
                
                // Auto-remove after 3 seconds
                setTimeout(() => {
                    const item = document.getElementById(fileId);
                    if (item) {
                        item.style.opacity = '0';
                        setTimeout(() => item.remove(), 300);
                    }
                }, 3000);
                
                // Show success message
                this.showNotification(`${file.name} uploaded successfully!`, 'success');
            }, 2000);
        }
    }

    addPhotoFromForm(form) {
        const formData = new FormData(form);
        const newPhoto = {
            id: Date.now(),
            title: form.querySelector('input[type="text"]').value,
            date: form.querySelector('input[type="date"]').value,
            image: form.querySelector('input[placeholder="Image URL"]').value,
            caption: form.querySelector('textarea').value,
            tags: form.querySelector('input[placeholder="Tags"]').value.split(',').map(tag => tag.trim()),
            category: form.querySelector('select').value
        };
        
        this.memories.photos.push(newPhoto);
        this.saveMemories();
        this.loadPhotoList();
        this.closeModal('add-photo-modal');
        form.reset();
    }

    addVideoFromForm(form) {
        const formData = new FormData(form);
        const newVideo = {
            id: Date.now(),
            title: form.querySelector('input[type="text"]').value,
            date: form.querySelector('input[type="date"]').value,
            url: form.querySelector('input[placeholder="Video URL/Embed Code"]').value,
            description: form.querySelector('textarea').value,
            tags: form.querySelector('input[placeholder="Tags"]').value.split(',').map(tag => tag.trim()),
            category: form.querySelector('select').value
        };
        
        this.memories.videos.push(newVideo);
        this.saveMemories();
        this.loadVideoList();
        this.closeModal('add-video-modal');
        form.reset();
    }

    addJournalFromForm(form) {
        const formData = new FormData(form);
        const newJournal = {
            id: Date.now(),
            title: form.querySelector('input[type="text"]').value,
            date: form.querySelector('input[type="date"]').value,
            content: form.querySelector('textarea').value,
            tags: form.querySelector('input[placeholder="Tags"]').value.split(',').map(tag => tag.trim()),
            category: form.querySelector('select').value
        };
        
        this.memories.journals.push(newJournal);
        this.saveMemories();
        this.loadJournalList();
        this.closeModal('add-journal-modal');
        form.reset();
    }

    editPhoto(id) {
        const photo = this.memories.photos.find(p => p.id === id);
        if (photo) {
            // In a real app, you would populate and show an edit modal
            alert(`Edit photo: ${photo.title}\nThis would open an edit form in a full implementation.`);
        }
    }

    deletePhoto(id) {
        if (confirm('Are you sure you want to delete this photo?')) {
            this.memories.photos = this.memories.photos.filter(p => p.id !== id);
            this.saveMemories();
            this.loadPhotoList();
            this.loadDashboard();
            this.showNotification('Photo deleted successfully!', 'success');
        }
    }

    editVideo(id) {
        const video = this.memories.videos.find(v => v.id === id);
        if (video) {
            alert(`Edit video: ${video.title}\nThis would open an edit form in a full implementation.`);
        }
    }

    deleteVideo(id) {
        if (confirm('Are you sure you want to delete this video?')) {
            this.memories.videos = this.memories.videos.filter(v => v.id !== id);
            this.saveMemories();
            this.loadVideoList();
            this.loadDashboard();
            this.showNotification('Video deleted successfully!', 'success');
        }
    }

    editJournal(id) {
        const journal = this.memories.journals.find(j => j.id === id);
        if (journal) {
            alert(`Edit journal: ${journal.title}\nThis would open an edit form in a full implementation.`);
        }
    }

    deleteJournal(id) {
        if (confirm('Are you sure you want to delete this journal?')) {
            this.memories.journals = this.memories.journals.filter(j => j.id !== id);
            this.saveMemories();
            this.loadJournalList();
            this.loadDashboard();
            this.showNotification('Journal deleted successfully!', 'success');
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.memories, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'memory-gallery-backup.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Data exported successfully!', 'success');
    }

    backupData() {
        this.exportData();
    }

    restoreData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const restoredData = JSON.parse(event.target.result);
                    this.memories = restoredData;
                    this.saveMemories();
                    this.loadManagementLists();
                    this.loadDashboard();
                    this.showNotification('Data restored successfully!', 'success');
                } catch (error) {
                    this.showNotification('Error restoring data. Invalid file format.', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Modal functions
function showAddPhotoModal() {
    document.getElementById('add-photo-modal').style.display = 'block';
}

function showAddVideoModal() {
    document.getElementById('add-video-modal').style.display = 'block';
}

function showAddJournalModal() {
    document.getElementById('add-journal-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize admin panel
const admin = new MemoryAdmin();

// Make admin available globally for onclick handlers
window.admin = admin;
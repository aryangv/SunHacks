// Main page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    const fileInfo = document.getElementById('fileInfo');
    const loading = document.getElementById('loading');
    const success = document.getElementById('success');
    const error = document.getElementById('error');
    const fileName = document.getElementById('fileName');
    const notesCount = document.getElementById('notesCount');
    const flashcardsCount = document.getElementById('flashcardsCount');
    const errorMessage = document.getElementById('errorMessage');

    // File input change handler
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            uploadBox.style.display = 'none';
            fileInfo.style.display = 'block';
        }
    });

    // Drag and drop functionality
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = '#764ba2';
        uploadBox.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
    });

    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = '#667eea';
        uploadBox.style.backgroundColor = 'transparent';
    });

    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = '#667eea';
        uploadBox.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileName.textContent = files[0].name;
            uploadBox.style.display = 'none';
            fileInfo.style.display = 'block';
        }
    });

    // Process file function
    window.processFile = function() {
        const file = fileInput.files[0];
        if (!file) {
            showError('Please select a file first');
            return;
        }

        // Show loading state
        fileInfo.style.display = 'none';
        loading.style.display = 'block';
        error.style.display = 'none';
        success.style.display = 'none';

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Send request to backend
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            
            if (data.success) {
                notesCount.textContent = data.notes_count;
                flashcardsCount.textContent = data.flashcards_count;
                success.style.display = 'block';
            } else {
                showError(data.error || 'An error occurred while processing the file');
            }
        })
        .catch(err => {
            loading.style.display = 'none';
            showError('Network error: ' + err.message);
        });
    };

    // Reset upload function
    window.resetUpload = function() {
        fileInput.value = '';
        uploadBox.style.display = 'block';
        fileInfo.style.display = 'none';
        loading.style.display = 'none';
        success.style.display = 'none';
        error.style.display = 'none';
    };

    // Show error function
    function showError(message) {
        errorMessage.textContent = message;
        error.style.display = 'block';
    }

    // Add click handler to upload box
    uploadBox.addEventListener('click', function() {
        fileInput.click();
    });
});

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

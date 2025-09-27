// Flashcards page JavaScript
let currentCardIndex = 0;
let isFlipped = false;
let knownCards = new Set();
let autoFlipTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof flashcardsData === 'undefined' || !flashcardsData || flashcardsData.length === 0) {
        return;
    }
    
    const totalCards = flashcardsData.length;
    updateProgress();
    loadCard();
    
    // Make functions globally available
    window.nextCard = nextCard;
    window.previousCard = previousCard;
    window.flipCard = flipCard;
    window.shuffleCards = shuffleCards;
    window.toggleAutoFlip = toggleAutoFlip;
    window.toggleMarkKnown = toggleMarkKnown;
    window.toggleDarkMode = toggleDarkMode;
});

function loadCard() {
    if (flashcardsData.length === 0) return;
    
    const card = flashcardsData[currentCardIndex];
    const cardNumber = document.getElementById('cardNumber');
    const cardNumberBack = document.getElementById('cardNumberBack');
    const cardQuestion = document.getElementById('cardQuestion');
    const cardAnswer = document.getElementById('cardAnswer');
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    const flashcard = document.getElementById('flashcard');
    
    // Update card numbers
    cardNumber.textContent = currentCardIndex + 1;
    cardNumberBack.textContent = currentCardIndex + 1;
    
    // Update content
    cardQuestion.textContent = card.question;
    cardAnswer.textContent = card.answer;
    
    // Reset card state
    isFlipped = false;
    cardFront.style.display = 'flex';
    cardBack.style.display = 'none';
    flashcard.classList.remove('flipped');
    
    // Update button text
    const flipBtn = document.getElementById('flipBtn');
    flipBtn.textContent = 'Show Answer';
    
    // Update button states
    updateButtonStates();
    
    // Update progress
    updateProgress();
    
    // Check if card is known
    const markKnownCheckbox = document.getElementById('markKnown');
    markKnownCheckbox.checked = knownCards.has(currentCardIndex);
}

function flipCard() {
    const cardFront = document.getElementById('cardFront');
    const cardBack = document.getElementById('cardBack');
    const flashcard = document.getElementById('flashcard');
    const flipBtn = document.getElementById('flipBtn');
    
    if (!isFlipped) {
        // Show answer
        cardFront.style.display = 'none';
        cardBack.style.display = 'flex';
        flashcard.classList.add('flipped');
        flipBtn.textContent = 'Show Question';
        isFlipped = true;
        
        // Start auto-flip timer if enabled
        if (document.getElementById('autoFlip').checked) {
            startAutoFlipTimer();
        }
    } else {
        // Show question
        cardFront.style.display = 'flex';
        cardBack.style.display = 'none';
        flashcard.classList.remove('flipped');
        flipBtn.textContent = 'Show Answer';
        isFlipped = false;
        
        // Clear auto-flip timer
        clearAutoFlipTimer();
    }
}

function nextCard() {
    if (currentCardIndex < flashcardsData.length - 1) {
        currentCardIndex++;
        loadCard();
    }
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        loadCard();
    }
}

function shuffleCards() {
    // Fisher-Yates shuffle algorithm
    for (let i = flashcardsData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcardsData[i], flashcardsData[j]] = [flashcardsData[j], flashcardsData[i]];
    }
    
    // Reset to first card
    currentCardIndex = 0;
    loadCard();
    
    // Show shuffle notification
    showNotification('Cards shuffled!', 'success');
}

function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex === flashcardsData.length - 1;
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const totalCards = document.getElementById('totalCards');
    const knownCardsElement = document.getElementById('knownCards');
    const remainingCards = document.getElementById('remainingCards');
    
    const progress = ((currentCardIndex + 1) / flashcardsData.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `${currentCardIndex + 1} / ${flashcardsData.length}`;
    
    totalCards.textContent = flashcardsData.length;
    knownCardsElement.textContent = knownCards.size;
    remainingCards.textContent = flashcardsData.length - knownCards.size;
}

function toggleAutoFlip() {
    const autoFlipCheckbox = document.getElementById('autoFlip');
    
    if (autoFlipCheckbox.checked && isFlipped) {
        startAutoFlipTimer();
    } else {
        clearAutoFlipTimer();
    }
}

function startAutoFlipTimer() {
    clearAutoFlipTimer();
    autoFlipTimer = setTimeout(() => {
        if (isFlipped) {
            nextCard();
        }
    }, 3000);
}

function clearAutoFlipTimer() {
    if (autoFlipTimer) {
        clearTimeout(autoFlipTimer);
        autoFlipTimer = null;
    }
}

function toggleMarkKnown() {
    const markKnownCheckbox = document.getElementById('markKnown');
    
    if (markKnownCheckbox.checked) {
        knownCards.add(currentCardIndex);
    } else {
        knownCards.delete(currentCardIndex);
    }
    
    updateProgress();
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(45deg, #dc3545, #c82333)';
    } else {
        notification.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (typeof flashcardsData === 'undefined' || !flashcardsData || flashcardsData.length === 0) {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousCard();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextCard();
            break;
        case ' ':
            e.preventDefault();
            flipCard();
            break;
        case 'Enter':
            e.preventDefault();
            flipCard();
            break;
        case 's':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                shuffleCards();
            }
            break;
    }
});

// Add keyboard shortcuts info
document.addEventListener('DOMContentLoaded', function() {
    if (typeof flashcardsData !== 'undefined' && flashcardsData && flashcardsData.length > 0) {
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.innerHTML = `
            <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; font-size: 0.8rem; z-index: 1000;">
                <strong>Keyboard Shortcuts:</strong><br>
                ← → Navigate | Space/Enter Flip | Ctrl+S Shuffle
            </div>
        `;
        document.body.appendChild(shortcutsInfo);
        
        // Hide after 5 seconds
        setTimeout(() => {
            shortcutsInfo.style.opacity = '0';
            setTimeout(() => shortcutsInfo.remove(), 500);
        }, 5000);
    }
});

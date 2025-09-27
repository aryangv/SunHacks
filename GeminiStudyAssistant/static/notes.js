// Notes page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const notesContent = document.getElementById('notesContent');
    const tableOfContents = document.getElementById('tableOfContents');
    
    // Generate table of contents
    generateTableOfContents();
    
    // Search functionality
    function searchNotes() {
        const searchTerm = searchInput.value.toLowerCase();
        const notesText = document.getElementById('notesText');
        
        if (!notesText) return;
        
        if (searchTerm === '') {
            // Remove all highlights
            removeHighlights();
            return;
        }
        
        // Remove previous highlights
        removeHighlights();
        
        // Highlight search terms in the rendered markdown
        const walker = document.createTreeWalker(
            notesText,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
                const wrapper = document.createElement('div');
                wrapper.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(wrapper.firstChild, textNode);
            }
        });
    }
    
    function removeHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }
    
    // Generate table of contents
    function generateTableOfContents() {
        const notesText = document.getElementById('notesText');
        if (!notesText) return;
        
        const headings = notesText.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const toc = document.getElementById('tableOfContents');
        
        if (headings.length === 0) {
            toc.innerHTML = '<p>No headings found</p>';
            return;
        }
        
        let tocHTML = '';
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const level = parseInt(heading.tagName.charAt(1));
            const indent = (level - 1) * 20;
            
            tocHTML += `
                <a href="#${id}" class="toc-item" style="padding-left: ${indent}px">
                    ${heading.textContent}
                </a>
            `;
        });
        
        toc.innerHTML = tocHTML;
        
        // Add click handlers for smooth scrolling
        const tocItems = toc.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    updateActiveTocItem(this);
                }
            });
        });
    }
    
    function updateActiveTocItem(activeItem) {
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }
    
    // View mode functions
    function setView(mode) {
        const notesContent = document.getElementById('notesContent');
        const readableBtn = document.getElementById('readableView');
        const compactBtn = document.getElementById('compactView');
        
        // Remove existing view classes
        notesContent.classList.remove('readable', 'compact');
        
        // Add new view class
        notesContent.classList.add(mode);
        
        // Update button states
        readableBtn.classList.toggle('active', mode === 'readable');
        compactBtn.classList.toggle('active', mode === 'compact');
        
        // Save preference
        localStorage.setItem('notesViewMode', mode);
    }
    
    // Load saved view mode
    const savedViewMode = localStorage.getItem('notesViewMode') || 'readable';
    setView(savedViewMode);
    
    // Quick action functions
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function scrollToBottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
    
    function highlightKeywords() {
        const notesText = document.getElementById('notesText');
        if (!notesText) return;
        
        // Common keywords to highlight
        const keywords = [
            'important', 'key', 'main', 'primary', 'essential', 'critical',
            'note', 'remember', 'warning', 'caution', 'tip', 'example'
        ];
        
        const text = notesText.innerHTML;
        let highlightedText = text;
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        notesText.innerHTML = highlightedText;
    }
    
    function exportNotes() {
        const notesText = document.getElementById('notesText');
        if (!notesText) return;
        
        const content = notesText.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'study-notes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function printNotes() {
        window.print();
    }
    
    // Dark mode toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }
    
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Make functions globally available
    window.searchNotes = searchNotes;
    window.setView = setView;
    window.scrollToTop = scrollToTop;
    window.scrollToBottom = scrollToBottom;
    window.highlightKeywords = highlightKeywords;
    window.exportNotes = exportNotes;
    window.printNotes = printNotes;
    window.toggleDarkMode = toggleDarkMode;
    
    // Add scroll listener for TOC highlighting
    window.addEventListener('scroll', function() {
        const notesText = document.getElementById('notesText');
        if (!notesText) return;
        
        const headings = notesText.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let current = '';
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                current = heading.id;
            }
        });
        
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === '#' + current);
        });
    });
});

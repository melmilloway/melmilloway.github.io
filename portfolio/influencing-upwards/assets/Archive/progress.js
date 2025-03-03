
class ProgressMeter {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.progressBar = this.container.querySelector('.progress-fill');
        this.percentageText = this.container.querySelector('.percentage');
        this.pageInfo = this.container.querySelector('.page-info');
        
        this.currentPage = 1;
        this.totalPages = 1;
    }

    calculatePercentage(page, total) {
        return Math.round((page / total) * 100) || 0;
    }

    setProgress(page, total, startFromPercentage) {
        if (page >= 1 && page <= total) {
            this.currentPage = page;
            this.totalPages = total;
            
            const percentage = this.calculatePercentage(page, total);
            
            // Set initial state
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = `${startFromPercentage}%`;
            this.percentageText.textContent = `${startFromPercentage}%`;
            
            // Force reflow
            this.progressBar.offsetWidth;
            
            // Start animation
            requestAnimationFrame(() => {
                this.progressBar.style.transition = 'width 0.8s ease-in-out';
                this.progressBar.style.width = `${percentage}%`;
                this.percentageText.textContent = `${percentage}%`;
            });
            
            // Update page info
            this.pageInfo.textContent = `Page ${page} of ${total}`;
            this.pageInfo.textContent = `Page ${page} of ${total}`;
        }
    }
}

// Make it available globally
window.ProgressMeter = ProgressMeter;

class ProgressMeter {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.progressBar = this.container.querySelector('.progress-fill');
        this.percentageText = this.container.querySelector('.percentage');
        this.pageInfo = this.container.querySelector('.page-info');

        this.currentPage = 1;
        this.totalPages = 1;
        this.startPercentage = 0;

        // Reset progress when page becomes visible
        this.finalPercentage = 0;
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.progressBar.style.transition = 'none';
                this.progressBar.style.width = `${this.finalPercentage}%`;
                this.percentageText.textContent = `${this.finalPercentage}%`;
            }
        });
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

            // Start animation with delay
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.progressBar.style.transition = 'width 0.8s ease-in-out';
                    this.progressBar.style.width = `${percentage}%`;
                    this.percentageText.textContent = `${percentage}%`;
                    this.finalPercentage = percentage;
                });
            }, 300); // 300ms delay before animation starts

            // Update page info
            this.pageInfo.textContent = `Page ${page} of ${total}`;
            this.pageInfo.textContent = `Page ${page} of ${total}`;
        }
    }

    setStartPercentage(percentage) {
        this.startPercentage = percentage;
    }
}

// Make it available globally
window.ProgressMeter = ProgressMeter;
const statements = document.querySelectorAll('.statement');
const dropAreas = document.querySelectorAll('.drop-area');
const feedback = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedback-message');
const closeFeedback = document.getElementById('close-feedback');
const liveRegion = document.getElementById('live-region'); // A hidden live region for announcements
const scoreDisplay = document.getElementById('score'); // Element to display the score
const completionMessage = document.getElementById('completion-message'); // Completion message element

let currentSelectedStatement = null; // Track the currently selected statement
let score = 0; // Initialize score
let attempts = 0; // Count of attempts
const totalStatements = statements.length; // Total number of statements

// Function to update and display score
function updateScore() {
    score++;
    const totalStars = 8; // Total number of stars
    const stars = '⭐'.repeat(score); // Current score stars
    const emptyStars = '☆'.repeat(totalStars - score); // Empty stars
    scoreDisplay.innerText = `${stars}${emptyStars}`; // Update the score display without numbers
}

// Add event listeners to each statement
statements.forEach(statement => {
    statement.addEventListener('dragstart', dragStart);
    statement.addEventListener('dragend', dragEnd);
    statement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleDrag(statement);
        }
    });
});

// Add drop event listeners to each drop area
dropAreas.forEach(dropArea => {
    dropArea.addEventListener('dragover', dragOver);
    dropArea.addEventListener('drop', drop);
    dropArea.tabIndex = 0; // Make drop areas focusable
    dropArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const statementText = currentSelectedStatement.innerText; // Get the currently selected statement text
            const dropAreaId = dropArea.id; // Get the drop area ID

            // Create a DataTransfer object and set the data for the drop event
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/plain', statementText);

            // Programmatically simulate a drop
            dropArea.dispatchEvent(new DragEvent('drop', { dataTransfer }));
        }
    });
});

// Drag start event
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.innerText);
    e.target.classList.add('dragging');
    e.target.setAttribute('aria-grabbed', 'true');
}

// Drag end event
function dragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.setAttribute('aria-grabbed', 'false');
}

// Handle the drag action (for keyboard users)
function handleDrag(statement) {
    if (currentSelectedStatement) {
        currentSelectedStatement.classList.remove('selected'); // Remove selected state from the previous statement
        currentSelectedStatement.setAttribute('aria-selected', 'false'); // Update ARIA state
    }
    currentSelectedStatement = statement; // Set the current statement as selected
    currentSelectedStatement.classList.add('selected'); // Add selected state
    currentSelectedStatement.setAttribute('aria-selected', 'true'); // Update ARIA state

    // Announce the selection to the screenreader using a live region
    announceToScreenReader(`Statement selected: ${statement.innerText}`);

    // Highlight the currently selected statement
    statement.focus(); // Focus on the currently selected statement
}

// Allow dropping
function dragOver(e) {
    e.preventDefault(); // Prevent default to allow drop
    e.target.setAttribute('aria-dropeffect', 'copy');
}

// Drop event
function drop(e) {
    e.preventDefault();
    const statementText = e.dataTransfer.getData('text/plain');
    const dropAreaId = e.target.id;

    const statementElement = Array.from(statements).find(card => card.innerText === statementText);
    if (!statementElement) return; // Return if statement not found

    const statementFeedback = statementElement.getAttribute('data-feedback');
    const isCorrect = (dropAreaId === 'misconceptions' && statementFeedback.startsWith('Misconception:')) ||
                      (dropAreaId === 'facts' && statementFeedback.startsWith('Fact:'));

    // Update score if the drop is correct
    if (isCorrect) {
        updateScore(); // Increment score for correct drop
    }

    // Show feedback dialog
    showFeedback(statementElement, isCorrect, statementFeedback);
    
    // Increment attempts count
    attempts++; 

    // Check for completion (if all statements have been attempted)
    if (attempts === totalStatements) {
        showCompletionMessage(); // Show completion message
        hideDropZones(); // Call to hide drop zones after completion
    }
}

// Function to display feedback
function showFeedback(statementElement, isCorrect, statementFeedback) {
    const feedbackText = `${isCorrect ? 'Correct!' : 'Incorrect!'} ${statementFeedback}`; // No <strong> tags
    feedbackMessage.innerHTML = feedbackText;

    feedback.style.display = 'block';
    feedback.setAttribute('aria-live', 'assertive');
    feedback.setAttribute('aria-hidden', 'false'); // Update ARIA property

    // Announce feedback message to the screenreader
    announceToScreenReader(feedbackText);

    // Set a timeout to ensure focus goes to feedbackMessage after the drop
    setTimeout(() => {
        feedbackMessage.focus(); // Focus on the feedback message, so the user can read it first
    }, 0); // Ensure it's after the drop event has completed

    statementElement.classList.add('fade-out'); // Fade out effect
    setTimeout(() => {
        statementElement.style.display = 'none'; // Hide after fading
        statementElement.classList.remove('selected'); // Clear selected state after dropping
        currentSelectedStatement = null; // Reset the selected statement
    }, 500);
}

// Function to hide drop zones
function hideDropZones() {
    dropAreas.forEach(dropArea => {
        dropArea.style.display = 'none'; // Hide the drop zones
    });
}

// Function to show completion message
function showCompletionMessage() {
    completionMessage.style.display = 'block'; // Show completion message

    const replayButton = document.getElementById('replay-button');
    replayButton.addEventListener('click', replayActivity); // Add event listener for replay
}

// Function to replay the activity
function replayActivity() {
    score = 0; // Reset score
    attempts = 0; // Reset attempts
    scoreDisplay.innerText = '☆'.repeat(8); // Reset score display
    completionMessage.style.display = 'none'; // Hide completion message

    // Reset each statement for replay
    statements.forEach(statement => {
        statement.style.display = 'block'; // Ensure all statements are visible
        statement.classList.remove('fade-out'); // Remove fade-out effect
        statement.style.opacity = '1'; // Reset opacity to 1 if you used it for fading
        // If you had any other transitions, reset them here
    });

    showDropZones(); // Show drop zones again when replaying
}


// Function to show drop zones again when replaying
function showDropZones() {
    dropAreas.forEach(dropArea => {
        dropArea.style.display = 'block'; // Show the drop zones
    });
}

// Close feedback dialog
const closeFeedbackHandler = () => {
    feedback.style.display = 'none';
    feedback.setAttribute('aria-hidden', 'true');

    // Set focus back to the last interacted statement or the first one if none are selected
    const nextStatement = currentSelectedStatement ? currentSelectedStatement : statements[0];
    nextStatement.focus();
};

closeFeedback.addEventListener('click', closeFeedbackHandler);

// Allow closing feedback dialog using keyboard
closeFeedback.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        closeFeedbackHandler();
    }
});

// Function to announce messages to screen readers
function announceToScreenReader(message) {
    liveRegion.innerText = message;
}

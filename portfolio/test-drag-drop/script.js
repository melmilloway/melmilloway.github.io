// ... (previous code remains unchanged)

// Define the statements and their feedback
const quizData = [
    {
        text: "Some fact",
        type: "fact",
        feedback: "Right: This is indeed a fact."
    },
    {
        text: "This misconceptions",
        type: "misconception",
        feedback: "Right: This is a common misconception."
    }
];

// Create and append statement elements
const statementContainer = document.querySelector('.statement-container');
quizData.forEach((item, index) => {
    const statement = document.createElement('div');
    statement.className = 'statement';
    statement.draggable = true;
    statement.textContent = item.text;
    statement.setAttribute('data-feedback', item.feedback);
    statement.id = `statement-${index}`;
    statementContainer.appendChild(statement);
});

// Update the statements NodeList after dynamically creating elements
const statements = document.querySelectorAll('.statement');

// ... (rest of the code remains largely unchanged)

// Update the drop function to use the new feedback structure
function drop(e) {
    e.preventDefault();
    const statementText = e.dataTransfer.getData('text/plain');
    const dropAreaId = e.target.id;

    const statementElement = Array.from(statements).find(card => card.innerText === statementText);
    if (!statementElement) return; // Return if statement not found

    const statementData = quizData.find(item => item.text === statementText);
    const isCorrect = (dropAreaId === 'misconceptions' && statementData.type === 'misconception') ||
                      (dropAreaId === 'facts' && statementData.type === 'fact');

    // Update score if the drop is correct
    if (isCorrect) {
        updateScore(); // Increment score for correct drop
    }

    // Show feedback dialog
    showFeedback(statementElement, isCorrect, statementData.feedback);
    
    // Increment attempts count
    attempts++; 

    // Check for completion (if all statements have been attempted)
    if (attempts === totalStatements) {
        showCompletionMessage(); // Show completion message
        hideDropZones(); // Call to hide drop zones after completion
    }
}

// Update the showFeedback function to use the new feedback structure
function showFeedback(statementElement, isCorrect, feedback) {
    const feedbackText = `${isCorrect ? 'Correct!' : 'Incorrect!'} ${feedback}`;
    feedbackMessage.innerHTML = feedbackText;

    feedback.style.display = 'block';
    feedback.setAttribute('aria-live', 'assertive');
    feedback.setAttribute('aria-hidden', 'false');

    announceToScreenReader(feedbackText);

    setTimeout(() => {
        feedbackMessage.focus();
    }, 0);

    statementElement.classList.add('fade-out');
    setTimeout(() => {
        statementElement.style.display = 'none';
        statementElement.classList.remove('selected');
        currentSelectedStatement = null;
    }, 500);
}

// ... (rest of the code remains unchanged)
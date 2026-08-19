const goalInput = document.getElementById('goalInput');
const styleSelect = document.getElementById('styleSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const errorText = document.getElementById('errorText');

const styleInstructions = {
    detailed: 'Make the prompt detailed and specific, including relevant context and constraints.',
    stepbystep: 'Structure the prompt so it asks the AI to work through the task step by step.',
    short: 'Keep the prompt short, simple, and to the point.',
    persona: 'Have the prompt open by assigning the AI a specific role or persona suited to this task.'
};

function buildPrompt(goal, style) {
    return `Write a single, ready-to-use AI prompt that someone could copy and paste into any AI chat tool to accomplish this goal: ${goal}

${styleInstructions[style]}

Respond with ONLY the finished prompt text itself, written as if it will be pasted directly into an AI chat — no labels, no explanation of what you wrote.`;
}

async function generatePrompt(goal, style) {
    const prompt = buildPrompt(goal, style);

    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: prompt
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data.reply;
}

generateBtn.addEventListener('click', async () => {
    const goal = goalInput.value.trim();
    const style = styleSelect.value;

    errorText.hidden = true;
    resultSection.hidden = true;

    if (!goal) {
        errorText.textContent = 'Please enter what you want the AI to help you do.';
        errorText.hidden = false;
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
        const result = await generatePrompt(goal, style);

        resultText.textContent = result;
        resultSection.hidden = false;
    } catch (error) {
        errorText.textContent = error.message;
        errorText.hidden = false;
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate prompt';
    }
});

copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(resultText.textContent);
    copyBtn.textContent = 'Copied!';

    setTimeout(() => {
        copyBtn.textContent = 'Copy';
    }, 1500);
});
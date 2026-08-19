const form = document.getElementById('studyForm');
const notesInput = document.getElementById('notesInput');
const taskSelect = document.getElementById('taskSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const errorText = document.getElementById('errorText');

const taskInstructions = {
  summarize: 'Summarize the key points clearly and concisely, using bullet points for the main ideas.',
  quiz: 'Create 8-10 quiz questions (mix of short answer and multiple choice) to test understanding of this material. Include an answer key at the end.',
  explain: 'Explain this material in much simpler terms, as if teaching a beginner. Use plain language and short sentences.',
  flashcards: 'Turn this material into flashcards in a "Q:" / "A:" format, one per concept, covering all the key ideas.'
};

function buildPrompt(notes, task) {
  return `${taskInstructions[task]}

Study material:
${notes}`;
}

async function generateStudyHelp(notes, task, apiKey) {
  const prompt = buildPrompt(notes, task);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1536,
      system: 'You are a helpful study assistant. Respond with ONLY the requested study material — no preamble or explanation.',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Something went wrong calling the API.');
  }

  return data.content[0].text;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const notes = notesInput.value.trim();
  const task = taskSelect.value;
  const apiKey = apiKeyInput.value.trim();

  errorText.hidden = true;

  if (!apiKey) {
    errorText.textContent = 'Please enter your API key above first.';
    errorText.hidden = false;
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const result = await generateStudyHelp(notes, task, apiKey);
    resultText.textContent = result;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate';
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
});

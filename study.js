const form = document.getElementById('studyForm');
const notesInput = document.getElementById('notesInput');
const taskSelect = document.getElementById('taskSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
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
${notes}

Respond with ONLY the requested study material — no preamble or explanation.`;
}

async function generateStudyHelp(notes, task) {
  const prompt = buildPrompt(notes, task);

  const response = await fetch('https://my-ai-toolkit.onrender.com/api/chat', {
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
    throw new Error(data.error || 'Something went wrong calling the AI.');
  }

  return data.reply;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const notes = notesInput.value.trim();
  const task = taskSelect.value;

  errorText.hidden = true;

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const result = await generateStudyHelp(notes, task);

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

  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

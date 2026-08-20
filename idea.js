const form = document.getElementById('ideaForm');
const topicInput = document.getElementById('topicInput');
const contextInput = document.getElementById('contextInput');
const countSelect = document.getElementById('countSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const errorText = document.getElementById('errorText');

function buildPrompt(topic, context, count) {
  const contextLine = context
    ? `Constraints/context to keep in mind: ${context}.`
    : '';

  return `Generate ${count} distinct, creative ideas for: ${topic}.
${contextLine}

Present them as a numbered list. Keep each idea to one or two sentences.

Respond with ONLY the numbered list of ideas — no preamble or explanation.`;
}

async function generateIdeas(topic, context, count) {
  const prompt = buildPrompt(topic, context, count);

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

  const topic = topicInput.value.trim();
  const context = contextInput.value.trim();
  const count = countSelect.value;

  errorText.hidden = true;

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const ideas = await generateIdeas(topic, context, count);

    resultText.textContent = ideas;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate ideas';
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);

  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

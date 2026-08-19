const form = document.getElementById('ideaForm');
const topicInput = document.getElementById('topicInput');
const contextInput = document.getElementById('contextInput');
const countSelect = document.getElementById('countSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const errorText = document.getElementById('errorText');

function buildPrompt(topic, context, count) {
  const contextLine = context
    ? `Constraints/context to keep in mind: ${context}.`
    : '';

  return `Generate ${count} distinct, creative ideas for: ${topic}.
${contextLine}

Present them as a numbered list. Keep each idea to one or two sentences.`;
}

async function generateIdeas(topic, context, count, apiKey) {
  const prompt = buildPrompt(topic, context, count);

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
      max_tokens: 1024,
      system: 'You are a creative brainstorming assistant. Respond with ONLY the numbered list of ideas — no preamble or explanation.',
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

  const topic = topicInput.value.trim();
  const context = contextInput.value.trim();
  const count = countSelect.value;
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
    const ideas = await generateIdeas(topic, context, count, apiKey);
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
  setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
});

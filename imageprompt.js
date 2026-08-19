const form = document.getElementById('imagePromptForm');
const subjectInput = document.getElementById('subjectInput');
const styleSelect = document.getElementById('styleSelect');
const detailsInput = document.getElementById('detailsInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const errorText = document.getElementById('errorText');

function buildPrompt(subject, style, details) {
  const detailsLine = details
    ? `Additional details to include: ${details}.`
    : '';

  return `Write a single, detailed image-generation prompt (suitable for tools like Midjourney, DALL-E, or similar AI image generators) for this image: ${subject}

Art style: ${style}.
${detailsLine}

Include specific visual descriptors — composition, lighting, color palette, and mood — so the prompt produces a vivid, well-defined image. Respond with ONLY the finished prompt text, no explanation or labels.`;
}

async function generateImagePrompt(subject, style, details, apiKey) {
  const prompt = buildPrompt(subject, style, details);

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
      max_tokens: 800,
      system: 'You are an expert at writing vivid, detailed prompts for AI image generators. Respond with ONLY the finished prompt — no preamble or explanation.',
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

  const subject = subjectInput.value.trim();
  const style = styleSelect.value;
  const details = detailsInput.value.trim();
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
    const result = await generateImagePrompt(subject, style, details, apiKey);
    resultText.textContent = result;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate image prompt';
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
});

// ============================================
// Grab references to every element we'll need
// ============================================
const form = document.getElementById('emailForm');
const contextInput = document.getElementById('contextInput');
const recipientInput = document.getElementById('recipientInput');
const toneSelect = document.getElementById('toneSelect');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const errorText = document.getElementById('errorText');

// ============================================
// Build the prompt from THREE separate inputs
//
// This is the new idea in this tool: instead of sending
// one block of text (like the Rewriter did), we assemble
// a clear instruction out of several smaller pieces of
// user input. Claude only ever sees this final combined
// string — it has no idea it came from three form fields.
// ============================================
function buildPrompt(context, recipient, tone) {
  const recipientLine = recipient
    ? `The recipient is: ${recipient}.`
    : '';

  return `Write an email with a ${tone} tone.
${recipientLine}
Here is what the email needs to say:
${context}

Write only the email itself, including a subject line, with no extra commentary before or after it.`;
}

// ============================================
// Real AI call — same shape as rewriteWithAI() in the
// Rewriter tool, just with a different prompt inside.
// ============================================
async function generateEmail(context, recipient, tone, apiKey) {
  const prompt = buildPrompt(context, recipient, tone);

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
      system: 'You write clear, well-structured emails exactly as instructed. Respond with ONLY the email itself — a subject line followed by the body — no preamble or explanation.',
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Something went wrong calling the API.');
  }

  return data.content[0].text;
}

// ============================================
// Handle the form submission — identical pattern to
// the Rewriter tool: prevent reload, validate the key,
// show loading state, call the API, handle success/failure.
// ============================================
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const context = contextInput.value;
  const recipient = recipientInput.value.trim();
  const tone = toneSelect.value;
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
    const email = await generateEmail(context, recipient, tone, apiKey);
    resultText.textContent = email;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate email';
  }
});

// ============================================
// Handle the "Copy" button — identical to the Rewriter tool
// ============================================
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

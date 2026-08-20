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
const errorText = document.getElementById('errorText');

// ============================================
// Build the prompt from the form inputs
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
// Send the request to our Render backend
// ============================================
async function generateEmail(context, recipient, tone) {
  const prompt = buildPrompt(context, recipient, tone);

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

// ============================================
// Handle the form submission
// ============================================
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const context = contextInput.value;
  const recipient = recipientInput.value.trim();
  const tone = toneSelect.value;

  errorText.hidden = true;

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const email = await generateEmail(context, recipient, tone);

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
// Handle the "Copy" button
// ============================================
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);

  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

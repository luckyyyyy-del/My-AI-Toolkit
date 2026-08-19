// ============================================
// Grab references to every element we'll need
// ============================================
const form = document.getElementById('rewriterForm');
const inputText = document.getElementById('inputText');
const styleSelect = document.getElementById('styleSelect');
const rewriteBtn = document.getElementById('rewriteBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const errorText = document.getElementById('errorText');

// ============================================
// Send the request to our Render backend
// ============================================
async function rewriteWithAI(text, style) {
  const styleInstructions = {
    formal: 'Rewrite this text in a formal, professional tone.',
    casual: 'Rewrite this text in a relaxed, casual, conversational tone.',
    shorter: 'Rewrite this text to be significantly shorter, keeping only the key point(s).',
    simpler: 'Rewrite this text using simpler words and shorter sentences, as if explaining to a beginner.'
  };

  const message = `${styleInstructions[style]}

Text:
${text}

Respond with ONLY the rewritten text — no preamble, no explanation, no quotation marks around it.`;

  const response = await fetch('https://my-ai-toolkit.onrender.com/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message
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

  const text = inputText.value;
  const style = styleSelect.value;

  errorText.hidden = true;

  // Show loading state
  rewriteBtn.disabled = true;
  rewriteBtn.textContent = 'Rewriting...';

  try {
    const rewritten = await rewriteWithAI(text, style);

    resultText.textContent = rewritten;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    rewriteBtn.disabled = false;
    rewriteBtn.textContent = 'Rewrite text';
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

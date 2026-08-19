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
const apiKeyInput = document.getElementById('apiKeyInput');
const errorText = document.getElementById('errorText');

// ============================================
// Real AI call
//
// This sends the text to Claude (Anthropic's AI model) and
// returns the rewritten version. It replaces the placeholder
// function from the previous step — notice everything else
// on the page (the button, loading state, result box) didn't
// need to change at all.
// ============================================
async function rewriteWithAI(text, style, apiKey) {
  const styleInstructions = {
    formal: 'Rewrite this text in a formal, professional tone.',
    casual: 'Rewrite this text in a relaxed, casual, conversational tone.',
    shorter: 'Rewrite this text to be significantly shorter, keeping only the key point(s).',
    simpler: 'Rewrite this text using simpler words and shorter sentences, as if explaining to a beginner.'
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // Required for calling the API directly from browser JavaScript,
      // instead of from a server. See the note in our chat about why
      // this pattern is only recommended for personal/local use.
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: 'You rewrite text exactly as instructed. Respond with ONLY the rewritten text — no preamble, no explanation, no quotation marks around it.',
      messages: [
        {
          role: 'user',
          content: `${styleInstructions[style]}\n\nText:\n${text}`
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    // The API sends a helpful message describing what went wrong
    // (e.g. an invalid key, or no credits left on the account).
    throw new Error(data.error?.message || 'Something went wrong calling the API.');
  }

  return data.content[0].text;
}

// ============================================
// Handle the form submission
// ============================================
form.addEventListener('submit', async (event) => {
  // Forms normally reload the page on submit — we don't want that,
  // since we're handling everything with JavaScript instead.
  event.preventDefault();

  const text = inputText.value;
  const style = styleSelect.value;
  const apiKey = apiKeyInput.value.trim();

  errorText.hidden = true;

  if (!apiKey) {
    errorText.textContent = 'Please enter your API key above first.';
    errorText.hidden = false;
    return;
  }

  // Show a loading state and prevent double-clicks
  rewriteBtn.disabled = true;
  rewriteBtn.textContent = 'Rewriting...';

  try {
    const rewritten = await rewriteWithAI(text, style, apiKey);
    resultText.textContent = rewritten;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    // This runs whether it succeeded or failed —
    // the button always gets reset back to normal.
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

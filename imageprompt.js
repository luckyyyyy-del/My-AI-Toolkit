const form = document.getElementById('imagePromptForm');
const subjectInput = document.getElementById('subjectInput');
const styleSelect = document.getElementById('styleSelect');
const detailsInput = document.getElementById('detailsInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const errorText = document.getElementById('errorText');

function buildPrompt(subject, style, details) {
  const detailsLine = details
    ? `Additional details to include: ${details}.`
    : '';

  return `Write a single, detailed image-generation prompt suitable for tools like Midjourney, DALL-E, or similar AI image generators.

Image description:
${subject}

Art style:
${style}

${detailsLine}

Include specific visual descriptors such as composition, lighting, color palette, camera angle, and mood so the prompt produces a vivid, well-defined image.

Respond with ONLY the finished prompt text. No explanation or labels.`;
}

async function generateImagePrompt(subject, style, details) {
  const prompt = buildPrompt(subject, style, details);

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

  const subject = subjectInput.value.trim();
  const style = styleSelect.value;
  const details = detailsInput.value.trim();

  errorText.hidden = true;
  resultSection.hidden = true;

  if (!subject) {
    errorText.textContent = 'Please describe the image you want.';
    errorText.hidden = false;
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const result = await generateImagePrompt(subject, style, details);

    resultText.textContent = result;
    resultSection.hidden = false;
  } catch (error) {
    errorText.textContent = error.message;
    errorText.hidden = false;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate image prompt';
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);

  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

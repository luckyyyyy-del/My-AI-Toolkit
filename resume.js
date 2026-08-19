// ============================================
// Grab references to every element we'll need
// ============================================
const form = document.getElementById('resumeForm');
const jobTitleInput = document.getElementById('jobTitleInput');
const experienceInput = document.getElementById('experienceInput');
const skillsInput = document.getElementById('skillsInput');
const educationInput = document.getElementById('educationInput');
const jobDescriptionInput = document.getElementById('jobDescriptionInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const errorText = document.getElementById('errorText');

// ============================================
// Build the prompt from FIVE separate inputs.
//
// Same idea as the Email Generator's buildPrompt() —
// just more pieces glued into one instruction. Notice
// we also explicitly ask for ATS-friendly formatting
// here, since Claude needs to be told what that means
// in practice (plain text, standard section headings,
// no tables/columns).
// ============================================
function buildPrompt(jobTitle, experience, skills, education, jobDescription) {
  return `Create a professional, ATS-friendly resume for someone applying to this job title: ${jobTitle}.

Work experience:
${experience}

Skills:
${skills}

Education:
${education}

Here is the job description to tailor the resume toward (match relevant keywords naturally, do not force them in):
${jobDescription}

Formatting requirements for ATS (Applicant Tracking System) compatibility:
- Use plain text only — no tables, columns, or graphics
- Use standard section headings (e.g. "Experience", "Skills", "Education")
- Use simple bullet points for experience details
- Keep formatting clean and consistent

Write only the finished resume, with no extra commentary before or after it.`;
}

// ============================================
// Real AI call — same shape as the other two tools.
// The one difference: max_tokens is raised from 1024
// to 2048, since a full resume is much longer than a
// rewritten sentence or a short email. Without this,
// Claude's response could get cut off partway through.
// ============================================
async function generateResume(jobTitle, experience, skills, education, jobDescription, apiKey) {
  const prompt = buildPrompt(jobTitle, experience, skills, education, jobDescription);

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
      max_tokens: 2048,
      system: 'You are a professional resume writer. You write clean, ATS-friendly resumes using plain formatting and strong, specific bullet points. Respond with ONLY the finished resume — no preamble or explanation.',
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
// the previous two tools.
// ============================================
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const jobTitle = jobTitleInput.value.trim();
  const experience = experienceInput.value.trim();
  const skills = skillsInput.value.trim();
  const education = educationInput.value.trim();
  const jobDescription = jobDescriptionInput.value.trim();
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
    const resume = await generateResume(jobTitle, experience, skills, education, jobDescription, apiKey);
    resultText.textContent = resume;
    resultSection.hidden = false;
  } catch (err) {
    errorText.textContent = err.message;
    errorText.hidden = false;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate resume';
  }
});

// ============================================
// Handle the "Copy" button — identical to the other tools
// ============================================
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

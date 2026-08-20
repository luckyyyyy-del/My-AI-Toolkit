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
const errorText = document.getElementById('errorText');

// ============================================
// Build the resume prompt
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
// Send the request to our Render backend
// ============================================
async function generateResume(jobTitle, experience, skills, education, jobDescription) {
  const prompt = buildPrompt(
    jobTitle,
    experience,
    skills,
    education,
    jobDescription
  );

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

  const jobTitle = jobTitleInput.value.trim();
  const experience = experienceInput.value.trim();
  const skills = skillsInput.value.trim();
  const education = educationInput.value.trim();
  const jobDescription = jobDescriptionInput.value.trim();

  errorText.hidden = true;

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const resume = await generateResume(
      jobTitle,
      experience,
      skills,
      education,
      jobDescription
    );

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
// Handle the "Copy" button
// ============================================
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);

  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});// ============================================
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
const errorText = document.getElementById('errorText');

// ============================================
// Build the resume prompt
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
// Send the request to our Render backend
// ============================================
async function generateResume(jobTitle, experience, skills, education, jobDescription) {
  const prompt = buildPrompt(
    jobTitle,
    experience,
    skills,
    education,
    jobDescription
  );

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

  const jobTitle = jobTitleInput.value.trim();
  const experience = experienceInput.value.trim();
  const skills = skillsInput.value.trim();
  const education = educationInput.value.trim();
  const jobDescription = jobDescriptionInput.value.trim();

  errorText.hidden = true;

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const resume = await generateResume(
      jobTitle,
      experience,
      skills,
      education,
      jobDescription
    );

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
// Handle the "Copy" button
// ============================================
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.textContent);

  copyBtn.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.textContent = 'Copy';
  }, 1500);
});

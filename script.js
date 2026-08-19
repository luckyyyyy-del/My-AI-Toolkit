// Grab references to the two elements we need:
// the hamburger button, and the menu it controls.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// When the button is clicked, toggle the "is-open" class
// on the menu. CSS then decides what "is-open" looks like
// (see .nav__links.is-open in style.css).
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');

  // Also update aria-expanded, so screen readers know
  // whether the menu is open or closed.
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Talk to Claude through our backend
async function askClaude(message) {
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data.reply;
}
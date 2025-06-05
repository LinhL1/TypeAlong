const songInput = document.getElementById('songFile');
const audio = document.getElementById('audio');
const lyricsInput = document.getElementById('lyricsInput');
const startBtn = document.getElementById('startTyping');
const lyricsDisplay = document.getElementById('lyricsDisplay');
const typingInput = document.getElementById('typingInput');

let lyricsLines = [];
let currentLineIndex = 0;
let startTime = null;
let totalTypedChars = 0;

songInput.addEventListener('change', () => {
  const file = songInput.files[0];
  if (file) {
    audio.src = URL.createObjectURL(file);
  }
});

startBtn.addEventListener('click', () => {
  const raw = lyricsInput.value.trim();
  if (!raw) {
    alert("Please paste lyrics.");
    return;
  }
  lyricsLines = raw.split('\n').filter(line => line.trim() !== '');
  if (lyricsLines.length === 0) return;

  currentLineIndex = 0;
  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();
  startTime = null;
  totalTypedChars = 0;
  updateLyricsDisplay();
  document.getElementById('wpm').textContent = '0';
});

typingInput.addEventListener('input', () => {
  if (!startTime) startTime = new Date();

  const currentLine = lyricsLines[currentLineIndex];
  const typed = typingInput.value;

  totalTypedChars += 1;

  // Calculate correct characters in this input
  let correctCharsThisInput = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentLine[i]) {
      correctCharsThisInput++;
    }
  }

  updateLyricsDisplay(currentLine, typed);

  // Real-time WPM calculation
  const elapsedMinutes = (new Date() - startTime) / 1000 / 60;
  const wordsTyped = correctCharsThisInput / 5;
  const wpm = Math.round(wordsTyped / elapsedMinutes);
  document.getElementById('wpm').textContent = isFinite(wpm) ? wpm : 0;

  if (typed.length >= currentLine.length) {
    currentLineIndex++;
    if (currentLineIndex < lyricsLines.length) {
      typingInput.value = '';
      updateLyricsDisplay();
      startTime = null; // Reset timer for next line (optional)
      totalTypedChars = 0;
      document.getElementById('wpm').textContent = '0';
    } else {
      typingInput.disabled = true;
      lyricsDisplay.innerHTML = "🎉 You've completed the lyrics!";
    }
  }
});

function updateLyricsDisplay(expectedLine = lyricsLines[currentLineIndex], typed = typingInput.value) {
  const nextLine = lyricsLines[currentLineIndex + 1] || "";
  lyricsDisplay.innerHTML = '';

  const lineEl = document.createElement('div');
  for (let i = 0; i < expectedLine.length; i++) {
    const span = document.createElement('span');
    span.textContent = expectedLine[i];

    if (i < typed.length) {
      span.className = typed[i] === expectedLine[i] ? 'correct' : 'incorrect';
    }
    if (i === typed.length) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      lineEl.appendChild(cursor);
    }

    lineEl.appendChild(span);
  }

  // Cursor at end if finished
  if (typed.length >= expectedLine.length) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = ' ';
    lineEl.appendChild(cursor);
  }

  const nextLineEl = document.createElement('div');
  nextLineEl.style.opacity = 0.3;
  nextLineEl.textContent = nextLine;

  lyricsDisplay.appendChild(lineEl);
  lyricsDisplay.appendChild(nextLineEl);
}
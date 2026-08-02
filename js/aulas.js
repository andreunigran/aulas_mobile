const modal = document.getElementById('gemini-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const geminiResponseEl = document.getElementById('gemini-response');
let isGeminiLoading = false;

const DEFAULT_GEMINI_API_KEY = 'AIzaSyBzmKvKC1gr2OrDpwcIj2gsljGjjh8dNy8';
const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

function readStorageValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function getGeminiConfig() {
  const params = new URLSearchParams(window.location.search);
  const apiKey = params.get('geminiApiKey')
    || window.GEMINI_API_KEY
    || window.geminiApiKey
    || readStorageValue('geminiApiKey')
    || DEFAULT_GEMINI_API_KEY;

  const model = params.get('geminiModel')
    || window.GEMINI_MODEL
    || window.geminiModel
    || readStorageValue('geminiModel')
    || DEFAULT_GEMINI_MODEL;

  return { apiKey, model };
}

closeModalBtn?.addEventListener('click', () => {
  modal?.classList.add('hidden');
  modal?.classList.remove('flex');
  isGeminiLoading = false;
});

async function callGemini(prompt, maxRetries = 4) {
  const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
  const { apiKey, model } = getGeminiConfig();
  const modelCandidates = [model, 'gemini-1.5-flash', 'gemini-2.5-flash-preview-05-20'];

  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    const modelName = modelCandidates[attempt % modelCandidates.length];
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        lastError = new Error(`HTTP error! status: ${response.status} for model ${modelName}`);
        const delay = 2 ** attempt * 1000;
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      const result = await response.json();

      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      }

      lastError = new Error('Resposta da API inválida ou vazia.');
      const delay = 2 ** attempt * 1000;
      await new Promise((res) => setTimeout(res, delay));
    } catch (error) {
      lastError = error;
      const delay = 2 ** attempt * 1000;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error('API call failed after all retries:', lastError);
  return 'Desculpe, não foi possível obter uma resposta da IA no momento. Por favor, verifique sua conexão ou tente novamente mais tarde.';
}

function parseMarkdown(text) {
  const lines = text.split('\n');
  let html = '';
  let inCodeBlock = false;
  let inList = false;

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += '</code></pre>';
        inCodeBlock = false;
      } else {
        html += '<pre><code class="language-dart code-block bg-gray-800 text-white p-4 rounded-md block">';
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      html += line.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
      return;
    }

    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${processInlineMarkdown(line.substring(2))}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line.startsWith('### ')) {
        html += `<h3>${processInlineMarkdown(line.substring(4))}</h3>`;
      } else if (line.startsWith('## ')) {
        html += `<h2>${processInlineMarkdown(line.substring(3))}</h2>`;
      } else if (line.startsWith('# ')) {
        html += `<h1>${processInlineMarkdown(line.substring(2))}</h1>`;
      } else if (line.trim() !== '') {
        html += `<p>${processInlineMarkdown(line)}</p>`;
      }
    }
  });

  if (inList) html += '</ul>';
  if (inCodeBlock) html += '</code></pre>';
  return html;
}

function processInlineMarkdown(line) {
  return line
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 text-gray-800 px-1 py-0.5 rounded">$1</code>');
}

async function deepenConcept(topic) {
  if (isGeminiLoading) return;
  isGeminiLoading = true;
  document.querySelectorAll('.gemini-btn').forEach((btn) => {
    btn.disabled = true;
  });

  const prompt = `Explique o conceito de "${topic}" de forma simples, direta e curta para um iniciante em Dart. Formate a resposta com títulos, listas e blocos de código se necessário.`;

  modal?.classList.remove('hidden');
  modal?.classList.add('flex');
  geminiResponseEl.innerHTML = '<div class="flex justify-center items-center h-full"><div class="loader"></div></div>';

  const explanation = await callGemini(prompt);
  geminiResponseEl.innerHTML = parseMarkdown(explanation);
  isGeminiLoading = false;
  document.querySelectorAll('.gemini-btn').forEach((btn) => {
    btn.disabled = false;
  });
}

async function explainCode(elementId) {
  if (isGeminiLoading) return;
  isGeminiLoading = true;
  document.querySelectorAll('.gemini-btn').forEach((btn) => {
    btn.disabled = true;
  });

  const codeElement = document.getElementById(elementId);
  if (!codeElement) {
    isGeminiLoading = false;
    document.querySelectorAll('.gemini-btn').forEach((btn) => {
      btn.disabled = false;
    });
    return;
  }

  const code = codeElement.innerText;
  const prompt = `Explique o seguinte código Flutter/Dart em português, de forma simples e direta para um iniciante:\n\n\`\`\`dart\n${code}\n\`\`\``;

  modal?.classList.remove('hidden');
  modal?.classList.add('flex');
  geminiResponseEl.innerHTML = '<div class="flex justify-center items-center h-full"><div class="loader"></div></div>';

  const explanation = await callGemini(prompt);
  geminiResponseEl.innerHTML = parseMarkdown(explanation);
  isGeminiLoading = false;
  document.querySelectorAll('.gemini-btn').forEach((btn) => {
    btn.disabled = false;
  });
}

let currentSlide = 0;
let slideSections = [];

function getPresentationSlides() {
  const slidesFromClass = Array.from(document.querySelectorAll('.slide-section'));
  if (slidesFromClass.length) return slidesFromClass;
  return Array.from(document.querySelectorAll('main > section'));
}

function startPresentation() {
  slideSections = getPresentationSlides();
  if (!slideSections.length) return;

  const overlay = document.getElementById('presentation-overlay');
  const content = document.getElementById('presentation-content');
  const counter = document.getElementById('slide-counter');

  currentSlide = 0;
  overlay?.classList.remove('hidden');
  overlay?.classList.add('flex');
  document.body.style.overflow = 'hidden';
  content.innerHTML = slideSections[currentSlide].innerHTML;
  if (typeof initializeLessonInteractivity === 'function') {
    initializeLessonInteractivity(content);
  }
  counter.textContent = `${currentSlide + 1} / ${slideSections.length}`;
}

function exitPresentation() {
  const overlay = document.getElementById('presentation-overlay');
  overlay?.classList.add('hidden');
  overlay?.classList.remove('flex');
  document.body.style.overflow = '';
}

function updatePresentationSlide() {
  const content = document.getElementById('presentation-content');
  const counter = document.getElementById('slide-counter');
  const slide = slideSections[currentSlide];

  if (!slide || !content || !counter) return;

  content.innerHTML = slide.innerHTML;
  if (typeof initializeLessonInteractivity === 'function') {
    initializeLessonInteractivity(content);
  }
  counter.textContent = `${currentSlide + 1} / ${slideSections.length}`;
}

function nextSlide() {
  if (currentSlide < slideSections.length - 1) {
    currentSlide += 1;
    updatePresentationSlide();
  } else {
    exitPresentation();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide -= 1;
    updatePresentationSlide();
  }
}

function setupPresentationControls() {
  const startBtn = document.getElementById('start-presentation-btn');
  const closeBtn = document.getElementById('presentation-close-btn');

  startBtn?.addEventListener('click', startPresentation);
  closeBtn?.addEventListener('click', exitPresentation);

  document.addEventListener('keydown', (event) => {
    const overlay = document.getElementById('presentation-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextSlide();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      exitPresentation();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupPresentationControls();
  setupPdfExport();
});

function setupPdfExport() {
  const exportBtn = document.getElementById('export-pdf-btn');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    const margin = 40;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    const addText = (text, size, isBold, isCode = false) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setFont(isCode ? 'Courier' : 'Helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      const lineHeight = size * 1.2;
      y += lines.length * lineHeight;
    };

    const sections = document.querySelectorAll('main > section');
    sections.forEach((section) => {
      const title = section.querySelector('h2');
      if (title) {
        addText(title.innerText, 18, true);
        y += 12;
      }

      const intro = section.querySelector('p.text-center');
      if (intro) {
        addText(intro.innerText, 10, false);
        y += 15;
      }

      const cards = section.querySelectorAll('.activity-card, .activity-card > div');
      cards.forEach((card) => {
        const subTitle = card.querySelector('h3');
        if (subTitle) {
          addText(subTitle.innerText, 14, true);
          y += 8;
        }
        const paragraphs = card.querySelectorAll('p:not(.text-center)');
        paragraphs.forEach((p) => {
          addText(p.innerText, 10, false);
          y += 8;
        });
        const listItems = card.querySelectorAll('li');
        listItems.forEach((li) => {
          addText(`- ${li.innerText}`, 10, false);
          y += 8;
        });
        const codeBlocks = card.querySelectorAll('.code-block');
        codeBlocks.forEach((code) => {
          addText(code.innerText, 9, false, true);
          y += 12;
        });
      });
      y += 24;
    });

    doc.save('dart-aula.pdf');
  });
}
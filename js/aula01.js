const dataTypes = {
  Numbers: {
    description: "Dart possui dois tipos numéricos principais: `int` para números inteiros e `double` para números de ponto flutuante (decimais).",
    code: `<span class="type">int</span> idade = <span class="number">30</span>;\n<span class="type">double</span> altura = <span class="number">1.75</span>;`
  },
  Strings: {
    description: "Usado para sequências de caracteres. A interpolação (usando `$variavel`) é uma forma poderosa de construir textos dinâmicos.",
    code: `<span class="type">String</span> nome = <span class="string">"Maria"</span>;\n<span class="type">String</span> mensagem = <span class="string">'Olá, $nome!'</span>;`
  },
  Booleans: {
    description: "Representa valores lógicos de verdadeiro (`true`) ou falso (`false`).",
    code: `<span class="type">bool</span> ativado = <span class="keyword">true</span>;`
  },
  Lists: {
    description: "Uma coleção ordenada de objetos, similar a um array.",
    code: `<span class="type">List</span>&lt;<span class="type">String</span>&gt; frutas = [<span class="string">'Maçã'</span>, <span class="string">'Banana'</span>];\nfrutas.add(<span class="string">'Uva'</span>);`
  },
  Maps: {
    description: "Uma coleção de pares chave-valor, onde cada chave deve ser única.",
    code: `<span class="type">Map</span>&lt;<span class="type">String</span>, <span class="keyword">dynamic</span>&gt; usuario = {\n  <span class="string">'nome'</span>: <span class="string">'Carlos'</span>,\n  <span class="string">'idade'</span>: <span class="number">25</span>\n};`
  }
};

const variables = {
  var: {
    description: "`var` declara uma variável cujo tipo é inferido na primeira atribuição e não pode ser alterado. O valor pode ser modificado.",
    code: `<span class="keyword">var</span> contador = <span class="number">10</span>;\ncontador = <span class="number">11</span>; <span class="comment">// Válido</span>`
  },
  final: {
    description: "`final` declara uma variável que só pode ser definida uma única vez. É uma constante de tempo de execução.",
    code: `<span class="keyword">final</span> <span class="type">String</span> nome = <span class="string">'Ana'</span>;\n<span class="comment">// nome = 'Bia'; // Erro!</span>`
  },
  const: {
    description: "`const` declara uma constante de tempo de compilação. Seu valor deve ser conhecido antes do programa ser executado.",
    code: `<span class="keyword">const</span> <span class="type">double</span> pi = <span class="number">3.14159</span>;`
  }
};

const playgroundExamples = {
  'Exemplo Simples': {
    code: `<span class="keyword">void</span> main() {\n  <span class="type">String</span> nomeProduto = <span class="string">'Smartphone'</span>;\n  print(<span class="string">'Nome: $nomeProduto'</span>);\n}`,
    output: 'Nome: Smartphone'
  },
  'Exemplo com Classes (OOP)': {
    code: `<span class="keyword">class</span> <span class="type">Produto</span> {\n  <span class="type">String</span> nome;\n  <span class="type">Produto</span>(<span class="keyword">this</span>.nome);\n}\n\n<span class="keyword">void</span> main() {\n  <span class="keyword">var</span> p = <span class="type">Produto</span>(<span class="string">'Smartphone'</span>);\n  print(<span class="string">'Nome: \${p.nome}'</span>);\n}`,
    output: 'Nome: Smartphone'
  }
};

function resolveContainer(root, id) {
  if (!root) return null;
  if (typeof root.getElementById === 'function') {
    return root.getElementById(id);
  }
  return root.querySelector(`#${id}`);
}

function setupInteractiveSection(containerId, contentId, data, defaultKey, root = document) {
  const buttonsContainer = resolveContainer(root, containerId);
  const contentContainer = resolveContainer(root, contentId);

  if (!buttonsContainer || !contentContainer) return;

  buttonsContainer.innerHTML = '';

  Object.keys(data).forEach((key) => {
    const button = document.createElement('button');
    button.textContent = key;
    button.className = 'interactive-btn px-4 py-2 rounded-md text-sm font-medium';
    button.onclick = () => {
      updateContent(key);
      updateActiveButton(key);
    };
    buttonsContainer.appendChild(button);
  });

  function updateContent(key) {
    const item = data[key];
    contentContainer.innerHTML = `
      <div class="content-fade-in">
        <p class="text-gray-700 mb-4">${item.description}</p>
        <div class="code-block"><pre><code>${item.code}</code></pre></div>
      </div>
    `;
  }

  function updateActiveButton(activeKey) {
    const buttons = buttonsContainer.querySelectorAll('button');
    buttons.forEach((button) => {
      button.classList.toggle('active', button.textContent === activeKey);
    });
  }

  updateContent(defaultKey);
  updateActiveButton(defaultKey);
}

function setupPlayground(root = document) {
  const buttonsContainer = resolveContainer(root, 'playground-buttons');
  const contentContainer = resolveContainer(root, 'playground-content');

  if (!buttonsContainer || !contentContainer) return;

  buttonsContainer.innerHTML = '';

  Object.keys(playgroundExamples).forEach((key) => {
    const button = document.createElement('button');
    button.textContent = key;
    button.className = 'interactive-btn px-4 py-2 rounded-md text-sm font-medium';
    button.onclick = () => {
      updateContent(key);
      updateActiveButton(key);
    };
    buttonsContainer.appendChild(button);
  });

  function updateContent(key) {
    const item = playgroundExamples[key];
    contentContainer.innerHTML = `
      <div class="content-fade-in grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold text-lg mb-2">Código Fonte</h3>
          <div class="code-block h-full"><pre><code>${item.code}</code></pre></div>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">Saída do Console</h3>
          <div class="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm h-full whitespace-pre-wrap">${item.output}</div>
        </div>
      </div>
    `;
  }

  function updateActiveButton(activeKey) {
    const buttons = buttonsContainer.querySelectorAll('button');
    buttons.forEach((button) => {
      button.classList.toggle('active', button.textContent === activeKey);
    });
  }

  const defaultKey = 'Exemplo Simples';
  updateContent(defaultKey);
  updateActiveButton(defaultKey);
}

function initializeLessonInteractivity(root = document) {
  setupInteractiveSection('data-types-buttons', 'data-types-content', dataTypes, 'Numbers', root);
  setupInteractiveSection('variables-buttons', 'variables-content', variables, 'var', root);
  setupPlayground(root);
}

function setupSimpleActivity(inputId, buttonId, resultId, correctAnswers, successMessage, errorMessage) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const resultDiv = document.getElementById(resultId);

  button.addEventListener('click', () => {
    const userAnswer = input.value.trim().replace(/;$/, '');
    const isCorrect = correctAnswers.some((answer) => userAnswer.replace(/\s/g, '') === answer.replace(/\s/g, ''));

    if (isCorrect) {
      resultDiv.className = 'compile-result compile-success';
      resultDiv.innerHTML = `<strong>Sucesso!</strong><br>${successMessage}`;
    } else {
      resultDiv.className = 'compile-result compile-error';
      resultDiv.innerHTML = `<strong>Erro!</strong><br>${errorMessage}`;
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const drawerBtn = document.getElementById('drawer-btn');
  const drawerNav = document.getElementById('drawer-nav');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const navLinks = drawerNav ? drawerNav.querySelectorAll('a') : [];

  function toggleDrawer() {
    drawerNav.classList.toggle('-translate-x-full');
    drawerNav.classList.toggle('translate-x-0');
    drawerOverlay.classList.toggle('hidden');
  }

  if (drawerBtn) {
    drawerBtn.addEventListener('click', toggleDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', toggleDrawer);
  }

  navLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      toggleDrawer();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  });

  initializeLessonInteractivity();
  setupSimpleActivity('activity-1-input', 'activity-1-btn', 'activity-1-result', ["'Arroz','Feijão','Macarrão'"], 'Lista criada!', 'Tente novamente.');
  setupSimpleActivity('activity-2-input', 'activity-2-btn', 'activity-2-result', ["usuario['cidade']='Recife'"], 'Mapa modificado!', 'Tente novamente.');
});

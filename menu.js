const navbarMenus = document.getElementById('navbarMenus');
const drawerMenus = document.getElementById('drawerMenus');

const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');

function abrirDrawer() {
  drawer.classList.remove('-translate-x-full');
  overlay.classList.remove('hidden');
}

function fecharDrawer() {
  drawer.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

menuBtn.addEventListener('click', abrirDrawer);
closeBtn.addEventListener('click', fecharDrawer);
overlay.addEventListener('click', fecharDrawer);

async function carregarMenus() {
  try {
    const resposta = await fetch('index.json');
    const menus = await resposta.json();

    navbarMenus.innerHTML = '';
    drawerMenus.innerHTML = '';

    menus.forEach(menu => {

      // ===== NAVBAR (desktop) =====
      const dropdown = document.createElement('div');
      dropdown.className = 'relative group';

      dropdown.innerHTML = `
        <button class="px-3 py-2 rounded hover:bg-blue-700">
          ${menu.titulo}
        </button>

        <div class="absolute left-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg hidden group-hover:block">
          ${menu.itens.map(item => `
            <a href="${item.url}"
               class="block px-4 py-2 hover:bg-gray-100">
              ${item.titulo}
            </a>
          `).join('')}
        </div>
      `;

      navbarMenus.appendChild(dropdown);

      // ===== DRAWER (mobile) =====
      const secao = document.createElement('div');
      secao.className = 'mb-4';

      secao.innerHTML = `
        <div class="font-semibold text-gray-700 px-2 py-2 uppercase text-sm">
          ${menu.titulo}
        </div>

        <div class="space-y-1">
          ${menu.itens.map(item => `
            <a href="${item.url}"
               class="block px-3 py-2 rounded hover:bg-gray-100">
              ${item.titulo}
            </a>
          `).join('')}
        </div>
      `;

      drawerMenus.appendChild(secao);
    });

  } catch (erro) {
    console.error('Erro ao carregar menus:', erro);

    drawerMenus.innerHTML = `
      <p class="text-red-500 p-4">
        Não foi possível carregar o arquivo index.json
      </p>
    `;
  }
}

carregarMenus();
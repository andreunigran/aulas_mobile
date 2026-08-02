// main.js - comportamento do menu e rolagem suave
document.addEventListener('DOMContentLoaded',function(){
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=> nav.classList.toggle('show'));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if(nav.classList.contains('show')) nav.classList.remove('show');
      }
    });
  });

  // Populate dropdown menus from index.json files
  document.querySelectorAll('.dropbtn').forEach(btn=>{
    let src = btn.getAttribute('data-source');
    const menuId = btn.nextElementSibling && btn.nextElementSibling.id;
    if(!src || !menuId) return;
    // normalize to absolute-path on the same origin
    if(!src.startsWith('/')) src = '/' + src;
    fetch(src).then(r=>{
      if(!r.ok) throw new Error('failed');
      return r.json();
    }).then(items=>{
      const ul = document.getElementById(menuId);
      items.forEach(it=>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = it.url;
        a.textContent = it.title;
        li.appendChild(a);
        ul.appendChild(li);
      });
    }).catch(()=>{
      const ul = document.getElementById(menuId);
      const li = document.createElement('li');
      li.textContent = 'Erro ao carregar';
      ul.appendChild(li);
    });

    // Toggle menu on click
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const ul = this.nextElementSibling;
      if(ul) ul.classList.toggle('show');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', ()=>{
    document.querySelectorAll('.dropdown-menu').forEach(m=>m.classList.remove('show'));
  });
});

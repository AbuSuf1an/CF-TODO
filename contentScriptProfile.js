// Adds Favorite Problems tab and modal to profile page
(function() {
  function createModal(favorites) {
    if (document.getElementById('cf-fav-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'cf-fav-modal';
    modal.className = 'cf-fav-modal-overlay';
    modal.innerHTML = `
      <div class="cf-fav-modal">
        <span class="cf-fav-close" title="Close">&times;</span>
        <h2>Todo Problems</h2>
        <div class="cf-fav-list">
          ${favorites.length === 0 ? '<p>No todo problems yet</p>' : favorites.map((p, i) => `
            <div class="cf-fav-item">
              <a href="${p.url}" target="_blank">${p.name}</a>
              <button class="cf-todo-done" data-index="${i}" title="Mark as done" style="background:none;border:none;cursor:pointer;padding:0;">
                <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="${p.done ? '#c6f7d0' : '#eee'}" stroke="${p.done ? '#34a853' : '#bbb'}" stroke-width="2"/>
                  ${p.done ? '<polyline points="7,13 11,17 17,7" fill="none" stroke="#34a853" stroke-width="2.5"/>' : ''}
                </svg>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.querySelector('.cf-fav-close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
    document.querySelectorAll('.cf-todo-done').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(this.getAttribute('data-index'));
        chrome.storage.sync.get({favorites: []}, function(data) {
          const favs = data.favorites;
          favs[idx].done = !favs[idx].done;
          chrome.storage.sync.set({favorites: favs}, function() {
            modal.remove();
            showModal();
          });
        });
      };
    });
  }
  function showModal() {
    chrome.storage.sync.get({favorites: []}, function(data) {
      createModal(data.favorites);
    });
  }
  function injectTab() {
    const menu = document.querySelector('.second-level-menu');
    if (!menu || document.getElementById('todo-problems-tab')) return;
    const menuList = menu.querySelector('.second-level-menu-list');
    if (!menuList) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'todo-problems-tab';
    a.textContent = 'Todo Problems';
    li.appendChild(a);
    menuList.appendChild(li);
    a.onclick = function(e) {
      e.preventDefault();
      showModal();
    };
  }
  document.addEventListener('DOMContentLoaded', injectTab);
  setTimeout(injectTab, 1000);
})();

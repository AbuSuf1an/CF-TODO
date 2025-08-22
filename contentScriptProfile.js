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
        <h2>Favorite Problems</h2>
        <div class="cf-fav-list">
          ${favorites.length === 0 ? '<p>No favorite problems yet</p>' : favorites.map((p, i) => `
            <div class="cf-fav-item">
              <a href="${p.url}" target="_blank">${p.name}</a>
              <button class="cf-fav-remove" data-index="${i}" title="Remove">x</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.querySelector('.cf-fav-close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
    document.querySelectorAll('.cf-fav-remove').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(this.getAttribute('data-index'));
        chrome.storage.sync.get({favorites: []}, function(data) {
          const favs = data.favorites;
          favs.splice(idx, 1);
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
    if (!menu || document.getElementById('favorite-problems-tab')) return;
    const menuList = menu.querySelector('.second-level-menu-list');
    if (!menuList) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.id = 'favorite-problems-tab';
    a.textContent = 'Favorite Problems';
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

// Adds Favorite Problems tab and modal to profile page
(function() {
  function createModal(favorites) {
    let modal = document.getElementById('cf-fav-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cf-fav-modal';
      modal.className = 'cf-fav-modal-overlay';
      modal.innerHTML = `
        <div class="cf-fav-modal">
          <span class="cf-fav-close" title="Close">&times;</span>
          <h2>TODO</h2>
          <div class="cf-fav-list"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('.cf-fav-close').onclick = () => modal.remove();
      modal.onclick = e => { if (e.target === modal) modal.remove(); };
    }
    // Update only the list content
    const listDiv = modal.querySelector('.cf-fav-list');
    listDiv.innerHTML = favorites.length === 0
      ? '<p>No problem added yet</p>'
      : favorites.map((p, i) => `
          <div class="cf-fav-item">
            <button class="cf-todo-done" data-index="${i}" title="Mark as done" style="background:none;border:none;cursor:pointer;padding:0;margin-right:8px;">
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="${p.done ? '#c6f7d0' : '#eee'}" stroke="${p.done ? '#34a853' : '#bbb'}" stroke-width="2"/>
                ${p.done ? '<polyline points="7,13 11,17 17,7" fill="none" stroke="#34a853" stroke-width="2.5"/>' : ''}
              </svg>
            </button>
            <a href="${p.url}" target="_blank">${p.name}</a>
            <button class="cf-todo-delete" data-index="${i}" title="Delete" style="background:none;border:none;cursor:pointer;padding:0;margin-left:8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <line x1="6" y1="6" x2="18" y2="18" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="18" y1="6" x2="6" y2="18" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `).join('');
    // Re-attach event listeners
    listDiv.querySelectorAll('.cf-todo-done').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(this.getAttribute('data-index'));
        chrome.storage.sync.get({favorites: []}, function(data) {
          const favs = data.favorites;
          favs[idx].done = !favs[idx].done;
          chrome.storage.sync.set({favorites: favs}, function() {
            createModal(favs);
          });
        });
      };
    });
    listDiv.querySelectorAll('.cf-todo-delete').forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(this.getAttribute('data-index'));
        chrome.storage.sync.get({favorites: []}, function(data) {
          const favs = data.favorites;
          favs.splice(idx, 1);
          chrome.storage.sync.set({favorites: favs}, function() {
            createModal(favs);
          });
        });
      };
    });
  }
  function showModal() {
    chrome.storage.sync.get({favorites: []}, function(data) {
      const favorites = data.favorites;
      // For each problem, check if solved by looking for 'Accepted' in the profile page
      const rows = document.querySelectorAll('table.status-frame-datatable tr');
      favorites.forEach(p => {
        let solved = false;
        rows.forEach(row => {
          const link = row.querySelector('a');
          const verdictCell = row.querySelector('td.verdict-cell');
          if (link && verdictCell && link.href === p.url && verdictCell.textContent.includes('Accepted')) {
            solved = true;
          }
        });
        if (solved) p.done = true;
      });
      createModal(favorites);
      chrome.storage.sync.set({favorites});
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
    a.textContent = 'Todo';
    li.appendChild(a);
    menuList.appendChild(li);
    a.onclick = function(e) {
      e.preventDefault();
      showModal();
    };
  }
  document.addEventListener('DOMContentLoaded', injectTab);
  setTimeout(injectTab, 1000);

  const observer = new MutationObserver(() => {
    injectTab();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

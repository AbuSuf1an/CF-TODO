// Injects "⭐ Add to Favorites" button after problem title and saves to chrome.storage.sync
(function() {
  function injectButton() {
    const titleDiv = document.querySelector('div.problem-statement > div.header > div.title');
    if (!titleDiv || document.getElementById('cf-fav-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'cf-fav-btn';
  btn.style.marginLeft = '5px';
  btn.style.cursor = 'pointer';
  btn.style.background = 'none';
  btn.style.border = 'none';
  btn.style.padding = '0';
  btn.style.verticalAlign = 'middle';
  btn.style.marginTop = '-10px';
  btn.innerHTML = `<svg id="cf-fav-star" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="filter: drop-shadow(0 1px 2px #888); vertical-align: middle;"><path d="M12 2.5c.4 0 .8.2 1 .6l2.4 5.1 5.6.8c.9.1 1.2 1.2.6 1.8l-4 3.9 1 5.5c.2.9-.8 1.6-1.6 1.2L12 18.3l-5 2.6c-.8.4-1.8-.3-1.6-1.2l1-5.5-4-3.9c-.6-.6-.3-1.7.6-1.8l5.6-.8L11 3.1c.2-.4.6-.6 1-.6z" fill="#bbb" stroke="#888" stroke-width="1"/></svg>`;

  const wrapper = document.createElement('span');
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'top';
  wrapper.style.gap = '4px';
  wrapper.style.verticalAlign = 'middle';
  titleDiv.parentNode.insertBefore(wrapper, titleDiv);
  wrapper.appendChild(titleDiv);
  wrapper.appendChild(btn);
    // Check if already favorite
    const url = window.location.href;
    chrome.storage.sync.get({favorites: []}, function(data) {
      if (data.favorites.some(p => p.url === url)) {
        setStarActive(true);
      }
    });
    function setStarActive(active) {
      const starSvg = btn.querySelector('#cf-fav-star');
      const starPath = starSvg ? starSvg.querySelector('path') : null;
      if (starPath) {
        if (active) {
          starPath.setAttribute('fill', '#FFD700');
          starPath.setAttribute('stroke', '#c9a400');
        } else {
          starPath.setAttribute('fill', '#bbb');
          starPath.setAttribute('stroke', '#888');
        }
      }
    }
    btn.addEventListener('click', function() {
      const name = titleDiv.textContent.trim();
      const url = window.location.href;
      chrome.storage.sync.get({favorites: []}, function(data) {
        const favorites = data.favorites;
        if (!favorites.some(p => p.url === url)) {
          favorites.push({name, url});
          chrome.storage.sync.set({favorites}, function() {
            setStarActive(true);
          });
        } else {
          // Remove from favorites if already added
          const newFavs = favorites.filter(p => p.url !== url);
          chrome.storage.sync.set({favorites: newFavs}, function() {
            setStarActive(false);
          });
        }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', injectButton);
  // In case of SPA navigation
  setTimeout(injectButton, 1000);
})();

// Injects "⭐ Add to Favorites" button after problem title and saves to chrome.storage.sync
(function() {
  function injectButton() {
    // Detect if problem is solved (Accepted in Last submission)
    let isSolved = false;
    const lastSubmission = document.querySelector('.roundbox .status-accepted, .roundbox:has(.status-accepted), .problem-statement .status-accepted');
    if (!lastSubmission) {
      // Fallback: look for 'Accepted' text in Last submission section
      const roundboxes = document.querySelectorAll('.roundbox');
      roundboxes.forEach(box => {
        if (box.textContent.includes('Accepted')) {
          isSolved = true;
        }
      });
    } else {
      isSolved = true;
    }
    const titleDiv = document.querySelector('div.problem-statement > div.header > div.title');
    if (!titleDiv || document.getElementById('cf-fav-btn')) return;
  const btn = document.createElement('button');
    btn.id = 'cf-fav-btn';
    btn.style.marginLeft = '5px';
    btn.style.cursor = 'pointer';
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.padding = '0';
    btn.style.verticalAlign = 'middle';
    btn.style.marginTop = '-10px';
    // Set initial tooltip
    btn.title = 'Add to Todo';
        // Checkbox with plus icon SVG
        btn.innerHTML = `<svg id="cf-todo-checkbox" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" style="vertical-align: middle;">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#eee" stroke="#bbb" stroke-width="2"/>
          <g id="cf-plus">
            <line x1="12" y1="8" x2="12" y2="16" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        </svg>`;

  const wrapper = document.createElement('span');
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'top';
  wrapper.style.gap = '4px';
  wrapper.style.verticalAlign = 'middle';
  titleDiv.parentNode.insertBefore(wrapper, titleDiv);
  wrapper.appendChild(titleDiv);
  wrapper.appendChild(btn);
    // Check if already favorite and/or solved
    const url = window.location.href;
    chrome.storage.sync.get({favorites: []}, function(data) {
      let found = false;
      let favorites = data.favorites;
      for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].url === url) {
          found = true;
          // If solved, mark as done
          if (isSolved && !favorites[i].done) {
            favorites[i].done = true;
            chrome.storage.sync.set({favorites}, function() {
              setCheckboxActive(true);
          btn.title = 'Remove from Todo';
            });
            return;
          }
          setCheckboxActive(isSolved || favorites[i].done);
        btn.title = 'Remove from Todo';
          return;
        }
      }
      // If not in favorites, do not auto-add even if solved
      setCheckboxActive(false);
      btn.title = 'Add to Todo';
    });
        function setCheckboxActive(active) {
          const svg = btn.querySelector('#cf-todo-checkbox');
          const box = svg ? svg.querySelector('rect') : null;
          const plusGroup = svg ? svg.querySelector('#cf-plus') : null;
          const plusLines = plusGroup ? plusGroup.querySelectorAll('line') : [];
          if (box && plusLines.length === 2) {
            if (active) {
              box.setAttribute('fill', '#ffe066');
              box.setAttribute('stroke', '#b8860b');
              plusLines.forEach(l => l.setAttribute('stroke', '#b8860b'));
            } else {
              box.setAttribute('fill', '#eee');
              box.setAttribute('stroke', '#bbb');
              plusLines.forEach(l => l.setAttribute('stroke', '#bbb'));
            }
          }
        }
    btn.addEventListener('click', function() {
      const name = titleDiv.textContent.trim();
      const url = window.location.href;
      chrome.storage.sync.get({favorites: []}, function(data) {
        const favorites = data.favorites;
        if (!favorites.some(p => p.url === url)) {
          // If solved, mark as done immediately
          let done = false;
          let isSolved = false;
          const lastSubmission = document.querySelector('.roundbox .status-accepted, .roundbox:has(.status-accepted), .problem-statement .status-accepted');
          if (!lastSubmission) {
            const roundboxes = document.querySelectorAll('.roundbox');
            roundboxes.forEach(box => {
              if (box.textContent.includes('Accepted')) {
                isSolved = true;
              }
            });
          } else {
            isSolved = true;
          }
          done = isSolved;
          favorites.push({name, url, done});
          chrome.storage.sync.set({favorites}, function() {
            setCheckboxActive(true);
              btn.title = 'Remove from Todo';
          });
        } else {
          // Remove from favorites if already added
          const newFavs = favorites.filter(p => p.url !== url);
          chrome.storage.sync.set({favorites: newFavs}, function() {
            setCheckboxActive(false);
              btn.title = 'Add to Todo';
          });
        }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', injectButton);
  // In case of SPA navigation
  setTimeout(injectButton, 1000);
})();

// Injects "Add to todo" button next to the star icon on problemset pages
(function() {
  function injectButtons() {
    // Find all problem rows in the table
    const table = document.querySelector('table.problems');
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      let starCell = null;
      for (let i = cells.length - 1; i >= 0; i--) {
        if (
          cells[i].querySelector('span[title*="favorites"]') ||
          cells[i].querySelector('.star') ||
          cells[i].querySelector('.favorite')
        ) {
          starCell = cells[i];
          break;
        }
      }
      // Fallback: use last cell if no star cell found
      if (!starCell && cells.length > 0) starCell = cells[cells.length - 1];
        const nameCell = row.querySelector('td:nth-child(2) a');
        if (!nameCell) return;
        // Find the best cell to inject the button
        let injectCell = row.querySelector('td.act.dark');
        if (!injectCell) {
          injectCell = Array.from(row.querySelectorAll('td')).find(td => td.className && td.className.includes('act'));
        }
        if (!injectCell) {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) injectCell = cells[cells.length - 1];
        }
        if (!injectCell) return;
        // Avoid duplicate injection
          if (injectCell.querySelector('.cf-todo-btn-span')) return;
          // Normalize all .act-item spans in the cell for alignment
          const actItems = injectCell.querySelectorAll('.act-item');
          actItems.forEach(span => {
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.position = '';
            span.style.bottom = '';
          });
        // Create span for button
        const btnSpan = document.createElement('span');
    btnSpan.className = 'cf-todo-btn-span';
    btnSpan.style.marginLeft = '6px';
    btnSpan.style.display = 'inline-flex';
    btnSpan.style.alignItems = 'center';
        // Create add to todo button
        const btn = document.createElement('button');
        btn.className = 'cf-todo-btn';
        btn.title = 'Add to Todo';
    btn.style.cursor = 'pointer';
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.padding = '0px';
    btn.style.verticalAlign = 'middle';
        // Checkbox with plus icon SVG
        btn.innerHTML = `<svg id="cf-todo-checkbox" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="vertical-align: middle;">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#eee" stroke="#bbb" stroke-width="2"/>
          <g id="cf-plus">
            <line x1="12" y1="8" x2="12" y2="16" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#bbb" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        </svg>`;
        btnSpan.appendChild(btn);
        injectCell.appendChild(btnSpan);
      // Get problem name and url
      const name = nameCell.textContent.trim();
      const url = nameCell.href;
      // Check if already in todo
      chrome.storage.sync.get({todo: []}, function(data) {
        const todo = data.todo;
        if (todo.some(p => p.url === url)) {
          setCheckboxActive(true);
          btn.title = 'Remove from Todo';
        } else {
          setCheckboxActive(false);
          btn.title = 'Add to Todo';
        }
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
        chrome.storage.sync.get({todo: []}, function(data) {
          let todo = data.todo;
          if (!todo.some(p => p.url === url)) {
            // Check if the problem is solved in the row
            let solved = false;
            // Try to find a cell with 'solved' or 'Accepted' indicator
            const verdictCell = row.querySelector('td.verdict-cell, td:has(.verdict-accepted), td:has(.status-accepted)');
            if (verdictCell && verdictCell.textContent.match(/Accepted|Solved|OK|✔|✓/i)) {
              solved = true;
            }
            // Fallback: look for green background or solved class
            if (row.className && row.className.match(/solved|accepted|ac/i)) {
              solved = true;
            }
            todo.push({name, url, done: solved});
            chrome.storage.sync.set({todo}, function() {
              setCheckboxActive(true);
              btn.title = 'Remove from Todo';
            });
          } else {
            todo = todo.filter(p => p.url !== url);
            chrome.storage.sync.set({todo}, function() {
              setCheckboxActive(false);
              btn.title = 'Add to Todo';
            });
          }
        });
      });
    });
  }
  document.addEventListener('DOMContentLoaded', injectButtons);
  setTimeout(injectButtons, 1000);
  // For SPA navigation
  const observer = new MutationObserver(() => {
    injectButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

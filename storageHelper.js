// Helper for chrome.storage.sync todo
const StorageHelper = {
  gettodo(cb) {
    chrome.storage.sync.get({todo: []}, data => cb(data.todo));
  },
  addtodo(problem, cb) {
    StorageHelper.gettodo(todos => {
      if (!todos.some(p => p.url === problem.url)) {
        todos.push(problem);
        chrome.storage.sync.set({todo: todos}, cb);
      } else {
        cb && cb();
      }
    });
  },
  removetodo(url, cb) {
    StorageHelper.gettodo(todos => {
      const newtodos = todos.filter(p => p.url !== url);
      chrome.storage.sync.set({todo: newtodos}, cb);
    });
  }
};

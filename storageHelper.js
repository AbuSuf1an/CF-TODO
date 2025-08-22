// Helper for chrome.storage.sync favorites
const StorageHelper = {
  getFavorites(cb) {
    chrome.storage.sync.get({favorites: []}, data => cb(data.favorites));
  },
  addFavorite(problem, cb) {
    StorageHelper.getFavorites(favs => {
      if (!favs.some(p => p.url === problem.url)) {
        favs.push(problem);
        chrome.storage.sync.set({favorites: favs}, cb);
      } else {
        cb && cb();
      }
    });
  },
  removeFavorite(url, cb) {
    StorageHelper.getFavorites(favs => {
      const newFavs = favs.filter(p => p.url !== url);
      chrome.storage.sync.set({favorites: newFavs}, cb);
    });
  }
};

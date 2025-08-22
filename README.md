# Codeforces todo List Chrome Extension

## Overview
Codeforces Todo List is a Chrome extension that lets you add Codeforces problems to your todo and view/manage them from your profile page. It provides a seamless way to bookmark problems for later review or practice.

## Features
- ⭐ Add any Codeforces problem to your todo directly from the problem page.
- 📋 View and manage your todo list in a modal on your profile page.
- 🗑️ Remove problems from your todo list.
- Data is stored using Chrome's `chrome.storage.sync` for cross-device sync.

## How It Works
- On a problem page, an "Add to todo" star button is injected next to the problem title. Clicking toggles todo status.
- On your profile page, a new "todo list" tab appears. Clicking it opens a modal listing all your saved problems, with links and remove buttons.

## File Structure
- `manifest.json`: Chrome extension manifest (v3), permissions, content scripts, and host permissions.
- `contentScriptProblem.js`: Injects the todo button on problem pages and handles add/remove logic.
- `contentScriptProfile.js`: Adds the "todo list" tab and modal to the profile page, allowing management of todo.
- `storageHelper.js`: Utility for interacting with Chrome storage for todo.
- `modal.css`: Styles for the modal and UI elements.

## Installation
1. Clone or download this repository.
2. Go to `chrome://extensions` in your browser.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the project folder.
5. Visit Codeforces problem or profile pages to use the extension.

## Permissions
- `storage`: To save your todo list.
- `activeTab`, `scripting`: For content script injection.
- Host permissions for Codeforces problem and profile pages.

## Usage
- On a problem page, click the ⭐ next to the title to add/remove from todo.
- On your profile page, click the "todo list" tab to view/manage your list.

## License
MIT

---
Made by AbuSuf1an

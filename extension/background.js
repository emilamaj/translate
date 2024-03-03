// Run the content script
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
  });
});

// Create a context menu item for translation when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "Translate",
    contexts: ["selection"]
  });
});

// Listen for clicks on the context menu item
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  // Check if the clicked item is the "translate" menu item and if there is a selected text
  if (info.menuItemId === "translate" && info.selectionText) {
    console.log('Selected text:', info.selectionText);

    // Send a message to the content script to translate the selected text
    // ...
  }
});
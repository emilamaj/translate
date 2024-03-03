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
    const translationEndpoint = "http://localhost:5000/translate";
    
    // Send a POST request to the translation endpoint with the selected text
    fetch(translationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: info.selectionText }),
    })
      .then(response => response.text())
      .then(result => {
        console.log('Received translation:', result);
      })
      .catch(error => console.log('Error:', error));
  }
});
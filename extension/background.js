chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translate",
      title: "Translate",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "translate" && info.selectionText) {
      const translationEndpoint = process.env.TRANSLATION_ENDPOINT;
      fetch(translationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: info.selectionText }),
      })
      .then(response => response.text())
      .then(result => {
        // Display the result, you might want to change how it's displayed
        alert(result);
      })
      .catch(error => console.log('Error:', error));
    }
  });
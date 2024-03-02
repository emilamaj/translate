chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "Translate",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "translate" && info.selectionText) {
    console.log('Selected text:', info.selectionText);
    const translationEndpoint = "http://localhost:5000/translate";
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
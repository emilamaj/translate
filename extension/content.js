// Listen for current selection request from the popup
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.method == "getUserSelection") {
      console.log('Content script received message');
      console.log('Content script sending response:', window.getSelection().toString());
      sendResponse({ data: window.getSelection().toString() });
    }
  }
);
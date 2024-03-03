// Add event listener to translate button
document.getElementById('translateBtn').addEventListener('click', translate);

// Add event listener to text input for Enter key press
document.getElementById('textToTranslate').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    translate();
  }
});

// Check if target language is stored in local storage
let targetLanguage = localStorage.getItem('targetLanguage');
console.log('Target language on open:', targetLanguage);

// If target language is not found in local storage, set it based on system language
if (!targetLanguage || targetLanguage === 'null' || targetLanguage === 'undefined') {
  const systemLanguage = navigator.language;
  console.log('Reading navigator language:', systemLanguage);

  // Store target language in local storage
  localStorage.setItem('targetLanguage', systemLanguage);
  targetLanguage = systemLanguage; // Update targetLanguage variable
  console.log('Target language set:', targetLanguage);
} else {
  console.log('Target language found:', targetLanguage);
}

// Allow user to manually edit target language
const languageTargetText = document.getElementById('languageTargetText');
languageTargetText.textContent = targetLanguage;
languageTargetText.addEventListener('click', function () {
  languageTargetText.contentEditable = true;
  languageTargetText.focus();
});

// Exit focus mode when Enter key is pressed
languageTargetText.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    languageTargetText.blur();
  }
});

// Save target language to local storage when focus is lost
languageTargetText.addEventListener('blur', function () {
  languageTargetText.contentEditable = false;
  languageTargetText.textContent = languageTargetText.textContent.trim();
  const newLanguage = languageTargetText.textContent;
  localStorage.setItem('targetLanguage', newLanguage);
});

// Function to handle translation
function translate() {
  const text = document.getElementById('textToTranslate').value;
  console.log('Text to translate:', text);

  // Check if text is not empty
  if (text) {
    const spinner = document.getElementById('spinnerContainer');
    spinner.style.display = 'block'; // Show the spinner

    // Read target language from local storage
    let targetLanguage = localStorage.getItem('targetLanguage');

    const translationEndpoint = 'http://localhost:5000/translate';

    // Send translation request to server
    fetch(translationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetLanguage: targetLanguage,
        text: text
      }),
    })
      .then(response => response.text())
      .then(result => {
        // Display translation result
        document.getElementById('translationResult').textContent = result;
        spinner.style.display = 'none'; // Hide the spinner
      })
      .catch(error => {
        console.log('Error:', error);
        spinner.style.display = 'none'; // Hide the spinner
      });
  }
}

// Send message to background script to get the selected text, then set the text input value
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { method: "getUserSelection" }, function (response) {
      // Do something with the response.data
      console.log("Found response to selection message:", response.data);
      document.getElementById('textToTranslate').value = response.data.trim();

      // Directly perform translation
      translate();
    });
  });
});
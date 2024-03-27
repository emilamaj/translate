// Add event listener to translate button
document.getElementById('translateBtn').addEventListener('click', translate);

// Add event listener to text input for Enter key press
document.getElementById('textToTranslate').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    translate();
  }
});

// Add event listener to reset language button
document.getElementById('resetLanguageTarget').addEventListener('click', function () {
  const languageTargetText = document.getElementById('languageTargetText');
  languageTargetText.value = ''; // Clear the text input
  languageTargetText.focus(); // Focus the text input
});

// Initialize target language (new)
function initializeLanguageTarget() {
  console.log('Initializing target language');

  // If target language is not found in local storage, set it based on system language
  let targetLanguage = localStorage.getItem('targetLanguage');
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

  // Try to retrieve history from localStorage
  let history = JSON.parse(localStorage.getItem('languageHistory'));
  console.log('Language history:', history);

  // If not found or empty, use default values
  if (!history || !history.length) {
    history = ["English", "English (street)", "Español", "Français", "Deutsch", "Italiano", "Português"];
    localStorage.setItem('languageHistory', JSON.stringify(history));
  }

  // Set the currently selected target language
  if (!targetLanguage || targetLanguage === 'undefined') targetLanguage = history[0];
  document.getElementById('languageTargetText').value = targetLanguage;
  populateSuggestions();
}

function populateSuggestions() {
  let history = JSON.parse(localStorage.getItem('languageHistory')) || [];
  console.log('Populating suggestions with history:', history);
  // Clear the suggestion list
  const suggestionDataList = document.getElementById('languageTargetSuggestions');
  suggestionDataList.innerHTML = ''; // Clear the suggestion list

  // Populate the suggestion div with the history
  const languageTargetText = document.getElementById('languageTargetText');
  history.forEach(lang => {
    const option = document.createElement('option');
    option.textContent = lang;
    option.addEventListener('mousedown', function () {
      console.log('Mousedown event detected for suggestion:', lang);
      targetLanguage = lang;
      languageTargetText.value = lang;
      // languageTarget.blur(); // Trigger blur event to save the language
    });
    suggestionDataList.appendChild(option);
  });
}

// Allow user to manually edit target language
const languageTargetText = document.getElementById('languageTargetText');
languageTargetText.addEventListener('focus', function () {
  console.log('Focus event detected for target language input');

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
  console.log(`Blur event detected for target language, content: ${languageTargetText.value}`);

  // Disable editing and trim the text content
  languageTargetText.contentEditable = false;
  languageTargetText.value = languageTargetText.value.trim();

  // Save the new language to local storage
  const newLanguage = languageTargetText.value;
  localStorage.setItem('targetLanguage', newLanguage);
  updateLanguageHistory(newLanguage);
});

function updateLanguageHistory(newLanguage) {
  console.log('Updating language history, new language:', newLanguage);

  let history = JSON.parse(localStorage.getItem('languageHistory')) || [];
  // Remove the language if it already exists to avoid duplicates
  history = history.filter(lang => lang !== newLanguage);
  // Add the new language to the start of the array
  history.unshift(newLanguage);
  // Ensure history does not exceed 10 items
  history = history.slice(0, 10);
  console.log('Updated history:', history);

  localStorage.setItem('languageHistory', JSON.stringify(history));
  populateSuggestions();
}

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
  // Initialize target language
  initializeLanguageTarget();

  // Fetch the selected text from the current tab
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
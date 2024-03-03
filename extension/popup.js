// Add event listener to translate button
document.getElementById('translateBtn').addEventListener('click', translate);

// Add event listener to text input for Enter key press
document.getElementById('textToTranslate').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    translate();
  }
});

// Function to handle translation
function translate() {
  const text = document.getElementById('textToTranslate').value;
  console.log('Text to translate:', text);

  // Check if text is not empty
  if (text) {
    const spinner = document.getElementById('spinnerContainer');
    spinner.style.display = 'block'; // Show the spinner

    const translationEndpoint = 'http://localhost:5000/translate';

    // Send translation request to server
    fetch(translationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        targetLanguage: 'ENGLISH',
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

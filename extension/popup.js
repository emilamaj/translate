document.getElementById('translateBtn').addEventListener('click', () => {
  const text = document.getElementById('textToTranslate').value;
  console.log('Text to translate:', text);
  if (text) {
    const translationEndpoint = 'http://localhost:5000/translate';
    fetch(translationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    })
      .then(response => response.text())
      .then(result => {
        document.getElementById('translationResult').textContent = result;
      })
      .catch(error => console.log('Error:', error));
  }
});
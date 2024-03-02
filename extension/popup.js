document.getElementById('translateBtn').addEventListener('click', () => {
    const text = document.getElementById('textToTranslate').value;
    if (text) {
      const translationEndpoint = process.env.TRANSLATION_ENDPOINT;
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

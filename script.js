async function analyzeCode() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const codeInput = document.getElementById('codeInput').value.trim();
  const loading = document.getElementById('loading');
  const outputContainer = document.getElementById('outputContainer');
  const output = document.getElementById('output');

  // Basic Validation
  if (!apiKey) {
    alert('Please enter your Google Gemini API Key!');
    return;
  }
  if (!codeInput) {
    alert('Please paste some code or error message to analyze!');
    return;
  }

  // Update UI State
  loading.classList.remove('hidden');
  outputContainer.classList.add('hidden');
  output.innerText = '';

  const promptText = `
    You are a Senior Software Engineer and AI Assistant. 
    Analyze the following code snippet or error message and provide a clear explanation:
    1. What is wrong or causing the issue in the code/error?
    2. How to fix it (provide the corrected code snippet)?
    3. Give 1-2 best practice tips to improve the code.

    Code/Error Snippet:
    ${codeInput}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });

    const data = await response.json();

    loading.classList.add('hidden');
    outputContainer.classList.remove('hidden');

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      output.innerText = data.candidates[0].content.parts[0].text;
    } else {
      output.innerText = "Failed to generate AI response. Please check your API key and input.";
    }

  } catch (error) {
    loading.classList.add('hidden');
    outputContainer.classList.remove('hidden');
    output.innerText = "Error connecting to AI service: " + error.message;
  }
}
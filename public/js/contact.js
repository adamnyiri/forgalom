document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault(); 
  
    const formData = new FormData(this);

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message')
      }),
      });

      const result = await response.text();
      document.getElementById('response').innerText = result;
  
      if (response.ok) {
        this.reset(); 
      }
    } catch (error) {
      console.error('Hiba az üzenet küldésekor:', error);
      document.getElementById('response').innerText = 'Hiba történt az üzenet küldésekor.';
    }
  });

  
  
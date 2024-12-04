document.addEventListener('DOMContentLoaded', async () => {
    loadMessages()
  });
  async function loadMessages() {

  const tableBody = document.getElementById('messages-table-body');

    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Nem sikerült lekérni az üzeneteket.');
  
      const messages = await response.json();
  
      tableBody.innerHTML = '';

      messages.forEach(message => {
        const row = document.createElement('tr');
  
        row.innerHTML = `
          <td>${message.id}</td>
          <td>${message.name}</td>
          <td>${message.email}</td>
          <td>${message.message}</td>
          <td>${new Date(message.sent_at).toLocaleString()}</td>
          <td>
            <button onclick="editMessage(${message.id}, '${message.name}', '${message.email}', '${message.message}')">Szerkesztés</button>
            <button onclick="deleteMessage(${message.id})">Törlés</button>
          </td>`;
  
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Hiba az üzenetek betöltésekor:', error);
      tableBody.innerHTML = `<tr><td colspan="4">Hiba történt az üzenetek betöltésekor.</td></tr>`;
    }
  }

  const form = document.getElementById('message-form');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const id = form.id.value;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };
  
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/messages/${id}` : '/api/messages';
    
    if(method == 'POST') {
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
    
          if (response.ok) {
            form.reset(); 
            document.getElementById('response').innerText = 'Sikeres üzenet küldés.';
            loadMessages();
          }
    } else {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    document.getElementById('response').innerText = 'Sikeres módosítás.';
    }
    form.reset();
    loadMessages();
    
  });
  
  function editMessage(id, name, email, message) {
    form.id.value = id;
    form.name.value = name;
    form.email.value = email;
    form.message.value = message;
  }
  
  async function deleteMessage(id) {
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    document.getElementById('response').innerText = 'Sikeres rekord törlés.';
    loadMessages();
  }
  
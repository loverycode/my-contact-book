const API_URL = '/api/contacts';

async function loadContacts() {
    const list = document.getElementById('contacts-list');
    list.innerHTML = '<div class="loading">Загрузка контактов...</div>';

    try {
        const res = await fetch(API_URL);
        const contacts = await res.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        list.innerHTML = 'Ошибка загрузки контактов';
    }
}

function renderContacts(contacts) {
    const list = document.getElementById('contacts-list');

    if (contacts.length === 0) {
        list.innerHTML = 'Контактов нет';
        return;
    }

    list.innerHTML = contacts.map(contact => `
    <div class="contact-item">
      <h3>${contact.name}</h3>
      <p><strong>Телефон:</strong> ${contact.phone}</p>
      <p><strong>Email:</strong> ${contact.email || '—'}</p>
      <div class="contact-actions">
        <button onclick="editContact(${contact.id})" class="btn edit-btn">Редактировать</button>
        <button onclick="deleteContact(${contact.id})" class="btn delete-btn">Удалить</button>
      </div>
    </div>
  `).join('');
}

async function addContact() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !phone) {
        alert('Заполните имя и телефон');
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, email })
        });

        if (res.ok) {
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('email').value = '';
            loadContacts();
            alert('Контакт добавлен');
        }
    } catch (error) {
        console.error('Ошибка добавления:', error);
        alert('Ошибка при добавлении');
    }
}

async function searchContacts() {
    const query = document.getElementById('search').value.trim();
    if (!query) {
        loadContacts();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/search?name=${encodeURIComponent(query)}`);
        const contacts = await res.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }
}

async function deleteContact(id) {
    if (!confirm('Удалить контакт?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadContacts();
            alert('Контакт удалён');
        }
    } catch (error) {
        console.error('Ошибка удаления:', error);
    }
}

async function editContact(id) {
    const newName = prompt('Введите новое имя:');
    if (!newName) return;

    const newPhone = prompt('Введите новый телефон:');
    if (!newPhone) return;

    const newEmail = prompt('Введите новый email:') || '';

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, phone: newPhone, email: newEmail })
        });

        if (res.ok) {
            loadContacts();
            alert('Контакт обновлён');
        }
    } catch (error) {
        console.error('Ошибка обновления:', error);
    }
}

loadContacts();

document.getElementById('search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchContacts();
});
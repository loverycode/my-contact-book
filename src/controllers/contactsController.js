const fs = require('fs').promises;
const path = require('path');

const contactsFilePath = path.join(__dirname, '../data/contacts.json');

async function readContacts() {
  try {
    const data = await fs.readFile(contactsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
}

async function getAllContacts(req, res) {
  try {
    const contacts = await readContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении контактов' });
  }
}

async function getContactById(req, res) {
  try {
    const contacts = await readContacts();
    const contact = contacts.find(c => c.id === parseInt(req.params.id));
    if (!contact) {
      return res.status(404).json({ error: 'Контакт не найден' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении контакта' });
  }
}

async function searchContacts(req, res) {
  try {
    const query = req.query.name?.toLowerCase();
    if (!query) {
      return res.status(400).json({ error: 'Укажите параметр name' });
    }

    const contacts = await readContacts();
    const filtered = contacts.filter(c =>
      c.name.toLowerCase().includes(query)
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске' });
  }
}

async function createContact(req, res) {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }

    const contacts = await readContacts();
    const newContact = {
      id: Date.now(),
      name,
      phone,
      email: email || '',
      createdAt: new Date().toISOString()
    };

    contacts.push(newContact);
    await writeContacts(contacts);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании контакта' });
  }
}

async function updateContact(req, res) {
  try {
    const contacts = await readContacts();
    const index = contacts.findIndex(c => c.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Контакт не найден' });
    }

    const { name, phone, email } = req.body;
    contacts[index] = {
      ...contacts[index],
      name: name || contacts[index].name,
      phone: phone || contacts[index].phone,
      email: email !== undefined ? email : contacts[index].email,
      updatedAt: new Date().toISOString()
    };

    await writeContacts(contacts);
    res.json(contacts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении контакта' });
  }
}

async function deleteContact(req, res) {
  try {
    const contacts = await readContacts();
    const filtered = contacts.filter(c => c.id !== parseInt(req.params.id));

    if (filtered.length === contacts.length) {
      return res.status(404).json({ error: 'Контакт не найден' });
    }

    await writeContacts(filtered);
    res.json({ message: 'Контакт удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении контакта' });
  }
}

module.exports = {
  getAllContacts,
  getContactById,
  searchContacts,
  createContact,
  updateContact,
  deleteContact
};
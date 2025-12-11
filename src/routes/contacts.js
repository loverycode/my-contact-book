const express = require('express');
const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts
} = require('../controllers/contactsController');

const router = express.Router();

// GET /api/contacts
router.get('/', getAllContacts);

// GET /api/contacts/search?name=...
router.get('/search', searchContacts);

// GET /api/contacts/:id
router.get('/:id', getContactById);

// POST /api/contacts
router.post('/', createContact);

// PUT /api/contacts/:id
router.put('/:id', updateContact);

// DELETE /api/contacts/:id
router.delete('/:id', deleteContact);

module.exports = router;
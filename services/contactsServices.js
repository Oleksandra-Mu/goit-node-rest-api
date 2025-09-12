import e from "express";
import Contact from "../db/Contact.js";

export const getContacts = () => Contact.findAll();

export const getContactById = (id) => Contact.findByPk(id);

export const removeContact = async (id) => {
  const contact = await getContactById(id);
  if (!contact) {
    return null;
  }

  await contact.destroy();
  return contact;
};

export const addContact = (payload) => Contact.create(payload);

export const updateContactById = async (id, payload) => {
  const contact = await getContactById(id);
  if (!contact) {
    return null;
  }
  await contact.update(payload);
  return contact;
};

export const updateStatusContact = async (id, favorite) => {
  const contact = await getContactById(id);
  if (!contact) {
    return null;
  }
  await contact.update({ favorite });
  return contact;
};

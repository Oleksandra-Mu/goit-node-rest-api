import e from "express";
import Contact from "../db/Contact.js";

export const getContacts = (query) => Contact.findAll({ where: query });

export const getContact = (query) => Contact.findOne({ where: query });

export const removeContact = async (query) => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }

  await contact.destroy();
  return contact;
};

export const addContact = (payload) => Contact.create(payload);

export const updateContactById = async (query, payload) => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  await contact.update(payload);
  return contact;
};

export const updateStatusContact = async (query, favorite) => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  await contact.update({ favorite });
  return contact;
};

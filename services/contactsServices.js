import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

export const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts;
};

export const getContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

export const getContactById = async (id) => {
  const contacts = await getContacts();
  const contact = contacts.find((c) => c.id === id);
  return contact || null;
};

export const removeContact = async (id) => {
  const contacts = await getContacts();
  const index = contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    return null;
  }

  const [removedContact] = contacts.splice(index, 1);
  await updateContacts(contacts);

  return removedContact;
};

export const addContact = async ({ name, email, phone }) => {
  const contacts = await getContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
};

export const updateContactById = async (id, body) => {
  const contacts = await getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) {
    return null;
  }
  const updatedContact = { ...contacts[index], ...body };
  contacts[index] = updatedContact;

  await updateContacts(contacts);
  return updatedContact;
};

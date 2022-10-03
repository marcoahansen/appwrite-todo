import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint("http://localhost:3001/v1")
  .setProject("6332ea15b6b288b620cf");

export const account = new Account(client);

export const databases = new Databases(client);

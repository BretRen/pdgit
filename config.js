import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// db configuration
export const db_port = "27017";
export const db_username = process.env.dbUsername;
export const db_name = process.env.dbName;
export const db_host = process.env.dbHost;
export const db_password = process.env.dbPassword;
export const db_is_srv = true;

// email configuration
export const email = process.env.email;
export const email_password = process.env.emailPassword;
export const email_host = process.env.emailHost;

// server configuration
export const host = process.env.host;

export const secretKey = process.env.secretKey;
import { MongoClient } from 'mongodb';
import { db_name, db_port, db_host } from './config.js';


const uri = `mongodb://${db_host}:${db_port}`

const client = new MongoClient(uri)

export async function connToDb() {
    await client.connect();
    console.log("成功连接");

    const db = client.db(db_name);

    return db;

}

connToDb()

export default connToDb;
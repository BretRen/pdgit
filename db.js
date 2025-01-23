import { MongoClient } from 'mongodb';
import { db_name, db_is_srv, db_username, db_port, db_host, db_passsword} from './config.js';


// const uri = `mongodb://${db_name}:${db_passsword}@${db_host}:${db_port}`
// 根据是否使用 SRV 配置连接字符串
const uri = db_is_srv
    ? `mongodb+srv://${db_username}:${db_passsword}@${db_host}/`
    : `mongodb://${db_username}:${db_passsword}@${db_host}:${db_port}`;

const client = new MongoClient(uri)

export async function connToDb() {
    await client.connect();
    console.log("成功连接");

    const db = client.db(db_name);

    return db;

}

connToDb()

export default connToDb;
import express from 'express'; // 默认导入 Express
import connToDb from './db.js';
import { hashPassword } from "./bcrypt.js"
const app = express();


const db = await connToDb();


// 中间件解析 JSON 数据
app.use(express.json());

// 中间件解析 URL 编码数据
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/api/reg', async (req,res) => {
    const { username, password } = req.body;

    //



    const collection = db.collection('users');
    const safe_password = await hashPassword(password)
    const result = await collection.insertOne({
        username: username,
        passsword : safe_password
    })
    console.log("插入成功:", result.insertedId);
    console.log(safe_password);
    res.status(200)
    res.send(req.body);
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

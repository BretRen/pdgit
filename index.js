import express from 'express'; // 默认导入 Express
import connToDb from './db.js';
import { hashPassword } from "./bcrypt.js"
import { isValidEmail } from './tool.js';
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
    // 获取 POST 过来的 username 和 password
    const { username, password , email} = req.body;

    //验证
    if (!username || !password || !email) {
        res.status(400)
        res.json({
            "error":'username or password or email are required',
            "code":400
        });
        return;
    }else if(!isValidEmail(email)) {
        res.status(400)
        res.json({
            "error":'email are required',
            "code":400
        });
        return;
    }


    // 选择集合
    const collection = db.collection('users');
    //哈希密码
    const safe_password = await hashPassword(password)
    //插入
    const result = await collection.insertOne({
        username: username,
        passsword : safe_password
    })
    //调试
    console.log("插入成功:", result.insertedId);
    console.log(safe_password);

    // 返回
    res.status(200)
    res.json({ data: req.body, code: 200});
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

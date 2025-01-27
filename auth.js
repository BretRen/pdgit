import { hashPassword } from "./bcrypt.js"
import { isValidEmail } from './tool.js';
import { sendEmail } from './email.js';
import { generateRandomString } from "./tool.js"
import { host } from "./config.js";
import { config } from "dotenv";
export function reg(db)
{
    return async (req,res) => {
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
    //存储token
    const link_token = generateRandomString(10)
    const result = await collection.insertOne({
        username: username,
        password : safe_password,
        email : email,
        link_token : link_token,
        isActive: false  // 邮箱未验证，默认为 false
    })
    //调试
    console.log("插入成功:", result.insertedId);
    console.log(safe_password);
    
    



    //发送验证邮箱
    vEmail(email,link_token)

    // 返回
    res.status(201)
    res.json({ data: req.body, code: 200});


}
}

async function vEmail (email,link)
{
    
    sendEmail(email, 'Pdnode-Acc', `This is the verification link: http://${host}/api/email/v/${link}/`)
    console.log("已发送验证邮件到：", email)
}

// vEmail("gretren@pdnode.com")


export function apiVEamil(db)
{
    return async (req,res) => {
        const token = req.params.token
        console.log("接收到验证")
        const collection = db.collection('users');
        const vUser = await collection.findOne({ link_token: token })

        if (!vUser) {
            return res.status(400).json({
                "error":'token not found',
                "code":400
            })
        }

        console.log(vUser)
        console.log("正在更改状态中")
        await collection.updateOne(
            {link_token: token},
            { $set:{ isActive:true } }
        )
        console.log("更改状态成功")
        res.status(200)
        res.json({
            "message":'email verified',
            "code":200,
            "token": token
        })
    }
}



export function login(db)
{
    return async (req, res) => {
        console.log("--------登录请求--------\n正在获取参数")
        const password = req.body.password
        const username = req.body.username

        console.log("开始验证")
        if (!username ||!password) {
            console.log("参数错误")
            return res.status(400).json({
                error: "Not have username or password",
                code: 400
            })
        }


        console.log(username, password)
        console.log("查询数据库中……")
        const collection = db.collection('users')
        const hash_password = await hashPassword(password)
        const user = await collection.findOne({ username: username, password: hash_password })

        if (!user) {
            console.log("账号或密码不正确")
            return res.status(401).json({
                error: "Invalid username or password",
                code: 401
            })
        }
        console.log(user)
    }
}
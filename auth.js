import { hashPassword, verifyPassword } from "./bcrypt.js"
import { sendEmail } from './email.js';
import { generateRandomString,verifyToken,generateToken,isValidEmail } from "./tool.js"
import { email, host } from "./config.js";
import { config } from "dotenv";
import { hash } from "bcrypt";
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

    //验证是否有一样的用户名和邮箱
    const user = await collection.findOne({$or: [{username: username}, {email: email}]})
    if (user) {
        res.status(400)
        res.json({
            "error":'username or email already exists',
            "code":400
        });
        return;
    }

    // 开始插入数据
    // 注意：此处并未对 password 进行安全检查，在实际应用中需要对 password 进行严格的检查
    // 如：检查 password 长度，是否包含特殊字符等。
    // 请自行在应用中添加此项检查。

    // 请注意：此处使用了 bcrypt.js 进行 password 哈希，请在您的应用中使用更安全的 password hashing 库。
    // 如：bcryptjs 或 argon2。
    // 请自行在应用中添加此项功能。

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
        const user = await collection.findOne({ username: username})
        if (!user)
            {
                console.log("账号不存在")
                return res.status(401).json({
                    error: "Invalid username",
                    code: 401
                })  // 请自行返回 401 状态码并返回相关信息
            }
        const isTruePassword = await verifyPassword(password, user.password)



        if (!isTruePassword) {
            console.log("账号或密码不正确")
            console.log(username, password,isTruePassword,user.password, await hashPassword(password))
            return res.status(401).json({
                error: "Invalid username or password",
                code: 401
            })
        }
        if (!user.isActive) {
            console.log("邮箱未验证")
            return res.status(401).json({
                error: "Email not verified",
                code: 401
            })
        }
        const token = generateToken({username: username,email:user.email})

        console.log(verifyToken(token))

        res.status(200).json({
            message: "Login success",
            code: 200,
            user: user,
            token: token // 请自行生成并返回 token
        })
        console.log(user)
    }
}

export function loginAuth(db){
    return async (req,res,next) => {
        console.log("中间件login")
        const auth = req.headers["authorization"];
        console.log(auth);
        // console.log(req.headers);  // 打印所有请求头部
        if (!auth){
            return res.status(401).json({
                error: "Token required",
                code: 401
            })
        }
        const token = auth.split(" ")[1]?.trim();
        console.log("提取的 token:", token);

        let vtoken

        try {
            vtoken = verifyToken(token)
        } catch (error) {
            return res.status(500).json({ error:"Error verifying token"})
        }
        console.log(vtoken)

        if (!token){
            return res.status(401).json({
                error: "Invalid token",
                code: 401
            })
        }

        const collection = db.collection("users")
        const user = await collection.findOne({username: vtoken.username})

        console.log(user)

        if (!user) {
            return res.status(401).json({
                error: "Invalid token",
                code: 401
            })
        }

        req.user = user
        req.token = token  // 请自行将 token 保存在 req 上，以便后续使用。

        next()

    }
}
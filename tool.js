import jwt from 'jsonwebtoken';
import {secretKey} from "./config.js"
 
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
  // 用于签名的密钥

// 生成 token
export function generateToken(payload) {


    const token = jwt.sign(payload, secretKey, {
        expiresIn: '1h',  // token 过期时间（可选）
    });

    return token;
}
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded; // 返回解码后的数据
    } catch (error) {
        console.error('Invalid or expired token', error);
        return null; // 返回 null 或其他错误处理
    }
}
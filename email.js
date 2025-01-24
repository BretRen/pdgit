import nodemailer from 'nodemailer';
import { email, email_password, email_host } from './config.js'

    const transporter = nodemailer.createTransport({
        host: email_host, // SMTP 主机，例如 smtp.gmail.com
        port: 587, // 常用端口：587（TLS）或 465（SSL）
        secure: false, // 如果是 465 端口，设置为 true
        auth: {
            user: email,
            pass: email_password
        }
    })

// 邮件发送函数
export async function sendEmail(to, subject, text) {

    try {
        const info = await transporter.sendMail({
            from: `"PdNode" <${email}>`, // 发件人
            to: to, // 收件人（可以是多个，以逗号分隔）
            subject: subject, // 邮件主题
            text: text, // 邮件内容
        });
        console.log('邮件发送成功:', info.messageId);
    } catch (error) {
        console.error('邮件发送失败:', error);
    }
}

// 调用函数发送邮件
// sendEmail('gretren@pdnode.com', 'Test Email', 'This is a test email.');
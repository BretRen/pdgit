import bcrypt from 'bcrypt';

// 加密密码
export async function hashPassword(password) {
    const saltRounds = 10; // 盐的轮数，越高越安全，但性能会变慢
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// 验证密码
export async function verifyPassword(inputPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
    return isMatch;
}

import { verifyToken } from './tool.js';
export function userInfo(db) {
    return (req, res) => {
        res.json({
            data: {
                username: req.user.username,
                email: req.user.email,
                isActive: req.user.isActive,
            },
            code: 200,
        })

    }
}
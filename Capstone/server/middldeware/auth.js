import jsonwebtoken from 'jsonwebtoken'
const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1]
        // console.log('token', token)
        if (!token) {
            return res.status(401).json({
                message: 'user is not login ....'
            })
        }
        let payload = await jsonwebtoken.verify(token, 'studentKey')
        console.log(payload);
        req.userid = payload.userid;
        req.role = payload.role;

        next()
    } catch (error) {
         res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
}
export {auth}
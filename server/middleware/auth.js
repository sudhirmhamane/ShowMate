import { clerkClient } from "@clerk/express"

export const protectUser = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);

        if (user.privateMetadata.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized - Admin access required'
            });
        }

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Not authorized"
        });
    }
};
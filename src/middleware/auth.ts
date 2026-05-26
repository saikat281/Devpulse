import type { NextFunction, Request, Response } from "express";
import type { Roles } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: Roles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({

                success: false,
                message: "Unauthorized access!"

            })
        }

        const decoded = jwt.verify(
            token as string,
            config.jwt_secret as string,
        ) as JwtPayload;
        
        console.log(decoded);

        if (!decoded?.email) {
            return res.status(401).json({

                success: false,
                message: "Unauthorized access!"

            })
        }


        const userData = await pool.query(
            `
        SELECT * FROM users WHERE email=$1
        `,
            [decoded?.email],
        );

        if (userData.rowCount === 0) {
            return res.status(404).json({

                success: false,
                message: "User not found!"

            })
        }

        if (roles.length && !roles.includes(decoded?.role)) {
            return res.status(403).json({

                success: false,
                message: "Access forbidden!",
                data:decoded?.role

            })
        }

        req.user = decoded;
        next();
    };
};

export default auth;
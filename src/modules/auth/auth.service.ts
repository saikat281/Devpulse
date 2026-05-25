import { pool } from "../../db";
import { userRoles } from "../../types";
import bcrypt from "bcryptjs";

const createUserInDB = async (payload: any) => {
    const { name, email, password, role } = payload;

    if (role && role !== userRoles.contributor && role !== userRoles.maintainer) {
        throw new Error("Invalid Role!");
    }

    const passwordHash = await bcrypt.hash(password, 15);


    const result = await pool.query(
        `
    INSERT INTO users(name , email , password , role) VALUES ($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
    `,
        [name, email, passwordHash, role],

    );

    delete result.rows[0].password;
    return result;
}



export const authService = {
    createUserInDB,
}
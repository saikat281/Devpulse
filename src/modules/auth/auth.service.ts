import config from "../../config";
import { pool } from "../../db";
import { userRoles } from "../../types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import type { ILoginPayload, Iuser } from "./auth.interface";

const createUserInDB = async (payload: Iuser) => {
    const { name, email, password, role } = payload;

    if (role && role !== userRoles.contributor && role !== userRoles.maintainer) {
        throw new Error("Invalid Role! Role must be contributor or maintainer");
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

const loginUserIntoDB = async (payload: ILoginPayload) => {
  


  const { email, password } = payload;

  

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  if (userData.rowCount === 0) {
    throw new Error("Invalid credentials!");
  }

  const user = userData.rows[0];

  const MatchPassword = await bcrypt.compare(password, user.password);
  console.log(MatchPassword)
  if (!MatchPassword) {
    throw new Error("Invalid credentials!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accesstoken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });
  delete user.password;
  return { accesstoken, user };
};



export const authService = {
    createUserInDB,loginUserIntoDB
}
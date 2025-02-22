import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET= "secret"
export function middleWare(req:Request,res:Response ,next:NextFunction){
    const token = req.headers["authorization"] || "";

    const decoded = jwt.verify(token, JWT_SECRET ) as {userId :string};

    if(decoded){
        req.userId = decoded.userId;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not authorized to access this resource"
        })
    }

}


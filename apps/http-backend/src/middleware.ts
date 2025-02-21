import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET= "secret"
export function middleWare(req:Request,res:Response ,next:NextFunction){
    const token = req.headers["authorization"] || "";

    const decoded = jwt.verify(token, JWT_SECRET )

    if(decoded){
        //@ts-ignore
        //how can you update the structure of request 
        req.userId = decoded.userId;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not authorized to access this resource"
        })
    }

}
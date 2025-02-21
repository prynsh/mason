import express from "express";
import jwt from "jsonwebtoken"
import { middleWare } from "./middleware";
import {SignupSchema, SignInSchema, NotesSchema}  from "@repo/common/types"
import { User , Note } from "@repo/db/client"
import bcrypt from "bcrypt"


const app = express();
app.use(express.json());

const JWT_SECRET= "secret"


app.post("/signup", async (req,res)=>{
    
    const parsedData = SignupSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(411).json({
            message:"Incorrect Inputs"
        })
        return;
    }
    try{
        const hashedPassword = await bcrypt.hash(parsedData.data?.password, 10)
        const user = await User.create({
                email:parsedData.data?.email,
                password:hashedPassword,
            })
        res.json({
            userId:user._id.toString()
        })
    }catch(e){
        res.status(411).json({
            message:"User already exists"
        })
    }

})
app.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) { 
        res.status(411).json({ message: "Incorrect Inputs" });
        return;
    }

    try {
        const user = await User.findOne({ email: parsedData.data.email });
        if (!user) {
            res.status(401).json({ message: "Invalid email" }); 
            return;
        }

        const isPasswordValid = bcrypt.compare(parsedData.data.password, parsedData.data.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            message: "Signin successful",
            token
        });

    } catch (e) {
        console.error("Signin error:", e);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.get("/bulk",middleWare,(req,res)=>{
    //db call
    res.json({
        message:"Hi"
    })
})
app.patch("/",(req,res)=>{
    res.json({
        message:"Hi"
    })
})
app.delete("/",(req,res)=>{
    res.json({
        message:"Hi"
    })
})

app.listen(3001)
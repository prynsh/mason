import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { middleWare } from "./middleware";
import {SignupSchema, SignInSchema, NotesSchema}  from "@repo/common/types"
import { User , Note } from "@repo/db/client"
import bcrypt from "bcrypt"
import cors from "cors"


const app = express();
app.use(express.json());
app.use(cors());


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
        console.log(user)
        if (!user) {
            res.status(401).json({ message: "Invalid email" }); 
            return;
        }

        const isPasswordValid = bcrypt.compare(parsedData.data.password, user.password as string);
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

app.post("/notes/create", middleWare, async (req: Request, res: Response):Promise<any> => {
    const parsedData = NotesSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(411).json({ message: "Incorrect Inputs" });
    }

    try {
        const userId = req.userId; 

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newNote = await Note.create({
            title: parsedData.data.title,
            content: parsedData.data.content,
            done: parsedData.data.done,
            tags:parsedData.data.tags,
            userId: userId  
        });

        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/notes/bulk", middleWare, async (req:Request, res) => {
    try {
        const userId = req.userId; 
        
        const notes = await Note.find({ userId }); 
        console.log(notes)

        res.json({
            message: "Notes fetched successfully",
            notes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.patch("/notes/:id", middleWare, async (req: Request, res: Response):Promise<any> => {
    try {
        const userId = req.userId; 
        const noteId = req.params.id; 
        const updateData = req.body; 

        if (!noteId) {
            return res.status(400).json({ message: "Note ID is required" });
        }

        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        if (updateData.content) note.content = updateData.content;

        await note.save(); 

        res.json({ message: "Note updated successfully", note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.delete("/notes/:id", middleWare, async (req: Request, res: Response):Promise<any> => {
    try {
        const userId = req.userId; 
        const noteId = req.params.id; 

        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        await Note.deleteOne({ _id: noteId }); 

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3001)
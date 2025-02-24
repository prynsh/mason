import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

  mongoose.connect(process.env.DATABASE_URL)

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  }
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  tags: {
    type: [String]
  },
  aiSummary: {
    type: String,
    default: null  
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

export { User, Note };

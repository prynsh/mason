import mongoose from "mongoose";
mongoose.connect("mongodb+srv://Mason:WVnRatXunvZkdaih@mason.gko53.mongodb.net/smart_notes")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  }
});

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

export { User, Note };

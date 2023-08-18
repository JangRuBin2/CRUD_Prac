import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/test_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions);

interface MessageDocument extends Document {
  title: string;
  content: string;
}

const messageSchema = new Schema<MessageDocument>({
  title: String,
  content: String
});

const Message = mongoose.model<MessageDocument>('Message', messageSchema);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/sendText', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const newMessage = new Message({ title, content });
    await newMessage.save();
    res.status(201).json({ message: 'Message added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding message' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

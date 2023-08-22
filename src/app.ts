import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import path from 'path';

const app = express();
//요청 본문 내용 json 파싱
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));
//mongoDB 연결
mongoose.connect('mongodb://localhost:27017/test_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions);

interface MessageDocument extends Document {
  title: string;
  content: string;
}
// 스키마 생성
const messageSchema = new Schema<MessageDocument>({
  title: String,
  content: String
});
// 모델 생성
const Message = mongoose.model<MessageDocument>('Message', messageSchema);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/write.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'write.html'));
});
app.get('/index.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/edit.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'edit.html'));
});
app.get('/loadContent', async(req : Request, res : Response) => {
  const messages = await Message.find();
  const formattedMessage = messages.map(message => ({
    title : message.title,
    content : message.content,
    id : message.id
  }))
  res.json(formattedMessage);
})
app.post('/sendText', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const newMessage = new Message({ title, content });
    //db에 저장
    await newMessage.save();
    res.status(201).json({ message: 'Message added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding message' });
  }
});
app.put('/editContent', async (req : Request, res : Response) => {
  try {
    const {title, content, id} = req.body;
    console.log(title, content, id);
    const messageToUpdate = await Message.findOne({ _id: id });
    if (!messageToUpdate) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }
    messageToUpdate.title = title;
    messageToUpdate.content = content;
    await messageToUpdate.save();
    res.status(200).json({ message: '게시물 수정이 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '게시물 수정 중 오류가 발생했습니다.' });
  };
})
app.listen(3000, () => {
  console.log('Server is running');
});

import express from 'express';
import mongoose, { Document, Schema } from 'mongoose';

const app = express();
const port = 3000;

// MongoDB 연결 문자열 (본인의 MongoDB 서버 주소로 변경)
const connectionString = 'mongodb://localhost:27017/test_db';

// Mongoose 라이브러리로 MongoDB 연결 시도.
mongoose
  .connect(connectionString)
  .then(() => console.log('Connected to MongoDB using Mongoose'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));


// Mongoose 스키마 및 모델 정의
interface ItemDocument extends Document {
  name: string;
  description: string;
}

const itemSchema = new Schema<ItemDocument>({
  name: String,
  description: String,
});

const Item = mongoose.model<ItemDocument>('Item', itemSchema);

// Express 라우트 설정 - MongoDB에서 데이터 가져오기
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send('Error fetching items: ' + error);
  }
});


// 서버 시작
app.listen(port, () => {
 console.log(`서버가 ${port} 포트에서 실행 중`);
});

import express from 'express';
import mongoose from 'mongoose';
const app = express();
mongoose.connect("mongodb://localhost:27017/QuizData");
const port = 5000;
import reg from './postCallbacks/reg.js';
import login from './postCallbacks/login.js';
import create from './postCallbacks/create.js';
import dashboardData from './postCallbacks/dashboardData.js';
import handleQuiz from './postCallbacks/quiz.js';
import handleAns from './postCallbacks/handleAns.js';

app.use(express.json());

app.post('/reg', (req, res) => {reg(req,res)});
app.post('/login', (req, res)=>{login(req.body, res)});
app.post('/create', (req, res)=>{create(req, res)});
app.post('/dash', (req, res)=>{dashboardData(req, res)});
app.post('/quiz', (req, res)=>{handleQuiz(req, res)});
app.post('/submitQuiz', (req, res)=>{handleAns(req, res)});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

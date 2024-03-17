const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8888;

const multer = require('multer');
const upload = multer();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.array());

// 라우터
const apiRouter = require('./api/index');
// const userRouter = require('./api/user');
// const movieRouter = require('./api/movie');

app.use('/public', express.static('public/'));
app.use('/api', apiRouter);
// app.use('/api/user', userRouter);
// app.use('/api/movie', movieRouter);

app.use((req, res, next) => {
  res.status(404).send('404');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('error');
});

var server = app.listen(port, () => {
  console.log('listening on port', port);
});
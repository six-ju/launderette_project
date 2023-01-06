const express = require('express');
const app = express();
const port = 8080;

const router = require('./routes');

app.use(express.static('front'));
app.use(express.json());
app.use(express.urlencoded());
app.use('/api', router);

app.listen(port, () => {
  console.log(port, '포트로 서버가 켜졌어요!');
});

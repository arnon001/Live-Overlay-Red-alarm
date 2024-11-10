const express = require('express');
const app = express();
const PORT = process.env.PORT || 1234;
const axios = require('axios');

app.set('view engine', 'ejs');
app.use(express.static('public'));

const interval = 500; // Polling every 0.5 seconds

var poll = function () {
  axios.get('https://kore.co.il/redAlert.json')
  .then(response => {
    currentAlert = response.data;

    setTimeout(poll, interval);
  })
}

app.get('/', (req, res) => {
  res.render('index', { alert: currentAlert });
});

app.get('/alert', (req, res) => {
  res.json(currentAlert || {});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

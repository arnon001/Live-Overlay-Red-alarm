const express = require('express');
const pikudHaoref = require('pikud-haoref-api');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const interval = 750; // Polling every 0.5 seconds
let currentAlert = null;
const pollForAlerts = () => {
  const options = {
    // proxy: 'http://user:pass@hostname:port/' (if needed outside Israel)
  };

  pikudHaoref.getActiveAlert((err, alert) => {
    setTimeout(pollForAlerts, interval);

    if (err) {
      console.error('Error retrieving active alert:', err);
      return;
    }

    // Only update if there is a new alert
    if (alert && JSON.stringify(alert) !== JSON.stringify(currentAlert)) {
      console.log('New alert:', alert);
    }

    currentAlert = alert || null; // Set to null if no active alert
  }, options);
};

// Start polling for alerts
pollForAlerts();



app.get('/', (req, res) => {
  res.render('index', { alert: currentAlert });
});

app.get('/alert', (req, res) => {
  res.json(currentAlert || {});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

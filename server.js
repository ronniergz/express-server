const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', port)

// --------------  HTTP  ----------------------//
// app.listen(port, () => {
//   console.log(`Server is listening at http://localhost:${port}`);
// })
// ---------------------------------------------//


// --------------  HTTPS  -------------------- //
const https = require('https');
const credentials = {
  cert: fs.readFileSync('localhost.crt',`utf-8`),
  key: fs.readFileSync('localhost.key', 'utf-8')
};
const httpsServer = https.createServer(credentials, app)

app.set('secPort', port+443);

// Redirect all traffic to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

httpsServer.listen(app.get('secPort'), () => {
  console.log("HTTPS Server is listening on port", app.get('secPort'));
})
// ---------------------------------------------//

// Get Message from server
app.get('/api/message', cors(), (req, res) => {
  console.log('GET /api/message');
  res.send("This is the message from the server");
});

// Send message from input field (JSON format)
app.post('/api/message', cors(), (req, res) => {
  console.log('POST /api/message');
  console.log(req.body);
  res.send('New message received: ' + JSON.stringify(req.body.message));
});

process.once('SIGUSR2', function () {
  httpsServer.close(function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

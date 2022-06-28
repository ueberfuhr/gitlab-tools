//Install express server
const express = require('express');
const root = './dist/gitlab-tools';
const app = express();

// Serve only the static files from the dist directory
app.use(express.static(root));

app.get('/gitlab-config.json', (req, res) =>
  res.json({host: '', token: ''})
);
// Routing
app.get('/issues', (req, res) =>
  res.sendFile('index.html', {root}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

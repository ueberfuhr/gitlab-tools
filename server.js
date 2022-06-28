//Install express server
const express = require('express');

const app = express();

// Serve only the static files from the dist directory
app.use(express.static('./dist/gitlab-tools'));

app.get('/gitlab-config.json', (req, res) =>
  res.json({host: '', token: ''})
);
app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/gitlab-tools/'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

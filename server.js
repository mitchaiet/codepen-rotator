const express = require('express');
const serveStatic = require('serve-static');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const baseFolder = './clocks';
const distFolder = 'dist';

function getDistFolders() {
  const folders = fs.readdirSync(baseFolder);
  const distFolders = folders.map(folder => path.join(baseFolder, folder, distFolder));
  return distFolders;
}

app.get('/website-count', (req, res) => {
  res.json({ count: getDistFolders().length });
});

app.use('/website/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const distFolders = getDistFolders();
  if (id >= 0 && id < distFolders.length) {
    serveStatic(distFolders[id])(req, res, next);
  } else {
    res.status(404).send('Website not found.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/status', (req, res) => {
  res.sendFile(path.join(__dirname, 'status.html'));
});

app.use('/status.js', serveStatic(path.join(__dirname, 'status.js')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

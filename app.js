if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(); // Trae la variable del .env automaticamente
const containerName = process.env.CONTAINER_NAME;
const connectionName = process.env.CONNECTION_NAME;

app.get('/all', (req, res) => {
  blobService.listBlobsSegmented(containerName, null, (err, data) => {
    if (err) throw err;
    let files = '';
    if (data.entries.length) {
      data.entries.forEach(element => {
        files += `<a href="https://${connectionName}.blob.core.windows.net/${containerName}/${element.name}" download>${element.name} </a><br>`
      });

      res.send(files);
    }
  })
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app;
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const mockAPIResponse = require('./mockAPI.js');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

const BASE_URL = 'https://api.meaningcloud.com/sentiment-2.1';
const API_KEY = process.env.meaning_cloud_API_KEY;

app.get('/', function (req, res) {
  // res.sendFile('dist/index.html');
  res.sendFile(path.resolve('src/client/views/index.html'));
})

app.post('/add-url', async (req, res) => {
  /* TODO:
      1. GET the url from the request body
      2. Build the URL
      3. Fetch Data from API
      4. Send it to the client
      5. REMOVE THIS TODO AFTER DOING IT 😎😎
      server sends only specified data to the client with below codes
  */

  const {articleUrl} = req.body;
  const meaningCloudApiUrl = BASE_URL + '?key=' + API_KEY + '&url=' + articleUrl + '&lang=en';
  const response = await fetch(meaningCloudApiUrl);
  try {
    const data = await response.json();
    const apiResponseData = {
      score_tag: data.score_tag,
      agreement: data.agreement,
      subjectivity: data.subjectivity,
      confidence: data.confidence,
      irony: data.irony,
    }
    console.log('send data to front-end');
    res.send(apiResponseData);
    console.log('finish sending data ' + apiResponseData);
  }catch (e) {
    console.log('Error ' + e);
  }
});

app.get('/test', function (req, res) {
  res.send(mockAPIResponse);
})

// designates what port the app will listen to for incoming requests
app.listen(8081, (error) => {
  if (error) throw new Error(error);
  console.log('Server listening on port 8081!');
})

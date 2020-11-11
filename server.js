require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns');
const random = require('random')
const url = require('url'); 
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//variables
const urlData = {
  originalURL : '',
  newURL : ''
}

//dns validation
function dnsLookup(lookupUrl) {
  
}

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//create new url
app.post('/api/shorturl/new', async function(req, res) {

  dns.lookup(url.parse(req.body.url).hostname, (err, address, family) => {
    console.log(err, address, family);

    if (address != null) {
      urlData.originalURL = req.body.url
      urlData.newURL = random.int(min = 0, max = 999)
      res.json({ original_url : urlData.originalURL, short_url : urlData.newURL});
    } else {
      res.json({ error: 'invalid url' })
    }

  });
 
});

//visit new url
app.get('/api/shorturl/:url', function(req, res) {
  req.params.url != urlData.newURL ? res.json({ error: 'invalid url' }) : res.redirect(urlData.originalURL)
}); 

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

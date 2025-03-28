const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

// SSL options
const options = {
    key: fs.readFileSync('key.pem'), // Update with your key.pem path
    cert: fs.readFileSync('cert.pem') // Update with your cert.pem path
};

// Serve static files from the Angular dist folder
app.use(express.static('dist/payment-ag'));

// Redirect all requests to `index.html` for Angular SPA routing
app.get('/callback', (req, res) => {
    res.sendFile(__dirname + '/dist/payment-ag/browser/callback/index.html');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/payment-ag/loginpage/index.html'));
})

app.get('', (req, res) => {
    res.redirect('https://172.31.20.11:443/loginpage/'); // Replace with the target URL
});

// Start the HTTPS server
https.createServer(options, app).listen(443,'0.0.0.0',  () => {
    console.log('🚀 Server running at https://webapp.sisthai-test.com');
});

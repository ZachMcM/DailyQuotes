const pm2 = require('pm2');

// Start the app
pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start({
    script: './index.js', // The path to your app's main file
    name: 'my-app', // The name to use for the app
    exec_mode: 'fork', // Run the app in a child process
  }, function (err, apps) {
    pm2.disconnect(); // Disconnect from pm2
    if (err) throw err;
  });
});

const accountSid = 'account_sid'; // Your Account SID from www.twilio.com/console
const authToken = 'auth_token'; // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const axios = require("axios");

const cron = require('node-cron');

const options = {
  method: 'GET',
  url: 'https://quotes15.p.rapidapi.com/quotes/random/',
  params: {language_code: 'en'},
  headers: {
    'X-RapidAPI-Key': 'rapidapi_key',
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
  }
};

cron.schedule('30 6 * * *', () => {
  
  axios.request(options).then(function (response) {
    client.messages
    .create({
      body: "\nQuote: " + response.data.content + "\n " + "\nAuthor: " + response.data.originator.name + "\n " + "\nLink: " + response.data.url, 
      from: '+twilio_number',
      to: '+your_number', 
     })
    .then(message => console.log(message.sid));
  }).catch(function (error) {
      console.error(error);
  });

});

cron.schedule('0 22 * * *', () => {
  
  axios.request(options).then(function (response) {
    client.messages
    .create({
      body: "\nQuote: " + response.data.content + "\n " + "\nAuthor: " + response.data.originator.name + "\n " + "\nLink: " + response.data.url, 
      from: '+twilio_number',
      to: '+your_number', // Text this number from: '+19706382686', // From a valid Twilio number
     })
    .then(message => console.log(message.sid));
  }).catch(function (error) {
      console.error(error);
  });

});
      



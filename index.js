var express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {

    res.set({
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Credentials' : 'true',
      'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers' : 'Origin, Content-Type, Accept'
    })
    res.sendFile(__dirname + "/index.html");
  })

app.listen(process.env.PORT || 3000,() => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
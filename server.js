var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var user        = require('./routes/user');
var path        = require('path'); 

// Constants
var PORT = 80;

// App
var app = express();
process.env.JWT_SECRET = 'chitek123';

process.env.USER_PHOTO_TEMP_DIR = path.join(__dirname, 'tmp');
process.env.USER_PHOTO_DIR = path.join(__dirname, 'public/static/user/photo');



var port = process.env.MONGODB_PORT_27017_TCP_PORT;
var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
var instance = process.env.MONGODB_INSTANCE_NAME;
var password = process.env.MONGODB_PASSWORD;
var username = process.env.MONGODB_USERNAME;
// 'mongodb://user:pass@localhost:port/database'
mongoose.connect('mongodb://' + username + ':' + password +'@' + addr + ':' + port + '/' + instance);
/*
var port = 27017;
var addr = '127.0.0.1';
var instance = 'sample';


mongoose.connect('mongodb://@' + addr + ':' + port + '/' + instance);
*/

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
  


app.post('/api/user/signin', user.signin);
app.post('/api/user/signup', user.signup);
app.get('/api/user/me',ensureAuthorized, user.me);

app.post('/api/user/upload', ensureAuthorized, user.checkToken, user.upload);
app.get('/api/user/photo', user.photo);

app.post('/api/user/update', ensureAuthorized, user.checkToken, user.update);






function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});


app.listen(PORT, function() {
          console.log('Running on http://localhost:' + PORT);
});


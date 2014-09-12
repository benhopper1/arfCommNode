
//TODO: create rel-paths for libs
var express = require('/nodejs_modules/node_modules/express');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');

//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('arfmvc.conf', 'utf8');
configData = JSON.parse(configData);

var basePath = path.dirname(require.main.filename);
console.log('basePath:'+basePath);


var phpExpress = require('/nodejs_modules/node_modules/php-express')({
        binPath: '/usr/bin/php' // php bin path.
});

var bodyParser = require('/nodejs_modules/node_modules/body-parser');

var logger = require('/nodejs_modules/node_modules/morgan');
var methodOverride = require('/nodejs_modules/node_modules/method-override');
var cookieParser = require('/nodejs_modules/node_modules/cookie-parser');
var expressSession = require('/nodejs_modules/node_modules/express-session');
var router = require('/nodejs_modules/node_modules/router')();

//TODO: --build db connection HERE--------
var Connection = require(__dirname + '/models/connection.js');
//---done statically here so connection will be prepared for future and share
var connection = Connection.getMaybeCreate(
	{
		instanceName:'arf',
		host:'127.0.0.1',
		user:configData.mysqlServerConnection.user,
		password:configData.mysqlServerConnection.password,
		database:'newWally'

	}
);



// some environment variables
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//---------setup for PHP RENDERING---------------
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser('server secret here'));
app.use(expressSession({secret: 'server secret cat man do', saveUninitialized: true, resave: true}));
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));


//---CUSTOM DATA FOR ROUTES AND JADE-------------------------
app.use(function (req, res, next){
	req.custom = 
		{
			tester:function(){
				console.log('tester worked!!');
				return 77;
			},
			tester2:function(){
				console.log('tester worked!!');
				return 77;
			},
			basePath:path.dirname(require.main.filename)

		}
	next();
});



//----------dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file){
  	if(file.substr(-3) == '.js'){
  		console.log(file);
      	route = require('./controllers/' + file);
      	route.controller(app);
  	}
});

//----H T T P   S E R V E R -----------------------
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



//-------S E C U R E   H T T P S   S E R V E R---------------------------------
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/nodejs_modules/node_modules/key.pem'),
  cert: fs.readFileSync('/nodejs_modules/node_modules/cert.pem')
};

https.createServer(options, app).listen(8000);

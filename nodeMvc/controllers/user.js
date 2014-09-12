var UserModel = require('../models/usermodel');
var userModel = new UserModel();
module.exports.controller = function(app) {

    /**
     * a home page route, testing php rendering...
     */
      app.get('/signup', function(req, res) {
            // any logic goes here
            req.session.userName = "Ben TTr-3";      
            console.log("app get signup");
            res.render('users/index.php')
      });

    /**
     * L O G I N 
     */
    //----G E T -----
    app.get('/login', function(req, res) {
        console.log("get")  ;
        console.log("HOST:"+req.hostname);        
        console.log("UserName:"+req.session.userName);
        console.log(req.body);
        res.render('users/login.jade',
            {
                data:'',
                customData:req.custom
            }
        );     
    });
    //-----P O S T ------
    app.post('/getUserData', function(req, res){
      	console.log("post getUserData")  ;
      	console.log("HOST:"+req.hostname);        
        console.log("UserName:"+req.session.userName);
        console.dir(req.body);
        //req.session.destroy();
        //--------lookup user and verify------------
        userModel.verifyAndGetUserData(
            {
                userName:req.body.userName,
                password:req.body.password,

                onSuccess:function(inUniRecord, inFields){
                    console.log("verfyPass:"+JSON.stringify(inUniRecord));                
                    //cookie time!!!
                    userModel.processCookie(
                        {
                            userRecord:inUniRecord,
                            responseRef:res,
                            requestRef:req,
                            onSuccess:function(){console.log("cookie thingy finished");},
                            onFail:function(){}
                        }
                    );
                },

                onFail:function(inError){console.log("username/password FAILED!!!");}
            }
        );
        
    });

    /**
     * L O G O U T 
     */
    app.get('/logout', function(req, res) {
        // any logic goes here
        console.log("HOST:"+req.hostname);        
        console.log("UserName:"+req.session.userName);
        req.session.destroy();
        var outData = {};
        userModel.getUsers(outData, function(inErr, inRows, inFields){
            res.render('users/login.jade',{data:inRows})
        });
      
    });



}
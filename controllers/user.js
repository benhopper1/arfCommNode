var UserModel = require('../models/usermodel');
var userModel = new UserModel();
module.exports.controller = function(app){

    /**
     * a home page route, testing php rendering...
     */
      app.get('/createAccount', function(req, res){
            // any logic goes here
            //req.session.userName = "Ben TTr-3";      
            console.log("app get createAccount");
            res.render('users/createaccount.jade',
                {
                    data:
                        {
                            fName:'ben',
                            lName:'hopper'

                        }
                }
            );
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
                            onSuccess:function(){
                                console.log("cookie thingy finished");
                                //res.render('users/displayaccount.jade',{data:inUniRecord});
                                //res.redirect('/displayAccount');
                                // DONE HERE---
                            },
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

    /**
     * A C C O U N T  D I S P L A Y
     */
    app.get('/displayAccount', function(req, res){
        userModel.sendMail({});
        console.log('/displayAccount');
        if(!(req.cookies.userId)){
            res.redirect('/login');
        }
        //--get user record from model....
        userModel.getUserDataById(req.cookies.userId, function(inError, inUniRecord, inFields){
            console.dir(inUniRecord);
            res.render('users/displayaccount.jade', {data:inUniRecord});
        });


    });


//########################################################################################
//S E R V I C E S 
//########################################################################################
    app.post('/user/service', function(req, res){
        //securityGaurd(req, res);
        //req.body.userName,
        console.log('/user/service ENTERED');
        console.dir(req.body);
        if(req.body.command == 'editUserAccountInformation'){
            userModel.dbEditUserAccountData(
                {
                    userImagePath:req.body.userImagePath,

                    onFinish:function(err, result){
                        console.log('onFinish of /user/service (newId):' + newId);
                    }

                }
            );
            

        }

    if(req.body.command == 'addNewUserAccountInformation'){
        if(!(req.cookies.userId)){
            userModel.dbAddUserAccountData(
                {                    
                    userImagePath:req.body.userImagePath,
                    firstName:req.body.params.firstName,
                    lastName:req.body.params.lastName,
                    emailAddress:req.body.params.emailAddress,
                    userName:req.body.params.userName,
                    address:req.body.params.address,
                    city:req.body.params.city,
                    state:req.body.params.state,
                    zipcode:req.body.params.zipcode,
                    country:req.body.params.country,

                    onFinish:function(err, result){
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(err, result));
                    }

                }
            );
        }else{
            //already has id in cookie!!!! not a new user

        }

    }

    });
















    var securityGaurd = function(inReq, inRes){
        if(!(req.cookies.userId)){
            res.redirect('/login');
            return true
        }
        return false;
    }




}
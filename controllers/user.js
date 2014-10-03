var url = require('url') ;
var UserModel = require('../models/usermodel');
var userModel = new UserModel();

module.exports.controller = function(app){





    var jsdom = require("/nodejs_modules/node_modules/plates");
      app.get('/test', function(req, res){
            console.log('req.secure' + req.secure);
            console.log("app get test");
            jsdom.env(
                  "http://127.0.0.1:35001/matt",
                  ["http://code.jquery.com/jquery.js"],
                  function (errors, window) {
                    console.dir(errors);
                    console.dir(window);
                        console.log("there have been", window.$("#r4").attr('value'), "nodejs releases!");
                  }

            );


      });
      app.get('/test2', function(req, res){
            console.log('req.secure' + req.secure);
            console.log("app get test2");
            res.render('users/test.php',
                {
                    data:
                        {
                            fName:'ben',
                            lName:'hopper'

                        }
                }
            );

            

      });

      app.get('/activateAccount', function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log(queryObject);

            console.log("enableAccount");
            res.render('users/login.jade',
                {
                    data:
                        {
                            fName:'ben',
                            lName:'hopper'

                        }
                }
            );


      });



      app.get('/createAccount', function(req, res){
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
      	console.log("post getUserData");
      	console.log("HOST:"+req.hostname);
        console.log("UserName:"+req.session.userName);
        console.dir(req.body);

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
                            },

                            onFail:function(inError){
                                console.log('process cookie ERROR->:' + inError);
                            }
                        }
                    );
                },

                onFail:function(inError){console.log('FAIL: /getUserData  userModel.verifyAndGetUserData()' + inError);}
            }
        );
        
    });



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
        console.log('/user/service ENTERED');
        console.dir(req.body);
        if(req.body.command == 'editUserAccountInformation'){
            console.log('editUserAccountInformation ENTERED');
            userModel.dbEditUserAccountData(
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
                    onFinish:function(result){
                        if(!(result.error)){
                            console.log('onFinish');
                            console.dir(result);
                        }else{
                            console.log('onFinish with error');
                            console.dir(result.error);
                        }
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
        if(!(inReq.cookies.userId)){
            inRes.redirect('/login');
            return true
        }
        return false;
    }




}
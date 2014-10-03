var url = require('url') ;
var fs = require('fs');

var UserModel = require('../models/usermodel');
var userModel = new UserModel();

var MemberModel = require('../models/membermodel');
var memberModel = new MemberModel();

var uuid = require('/nodejs_modules/node_modules/node-uuid');

module.exports.controller = function(app){
	var configData = fs.readFileSync('arfmvc.conf', 'utf8');
	configData = JSON.parse(configData);


    app.get('/members/finder', function(req, res){
        console.log('/displayAccount');
        securityGaurd(req, res);

        res.render('members/test_memberfinder.jade',
            {
                data:
                {

                }
            }
        );
    });



//########################################################################################
//------  S E R V I C E S ----------------------------------------------------------------
//########################################################################################

//-- F U Z Z Y   F I N D   M E M B E R S II(2)
    app.post('/members/service/fuzzyFind', function(req, res){
        securityGaurd(req, res);


        memberModel.fuzzyFindMember(req.body.needle, req.body.populationStart, req.body.populationCount, function(err, rows, fields){
            app.render('members/component_memberfinder.jade',

                {
                    reqBody:req.body,
                    data:
                    {
                        error:err,
                        members:rows,
                        command:req.body.command
                    }
                },

                function(err, html){
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(
                        {
                            error:err,
                            html:html,
                            uuid:req.body.uuid
                        })
                    );
                }
            );

        });


    });




    var securityGaurd = function(inReq, inRes){
        //TODO add error protect against invalid posting users, create a quick hash of logined user for dbl-verify
        if(!(inReq.cookies.userId)){
            inRes.redirect('/login');
            return true
        }
        return false;
    }



}
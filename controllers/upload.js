var Model = require('../models/uploadmodel');
var model = new Model();
var path = require('path');
var fs = require('fs');
var multiparty = require('/nodejs_modules/node_modules/multiparty');
var finish = require("/nodejs_modules/node_modules/finish");

module.exports.controller = function(app){

	//-----G E T ----------------------------------------
    app.get('/upload', function(req, res){    	
        console.log("get")  ;
        console.log("HOST:"+req.hostname);        
        console.log("UserName:"+req.session.userName);
        console.log(req.body);
        console.log("MODELTEST:" + model.test());

        res.render('upload/upload_get.jade',
            {
                data:'',
                customData:req.custom
            }
        );     
    });



        //-----P O S T ---------------------------------
    app.post('/upload', function(req, res){
        //var fieldsHash = {};
        
        //var file;
        //var fileName;
        //var encoding;
        //var mimeType;



        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files){
            if(files){
                var fieldsHash = {};
                var tmpFilePath = files.uploadedFile[0].path;
                var fileName = files.uploadedFile[0].originalFilename;
                var encoding = '';
                var mimeType = '';
                var fieldName ='';

                var file = fs.createReadStream(tmpFilePath);

                Object.keys(fields).forEach(function(name){
                    fieldsHash[name] = fields[name][0];
                });

                model.processUploadedFile(
                    {
                        request:'',
                        response:'',                        
                        file:file,
                        fileName:fileName,
                        encoding:encoding,
                        mimeType:mimeType,
                        data:fieldsHash,
                        onComplete:function(inData, err){
                            console.log('onComplete of processUploadedFile');
                            console.dir(inData);
                            console.log('----------error-----------');
                            console.dir(err);
                        }
                    }
                );
            }
            
        });

    });

}

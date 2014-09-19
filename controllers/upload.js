var Model = require('../models/uploadmodel');
var model = new Model();
var path = require('path');
var fs = require('fs');

module.exports.controller = function(app){

	//-----G E T -------
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

    

        //-----P O S T ------
    app.post('/upload', function(req, res){
        //console.dir( req);
    	

        var fieldsHash = {};
        var fieldName;
        var file;
        var fileName;
        var encoding;
        var mimeType;

        req.busboy.on('field', function(inFieldName, invalue, something0, somethig1){
            console.log('onfield');
            //--collecting input fields------------
            fieldsHash[inFieldName] = invalue;
            req.busboy.on('end', function(){console.log('onEnd!!')});

        });

    	req.busboy.on('file', function(inFieldName, inFile, inFileName, inEncoding, inMimeType){
            //force after parse of fields,,, brute--- need asyc lib
            setTimeout(function(){
                console.log('inTimeOut');
                console.dir(fieldsHash);
                console.log('onFile');

                fieldName = inFieldName;                
                file = inFile;                
                fileName = inFileName;
                encoding = inEncoding;
                mimeType = inMimeType;
                
                console.dir(fieldsHash);                
                model.processUploadedFile(
                    {
                        request:'',
                        response:'',
                        fieldName:fieldName,
                        file:file,
                        fileName:fileName,
                        encoding:encoding,
                        mimeType:mimeType,
                        data:fieldsHash,
                        onComplete:function(inData){
                            console.log('onComplete of processUploadedFile');
                            console.dir(inData);
                        }
                    }               
                );
            },100);



        });        
        
        
        req.busboy.on('finish', function(){
            console.log("finished!!!!");

        });

        req.pipe(req.busboy);
        
    });

}

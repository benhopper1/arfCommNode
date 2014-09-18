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
    	req.pipe(req.busboy);
    	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
    		var data = {}; //crop , convert audio etc... custom data.....
    		model.processUploadedFile(req, res, fieldname, file, filename, encoding, mimetype, data, function(){
    			//post result of processUploadedFile-----
    		});
    	});

    	//req.busboy.on('file', model.processUploadedFile);
      		//console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      		//console.dir(file);

      		//--save file
      		//var saveTo = path.join(imageFolderPath, path.basename(filename));
      		//file.pipe(fs.createWriteStream(saveTo));



    	//});


    	//req.setEncoding("binary");    	
      	//console.log("post upload");
      	//console.log("path-x:"+req.custom.basePath);


      	//fileName = req.files; //.uploadedFile.name;
      	//console.log("fileName:" + fileName);







      	
        //console.log("UserName:"+req.session.userName);
        //console.dir(req.body);        
        //console.dir(req);
        
    });

}

//sftp://ben@192.168.0.16/home/ben/git_project/arfcommnode/views/upload/upload_get.jade
var path = require('path');
var fs = require('fs');


var Connection = require(__dirname + '/connection.js');
connection = Connection.getInstance('arf').getConnection();

var ModelMedia = require(path.dirname(require.main.filename) + '/models/mediastoragemodel');
var mediaStorageModel = new ModelMedia();





//model----------------
var Model = function(){
	var _this = this;


	//
	//this.getUsers = function(inData, inPostFunction){
	//	connection.query('SELECT * from tb_user', function(err, rows, fields){
	//		for(key in rows){
	//			console.log(rows[key].userName);
	//		}
	//		if(inPostFunction){inPostFunction(err, rows, fields);}
	//		
	//	});
	//}

	this.test = function(){
		return "model test from upload!!!!";
	}

	this.processUploadedFile = function(inReq, inRes, fieldName, file, fileName, encoding, mimeType, data, inPostFunction){
		//var imageFolderPath = inReq.custom.imageFolderPath;
      	//var audioFolderPath = inReq.custom.audioFolderPath;
		//console.log('----in model------');
		//console.log('File [' + fieldName + ']: filename: ' + fileName + ', encoding: ' + encoding + ', mimetype: ' + mimeType);
  		
  		//--save file
  		//var saveTo = path.join(imageFolderPath, path.basename(fileName));
  		//file.pipe(fs.createWriteStream(saveTo));
  		mediaStorageModel.storeFile(file, fileName, encoding, mimeType, data);

	}




 
}

module.exports = Model;

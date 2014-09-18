var path = require('path');
var fs = require('fs');

var os = require("os");
var uuid = require('/nodejs_modules/node_modules/node-uuid');


var Connection = require(__dirname + '/connection.js');
connection = Connection.getInstance('arf').getConnection();

//model----------------
var Model = function(){
	var _this = this;

	var basePath = path.dirname(require.main.filename);

	var configData = fs.readFileSync(basePath + '/arfmvc.conf', 'utf8');
	configData = JSON.parse(configData);

	var imageFolderPath = basePath + '/' + configData.mediaStorageModel.imageFolderPath;
  	var audioFolderPath = basePath + '/' + configData.mediaStorageModel.audioFolderPath; 


  	// determines which function to process with------
	this.storeFile = function(inFile, inFileName, inEncoding, inMimeType, data){
		//--- verify file is what it says it is!!!!
		if(!(_this.validateFileContents(inFile, inEncoding, inMimeType))){
			//-- was spoofed!!!, do not allow ----
			return false;
		}

		//---mimetype: audio/wav
		if(inMimeType.indexOf('audio') != -1){
			console.log("audio");
			_this.storeAudioFile(inFile, inFileName, inEncoding, inMimeType, data);
			return true;
		}
		console.log('ext:' + path.extname(inFileName));
		//image/jpeg
		if(inMimeType.indexOf('image') != -1 || path.extname(inFileName) == '.jpg' || path.extname(inFileName) == '.gif' || path.extname(inFileName) == '.png'){
			console.log("image");
			_this.storeImageFile(inFile, inFileName, inEncoding, inMimeType, data);
			return true;
		}

		console.log("file type will not be saved");
		
	}

	this.storeAudioFile = function(inFile, inFileName, inEncoding, inMimeType, data){
		inFileName = _this.buildUniqueName(inFileName);
		var saveTo = path.join(audioFolderPath, path.basename(inFileName));
  		inFile.pipe(fs.createWriteStream(saveTo));
  		_this.dbStoreFile(inFileName, path.join(audioFolderPath, path.basename(inFileName)), inEncoding, inMimeType, '');
  		return true;
	}

	this.storeImageFile = function(inFile, inFileName, inEncoding, inMimeType, data){
		inFileName = _this.buildUniqueName(inFileName);
		_this.dbStoreFile(inFileName, path.join(audioFolderPath, path.basename(inFileName)), inEncoding, inMimeType, '');
		var saveTo = path.join(imageFolderPath, path.basename(inFileName));
  		inFile.pipe(fs.createWriteStream(saveTo));  		
  		return true;
	}

	this.validateFileContents = function(inFile, inEncoding, inMimeType){
		//TODO: not implemented yet!!!
		return true;
	}

	this.buildUniqueName = function(inFileName){
		//var oldPathName = inFileName;		
		//var oldFileName = path.basename(inFileName, path.extname(inFileName));		
		return inFileName.replace(path.basename(inFileName, path.extname(inFileName)), uuid.v1());		
	}


	this.dbStoreFile = function(inFileName, inPathFileName, inEncoding, inMimeType, inPostFunction){
		var domain = 'HTTP://127.0.0.1';
		var internetPath = inPathFileName.replace(path.dirname(require.main.filename), domain);
		console.log('internetPath:' + internetPath);
		console.log('inPathFileName:' + inPathFileName);
		//console.dir(os.networkInterfaces( ));
		var fileName = path.basename(inPathFileName, path.extname(inPathFileName));
		console.log('fileName:' + fileName);

		var subFolders = internetPath.replace(domain, '').replace('/' + path.basename(inPathFileName), '');
		console.log('subFolders:' + subFolders);		

		var localPath = path.dirname(inPathFileName).replace(os.hostname(), "");
		console.log('localPath:' + localPath);	

		var fullPathName = internetPath;
		console.log('fullPathName:' + fullPathName);	
			

		var extension = path.extname(inPathFileName);
		console.log('extension:' + extension);

		var domainUsePath = subFolders + '/' + fileName + extension;


		var sqlString = "INSERT INTO tb_fileSystem (fileName, domain, subFolders, localPath, fullPathName, extension, domainUsePath, encoding, mime) VALUES(" + connection.escape(fileName) + ", " + connection.escape(domain) + "," + connection.escape(subFolders) + "," + connection.escape(localPath) + "," + connection.escape(fullPathName) + "," + connection.escape(extension) + ", " + connection.escape(domainUsePath) + ", " + connection.escape(inEncoding) + ", " + connection.escape(inMimeType) + " )";
		connection.query(sqlString, function(err, result){			
		//if(inPostFunction){inPostFunction(err, result, result.insertId);
			console.log('indb return:')
			console.dir(result);
			console.dir(err);
					
		});

	}





}

module.exports = Model;
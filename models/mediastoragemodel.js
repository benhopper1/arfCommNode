var path = require('path');
var fs = require('fs');

var os = require("os");
var uuid = require('/nodejs_modules/node_modules/node-uuid');

var ImageModel = require(path.dirname(require.main.filename) + '/models/' + 'imagemodel.js');
var imageModel = new ImageModel();


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
	this.storeFile = function(inData){		
		//--- verify file is what it says it is!!!!
		if(!(_this.validateFileContents(inData.file, inData.encoding, inData.mimeType))){
			//-- was spoofed!!!, do not allow ----
			return false;
		}

		//---mimetype: audio/wav
		if(inData.mimeType.indexOf('audio') != -1){
			console.log("audio");
			_this.storeAudioFile(inData.file, inData.fileName, inData.encoding, inData.mimeType, inData.onComplete);
			return true;
		}
		console.log('ext:' + path.extname(inData.fileName));
		//image/jpeg
		if(inData.mimeType.indexOf('image') != -1 || path.extname(inData.fileName) == '.jpg' || path.extname(inData.fileName) == '.gif' || path.extname(inData.fileName) == '.png'){
			console.log("image");
			_this.storeImageFile(inData.file, inData.fileName, inData.encoding, inData.mimeType, inData.data.theme, inData.onComplete);
			return true;
		}

		console.log("file type will not be saved");
		
	}

	this.storeAudioFile = function(inFile, inFileName, inEncoding, inMimeType, data){
		inFileName = _this.buildUniqueName(inFileName);

		//run converter,,, should create an array of files, same name diff extensions---

		var saveTo = path.join(audioFolderPath, path.basename(inFileName));
  		inFile.pipe(fs.createWriteStream(saveTo));
  		_this.dbStoreFile(path.join(audioFolderPath, path.basename(inFileName)), inEncoding, inMimeType, '');
  		return true;
	}

	this.storeImageFile = function(inFile, inFileNamePath, inEncoding, inMimeType, inTheme, data){
		imageModel.resizeStream(inFile, inFileNamePath, inTheme, function(err, stdout, stderr){			
			inFileNamePath = _this.buildUniqueName(inFileNamePath);
			_this.dbStoreFile(path.join(audioFolderPath, path.basename(inFileNamePath)), inEncoding, inMimeType, '');
			var saveTo = path.join(imageFolderPath, path.basename(inFileNamePath));
  			stdout.pipe(fs.createWriteStream(saveTo));
  			stdout.on('close', function(){
  				console.log("stream Written to File:" + saveTo);

			});
		});
	

  		return true;
	}

	this.validateFileContents = function(inFile, inEncoding, inMimeType){
		//TODO: not implemented yet!!!
		return true;
	}

	this.buildUniqueName = function(inFileNamePath){		
		return inFileNamePath.replace(path.basename(inFileNamePath, path.extname(inFileNamePath)), uuid.v1());		
	}


	this.dbStoreFile = function(inFileNamePath, inEncoding, inMimeType, inPostFunction){
		var domain = 'HTTP://127.0.0.1';
		var internetPath = inFileNamePath.replace(path.dirname(require.main.filename), domain);		
		var fileName = path.basename(inFileNamePath, path.extname(inFileNamePath));
		var subFolders = internetPath.replace(domain, '').replace('/' + path.basename(inFileNamePath), '');
		var localPath = path.dirname(inFileNamePath).replace(os.hostname(), "");
		var fullPathName = internetPath;
		var extension = path.extname(inFileNamePath);
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
var path = require('path');
var fs = require('fs');

var os = require("os");
var uuid = require('/nodejs_modules/node_modules/node-uuid');

var ImageModel = require(path.dirname(require.main.filename) + '/models/' + 'imagemodel.js');
var imageModel = new ImageModel();

var AudioModel = require(path.dirname(require.main.filename) + '/models/' + 'audiomodel.js');
var audioModel = new AudioModel();


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
		console.log('storeFile');
		console.dir(inData);
		//--- verify file is what it says it is!!!!
		if(!(_this.validateFileContents(inData.file, inData.encoding, inData.mimeType))){
			//-- was spoofed!!!, do not allow ----
			return false;
		}

		
		if(inData.mimeType.indexOf('audio') != -1 || path.extname(inData.fileName) == '.wav' || path.extname(inData.fileName) == '.mp3'){
			_this.storeAudioFile(inData.file, inData.fileName, inData.encoding, inData.mimeType, inData.onComplete);
			return true;
		}
		
		
		if(inData.mimeType.indexOf('image') != -1 || path.extname(inData.fileName) == '.jpg' || path.extname(inData.fileName) == '.gif' || path.extname(inData.fileName) == '.png'){			
			_this.storeImageFile(inData.file, inData.fileName, inData.encoding, inData.mimeType, inData.data.theme, inData.onComplete);
			return true;
		}
	}

	this.storeAudioFile = function(inFile, inFileName, inEncoding, inMimeType, inCompleteFunction){
		inFileName = _this.buildUniqueName(inFileName);

		if(path.extname(inFileName) == '.wav'){
			audioModel.wavStreamToMp3Stream(inFile, function(inMp3Stream, err){
				if(!(err)){
					var saveTo = path.join(audioFolderPath, path.basename(inFileName));
		  			inFile.pipe(fs.createWriteStream(saveTo));
		  			_this.dbStoreFile(path.join(audioFolderPath, path.basename(inFileName)), inEncoding, inMimeType, '');
	  			
		  			var mp3FileName = path.basename(inFileName, path.extname(inFileName)) + '.mp3';
		  			inMp3Stream.pipe(fs.createWriteStream(path.join(audioFolderPath, mp3FileName)));
		  			_this.dbStoreFile(path.join(audioFolderPath, mp3FileName), '', 'audio/mp3', '');
  				}
	  			if(inCompleteFunction){
  					inCompleteFunction(
  						{
  							fileName:path.basename(inFileName),
  							domainFilePath:configData.mediaStorageModel.imageFolderPath + '/' + path.basename(inFileName),
  							fileNameNoExt:path.basename(inFileName, path.extname(inFileName))
  						},err
					);
  				}

			});
		}
		if(path.extname(inFileName) == '.mp3'){
			
			audioModel.mp3StreamToWavStream(inFile, function(inWavStream, err){
				if(!(err)){
					var saveTo = path.join(audioFolderPath, path.basename(inFileName));
					

					inFile.pipe(fs.createWriteStream(saveTo));					
					_this.dbStoreFile(path.join(audioFolderPath, path.basename(inFileName)), inEncoding, inMimeType, '');

					var wavFileName = path.basename(inFileName, path.extname(inFileName)) + '.wav';
					inWavStream.pipe(fs.createWriteStream(path.join(audioFolderPath, wavFileName)));
					_this.dbStoreFile(path.join(audioFolderPath, wavFileName), '', 'audio/wav', '');
				}
				if(inCompleteFunction){
  					inCompleteFunction(
  						{
  							fileName:path.basename(inFileName),
  							domainFilePath:configData.mediaStorageModel.imageFolderPath + '/' + path.basename(inFileName),
  							fileNameNoExt:path.basename(inFileName, path.extname(inFileName))
  						},err
					);
  				}
			});
		}




  		return true;
	}

	this.storeImageFile = function(inFile, inFileNamePath, inEncoding, inMimeType, inTheme, inCompleteFunction){
		imageModel.resizeStream(inFile, inFileNamePath, inTheme, function(err, stdout, stderr){
			inFileNamePath = _this.buildUniqueName(inFileNamePath);
			_this.dbStoreFile(path.join(audioFolderPath, path.basename(inFileNamePath)), inEncoding, inMimeType, '');
			var saveTo = path.join(imageFolderPath, path.basename(inFileNamePath));
  			stdout.pipe(fs.createWriteStream(saveTo));
  			stdout.on('close', function(){
  				console.log("stream Written to File:" + saveTo);
  				console.dir(inCompleteFunction);
  				if(inCompleteFunction){
  					inCompleteFunction(
  						{
  							fileName:path.basename(inFileNamePath),
  							domainFilePath:configData.mediaStorageModel.imageFolderPath + '/' + path.basename(inFileNamePath)
  						}
					);
  				}
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
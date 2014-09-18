var path = require('path');
var fs = require('fs');

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
		if(!(validateFileContents(inFile, inEncoding, inMimeType))){
			//-- was spoofed!!!, do not allow ----
			return false;
		}

		//---mimetype: audio/wav
		if(inMimeType.indexOf('audio') != -1){
			console.log("audio");
			_this.storeAudioFile(inFile, inFileName, inEncoding, inMimeType, data);
			return true;
		}
		
		//image/jpeg
		if(inMimeType.indexOf('image') != -1){
			console.log("image");
			_this.storeImageFile(inFile, inFileName, inEncoding, inMimeType, data);
			return true;
		}

		console.log("problem");

		
	}



	this.storeAudioFile = function(inFile, inFileName, inEncoding, inMimeType, data){
		var saveTo = path.join(audioFolderPath, path.basename(inFileName));
  		inFile.pipe(fs.createWriteStream(saveTo));  		
  		return true;
	}

	this.storeImageFile = function(inFile, inFileName, inEncoding, inMimeType, data){
		var saveTo = path.join(imageFolderPath, path.basename(inFileName));
  		inFile.pipe(fs.createWriteStream(saveTo));  		
  		return true;
	}

	this.validateFileContents = function(inFile, inEncoding, inMimeType){
		//TODO: not implemented yet!!!
		return true;
	}





}

module.exports = Model;
var fs = require('fs'), gm = require('/nodejs_modules/node_modules/gm');
var gulp = require('/nodejs_modules/node_modules/gulp'); 
var imageResize = require('/nodejs_modules/node_modules/gulp-image-resize');


var Model = function(){
	//todo set to dir direct-----in sigle unit testing, will not work until whole unit testing..
	var configData = fs.readFileSync('/home/ben/git_project/arfcommnode/arfmvc.conf', 'utf8');
	configData = JSON.parse(configData).imageModel;
	console.dir(configData);



	this.getInformation = function(inFilePath, inPostFunction){
		gm(inFilePath).identify(function(err, data){
		  	if(inPostFunction){
		  		inPostFunction(err, data);
		  	} 
		});
	}

	//--theme settings are in the config file, settings for crop resize....
	this.resize = function(inOldFileNamePath, inNewFileNamePath, inTheme, inPostFunction){
		console.log("resize ENTERED!!!");
		gm(inOldFileNamePath)			
			.resize(configData.themes[inTheme].resizeX, configData.themes[inTheme].resizeY)
		  	.gravity('Center')

		  	//----
		  	.stroke("#ffffff")
			.drawCircle(10, 10, 20, 10)
			.font("Helvetica.ttf", 12)
			.drawText(30, 20, "GMagick!")
			//----


		  	.crop(configData.themes[inTheme].cropX, configData.themes[inTheme].cropY)			
			.write(inNewFileNamePath, function(err){
				if(inPostFunction){inPostFunction(err);}			  
			})
	}

}

module.exports = Model;




//---- single unit testing -------------------------------------------------------------------

//     /home/ben/git_project/arfcommnode/public/images/arf_83_0.jpg


//var filePath = '/home/ben/git_project/arfcommnode/public/images/arf_83_0.jpg';
var filePath ='/home/ben/git_project/arfcommnode/public/images/3961ed30-3f9a-11e4-912b-958409e520ae.jpg';
var xfilePath = '/home/ben/git_project/arfcommnode/public/images/arf_83_0B.jpg';

var model = new Model();
model.getInformation('/home/ben/git_project/arfcommnode/public/images/arf_83_0.jpg', function(inErr, inData){
	console.dir(inErr);
	console.dir(inData);
})

model.resize(filePath, xfilePath, 'normalUserImage', function(inErr){
	console.log(inErr);
});
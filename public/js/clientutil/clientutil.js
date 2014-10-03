
var clientUtilModule = new function(){
	console.log('LOADING ->: clientUtilModule');

	/*
	*--instance: serverAddress, fileFilter
	*
	*--send():data, onResponse
	*
	*
	*/

	
	this.InputFileObject = function(inServerAddress, inFileFilter){

		//--STATIC---------------------------------------------
		if(typeof clientUtilModule.InputFileObject.indexCounter === 'undefined'){
			clientUtilModule.InputFileObject.indexCounter = 0;
		}else{
			clientUtilModule.InputFileObject.indexCounter += 1;
		}

		//----INSTANCE------------------------------------------
		var _this = this;
		var index = clientUtilModule.InputFileObject.indexCounter;
		var id = 'inputFileArea_' + index;

		var ajaxPostObject = new clientUtilModule.AjaxPostObject(inServerAddress);

		var filter = [];


		//build----------------------
		if(!(typeof inFileFilter === 'undefined')){
			filter = inFileFilter;
			for(index in filter){
				if(filter[index].indexOf('.') == -1){
					filter[index] = '.' + filter[index];
				}
			}
		}


	    if (! $('#' + id).length){
	        $( "body" ).append('<div id="' + id + '"><input type="file" id="' + id + '_file" style="display:none" accept="' + filter.toString() + '"><div>');
	    }else{
	        //cleanup prior stuff
	        var control = $("#" + id + "_file");
	        control.replaceWith( control = control.clone());
	    }

	    $("#" + id + "_file").trigger( "click" );
	    // end of build----------------

	    this.showBrowse = function(){
	    	$("#" + id + "_file").trigger( "click" );
	    }

	    this.send = function(inHashOfData, inOnResponse){
	    	ajaxPostObject.uploadFileAndData(id + '_file', inHashOfData, inOnResponse);
	    }

	    this.setOnFileChange = function(inFunction){
	    	if(inFunction){
	    		$("#" + id + "_file").change(function(e){
	        		inFunction(index, "#" + id + "_file", e);
	    		});
	    	}
	    }



	}

	//##################################################################################################
	//--  A j a x P o s t O b j e c t ------------------------------------------------------------------
	//##################################################################################################

	this.AjaxPostObject = function(inServerAddress){
		var serverAddress = inServerAddress;
	    this.uploadFileAndData = function(inFileElementId, inHashOfData, onResponse){
	        var client = new XMLHttpRequest();

	        client.onreadystatechange = function() {
	            if (client.readyState == 4 && client.status == 200){
	                if(onResponse){
	                    onResponse(client.responseText);
	                }
	            }
	        }

	        var file = document.getElementById(inFileElementId);
	        var formData = new FormData();
	        //console.log(JSON.stringify(file.files[0]));
	        formData.append("uploadedFile", file.files[0]);

	        for(key in inHashOfData){
	           formData.append(key, inHashOfData[key]);
	        }

	        client.open("post", serverAddress, true);
	        client.send(formData);
	    }
	}

	//##################################################################################################
	//--  A j a x J s o n P o s t O b j e c t ----------------------------------------------------------
	//##################################################################################################
	this.AjaxJsonPostObject = function(inData){
	    var aSync = true;
	    var method = 'post';
	    var url;
	    var function_onSuccess;
	    var function_onFail;
	    
	    if(inData.url){url = inData.url;}
	    if(inData.onAjaxSuccess){function_onSuccess = inData.onAjaxSuccess;}
	    if(inData.onAjaxFail){function_onFail = inData.onAjaxFail;}

	    var xhr = new XMLHttpRequest();

	    this.send = function(inData, inOnAjaxSuccess, inOnAjaxFail){
	    	if(inOnAjaxSuccess){function_onSuccess = inOnAjaxSuccess;console.log('suc  yes man!!!');}
	    	if(inOnAjaxFail){function_onFail = inOnAjaxFail;}
	        console.log('sending');
	        xhr.open(method, url, aSync);

	        xhr.onload = function(e){
	            if (xhr.readyState === 4){
	                if(xhr.status === 200){
	                    if(function_onSuccess){function_onSuccess(xhr.responseText);}
	                }else{
	                    if(function_onFail){function_onFail(e, xhr.statusText);}
	                }
	            }
	        };

	        xhr.onerror = function(e){
	            if(function_onFail){function_onFail(e, xhr.statusText);}
	        };

	        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	        xhr.send(JSON.stringify(inData));
	    }

	}



	//##################################################################################################
	//--  B A S I C ------------------------------------------------------------------------------------
	//##################################################################################################
	this.classToHash = function(inClass){
		if(inClass.indexOf('.') == -1){inClass = '.' + inClass;}
		var fieldsHash = {};
		$(inClass).each(function(){
			fieldsHash[this.name] = this.value;
		});
		return fieldsHash
	}


}

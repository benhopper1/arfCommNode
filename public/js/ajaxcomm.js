var AjaxJsonPostObject = function(inData){
    //var data = inData;
    var aSync = true;
    var method = 'post';
    var url;
    var function_onSuccess;
    var function_onFail;
    
    if(inData.url){url = inData.url;}
    if(inData.onSuccess){function_onSuccess = inData.onSuccess;}
    if(inData.onFail){function_onFail = inData.onFail;}

    var xhr = new XMLHttpRequest();

    this.send = function(inData){
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
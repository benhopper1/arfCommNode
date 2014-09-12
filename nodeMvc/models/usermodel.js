var Connection = require(__dirname + '/connection.js');
connection = Connection.getInstance('arf').getConnection();

//model----------------
var Model = function(){
	var _this = this;
	this.getUsers = function(inData, inPostFunction){
		connection.query('SELECT * from tb_user', function(err, rows, fields){
			for(key in rows){
				console.log(rows[key].userName);
			}
			if(inPostFunction){inPostFunction(err, rows, fields);}
			
		});
	}

	this.verifyUserPassword = function(inUserName, inPassword, inPostFunction){
		var sqlString = "SELECT * from tb_user WHERE userName = '"+ inUserName + "' AND password = '" + inPassword + "'";
		connection.query(sqlString, function(err, rows, fields){			
			if(inPostFunction){inPostFunction(err, rows, fields);}			
		});
	}

	this.verifyAndGetUserData = function(inData){		
		_this.verifyUserPassword(inData.userName, inData.password, function(inErr, inRows, inFields){
			if(inRows.length > 0){
				//---user && password == good
				var sqlString = "SELECT * from vw_userData WHERE id=" + inRows[0].id;
				connection.query(sqlString, function(inErr, inRows, inFields){
					if(!(inErr)){					
						if(inData.onSuccess){inData.onSuccess(inRows[0], inFields);}
					}else{
						if(inData.onFail){inData.onFail(inErr);}
					}
				});
			}else{
				if(inData.onFail){inData.onFail(inErr);}
			}
		});		
	}

	this.verifyDeviceId = function(inUserId, inDeviceId, inPostFunction){
		var sqlString = "SELECT * from tb_userDeviceList WHERE userId = " + inUserId + " AND id = " + inDeviceId;
		connection.query(sqlString, function(err, rows, fields){			
			if(inPostFunction){inPostFunction((rows.length > 0));}			
		});
	}

	this.createNewDeviceId = function(inUserId, inAgent, inDeviceNumber, inDeviceType, inPostFunction){
		var sqlString = "INSERT INTO tb_userDeviceList (userId, userAgent, deviceNumber, deviceTypeId) VALUES(" + inUserId + ", '" + inAgent + "','" + inDeviceNumber + "', " + inDeviceType + " )";
		connection.query(sqlString, function(err, result){			
			if(inPostFunction){inPostFunction(err, result, result.insertId);}			
		});
	}

	this.processCookie = function(inData){
		if(inData.userRecord.id){
			inData.responseRef.cookie('userId', inData.userRecord.id.toString(), { maxAge: 86400000*365, httpOnly: true });
			if(inData.userRecord.userName){
				inData.responseRef.cookie('userName', inData.userRecord.userName, { maxAge: 86400000*365, httpOnly: true });
			}
			console.log("cookieT6t:"+JSON.stringify(inData.requestRef.cookies));
			if(inData.requestRef.cookies.deviceId){
				console.log("deviceId cookie exist");
				//verify id
				_this.verifyDeviceId(inData.userRecord.id, inData.requestRef.cookies.deviceId, function(inExist){					
					// check count
					if(inExist){
						//store in cookie
						inData.responseRef.cookie('deviceId', inData.requestRef.cookies.deviceId, { maxAge: 86400000*365, httpOnly: true }).send('');
						if(inData.onSuccess){inData.onSuccess();}
					}else{
						// create
						_this.createNewDeviceId(inData.userRecord.id, 'fakeAgentString', 'fakeDeviceNumber', 2, function(inErr, inResult, inNewDeviceId){
							inData.responseRef.cookie('deviceId', inNewDeviceId, { maxAge: 86400000*365, httpOnly: true }).send('');
							if(inData.onSuccess){inData.onSuccess();}
						});
					}
				});

			}else{
				// create new dev id for user
				_this.createNewDeviceId(inData.userRecord.id, 'fakeAgentString2', 'fakeDeviceNumber', 2, function(inErr, inResult, inNewDeviceId){
					inData.responseRef.cookie('deviceId', inNewDeviceId, { maxAge: 86400000*365, httpOnly: true }).send('');
					if(inData.onSuccess){inData.onSuccess();}
				});
			}
		}	
	}
 
}

module.exports = Model;

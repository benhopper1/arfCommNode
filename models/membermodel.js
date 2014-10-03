var Connection = require(__dirname + '/connection.js');
connection = Connection.getInstance('arf').getConnection();



//model----------------
var Model = function(){

	this.fuzzyFindMember = function(inNeedle, inStart, inCount, inPostFunction){
		var sqlString = "SELECT distinct vw_userTableSearchCode.id, vw_userData.* FROM vw_userTableSearchCode left outer join vw_userData on vw_userTableSearchCode.id = vw_userData.id WHERE vw_userTableSearchCode.thing like "+ connection.escape(inNeedle + '%') + " limit " + connection.escape(inStart) + ", " + connection.escape(inCount);
		connection.query(sqlString, function(err, rows, fields){
			if(inPostFunction){inPostFunction(err, rows, fields);}
		});
	}





}

module.exports = Model;
class Clicker {
	constructor(room, maker) {
		this.room = room;

	}
}


exports.commands = {
	clicker: {
		new: function (target, room, user) {
			
		}
	},

	online: function (target, room, user) {
 		if (!this.runBroadcast()) return;
		var totalUsers = 0; 
		for (var u of Users.users) {
			u = u[1];
			if (Users(u).connected) {
				totalUsers++;
			}
		}
		header = '<b><div style="font-size:11pt"><center>Utilisateurs connectés sur le serveur: <font color=green>' + totalUsers + '</font></center></b></div>';
		this.sendReplyBox(header);
	}
};

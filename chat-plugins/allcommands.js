'use strict';
const fs = require('fs');
const RESULTS_MAX_LENGTH = 10;
const MAX_REASON_LENGTH = 300;

exports.commands = {
		allcommands: function(target, room, user) {
		if (!this.runBroadcast()) return; 
		let arr = []; 
		for(let i in Chat.commands) {
			arr.push('<b>' + i + '</b>');
		}
		arr.sort(function (a, b) { return a.localeCompare(b) });
		
			this.sendReplyBox(
				'<div style="max-height: 200px ; overflow-y: scroll"><font size="3pt"><justify><u><b><i>' + // menu scroll avec le max height
				'Toutes les commandes du serveur Pokéland</u></i> (Total: ' + arr.length + ')' +
				'</b></justify></font><br /><br />' +
				arr.join(', ') + 
				'</div>'
		)
				},
};

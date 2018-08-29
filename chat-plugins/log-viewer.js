/**
 * PS Log Viewer
 * PS Server Chat-plugin
 * Add this to your servers chat-plugins directory,
 * so tokens can be generated and used for authentication.
 */
'use strict';

const FS = require('../fs.js');

//Check to see if JSON for tokens exists
if (!FS('config/log-tokens.json').readTextIfExistsSync()) {
	FS('config/log-tokens.json').write("{}");
}

exports.commands = {
	logs: 'viewlogs',
	viewlogs: function(target, room, user) {
		if (!this.can('lock') || user.group === '*') return;
		if (!this.runBroadcast()) return;
		if ((room.id !== 'staff' && room.id !== 'upperstaff') && this.broadcasting) return;
		if (!Config.logViewerLink) return this.errorReply('The log-viewer link was not provided in config.js. Please ask an Administrator to add it.');
		return this.sendReply(`|raw|<a href="${Config.logViewerLink}">Log-Viewer</a>`);
	},
	viewlogshelp: ["/viewlogs - View chat logs for the server. Requires: Global %, @, &, or ~"],

	logviewertoken: 'token',
	maketoken: 'token',
	gettoken: 'token',
	generatetoken: 'token',
	token: function(target, room, user) {
		if (!this.can('lock') || user.group === '*') return;
		let split = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*".split('');
		let token = '';
		for (let i = 0; i < 16; i++) {
			token += split[Math.floor(Math.random() * split.length)];
		}
		let self = this;
		let json = FS('config/log-tokens.json').readSync("utf-8");
		try {
			json = JSON.parse(json);
		} catch (e) {
			console.log(e);
			return self.errorReply('An error occured in token generation.');
		}
		for (let i in json) {
			if (toId(json[i].name) === user.userid) delete json[i];
		}
		json[token] = {
			name: user.name,
			expires: Date.now(),
			ip: user.latestIp,
		};
		FS('config/log-tokens.json').writeSync(JSON.stringify(json));
		self.sendReply('Your token was generated!');
		self.sendReply('[TOKEN] ' + token);
	},
	tokenhelp: ["/token - Generate a token for the log-viewer server. Requires: Global %, @, &, or ~"],
};

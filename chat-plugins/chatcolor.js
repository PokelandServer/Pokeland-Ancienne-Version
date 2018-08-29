'use strict';
/********************
 * User Commands
 * This is where miscellaneous commands that any user can use go
 ********************/
const color = require('../config/color');
const Pokedex = require('../data/pokedex.js').BattlePokedex;

function font(color, text) {
	return '<font color="' + color + '">' + text + '</font>';
}
function bold(text) {
	return '<b>' + text + '</b>';
}

exports.commands = {
	chatcolour: 'chatcolor',
	chatcolor: function (target, room, user) {
		let group = user.getIdentity().charAt(0);
		if (room.auth) group = room.auth[user.userid] || group;
		if (user.hiding) group = '~'; 
		let targets = target.split(',');
		if (targets.length < 2) return this.parse('/help chatcolor');
		if (!this.can('&') || !this.canBroadcast()) return;
		if (!this.canTalk()) return this.errorReply("You may not use this command while unable to speak.");
		this.add('|raw|' + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='background: none ; border: 0 ; padding: 0 5px 0 0 ; font-family: &quot;verdana&quot; , &quot;helvetica&quot; , &quot;arial&quot; , sans-serif ; font-size: 9pt ; cursor: pointer'><font color='" + user.name + "'>" + bold(font(color(user), user.name + ":</font></button>" + '<b><font color="' + targets[0].toLowerCase().replace(/[^#a-z0-9]+/g, '') + '">' + Chat.escapeHTML(targets.slice(1).join(",")) + '</font></b>')));
	},
	chatcolorhelp: ["/chatcolor OR /chatcolour [colour], [message] - Outputs a message in a custom colour. Requires admin."],

	/* eslint-enable */
	helixfossil: 'm8b',
	helix: 'm8b',
	magic8ball: 'm8b',
	m8b: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let results = ['Signs point to yes.', 'Yes.', 'Reply hazy, try again.', 'Without a doubt.', 'My sources say no.', 'As I see it, yes.', 'You may rely on it.', 'Concentrate and ask again.', 'Outlook not so good.', 'It is decidedly so.', 'Better not tell you now.', 'Very doubtful.', 'Yes - definitely.', 'It is certain.', 'Cannot predict now.', 'Most likely.', 'Ask again later.', 'My reply is no.', 'Outlook good.', 'Don\'t count on it.'];
		return this.sendReplyBox(results[Math.floor(20 * Math.random())]);
	},
};
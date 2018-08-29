/* Custom color plugin
 * by jd and panpawn
 */

'use strict';

const fs = require('fs');

let filepath = 'config/customcolors.json'; 
let customColors = {};

function load () {
	fs.readFile(filepath, 'utf8', function (err, file) {
		if (err) return;
		customColors = JSON.parse(file);
	});
}

load();

function updateColor() {
	fs.writeFileSync(filepath, JSON.stringify(customColors));

	var newCss = '/* Custom Colors CSS */\n';
	
	for (var name in customColors) {
		newCss += generateCSS(name, customColors[name]);
	}
	newCss += '/* End Custom Colors CSS */\n';
	
	var file = fs.readFileSync('config/custom.css', 'utf8').split('\n');
	if (~file.indexOf('/* Custom Colors CSS */')) file.splice(file.indexOf('/* Custom Colors CSS */'), (file.indexOf('/* End Custom Colors CSS */') - file.indexOf('/* Custom Colors CSS */')) + 1);
	fs.writeFileSync('config/custom.css', file.join('\n') + newCss);
}

function generateCSS(name, color) {
	let css = '';
	let rooms = [];
	name = toId(name);
	Rooms.rooms.forEach((curRoom, id) => {
		if (id === 'global' || curRoom.type !== 'chat' || curRoom.isPersonal) return;
		if (!isNaN(Number(id.charAt(0)))) return;
		rooms.push('#' + id + '-userlist-user-' + name + ' strong em');
		rooms.push('#' + id + '-userlist-user-' + name + ' strong');
		rooms.push('#' + id + '-userlist-user-' + name + ' span');
	});
	css = rooms.join(', ');
	css += '{\ncolor: ' + color + ' !important;\n}\n';
	css += '.chat.chatmessage-' + name + ' strong {\n';
	css += 'color: ' + color + ' !important;\n}\n';
	return css;
}

exports.commands = {
	customcolour: 'customcolor',
	customcolor: function (target, room, user) {
		if (!this.can('makechatroom')) return false;
		target = target.split(',');
		for (var u in target) target[u] = target[u].trim();
		if (!target[1]) return this.parse('/help customcolor');
		if (toId(target[0]).length > 19) return this.errorReply("Usernames are not this long...");
		if (target[1] === 'delete') {
			if (!customColors[toId(target[0])]) return this.errorReply('/customcolor - ' + target[0] + ' does not have a custom color.');
			delete customColors[toId(target[0])];
			updateColor();
			this.sendReply("You removed " + target[0] + "'s custom color.");
			Rooms('staff').add(user.name + " removed " + target[0] + "'s custom color.").update();
			this.privateModCommand("(" + target[0] + "'s custom color was removed by " + user.name + ".)");
			if (Users(target[0]) && Users(target[0]).connected) Users(target[0]).popup(user.name + " removed your custom color.");
			return;
		}

		this.sendReply("|raw|You have given <b><font color=" + target[1] + ">" + Chat.escapeHTML(target[0]) + "</font></b> a custom color.");
		Rooms('staff').add('|raw|' + Chat.escapeHTML(target[0]) + " has recieved a <b><font color=" + target[1] + ">custom color</fon></b> from " + Chat.escapeHTML(user.name) + ".").update();
		this.privateModCommand("(" + target[0] + " has recieved custom color: '" + target[1] + "' from " + user.name + ".)");
		customColors[toId(target[0])] = target[1];
		updateColor();
	},
	customcolorhelp: ["Commands Include:",
				"/customcolor [user], [hex] - Gives [user] a custom color of [hex]",
				"/customcolor [user], delete - Deletes a user's custom color"],

	colorpreview: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.split(',');
		for (var u in target) target[u] = target[u].trim();
		if (!target[1]) return this.parse('/help colorpreview');
		return this.sendReplyBox('<b><font size="3" color="' +  target[1] + '">' + Chat.escapeHTML(target[0]) + '</font></b>');
	},
	colorpreviewhelp: ["Usage: /colorpreview [user], [color] - Previews what that username looks like with [color] as the color."],
};
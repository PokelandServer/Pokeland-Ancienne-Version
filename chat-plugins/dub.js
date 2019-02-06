'use strict';
const http = require('http');
const https = require('https');
exports.commands = {
'!dubtrack': true,
	dub: 'dubtrack',
	music: 'dubtrack',
	radio: 'dubtrack',
	dubtrackfm: 'dubtrack',
	dubtrack: function (target, room, user) {
		if (!this.runBroadcast()) return;

		let nowPlaying = "";

		let options = {
			host: 'api.dubtrack.fm',
			port: 443,
			path: '/room/radio',
			method: 'GET',
		};

		https.get(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				if (data.charAt(0) === '{') {
					data = JSON.parse(data);
					if (data['data'] && data['data']['currentSong']) nowPlaying = "<br /><b>Now Playing:</b> " + Chat.escapeHTML(data['data']['currentSong'].name);
				}
				this.sendReplyBox('Join our dubtrack.fm room <a href="https://www.dubtrack.fm/join/pokeland_154945532058110">here!</a>' + nowPlaying);
				if (room) room.update();
			});
		});
	}

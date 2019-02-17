/**
 * Filters
 * Gold Server - http://gold.psim.us/
 *
 * Manually sets filters for chatting and names.
 * In this, we also handle proxy connections with a blacklist feature.
 * Credits: jd, panpawn
 *
 * @license MIT license
 */
'use strict';

const fs = require('fs');

let adWhitelist = Config.adWhitelist ? Config.adWhitelist : [];
let adRegex = new RegExp("(play.pokemonshowdown.com\\/~~)(?!(" + adWhitelist.join('|') + "))", "g");

let bannedMessages = Config.bannedMessages ? Config.bannedMessages : [];

let proxyWhitelist = Config.proxyWhitelist || false;

/*********************
 * Chatfilter Magic *
 * ******************/


/*********************
 * Namefilter Magic *
 * ******************/
try {
	Config.bannedNames = fs.readFileSync('config/bannednames.txt', 'utf8').toLowerCase().split('\n');
} catch (e) {
	Config.bannedNames = [];
}

function loadBannedNames() {
	try {
		Config.bannedNames = fs.readFileSync('config/bannednames.txt', 'utf8').toLowerCase().split('\n');
	} catch (e) {
		Config.bannedNames = [];
	}
}
loadBannedNames();


Chat.namefilter = function (name, user) {
	const badHosts = Object.keys(Gold.lockedHosts);
	const nameId = toId(name);

	let badNameMatch = false;
	Config.bannedNames.forEach(badName => {
		if (badNameMatch) return;
		if (badName && nameId.includes(badName)) {
			badNameMatch = true;
		}
	});
	if (badNameMatch) {
		user.send('|nametaken||Your name contains a banned word. Please change it to something appropriate.');
		user.forceRenamed = name;
		return false;
	}

	if (user.forceRenamed) {
		Monitor.log(`[NameMonitor] ${name} (forcerenamed from ${user.forceRenamed})`);
		user.forceRenamed = undefined;
	}

	// Hostfilter stuff
	if (!user.connections) return name; // this should never happen
	let conNum = Object.keys(user.connections).length - 1;
	const ip = user.connections[conNum].ip;
	const trusted = trustedHack(nameId);

	if (Config.autoSbanIps && Config.autoSbanIps.includes(ip)) {
		const added = Users.ShadowBan.addUser(user, true);
		if (added) Monitor.log(`[IPShadowBanMonitor] SHADOWBANNED: ${name}`);
		return;
	}

	Dnsbl.reverse(ip).then(host => {
		if (!host) return;
		if (badHosts.length < 0) return; // there are no blacklisted hosts (yet)

		// handling "trusted" users...
		if (trusted) return;
		
		if (proxyWhitelist && proxyWhitelist.includes(nameId)) return;

		badHosts.forEach(badHost => {
			if (host.includes(badHost)) {
				user.disconnectAll();
				user.locked = '#hostfilter';
				user.updateIdentity();
				user.popup("|modal|Tu as été automatiquement lock ! Car tu utilises un proxy ! Si tu veux être unlock désactive-le !");
				Monitor.log("[ProxyMonitor] " + name + " (" + ip + ") a était automatiquement lock et déconnecté. (" + host + ")");
				return;
			}
		});
	});

	Gold.evadeMonitor(user, name);

	return name;
};

// deal with global ranked user's manually...
function trustedHack(name) {
	let nameId = toId(name);
	let userSymbol = (Users.usergroups[nameId] ? Users.usergroups[nameId].substr(0, 1) : ' ');
	let rankIndex = (Config.groupsranking.includes(userSymbol) ? Config.groupsranking.indexOf(userSymbol) : false);
	if (rankIndex && rankIndex > 0) return true;
	return false;
}

/*********************
 * Hostfilter Magic *
 * ******************/
Gold.lockedHosts = Object.create(null);

function loadHostBlacklist() {
	fs.readFile('config/lockedhosts.json', 'utf8', function (err, file) {
		if (err) return;
		Gold.lockedHosts = JSON.parse(file);
	});
}
loadHostBlacklist();

function saveHost() {
	fs.writeFileSync('config/lockedhosts.json', JSON.stringify(Gold.lockedHosts));
}


Gold.evadeMonitor = function (user, name, punished) {
	if (punished && punished.alts) { // handles when user is unlocked
		punished.alts.forEach(alt => {
			if (Gold.punishments[toId(alt)]) delete Gold.punishments[toId(alt)];
		});
		Gold.savePunishments();
		return;
	}
	let points = 0;
	let matched = false;
	let userAgent = user.useragent;
	let ip = user.latestIp;

	if (punished) {
		if (user.permalocked) return;
		let tarId = user.userid;
		Object.keys(Gold.punishments).forEach(punished => {
			if (Gold.punishments[punished].ip === ip) matched = true;
		});
		if (!matched && !Gold.punishments[tarId]) {
			Gold.punishments[tarId] = {
				'useragent': userAgent,
				'ip': ip,
				'iprange': Gold.getIpRange(ip)[0],
				'ipclass': Gold.getIpRange(ip)[1],
				'type': punished.type,
				'expires': punished.expires,
			};
			Gold.savePunishments();
		}
	

		let reasons = [];
		let evader = '', offender = '', reason = '';
		let defaultAvatars = [1, 2, 101, 102, 169, 170, 265, 266];
		let punishedUsers = Object.keys(Gold.punishments);

		for (let i = 0; i < punishedUsers.length; i++) {
			offender = Gold.punishments[punishedUsers[i]];
			if (offender.ip === ip) break;
			if (reasons.length >= 3) break; // this should never happen
			if (offender.expires < Date.now()) {
				delete Gold.punishments[punishedUsers[i]];
				Gold.savePunishments();
			}
			if (offender.useragent && offender.useragent === userAgent) {
				reason = `have the same user agent`;
				if (!reasons.includes(reason)) {
					points++;
					reasons.push(reason);
					evader = `${offender.type} user: ${punishedUsers[i]}`;
				}
			}
			if (offender.iprange && ip.startsWith(offender.iprange)) {
				reason = `have the IPv4 class ${offender.ipclass} range (${offender.iprange}.*)`;
				if (!reasons.includes(reason)) {
					points++;
					reasons.push(reason);
					evader = `${offender.type} user: ${punishedUsers[i]}`;
				}
			}
			// this does not count AS a reason (points), but merely to add to the list of reasons
			if (defaultAvatars.includes(user.avatar)) {
				reason = `have a default avatar`;
				if (!reasons.includes(reason)) {
					reasons.push(reason);
					points = points + 0.5;
				}
			}
		}
		let staff = Rooms('staff');
		if (staff) {
			if (points >= 2) {
				Users.ShadowBan.addUser(name);
				let msg = `[EvadeMonitor] SHADOWBANNED: ${name}, evading alt of ${evader} because they ${reasons.join(' and ')}`;
				staff.add(msg).update();
				modlog(msg);
			}
		}
	}
};

exports.commands = {
	lockhost: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.parse('/help lockhost');
		if (Gold.lockedHosts[target]) return this.errorReply("The host '" + target + "' is was already locked by " + Gold.lockedHosts[target].by + ".");

		Gold.lockedHosts[target] = {
			by: user.name,
			on: Date.now(),
		};
		saveHost();

		this.privateModCommand("(" + user.name + " has blacklisted host: " + target + ")");
	},
	lockhosthelp: ["/lockhost [host] - Adds host to server blacklist.  Users connecting with these hosts will be automatically locked from connection, so use this carefully! Requires & ~"],

	unlockhost: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.parse('/help unlockhost');
		if (!Gold.lockedHosts[target]) return this.errorReply("The host '" + target + "' is not currently blacklisted.");

		delete Gold.lockedHosts[target];
		saveHost();

		this.privateModCommand("(" + user.name + " has unblacklisted host: " + target + ")");
	},
	unlockhosthelp: ["/unlockhost [host] - Removes a host from the server's blacklist.  Requires & ~"],

	proxylist: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		let badHosts = Object.keys(Gold.lockedHosts);
		if (badHosts.length < 0) return this.errorReply("Weird, no proxies have been blacklisted (yet).");

		let buff = '<table border="1" cellspacing ="0" cellpadding="3"><tr><td><b>Proxy:</b></td><td><b>Blacklisted By:</b></td><td><b>Blacklisted:</b></td></tr>';
		badHosts.forEach(proxy => {
			buff += '<tr><td>' + proxy + '</td><td>' + hashColors(Gold.lockedHosts[proxy].by, false) + '</td><td>' + Chat.toDurationString(Date.now() - Gold.lockedHosts[proxy].on) + ' ago</td></tr>';
		});
		buff += '</table>';

		return this.sendReplyBox(buff);
	},

	spamautolock: 'autolockspam',
	autolockspam: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.sendReply(`This room currently will ${(room.autoLockSpam ? 'autolock' : 'NOT autolock')} spammers.`);
		if (this.meansYes(target)) {
			if (room.autoLockSpam) return this.errorReply("This room is already automatically locking spammers.");
			room.autoLockSpam = true;
			this.privateModCommand(`(${user.name} set this room to automatically lock spammers.)`);
		} else if (this.meansNo(target)) {
			if (!room.autoLockSpam) return this.errorReply("This room already is not automatically locking spammers.");
			room.autoLockSpam = false;
			this.privateModCommand(`(${user.name} set this room to no longer automatically lock spammers.)`);
		} else if (target === 'help') {
			return this.parse('/help autolockspam');
		}
		if (room.chatRoomData) {
			room.chatRoomData.autoLockSpam = room.autoLockSpam;
			Rooms.global.writeChatRoomData();
		}
	},
	autolockspamhelp: [
		"/autolockspam on - Enables automatically locking spammers in the current room. Requires: & ~",
		"/autolockspam off - Disables automatically locking spammers in the current room. Requires: & ~",
	],
};

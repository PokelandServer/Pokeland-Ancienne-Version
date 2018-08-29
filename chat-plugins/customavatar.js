/*Custom Avatar script. ~SilverTactic (Siiilver)*/
var fs = require('fs');
var path = require('path');

function hasAvatar (user) {
	if (Config.customavatars[toId(user)] && fs.existsSync('config/avatars/' + Config.customavatars[toId(user)])) 
		return Config.customavatars[toId(user)];
	return false;
}

function loadAvatars() {
	var formatList = ['.png', '.gif', '.jpeg', '.jpg'];
	fs.readdirSync('config/avatars')
	.filter(function (avatar) {
		return formatList.indexOf(path.extname(avatar)) > -1;
	})
	.forEach(function (avatar) {
		Config.customavatars[path.basename(avatar, path.extname(avatar))] = avatar;
	});
}
loadAvatars();

if (Config.watchconfig) {
	fs.watchFile(path.resolve(__dirname, 'config/config.js'), function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		loadAvatars();
	});
}

var cmds = {
	'': 'help',
	help: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('<b>Commandes Custom Avatar</b><br>' +
			'(Toutes ces commandes requièrent le rang d\'administrateur)<br><br>' +
			'<ul><li>/setavatar <em>Utilisateur</em>, <em>URL</em> - Définit l\'avatar d\'un utilisateur à l\'image spécifiée.' +
			'<li>/deleteavatar <em>Utilisateur</em> - Supprime l\'avatar d\'un utilisateur.' +
			'<li>/moveavatar <em>Utilisateur 1</em>, <em>Utilisateur 2</em> - Déplace l\'avatar de l\'utilisateur 1 à l\'utilisateur 2.</ul>'
		);
	},

	add: 'set',
	set: function (target, room, user, connection, cmd) {
		if ((user.userid == 'breyn') || (this.can('lockhost'))) {
		if (!target) return this.sendReply('|html|/ca set <em>Utilisateur</em>, <em>URL</em> - Définit l\'avatar d\'un utilisateur à l\'image spécifiée.');
		target = target.split(',');
		if (target.length < 2)  return this.sendReply('|html|/ca set <em>User</em>, <em>URL</em> - Définit l\'avatar d\'un utilisateur à l\'image spécifiée.');

		var targetUser = Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0];
		var link = target[1].trim();
		if (!link.match(/^https?:\/\//i)) link = 'http://' + link;
		
		var allowedFormats = ['png', 'jpg', 'jpeg', 'gif'];
		new Promise (function (resolve, reject) {
			require("request").get(link)
				.on('error', function (err) {
					console.log(err);
					reject("Avatar indisponible. Essayez avec un autre.");
				})
				.on('response', function (response) {
					if (response.statusCode !== 200) reject('Avatar indisponible. Essayez avec un autre.');
					var type = response.headers['content-type'].split('/');
					if (type[0] !== 'image') reject('L\'URL n\'est pas une image.');
					if (!~allowedFormats.indexOf(type[1])) reject('Format non supporté: Les formats supportés sont ' + allowedFormats.join(', '));

					if (hasAvatar(targetUser)) fs.unlinkSync('config/avatars/' + Config.customavatars[toId(targetUser)]);
					var file = toId(targetUser) + '.' + type[1];
					response.pipe(fs.createWriteStream('config/avatars/' + file));
					resolve(file);
				});
		})
		.then(function (file) {
			Config.customavatars[toId(targetUser)] = file;
			var getUser = Users.getExact(targetUser);
			if (getUser) getUser.avatar = file;

			var desc = 'avatar a été fixé: <br><div style = "width: 80px; height: 80px; display: block"><img src = "' + link + '" style = "max-height: 100%; max-width: 100%"></div>';
			this.sendReply('|html|L\'avatar de '+ targetUser +' a été fixé: <br><div style = "width: 80px; height: 80px; display: block"><img src = "' + link + '" style = "max-height: 100%; max-width: 100%"></div>');
			if (getUser) {
				getUser.send('|html|' + user.name + ' a fixé votre avatar. Si vous ne le voyez pas, <a href=https://www.bigbangfr.com/t875-pourquoi-vous-ne-voyez-pas-votre-avatar-sur-le-serveur#11916>cela pourrait en être la raison</a>.');
				getUser.popup('|html|<center>Votre ' + desc + '<br>Si vous ne le voyez pas, <a href=https://www.bigbangfr.com/t875-pourquoi-vous-ne-voyez-pas-votre-avatar-sur-le-serveur#11916>voici comment y remédier</a>.</center>');
			}
		}.bind(this))
		.catch (function (err) {
			this.errorReply('Error setting ' + targetUser + '\'s avatar: ' + err);
		}.bind(this));
	}
	},

	remove: 'delete',
	'delete': function (target, room, user, connection, cmd) {
		if ((user.userid == 'breyn') || (this.can('globalmod'))) {
		if (!target || !target.trim()) return this.sendReply('|html|/' + cmd + ' <em>Utilisateur</em> - Supprime l\'avatar d\'un utilisateur.');
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		var avatars = Config.customavatars;
		if (!hasAvatar(target)) return this.errorReply(target + ' n\'a pas d\'avatar.');

		fs.unlinkSync('config/avatars/' + avatars[toId(target)]);
		delete avatars[toId(target)];
		this.sendReply('L\'avatar de '+ target +' a été correctement supprimé.');
		if (Users.getExact(target)) {
			Users.getExact(target).send('Votre avatar a été supprimé.');
			Users.getExact(target).avatar = 1;
		}
	}
	},
	
	
	shift: 'move',
	move: function (target, room, user, connection, cmd) {
		if (!this.can('globalmod')) return false;
		if (!target || !target.trim()) return this.sendReply('|html|/moveavatar <em>Utilisateur 1</em>, <em>Utilisateur 2</em> - Déplace l\'avatar de l\'utilisateur 1 à l\'utilisateur 2.');
		target = target.split(',');
		if (target.length < 2) return this.sendReply('|html|/moveavatar <em>Utilisateur 1</em>, <em>Utilisateur 2</em> - Déplace l\'avatar de l\'utilisateur 1 à l\'utilisateur 2.');

		var user1 = (Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0]);
		var user2 = (Users.getExact(target[1]) ? Users.getExact(target[1]).name : target[1]);
		if (!toId(user1) || !toId(user2)) return this.sendReply('|html|/moveavatar <em>Utilisateur 1</em>, <em>Utilisateur 2</em> - Déplace l\'avatar de l\'utilisateur 1 à l\'utilisateur 2.');
		var user1Av = hasAvatar(user1);
		var user2Av = hasAvatar(user2);
		if (!user1Av) return this.errorReply(user1 + ' n\'a pas d\'avatar.');

		var avatars = Config.customavatars;
		if (hasAvatar(user2)) fs.unlinkSync('config/avatars/' + user2Av);
		var newAv = toId(user2) + path.extname(user1Av);
		fs.renameSync('config/avatars/' + user1Av, 'config/avatars/' + newAv);
		delete avatars[toId(user1)];
		avatars[toId(user2)] = newAv;
		if (Users.getExact(user1)) Users.getExact(user1).avatar = 1;
		if (Users.getExact(user2)) {
			Users.getExact(user2).avatar = newAv;
			Users.getExact(user2).send(user.name + ' a déplacé l\'avatar de ' + user1 + ' jusqu\'à vous. Pensez à rafraîchir la page si vous ne le voyez pas.');
		}
		return this.sendReply('L\'avatar de ' + user1 + ' a été correctement déplacé vers ' + user2 + '.');
	}
};

exports.commands = {
	ca: 'customavatar',
	customavatar: cmds,
	moveavatar: cmds.move,
	deleteavatar: 'removeavatar',
	removeavatar: cmds.delete,
	setavatar: cmds.set
}
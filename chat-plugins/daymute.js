var fs = require('fs');
exports.commands = {
 
 dm: 'daymute',
	daymute: function (target, room, user) {
		if (!target) return this.parse('/help daymute');
		if (!this.can('roomban', targetUser, room)) return false;
                if (room.isMuted(user) && !user.can('bypassall')) return this.errorReply("Vous ne pouvez pas le faire sans pouvoir parler.");
		
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User "' + this.targetUsername + '" Introuvable.');

		if ((room.isMuted(targetUser) && !canBeMutedFurther) || targetUser.locked || !targetUser.connected) {
			var problem = " Mais était déjà " + (!targetUser.connected ? "déconnecter" : targetUser.locked ? "locked" : "licked");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " Vous avez était mute par" + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " Vous avez était mute par" + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		targetUser.popup(user.name + 'Vous a mute pendant 24 heures. ' + target);
		this.addModAction('' + targetUser.name + ' a été mute par ' + user.name + ' pendant 24 heures.' + (target ? " (" + target + ")" : ""));
		
		room.mute(targetUser, 24 * 60 * 60 * 1000, true);
	},
};
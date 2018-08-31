/*
 * KickServer created by Maaff / Trad by Distrib
 */
 exports.commands = {
     ks: 'kickserver',
     kickserver: function(target, room, user) {
         if (!this.can('forcewin')) return false;
         if (!target) return this.parse('/help kickserver');
         target = this.splitTarget(target);
         let targetUser = this.targetUser;
         if (target.length > 19) return this.errorReply("' L'utilisateur" + this.targetUsername + "' n'a pas été trouvé.");
         if (!targetUser) return this.errorReply("L'utilisateur '" + this.targetUsername + "'n'a pas été trouvé.");
         this.addModAction(targetUser.name + " a été kick du serveur par " + user.name + ".");
         targetUser.popup("Tu as été kick du serveur par " + user.name + ".");
         targetUser.disconnectAll();
     },
     kickserverhelp: ["/kickserver OU /ks [username] - Kick un utilisateur du serveur. Requiert: @ & ~"],
 };

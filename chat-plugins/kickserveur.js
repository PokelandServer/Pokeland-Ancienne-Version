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
         if (target.length > 19) return this.errorReply("' User" + this.targetUsername + "' not found.");
         if (!targetUser) return this.errorReply("User '" + this.targetUsername + "'not found.");
         this.addModAction(targetUser.name + " a été kick du serveur par " + user.name + ".");
         targetUser.popup("Tu as étais kick du serveur par " + user.name + ".");
         targetUser.disconnectAll();
     },
     kickserverhelp: ["/kickserver OR /ks [username] - kick un utilisateur du serveur. Requires: @ & ~"],
 };
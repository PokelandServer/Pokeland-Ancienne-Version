


exports.commands = {

   ac: 'autoconfirm',
    autoconfirm: function (target, room, user) {
        if (!this.can('lockdown')) return;
        if (!target) return this.parse(`/help autoconfirm`);
        let tarUser = Users(target);
        if (!tarUser) return this.errorReply(`User "${target} not found.`);
        if (tarUser.locked) return this.errorReply(`${tarUser.name} is locked and cannot be granted autoconfirmed status.`);
        if (tarUser.autoconfirmed) return this.errorReply(`${tarUser.name} is already autoconfirmed.`);
        let curType = Db("userType").get(tarUser.userid) || 0;
        if (curType) {
            switch (curType) {
            case 3:
                this.errorReply(`${tarUser.name} is a sysop and should already be autoconfirmed.`);
                break;
            case 4:
                this.errorReply(`${tarUser.name} is already set as autoconfirmed on this server.`);
                break;
            case 5:
            case 6:
                this.errorReply(`${tarUser.name} is ${(curType === 5 ? `permalocked on` : `permabanned from`)} this server and cannot be given autonconfirmed status.`);
            }
            return;
        }
        Db("userType").set(tarUser.userid, 4);
        tarUser.autoconfirmed = tarUser.userid;
        tarUser.popup(`|modal|${user.name} Tu es maintenant autoconfirmed.`);
        return this.sendReply(`${tarUser.name} est maintenant autoconfirmed.`);
    },
    autoconfirmhelp: ['/autoconfirm user - Grants a user autoconfirmed status on this server only. Requires ~'],
        
      
};


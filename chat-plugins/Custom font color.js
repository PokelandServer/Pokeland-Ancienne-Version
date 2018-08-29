var fs = require('fs');
var selectors;

function writeIconCSS() {
	fs.appendFile('config/custom.css', selectors);
}

exports.commands = {
    customfont: function (target, room, user) {
        if (!this.can('ban')) return this.errorReply("Accès refusé.");

        var args = target.split(',');if (args.length < 2)
        return this.parse('/help customfont');
        var username = toId(args.shift());
        var color = 'Color:' + args.shift().trim() + ';';
        selectors = '.chat.chatmessage-' +  username + ' em';
        args.forEach(function (room) {
        });
        selectors += '{' + '' + color +  '}';

        this.privateModCommand("(" + user.name + " a mis une couleur police personnalisée à " + username + ")");
        writeIconCSS();
    },
    customfonthelp: ["/customfont [user], [color]"],
    
        darkcustomfont: function (target, room, user) {
        if (!this.can('ban')) return this.errorReply("Accès refusé.");

        var args = target.split(',');if (args.length < 2) return this.parse('/help darkcustomfont');
        var username = toId(args.shift());
        var color = 'Color:' + args.shift().trim() + ';';
        selectors = '.dark .chat.chatmessage-' +  username + ' em';
        args.forEach(function (room) {
        });
        selectors += '{' + '' + color +  '}';

        this.privateModCommand("(" + user.name + " a mis une couleur police personnalisée à " + username + ")");
        writeIconCSS();
    },
    darkcustomfonthelp: ["/darkcustomfont [user], [color]"],
};
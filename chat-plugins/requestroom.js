/**
 * Room Request System
 *
 * 
 * @license MIT license
 */
"use strict";
 
let allowRequests = true;
 
exports.commands = {
    confirmrequestroom: 'requestroom',
    rr: 'requestroom',
    requestroom: function (target, room, user, connection, cmd) {
        if (!user.named) return this.errorReply(`Choisissez un nom avant de request une room`);
        if (!user.registered) return this.errorReply(`Les noms non enregistrés ne peuvent pas être promu, dont ils ne peuvent pas request rooms.`);
        if (!user.autoconfirmed) return this.errorReply(`Vous devez être autoconfirmed pour request une room.`);
        if (!allowRequests) return this.errorReply(`Les room requests sont actuellement fermées.`);
        let curRequest = Db("rooms").get(user.userid, null);
        if (curRequest && curRequest.blacklist) return this.errorReply(`Vous êtes banni des requesting rooms.`);
        if (curRequest && curRequest.status === "pending") return this.parse('/checkroomrequest');
        let hasRoom = false;
        Rooms.rooms.forEach(r => {
            if (r.founder === user.userid) {
                hasRoom = true;
                return;
            }
        });
        target = target.split(',');
        if (target.length < 3) return this.parse('/help requestroom');
        if (['public', 'hidden', 'secret'].indexOf(toId(target[1])) === -1) return this.errorReply(`Les room types valables sont publiques, cachées, et secrètes.`);
        let desc = '';
        for (let i = 2; i < target.length; i++) {
            desc += target[i] + (i === target.length - 1 ? "" : ",");
        }
        curRequest = {
            name: Chat.escapeHTML(target[0].trim()),
            type: toId(target[1]),
            desc: Chat.escapeHTML(desc),
            trusted: user.trusted,
            staff: user.isStaff,
            status: "pending",
            paid: false,
        };
        if (cmd !== 'confirmrequestroom') {
            return this.sendReplyBox(`<center><b>Room Name</b>: ${curRequest.name}<br/><b>Room Type</b>: ${curRequest.type}<br/><b>Description</b>:${curRequest.desc}<br/>${hasRoom ? `<br/>` : ``}<button name="send" value="/confirmrequestroom ${curRequest.name}, ${curRequest.type}, ${curRequest.desc}" class="button">Oui, c'est bon !</button><button class="button" name="receive" value="|c|~Pokeland serveur|Demander à nouveau la room, mais avec les changements que vous voulez faire.">Non, j'dois changer des choses ou chépa quoi</button></center>`);
        } else if (hasRoom) {
"d"
        }
        Db("rooms").set(user.userid, curRequest);
        Rooms.rooms.get("staff").add('|c|~Request Room|' + '/html Ho quelqu\'n veut une room ! <button class="button" name="send" value="/roomrequests view">les ~ go look!</button>'
    );
        Rooms.rooms.get("staff").update();
        return this.sendReply('Votre room request a bien été envoyée à l Upper Staff.');
    },
    requestroomhelp: ["/requestroom [nom], [public|hidden|secret], [pourquoi cette room devrait être crée] - Envoie une room creation request à l'Upper Staff. Vous ne pouvez pas request une autre autre room pour 2 semaines après que votre request ait été complétée. Upper staff vous contactera probablement pour plus d'informations avant que la room soit crée. Nous réservons le droit de rejeter toutes les requests."],
    checkroomrequest: function (target, room, user) {
        target = toId(target);
        if (!target) target = user.userid;
        if (!user.can('roomowner') && user.userid !== target) return this.errorReply(`/checkroomrequest -  Accès interdit pour visualiser les requests des autres.`);
        let curRequest = Db("rooms").get(target);
        if (!curRequest || curRequest.blacklisted) return this.errorReply(`${(target === user.userid ? "You don't " : target + " does not ")} have a pending room request.`);
        let output = `<center><h1>Pokeland Room Request</h1></center><b>Requester</b>: ${target} <br/><b>Room Name</b>: ${curRequest.name}<br/><b>Room Type</b>: ${curRequest.type}<br/><b>Description</b>: ${curRequest.desc}<br/>${curRequest.paid ? `Cet room a bien été payée depuis ${user.userid === target ? `vous possédez déjà un chatroom` : `le requester a déjà possédé un chatroom`}.<br/>` : ``}`;
        if (user.userid === target) output += `<button class="button" name="send" value="/cancelroomrequest">Annule cette request</button><br/>`;
        if (user.can('roomowner')) output += `${(curRequest.staff ? `Le requester est un membre ~ global ` : (curRequest.trusted ? `Le requester est un trusted user.` : ``))}`;
        this.sendReplyBox(output);
    },
    crr: 'cancelroomrequest',
    cancelroomrequest: function (target, room, user) {
        if (!user.named) return this.errorReply(`Choisisez un nom avant de gérer une room request.`);
        if (!user.registered) return this.errorReply(`Les noms non enregistrés ne peuvent pas être promu, donc ils ne peuvent pas request rooms.`);
        if (!user.autoconfirmed) return this.errorReply(`Vous devez être autoconfirmed pour request une room.`);
        let curRequest = Db("rooms").get(user.userid, null);
        if (!curRequest || curRequest.blacklisted) return this.errorReply(`${(target === user.userid ? "You don't " : target + " does not ")} have a pending room request.`);
        if (curRequest.status !== "pending") return this.errorReply(`Votre room request est déjà ${curRequest.status}, et ne peut pas être annulé.`);
        curRequest.status = "cancelled";
        curRequest.by = user.userid;
        if (curRequest.paid) {
            Economy.writeMoney(user.userid, 50);
            
        }
        this.sendReply(`.`);
    },
    checkroomrequesthelp: ["/checkroomrequest (pseudonyme) - Vérifie la room request actuelle de l'utilisateur. Laisse le pseudonyme  vide par défaut à votre request. Exige: &, ~ si le pseudonyme n'est pas votre pseudonyme."],
    roomrequests: function (target, room, user) {
        if (!this.can('roomowner')) return;
        target = target.split(',');
        let req = null;
        switch (toId(target[0])) {
        case '':
        case 'view':
            let requests = Db("rooms").keys();
            let output = `<div class="infobox infobox-limited"><table><tr><th style="border: 1px solid" colspan="6"><b>Pokeland Room Requests</b></th></tr><tr><th style="border: 1px solid">Requester</th><th style="border: 1px solid">Room Name</th><th style="border: 1px solid">Room Type</th><th style="border: 1px solid">Description</th><th style="border: 1px solid">Status</th><th style="border: 1px solid">Options</th></tr>`;
            for (let i = 0; i < requests.length; i++) {
                let cur = Db("rooms").get(requests[i]);
                if (cur.blacklisted) {
                    output += `<tr><td style="border: 1px solid">${requests[i]}</td><td style="border: 1px solid; background-color: #ff4d4d; color: black" colspan="5"><center>Blacklisted from owning rooms.</center></td></tr>`;
                    continue;
                }
                output += `<tr><td style="border: 1px solid">${requests[i]}</td><td style="border: 1px solid">${cur.name}</td><td style="border: 1px solid">${cur.type}</td><td style="border: 1px solid">${cur.desc}</td><td style="border: 1px solid">${cur.status}</td>`;
                if (cur.status === 'pending') {
                    output += `<td style="border: 1px solid"><button class="button" name="send" value="/roomrequests accept, ${requests[i]}">Accept</button><button class="button" name="send" value="/roomrequests reject, ${requests[i]}">Reject</button></td></tr>`;
                } else {
                    output += `<td style="border: 1px solid">${cur.status} by ${cur.by}</td></tr>`;
                }
            }
            output += `</table></div>`;
            return user.sendTo(room, `|html|${output}`);
            //break;
        case 'accept':
            if (!target[1]) return this.parse('/help roomrequests');
            req = Db("rooms").get(toId(target[1]));
            if (!req) return this.errorReply(`${target[1]} n'a pas une room request.`);
            if (req.blacklisted) return this.errorReply(`${target[1]} est banni d'owning rooms.`);
            if (req.status !== 'pending') return this.errorReply(`La request actuelle de ${target[1]} a déjà été ${req.status}.`);
            req.status = 'accepted';
            req.by = user.userid;
            Db("rooms").set(toId(target[1]), req);
            this.parse(`/makeprivatechatroom ${req.name}`);
            let r = Rooms(toId(req.name));
            if (req.type !== 'secret') {
                r.isPrivate = 'hidden';
                r.chatRoomData.isPrivate = 'hidden';
                r.add(`${user.name} made this room hidden.`).update();
                r.modlog(`${user.name} made this room hidden.`);
            }
            if (req.type === 'public') {
                r.add(`Ce chatroom prévoit d'être public dans 1 semaine si l'Upper Staff sent que cela est assez actif pendant cette phase d'essai. ${target[1]}, vous êtes responsable de contacter l'Upper Staff de créer vitre room publique dans 1 week.`).update();
                r.sendModCommand(`(CHATROOM TYPE: Pre-Public. This room can be made public 1 week from this modnote.)`);
                r.logEntry(`(CHATROOM TYPE: Pre-Public. This room can be made public 1 week from this modnote.)`);
                r.modlog(`(CHATROOM TYPE: Pre-Public. This room can be made public 1 week from this modnote.)`);
            }
            r.founder = toId(target[1]);
            r.chatRoomData.founder = toId(target[1]);
            r.auth = {};
            r.chatRoomData.auth = {};
            r.auth[toId(target[1])] = '#';
            r.chatRoomData.auth[toId(target[1])] = '#';
            Rooms.global.writeChatRoomData();
            user.popup(`|html|<center>Vous avez accepté la room request de ${target[1]}.<br/>La Room "${req.name}" a été crée.</center>`);
            if (Users(target[1]) && Users(target[1]).connected) Users(target[1]).joinRoom(r);
            return this.parse(`/join ${req.name}`);
            //break;
        case 'reject':
            if (!target[1]) return this.parse('/help roomrequests');
            req = Db("rooms").get(toId(target[1]));
            if (!req) return this.errorReply(`${target[1]} n'a pas une room request.`);
            if (req.blacklisted) return this.errorReply(`${target[1]} est banni d'owning rooms.`);
            if (req.status !== 'pending') return this.errorReply(`La request actuelle de ${target[1]} a déjà été ${req.status}.`);
            req.status = 'rejected';
            req.by = user.userid;
            if (req.paid) {
                Economy.writeMoney(toId(target[1]), 0);
           
            }
            Db("rooms").set(toId(target[1]), req);
            return this.sendReply(`Vous avez rejeté la room request de ${target[1]}`);
            //break;
        case 'delete':
            if (!target[1]) return this.parse('/help roomrequests');
            req = Db("rooms").get(toId(target[1]));
            if (!req) return this.errorReply(`${target[1]} n'a pas de room request.`);
            if (req.blacklisted) return this.errorReply(`${target[1]} est banni d'owning rooms. Si vous voulez annuler la blacklist, faites /roomrequests unblacklist, ${target[1]}`);
            if (req.paid && req.status === "pending") {
                Economy.writeMoney(toId(target[1]), 0);
        
            }
            Db("rooms").remove(toId(target[1]));
            return this.sendReply(`Vous avez supprimé la room request de ${target[1]}`);
            //break;
        case 'modify':
            if (!target[3]) return this.parse('/help roomrequests');
            req = Db("rooms").get(toId(target[1]));
            if (!req) return this.errorReply(`${target[1]} n'a pas de room request.`);
            if (req.blacklisted) return this.errorReply(`${target[1]} est banni d'owning rooms.`);
            if (req.status !== 'pending') return this.errorReply(`La request actuelle de ${target[1]} a déjà été ${req.status}.`);
            target[2] = toId(target[2]);
            if (target[2] === 'name') {
                req.name = Chat.escapeHTML(target[3].trim());
                Db("rooms").set(toId(target[1]), req);
                return this.sendReply(`Le room name de la request de ${target[1]} a bien été changé en: ${req.name}`);
            } else if (target[2] === 'type') {
                if (['public', 'hidden', 'secret'].indexOf(toId(target[3])) === -1) return this.errorReply(`Les Room types pauvent être publiques, cachées, ou secrètes`);
                if (req.type === toId(target[3])) return this.errorReply(`Le room type de la request de ${target[1]} est déjà ${req.type}`);
                req.type = toId(target[3]);
                Db("rooms").set(toId(target[1]), req);
                return this.sendReply(`Le room type de la request de ${target[1]} a bien été changé en: ${req.type}`);
            } else {
                return this.errorReply(`/roomrequests modify, [request], [name|type], [new name || public|hidden|secret]`);
            }
            //break;
        case 'blacklist':
            if (!target[1]) return this.parse('/help roomrequests');
            target[1] = toId(target[1]);
            let targetUser = Users(target[1]);
            req = Db("rooms").get(target[1]);
            if (req && req.blacklisted) return this.errorReply(`${target[1]} et déjà banni d'owning rooms.`);
            if (req && req.paid && req.status === "pending") {
                Economy.writeMoney(toId(target[1]), 0);
                            }
            Db("rooms").set(target[1], {blacklisted: true, by: user.userid, reason: (target[2] || undefined)});
            let demoted = [];
            Rooms.rooms.forEach((curRoom, id) => {
                if (!curRoom.auth || !curRoom.auth[target[1]]) return;
                if (curRoom.founder === target[1]) {
                    curRoom.founder = false;
                    curRoom.chatRoomData.founder = false;
                }
                if (curRoom.auth[target[1]] === '#') {
                    curRoom.auth[target[1]] = '@';
                    demoted.push(curRoom.id);
                    if (targetUser) curRoom.onUpdateIdentity(targetUser);
                }
            });
            if (demoted.length) Rooms.global.writeChatRoomData();
            if (targetUser) targetUser.popup(`|html|<center>${user.name} vous as banni d'owning rooms. ${(target[2] ? `(${target[2].trim()})` : ``)}<br/>Vous avez automatiquement bien été rétrogradé de room owner dans ${demoted.join(', ')}.<br/>Pour demander votre room ownership blacklist, mp un leader ou un admin. ${Config.appealurl ? `<br/>Ou vous pouvez <a href="${Config.appealurl}">demander sur le forum</a>.` : ``}</center>`);
            Monitor.adminlog(`${target[1]} a été banni d'owning rooms par ${user.name} ${(demoted.length ? `et dégradé # dans ${demoted.join(', ')}` : ``)}. ${(target[2] ? `(${target[2].trim()})` : ``)}`);
            if (targetUser && targetUser.trusted) Monitor.log("[CrisisMonitor] Trusted user " + targetUser.name + (targetUser.trusted !== targetUser.userid ? " (" + targetUser.trusted + ")" : "") + " a été banni d'owning rooms par " + user.name + ", and should probably be demoted.");
            this.globalModlog("ROOMOWNERBAN", (targetUser || target[1]), " by " + user.name + (target[2] ? ": " + target[2] : ""));
            return this.sendReply(`${target[1]} a été banni d'owning rooms.`);
            //break;
        case 'unblacklist':
            if (!target[1]) return this.parse('/help roomrequests');
            target[1] = toId(target[1]);
            req = Db("rooms").get(target[1]);
            if (!req || !req.blacklisted) return this.errorReply(`${target[1]} n'est pas banni d'owning rooms.`);
            Db("rooms").remove(target[1]);
            Monitor.adminlog(`${target[1]} a été débanni d'owning rooms by ${user.name}.`);
            this.globalModlog("UNROOMOWNERBAN", target[1], " by " + user.name);
            return this.sendReply(`${target[1]} n'est plus banni d'owning rooms.`);
            //break;
        case 'viewblacklist':
            if (target[1]) {
                target[1] = toId(target[1]);
                req = Db("rooms").get(target[1]);
                if (!req || !req.blacklisted) return this.errorReply(`${target[1]} n'est pas banni d'owning rooms.`);
                return this.sendReply(`ROOMOWNERBAN by ${req.by} ${(req.reason ? `(${req.reason})` : ``)}.`);
            }
            let list = [];
            let keys = Db("rooms").keys();
            for (let key = 0; key < keys.length; key++) {
                if (Db("rooms").get(keys[key]).blacklisted) list.push(keys[key]);
            }
            if (!list.length) return this.sendReply('Aucun utilisateur nest banni d owning room.');
            return this.sendReply(`Les joueurs suivants ${list.length} sont banni d'owning rooms: ${list.join(', ')}.`);
            //break;
        case 'open':
            if (allowRequests) return this.errorReply(`Les Room Requests sont déjà ouvertes.`);
            allowRequests = true;
            Monitor.adminlog(`${user.name} a ouvert les room requests`);
            return this.sendReply(`Les Room Requests sont maintenant ouvertes.`);
            //break;
        case 'close':
            if (!allowRequests) return this.errorReply(`Les Room Requests sont déjà fermées.`);
            allowRequests = false;
            Monitor.adminlog(`${user.name} a fermé les room requests`);
            return this.sendReply(`Les Room Requests sont maintenant fermées .`);
            //break;
        default:
            return this.parse('/help roomrequests');
        }
    },
    roomrequestshelp: [
        "/roomrequests - Gère la room requests. Exige &, ~. Accepte les arguments suivants:",
        "/roomrequests view - Visualise et gère toutes les room requests en cours",
        "/roomrequests accept, [requester] - Accepte une room request et crée la room.",
        "/roomrequests reject, [requester] - Refuse une room request.",
        "/roomrequests modify, [requester], [name|type], [new name || public|hidden|secret] - Modifie un nom de room requests ou de type.",
        "/roomrequests delete, [requester] - Supprime une room request, supprimer une room request ne causera pas une période de cooldown avant que l'utilisateur pourra envoyer une autre request.",
        "/roomrequests blacklist, [user], (reason) - Bans a user from owning or requesting rooms. They will be automatically de-roomownered server wide as well.",
        "/roomrequests unblacklist, [utilisateur] - Permet à un utilisateur de request rooms et d'être encore un roomowner.",
        "/roomrequests viewblacklist, (utilisateur) - Visualise la roomowner blacklist. Si l'argument est fourni, vérifie si l'utilisateur est banni en tant que roomowner.",
        "/roomrequests [open|close] - Opens or closes room requests.",
    ],
};
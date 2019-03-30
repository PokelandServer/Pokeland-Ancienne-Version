'use strict';
/********************
 * Cards
 * Origins's Card System: Credit to Naten, nineage, fender, and everyone who added cards/ sparkychild for trading, searching, transfering of cards
 * All cards should be retrieved here http://www.pokemon.com/us/pokemon-tcg/pokemon-cards/
 * Cards are organized alphabetically and use a point system
 * publicids are dex numbers and any unique identifiers (if they're not a Pokemon, do a shorthand version of the card name)
 * Dex Number, (for multiple pokemon: DEX[lowercase letter, a, b, c, d])
********************/
const uuid = require('uuid');
const cards = require('./card-data.js');
let color = require('../config/color');
 
const colors = {
    Mythic: '#D82A2A',
    Legendary: '#E8AB03',
    Epic: '#73DF14',
    Rare: '#2DD1B6',
    Uncommon: '#2D3ED1',
    Common: '#000',
};
 
const shop = [
    ['XY', 'Obtenez 5 cartes dans le premier pack sorti dans la série XY', 2],
    ['XY-Etincelles', 'Obtenez 5 cartes dans le pack Etincelles sorti dans la série XY.', 3],
    ['XY-Poings Furieux', 'Obtenez 5 cartes dans le pack Poings Furieux sorti dans la série XY.', 3],
    ['XY-Vigueur Spectrale', 'Obtenez 5 cartes dans le pack Vigueur Spectrale sorti dans la série XY.', 3],
    ['XY-Primo Choc', 'Obtenez 5 cartes dans le pack Primo Choc sorti dans la série XY.', 4],
    ['XY-Ciel Rugissant', 'Obtenez 5 cartes dans le pack Ciel Rugissant sorti dans la série XY.', 4],
    ['XY-Origines Antiques', 'Obtenez 5 cartes dans le pack Origines Antiques sorti dans la série XY.', 4],
    ['XY-Générations', 'Obtenez 5 cartes dans le pack Générations sorti dans la série XY.', 5]
];
let packShop = ['XY', 'XY-Etincelles', 'XY-Poings Furieux', 'XY-Vigueur Spectrale', 'XY-Primo Choc', 'XY-Ciel Rugissant', 'XY-Origines Antiques', 'XY-Générations', 'Double Danger', 'Eau', 'Feu', 'Combat', 'Fée', 'Dragon', 'Incolore', 'Psy', 'Electrique', 'Obscurité', 'Plante', 'OU-Pack', 'UU-Pack', 'Uber-Pack', 'PU-Pack', 'NU-Pack', 'RU-Pack', 'LC-Pack', 'BL-Pack', 'BL2-Pack', 'BL3-Pack', 'Gen1', 'Gen2', 'Gen3', 'Gen4', 'Gen5', 'Gen6', 'Métal', 'Dresseur', 'Supporter', 'Objet', 'Stade', 'EX-Pack', 'Légendaire', 'Full', 'Event'];
const tourCardRarity = ['No Card', 'Commun', 'Peu Commun', 'Rare', 'Epique', 'Epique', 'Legendaire', 'Legendaire', 'Mythique'];
const cardRarity = ['Commun', 'Peu commun', 'Rare', 'Epique', 'Légendaire', 'Mythique'];
let cleanShop = [];
let cleanCard = [];
let rareCache = []; //Used to cache cards for tours
let cardCache = []; //Used to cache cards in packs
let userPacks = {}; //Used to store users unopened packs
 
function cachePacks() {
    for (let i = 0; i < packShop.length; i++) {
        cardCache.push([]);
        for (let key in cards) {
            if (cards.hasOwnProperty(key)) {
                let obj = cards[key];
                if (obj.hasOwnProperty('collection') && obj.collection.indexOf(packShop[i]) > -1) cardCache[i].push(key);
            }
        }
    }
    for (let i = 0; i < packShop.length; i++) {
        cleanShop.push(toId(packShop[i]));
    }
}
 
function cacheRarity() {
    for (let i = 0; i < cardRarity.length; i++) {
        rareCache.push([]);
        for (let key in cards) {
            if (cards.hasOwnProperty(key)) {
                let obj = cards[key];
                if (obj.hasOwnProperty('rarity') && obj.rarity.indexOf(cardRarity[i]) > -1) rareCache[i].push(key);
            }
        }
    }
    for (let i = 0; i < cardRarity.length; i++) {
        cleanCard.push(toId(cardRarity[i]));
    }
}
 
global.tourCard = function (tourSize, userid) {
    if (tourSize > 32) tourSize = 32;
    let tourRarity = tourCardRarity[Math.floor(tourSize / 2)];
    let cacheValue = rareCache[cleanCard.indexOf(toId(tourRarity))];
    let card = cacheValue[Math.round(Math.random() * (cacheValue.length - 1))];
    if (tourRarity === 'No Card') return;
    addCard(userid, card);
    return [colors[cards[card].rarity], cards[card].rarity, cards[card].title, cards[card].name];
};
 
function addCard(name, card) {
    let newCard = {};
    newCard.id = uuid.v1();
    newCard.title = cards[card].title;
    newCard.card = cards[card].card;
    newCard.name = cards[card].name;
    newCard.rarity = cards[card].rarity;
    newCard.points = cards[card].points;
 
    let userid = toId(name);
    Db('cards').set(userid, Db('cards').get(userid, []).concat([newCard]));
    Db('points').set(userid, Db('points').get(userid, 0) + newCard.points);
}
 
function removeCard(cardTitle, userid) {
    let userCards = Db('cards').get(userid, []);
    let idx = -1;
    // search for index of the card
    for (let i = 0; i < userCards.length; i++) {
        let card = userCards[i];
        if (card.title === cardTitle) {
            idx = i;
            break;
        }
    }
    if (idx === -1) return false;
    // remove it
    userCards.splice(idx, 1);
    // set it in db
    Db('cards').set(userid, userCards);
    return true;
}
 
function getPointTotal(userid) {
    let totalCards = Db('cards').get(userid, []);
    let total = 0;
    for (let i = 0; i < totalCards.length; i++) {
        total += totalCards[i].points;
    }
    return total;
}
 
function rankLadder(title, type, array, prop, group) { //Will clean up someday (tm)
    let groupHeader = group || 'Username';
    const ladderTitle = '<center><h4><u>' + title + '</u></h4></center>';
    const thStyle = 'class="rankladder-headers default-td" style="background: -moz-linear-gradient(#576468, #323A3C); background: -webkit-linear-gradient(#576468, #323A3C); background: -o-linear-gradient(#576468, #323A3C); background: linear-gradient(#576468, #323A3C); box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
    const tableTop = '<div style="max-height: 310px; overflow-y: scroll;">' +
        '<table style="width: 100%; border-collapse: collapse;">' +
        '<tr>' +
            '<th ' + thStyle + '>Rank</th>' +
            '<th ' + thStyle + '>' + groupHeader + '</th>' +
            '<th ' + thStyle + '>' + type + '</th>' +
        '</tr>';
    const tableBottom = '</table></div>';
    const tdStyle = 'class="rankladder-tds default-td" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
    const first = 'class="first default-td important" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
    const second = 'class="second default-td important" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
    const third = 'class="third default-td important" style="box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.3) inset, 1px 1px 1px rgba(255, 255, 255, 0.7) inset;"';
    let midColumn;
    const length = array.length;
 
    let tableRows = '';
 
    for (let i = 0; i < length; i++) {
        if (i === 0) {
            midColumn = '</td><td ' + first + '>';
            tableRows += '<tr><td ' + first + '>' + (i + 1) + midColumn + array[i].name + midColumn + array[i][prop] + '</td></tr>';
        } else if (i === 1) {
            midColumn = '</td><td ' + second + '>';
            tableRows += '<tr><td ' + second + '>' + (i + 1) + midColumn + array[i].name + midColumn + array[i][prop] + '</td></tr>';
        } else if (i === 2) {
            midColumn = '</td><td ' + third + '>';
            tableRows += '<tr><td ' + third + '>' + (i + 1) + midColumn + array[i].name + midColumn + array[i][prop] + '</td></tr>';
        } else {
            midColumn = '</td><td ' + tdStyle + '>';
            tableRows += '<tr><td ' + tdStyle + '>' + (i + 1) + midColumn + array[i].name + midColumn + array[i][prop] + '</td></tr>';
        }
    }
    return ladderTitle + tableTop + tableRows + tableBottom;
}
 
function getShopDisplay(shop) {
    let display = "<table width='100%' border='1' style='border-collapse: collapse; color: #444; box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);' cellpadding='5'>" +
        "<tr><th class='card-th' style='background-image: -moz-linear-gradient(center top , #EBF3FC, #DCE9F9); box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.8) inset;'>Command</th><th class='card-th' style='background-image: -moz-linear-gradient(center top , #EBF3FC, #DCE9F9); box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.8) inset;'>Description</th><th class='card-th' style='background-image: -moz-linear-gradient(center top , #EBF3FC, #DCE9F9); box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.8) inset;'>Cost</th></tr>";
    let start = 0;
    while (start < shop.length) {
        display += "<tr>" + "<td class='card-td'><button name='send' value='/buypack " + shop[start][0] + "' style='border-radius: 12px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2) inset;'><b>" + shop[start][0] + "</b></button></td>" +
            "<td class='card-td'>" + shop[start][1] + "</td>" +
            "<td class='card-td'>" + shop[start][2] + "</td>" +
            "</tr>";
        start++;
    }
    display += "</table><center>Pour acheter un pack dans le shop, faites /buypack <em>pack</em>.</center>";
    return display;
}
 
function toTitleCase(str) {
    return str.replace(/(\w\S*)/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
 
cachePacks();
cacheRarity();
 
exports.commands = {
    packs: 'pack',
    pack: function (target, room, user) {
        if (!this.runBroadcast()) return;
        if (!target) target = user.name;
        target = toId(target);
        if (!userPacks[target] || userPacks[target].length === 0) return this.sendReply((target === user.userid ? 'Vous n'avez' : target + ' has') + ' pas de packs.');
        this.sendReply('|raw|<u><b>List of packs:</b></u>');
        for (let i = 0; i < userPacks[target].length; i++) {
            this.sendReply('|raw| <button name="send" value="/openpack ' + userPacks[target][i] + '"> Appuyez pour ouvrir <b>' + toTitleCase(userPacks[target][i]) + '</b> pack</button>');
        }
    },
 
    buypacks: 'buypack',
    buypack: function (target, room, user) {
        if (!target) return this.sendReply("/buypack - Achète un pack dans le packshop. Alias: /buypacks");
        let self = this;
        let packId = toId(target);
        let amount = Db('money').get(user.userid, 0);
        if (cleanShop.indexOf(packId) < 0) return self.sendReply("Ce n'est pas un pack valide. Faites /packshop pour voir tous les packs.");
        let shopIndex = cleanShop.indexOf(toId(target));
        if (packId !== 'xybase' && packId !== 'xyfuriousfists' && packId !== 'xyflashfire' && packId !== 'xyphantomforces' && packId !== 'xyroaringskies' && packId !== 'xyprimalclash' && packId !== 'xyancientorigins' && packId !== 'xygenerations') return self.sendReply("Ce pack n'est actuellement pas disponible.  Faites /packshop pour voir les packs disponibles.");
        let cost = shop[shopIndex][2];
        if (cost > amount) return self.sendReply("Vous avez besoin de " + (cost - amount) + " bucks en plus pour acheter ce pack.");
        let total = Db('money').set(user.userid, amount - cost).get(user.userid);
        let pack = toId(target);
        self.sendReply('|raw|Vous avez acheté ' + target + ' (pack) pour ' + cost +
            ' bucks. Faites <button name="send" value="/openpack ' +
            pack + '"><b>/openpack ' + pack + '</b></button> pour ouvrir votre pack.');
        self.sendReply("Vous avez jusqu'à que le serveur restart pour ouvrir votre pack.");
        if (!userPacks[user.userid]) userPacks[user.userid] = [];
        userPacks[user.userid].push(pack);
        if (room.id !== 'lobby' && room.id !== 'casino') room.addRaw(user.name + ' a acheté <b>' + target + ' (pack) </b> depuis le shop.');
        room.update();
    },
 
    packshop: function (target, room, user) {
        if (!this.runBroadcast()) return;
        return this.sendReply('|raw|' + getShopDisplay(shop));
    },
 
    open: 'openpack',
    openpacks: 'openpack',
    openpack: function (target, room, user) {
        if (!this.runBroadcast()) return;
        if (!target) {
            this.sendReply("/openpack [pack] - Ouvre un pack de cartes Pokémon. Alias: /open, /openpacks");
            return this.parse('/packs');
        }
        if (cleanShop.indexOf(toId(target)) < 0) return this.sendReply("Ce pack n'existe pas.");
        if (!userPacks[user.userid] || userPacks[user.userid].length === 0) return this.sendReply("Vous n'avez pas de packs.");
        if (userPacks[user.userid].indexOf(toId(target)) < 0) return this.sendReply("Vous n'avez pas ce pack.");
        let newPack;
        for (let i = 0; i < 5; i++) {
            newPack = toId(target);
            let cacheValue = cardCache[cleanShop.indexOf(toId(target))];
            let card = cacheValue[Math.round(Math.random() * (cacheValue.length - 1))];
            addCard(user.userid, card);
            let cardName = cards[card].name;
            let packName = packShop[cleanShop.indexOf(toId(target))];
            this.sendReplyBox(user.name + ' a eu <font color="' + colors[cards[card].rarity] + '">' + cards[card].rarity + '</font>' +
            '<button name="send" value="/card ' + (carte) + '"><b>' + cardName + '</b></button> depuis ' +
            '<button name="send" value="/buypack ' + packName + '">' + packName + ' (Pack)</button>.');
        }
        let usrIndex = userPacks[user.userid].indexOf(newPack);
        userPacks[user.userid].splice(usrIndex, 1);
    },
 
    givepacks: 'givepack',
    givepack: function (target, room, user) {
        if (!user.can('declare')) return this.errorReply("/givepack - Access denied.");
        if (!target) return this.sendReply("/givepack [user], [pack] - Give a user a pack.");
        let parts = target.split(',');
        this.splitTarget(parts[0]);
        if (!parts[1]) return this.sendReply("/givepack [user], [pack] - Give a user a pack.");
        let pack = toId(parts[1]);
        let userid = toId(this.targetUsername);
        if (cleanShop.indexOf(pack) < 0) return this.sendReply("This pack does not exist.");
        if (!this.targetUser) return this.sendReply("User '" + this.targetUsername + "' not found.");
        if (!userPacks[userid]) userPacks[userid] = [];
        userPacks[userid].push(pack);
        this.sendReply(this.targetUsername + " was given " + pack + " pack. This user now has " + userPacks[userid].length + " pack(s).");
        Users.get(this.targetUsername).connections[0].sendTo(room.id,
            '|raw|' + user.name + ' has given you ' + pack + ' pack. You have until the server restarts to open your pack.' +
            'Use <button name="send" value="/openpack ' + pack + '"><b>/openpack ' + pack + '</b></button> to open your pack.');
    },
 
    takepacks: 'takepack',
    takepack: function (target, room, user) {
        if (!user.can('takepack')) return this.errorReply("/takepack - Access denied.");
        if (!target) return this.sendReply("/takepack [user], [pack] - Take a pack from a user.");
        let parts = target.split(',');
        this.splitTarget(parts[0]);
        if (!parts[1]) return this.sendReply("/takepack [user], [pack] - Take a pack from a user.");
        let pack = toId(parts[1]);
        let userid = toId(this.targetUsername);
        let packIndex = userPacks[userid].indexOf(pack);
        if (packShop.indexOf(pack) < 0) return this.sendReply("This pack does not exist.");
        if (!this.targetUser) return this.sendReply("User '" + this.targetUsername + "' not found.");
        if (!userPacks[userid]) userPacks[userid] = [];
        if (packIndex < 0) return this.sendReply("This user does not have this pack.");
        userPacks[userid].splice(packIndex, 1);
        this.sendReply(this.targetUsername + " lost " + pack + " pack. This user now has " + userPacks[userid].length + " pack(s).");
        Users.get(this.targetUsername).send('|raw|' + user.name + ' has taken ' + pack + ' pack from you. You now have ' + userPacks[userid].length + ' pack(s).');
    },
 
    showcards: 'showcase',
    showcard: 'showcase',
    showcase: function (target, room, user) {
        if (!this.runBroadcast()) return;
        let userid = user.userid;
        if (target) userid = toId(target);
        const cards = Db('cards').get(userid, []);
        if (!cards.length) return this.sendReplyBox(userid + " n'a pas de cartes.");
        const cardsMapping = cards.map(function (card) {
            return '<button name="send" value="/card ' + card.title + '" style="border-radius: 12px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2) inset;" class="card-button"><img src="' + card.card + '" width="80" title="' + card.name + '"></button>';
        });
        this.sendReplyBox('<div style="max-height: 300px; overflow-y: scroll;">' + cardsMapping.join('') + '</div><br><center><b><font color="' + color(userid) + '">' + userid + '</font> a ' + cards.length + ' cartes et ' + getPointTotal(userid) + ' points.</b></center>');
    },
 
    card: function (target, room, user) {
        if (!target) return this.sendReply("/card [nom] - Donne les informations d'une carte.");
        if (!this.runBroadcast()) return;
        let cardName = toId(target);
        if (!cards.hasOwnProperty(cardName)) return this.sendReply(target + ": carte non trouvée.");
        let card = cards[cardName];
        let html = '<div class="card-div card-td" style="box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);"><img src="' + card.card + '" height="220" title="' + card.name + '" align="right">' +
            '<span class="card-name" style="border-bottom-right-radius: 2px; border-bottom-left-radius: 2px; background-image: -moz-linear-gradient(center top , #EBF3FC, #DCE9F9);  box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.8) inset, 0px 0px 2px rgba(0, 0, 0, 0.2);">' + card.title + '</span>' +
            '<br /><br /><h1><font color="' + colors[card.rarity] + '">' + card.rarity + '</font></h1>' +
            '<br /><br /><font color="#AAA"><i>Points:</i></font> ' + card.points +
            '<br /><br /><font color="#AAA"><i>Carte trouvées:</i></font>' + card.collection.join(', ') +
            '<br clear="all">';
        this.sendReply('|raw|' + html);
    },
 
    cardladder: function (target, room, user) {
        if (!this.runBroadcast()) return;
        let keys = Object.keys(Db('points').object()).map(function (name) {
            return {name: name, points: getPointTotal(name)};
        });
        if (!keys.length) return this.sendReplyBox("Card ladder is empty.");
        keys.sort(function (a, b) { return b.points - a.points; });
        this.sendReplyBox(rankLadder('Card Ladder', 'Points', keys.slice(0, 100), 'points'));
    },
 
    cs: 'cardsearch',
    cardsearch: 'searchcard',
    searchcard: function (target, room, user) {
        const letters = "abcdefghijklmnopqrstuvwxyz".split("");
        const categories = {
            Rareté: ['Commun', 'Peu commun', 'Rare', 'Epique', 'Légendaire', 'Mythique'], // rarities
            Packs: ['XY-Promo', 'XY', 'XY-Etincelles', 'XY-Poings Furieux', 'XY-Vigueur Spectrale', 'XY-Primo Choc', 'XY-Ciel Rugissant', 'XY-Origines Antiques', 'Double Danger'],
            Types: ['Eau', 'Feu', 'Combat', 'Fée', 'Dragon', 'Incolore', 'Psy', 'Electrique', 'Obscurité', 'Plante', 'Métal'],
            Tiers: ['OU-Pack', 'UU-Pack', 'Uber-Pack', 'PU-Pack', 'NU-Pack', 'RU-Pack', 'LC-Pack', 'BL-Pack', 'BL2-Pack', 'BL3-Pack'],
            Génération: ['Gen1', 'Gen2', 'Gen3', 'Gen4', 'Gen5', 'Gen6'],
            Divers: ['Dresseur', 'Supporter', 'Objet', 'Stade', 'Energie', 'Delta', 'EX-Pack', 'Méga', 'Légendaire', 'Full', 'Event'],
        };
 
        const scrollable = "<div style=\"max-height: 300px; overflow-y: scroll\">"; // code for scrollable html
        const divEnd = "</div>";
        const definePopup = "|wide||html|<center><b>CardSearch</b></center><br />";
        const generalMenu = "<center>" +
            '<button name="send" value="/searchcard letter" style=\"background-color:aliceblue;height:30px\">Alphabétique</button>&nbsp;&nbsp;' + // alphabetical
            '<button name="send" value="/searchcard category" style=\"background-color:aliceblue;height:30px\">Catégories</button>&nbsp;&nbsp;' + // category
            '</center><br />';
        if (!target) {
            return user.popup(definePopup + generalMenu);
        }
        // quick fix for when target ends with a comma
        target = target.replace(/\,[\s]+$/i, "");
        let parts = target.split(",");
        let actionCommand = parts.shift();
        let cardDisplay;
        switch (toId(actionCommand)) {
        case 'letter':
            let letter = toId(parts[0]);
 
            const letterMenu = '<center>' + letters.map(l => {
                return '<button name="send" value="/searchcard letter, ' + l + '" ' + (letter === l ? "style=\"background-color:lightblue;height:30px;width:35px\"" : "style=\"background-color:aliceblue;height:30px;width:35px\"") + ">" + l.toUpperCase() + "</button>";
            }).join("&nbsp;") + "</center><br />";
 
            if (!letter || letters.indexOf(letter) === -1) {
                // invalid letter to search for, or none given
                // only show menu
                return user.popup(definePopup + generalMenu + letterMenu);
            }
            // sort cards by letter
            let letterMons = {};
            for (let m in cards) {
                if (!letterMons[m.charAt(0)]) letterMons[m.charAt(0)] = {};
                letterMons[m.charAt(0)][m] = 1;
            }
 
            if (!letterMons[letter]) return user.popup(definePopup + generalMenu + letterMenu);
            // make graphics for the letter
            cardDisplay = Object.keys(letterMons[letter]).sort().map(m => {
                let card = cards[m];
                return '<button name="send" value="/searchcard card, ' + card.title + '" style="border-radius: 12px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2) inset;" class="card-button"><img src="' + card.card + '" width="100" title="' + card.name + '"></button>';
            }).join("&nbsp;");
            // send the popup
            user.lastCardSearch = target;
            user.popup(definePopup + generalMenu + letterMenu + scrollable + cardDisplay + divEnd);
            break;
        case 'category':
            // clean all the parts first
            parts = parts.map(p => {
                return toId(p);
            });
 
            // create category menu
            let categoryMenu = "";
            for (let c in categories) {
                categoryMenu += '<b>' + c + ' -</b> ' + categories[c].map(k => {
                    let m = toId(k);
                    // add a special search condition for rarity
                    if (c === "Rarity") m += "rarity";
 
                    // new params for the search
                    // clone parts
                    let newParams = parts.slice(0);
                    if (parts.indexOf(m) > -1) {
                        // remove it
                        newParams.splice(newParams.indexOf(m), 1);
                    } else {
                        newParams.push(m);
                    }
 
                    let style = (parts.indexOf(m) > -1 ? "style=\"background-color:lightblue;height:23\"" : "style=\"background-color:aliceblue;height:23\""); // button style checking if currently searching
 
                    return '<button name="send" value="/searchcard category, ' + newParams.join(", ") + '" ' + style + '>' + k + '</button>';
                }).join("&nbsp;") + "<br />";
            }
            if (!parts.length) {
                return user.popup(definePopup + generalMenu + categoryMenu);
            }
            // now clone the cards and delete the ones who dont match the categories
            let paramCards = Object.assign({}, cards);
 
            // filter out the unneeded ones; ignore rarity
            for (let i = 0; i < parts.length; i++) {
                let param = parts[i];
                // ignore rarity
                if (/rarity$/i.test(param)) continue;
                for (let c in paramCards) {
                    let cardParams = paramCards[c].collection.join("~").toLowerCase().replace(/[^a-z0-9\~]/g, "").split("~");
                    if (cardParams.indexOf(param) === -1) delete paramCards[c]; // remove the card from the currently searched ones.
                }
            }
 
            // seperate check for rarity
            let rarityCheck = parts.some(a => {
                return /rarity$/i.test(a);
            });
            if (rarityCheck) {
                for (let c in paramCards) {
                    let cardRare = toId(paramCards[c].rarity);
                    for (let i = 0; i < parts.length; i++) {
                        if (/rarity$/i.test(parts[i])) {
                            // check if rarity is the card's rarity
                            if (parts[i].replace(/rarity$/i, "") !== cardRare) {
                                // remove if not matched
                                delete paramCards[c];
                            }
                        }
                    }
                }
            }
 
            // no cards left
            if (!Object.keys(paramCards).length) {
                return user.popup(definePopup + generalMenu + categoryMenu + '<br /><center><font color="red"><b>Rien ne correspond à votre recherche</b></font></center>');
            }
            user.lastCardSearch = target;
            // build the display
            cardDisplay = Object.keys(paramCards).sort().map(m => {
                let card = paramCards[m];
                return '<button name="send" value="/searchcard card, ' + card.title + '" style="border-radius: 12px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2) inset;" class="card-button"><img src="' + card.card + '" width="100" title="' + card.name + '"></button>';
            }).join("&nbsp;");
            user.popup(definePopup + generalMenu + categoryMenu + scrollable + cardDisplay + divEnd);
            break;
        case 'card':
            let backButton = '<button name="send" value="/cardsearch ' + user.lastCardSearch + '" style="background-color:aliceblue;height:30px;width:35">&lt;&nbsp;Back</button><br /><br />';
            if (!parts[0] || !(toId(parts[0]) in cards)) {
                return user.popup(definePopup + backButton + '<center><font color="red"><b>Carte invalide</b></font></center>');
            }
 
            // build the display screen for the card
            let card = cards[toId(parts[0])];
            // the image
            let cardImage = '<img src="' + card.card + '" height=250>';
            // the name of the card
            let cardName = "<b>Nom:</b> " + card.name + "<br />";
            // the id of the card
            let cardId = "<font color=\"gray\">(" + card.title + ")</font><br />";
            // rarity display
            let cardRarityPoints = '<b>Rareté: </b><font color="' + colors[card.rarity] + '">' + card.rarity + '</font> (' + card.points + ')<br />';
            // collections
            let cardCollection = '<b>Packs: </b>' + card.collection.join(", ") + "<br />";
            // get users that have the card
            let allCardUsers = Db('cards').object();
            let cardHolders = [];
            // dont allow duplicates
            for (let u in allCardUsers) {
                let userData = allCardUsers[u];
                for (let i = 0; i < userData.length; i++) {
                    let tC = userData[i];
                    if (tC && tC.title === card.title) {
                        if (!cardHolders[u]) cardHolders[u] = 0;
                        cardHolders[u]++;
                    }
                }
            }
            // show duplicates as (x#)
            cardHolders = Object.keys(cardHolders).sort().map(u => {
                return "&nbsp;- " + u + (cardHolders[u] > 1 ? " (x" + cardHolders[u] + ")" : "");
            });
 
            // build the display!
            cardDisplay = "<center><table><tr>" +
                "<td>" + cardImage + "</td>" + // Card on the left
                "<td>" + // details now
                cardName + cardId + cardRarityPoints + cardCollection +
                "<b>Users with this card:</b><br />" + // card holders
                "<div style=\"max-height: 130px; overflow-y: scroll\">" + // scrollable
                cardHolders.join("<br />") + "<br />" +
                "</td></tr></table></center>"; // close the table
 
            user.popup(definePopup + backButton + cardDisplay);
            break;
        case 'error':
        default:
            user.popup(definePopup + generalMenu + '<br /><center><font color="red"><b>Commande invalide pour le CardSearch</b></font></center>');
            break;
        }
    },
 
    trade: 'tradecard',
    tradecard: function (target, room, user) {
        if (!target) return this.errorReply("/tradecard [ID de la carte], [Nom d'utilisateur], [targetCard ID]");
        let parts = target.split(",").map(p => toId(p));
        if (parts.length !== 3) return this.errorReply("/tradecard [votre ID de carte], [targetUser], [targetCard ID]");
        let match;
 
        // check for user's card
        let forTrade = parts[0];
        match = false;
        let userCards = Db('cards').get(user.userid, []);
        for (let i = 0; i < userCards.length; i++) {
            if (userCards[i].title === forTrade) {
                match = true;
                break;
            }
        }
        if (!match) return this.errorReply("Vous n'avez pas cette carte!");
 
        // check for target's card
        let targetUser = parts[1];
        let targetTrade = parts[2];
 
        let targetCards = Db('cards').get(targetUser, []);
        match = false;
        for (let i = 0; i < targetCards.length; i++) {
            if (targetCards[i].title === targetTrade) {
                match = true;
                break;
            }
        }
 
        if (!match) return this.errorReply(targetUser + " n'a pas cette carte!");
 
        // initiate trade
        let tradeId = uuid.v1();
        let newTrade = {
            from: user.userid,
            to: targetUser,
            fromExchange: forTrade,
            toExchange: targetTrade,
            id: tradeId,
        };
 
        Db('cardtrades').set(tradeId, newTrade);
 
        // send messages
        this.sendReply("Votre échange a été soumis.");
        if (Users.get(targetUser)) Users.get(targetUser).send("|pm|~TradeBot|" + targetUser + "|/html <div class=\"broadcast-green\">" + Tools.escapeHTML(user.name) + " a engagé un échange avec vous.  Cliques <button name=\"send\" value=\"/trades last\">ici</button> ou utilise <b>/trades</b> pour voir vos échanges en attente. </div>");
        user.send("|pm|~TradeBot|" + user.userid + "|/html <div class=\"broadcast-green\">Your trade with " + Tools.escapeHTML(targetUser) + " has been initiated.  Cliques <button name=\"send\" value=\"/trades last\">ici</button> ou utilise <b>/trades</b> pour voit vos échanges en attente.</div>");
    },
 
    trades: 'viewcardtrades',
    viewcardtrades: function (target, room, user) {
        // popup variables
        const popup = "|html|<center><b><font color=\"blue\">Trade Manager</font></b></center><br />";
 
        // get the user's trades
        let allTrades = Db('cardtrades').object();
        let userTrades = [];
        for (let id in allTrades) {
            let trade = allTrades[id];
            if (trade.from === user.userid || trade.to === user.userid) {
                // push this into the user's trade data
                userTrades.push(trade);
            }
        }
 
        // if no pending trades
        if (!userTrades.length) return user.popup(popup + "<center>Vous n'avez pas d'échanges en attente.</center>");
 
        // build trade manager screen
        // decide which trade to display
        if (target === "last") {
            target = userTrades.length - 1;
        } else {
            // when there is no target (initial use of command)
            if (!target) target = 0;
            target = parseInt(target);
            if (isNaN(target)) target = 0;
            if (target < 0) target = 0;
            if (target >= userTrades.length) target = userTrades.length - 1;
        }
 
        // show trade details
        let displayTrade = userTrades[target];
        const acceptReject = '<center>' + (displayTrade.from === user.userid ? "" : '<button name="send" value="/tradeaction accept, ' + displayTrade.id + '" style=\"background-color:green;height:30px\"><b>Accepter</b></button>') + // accept button
            '&nbsp;&nbsp;' + // spacing
            '<button name="send" value="/tradeaction ' + (displayTrade.from === user.userid ? "cancel" : "reject") + ', ' + displayTrade.id + '" style=\"background-color:red;height:30px\"><b>' + (displayTrade.from === user.userid ? "Annuler" : "Reject") + '</b></button></center>' + // reject button
            '<br /><br />'; // new line
 
        // build the user's card first
        let card = cards[(displayTrade.from === user.userid ? displayTrade.fromExchange : displayTrade.toExchange)];
        // the image
        let cardImage = '<img src="' + card.card + '" height=250>';
        // rarity display
        let cardRarityPoints = '(<font color="' + colors[card.rarity] + '">' + card.rarity + '</font> - ' + card.points + ')<br />';
        let userSideDisplay = '<center>' + user.userid + '<br />' + cardImage + "<br />" + cardRarityPoints + '</center>';
 
        // now build the target's side
        card = cards[(displayTrade.from !== user.userid ? displayTrade.fromExchange : displayTrade.toExchange)];
        // the image
        cardImage = '<img src="' + card.card + '" height=250>';
        // rarity display
        cardRarityPoints = '(<font color="' + colors[card.rarity] + '">' + card.rarity + '</font> - ' + card.points + ')<br />';
        let targetSideDisplay = "<center>" + (displayTrade.from !== user.userid ? displayTrade.from : displayTrade.to) + '<br />' + cardImage + "<br />" + cardRarityPoints + "</center>";
 
        // now build the entire popup
        let tradeScreen = popup + // base popup
            '<center><table><tr><td>' + // table element
            userSideDisplay +
            '</td><td>' + // next column
            targetSideDisplay +
            '</td></tr></table></center><br />' + // close table and add new line
            acceptReject;
 
        // build the navigation bar
        // build max and min
        let navigationButtons;
        if (userTrades.length === 1) {
            navigationButtons = '<center><button style="background-color:deepskyblue;height:30px;width:30px">1</button></center>';
        } else {
            // build min and mas
            let min = '<button style="background-color:lightblue;height:30px;width:30px" name="send" value="/viewcardtrades 0">1</button>&nbsp;&nbsp;&nbsp;';
            let max = '&nbsp;&nbsp;&nbsp;<button style="background-color:lightblue;height:30px;width:30px" name="send" value="/viewcardtrades last">' + (userTrades.length) + '</button>';
            // lazy replace for colour
            if (target === 0) min = min.replace("background-color:lightblue;height:30px", "background-color:deepskyblue;height:30px");
            if (target === userTrades.length - 1) max = max.replace("background-color:lightblue;height:30px", "background-color:deepskyblue;height:30px");
 
            let middle = "";
            // build range
            let range = Object.keys(userTrades).slice(1, userTrades.length - 1); // remove min and max and turn it into a array of numbers
            if (range.length !== 0) { // only build middle buttons is there is none
                if (range.length > 5) {
                    // find the current one and get 2 above and below
                    let displayRange = [target - 2, target - 1, target, target + 1, target + 2].filter(i => {
                        return i > 0 && i <= range.length;
                    });
                    // build middle buttons
                    middle = (displayRange[0] !== 1 ? "... " : "") + displayRange.map(n => {
                        n = parseInt(n);
                        let style = n === target ? "background-color:deepskyblue;height:30px;width:30px" : "background-color:aliceblue;height:30px;width:30px";
                        return '<button style="' + style + '" name="send" value="/viewcardtrades ' + n + '">' + (n + 1) + '</button>';
                    }).join("&nbsp;") + (displayRange[displayRange.length - 1] !== range.length ? " ..." : "");
                } else {
                    // just map the range
                    middle = range.map(n => {
                        n = parseInt(n);
                        let style = n === target ? "background-color:deepskyblue;height:30px;width:30px" : "background-color:aliceblue;height:30px;width:30px";
                        return '<button style="' + style + '" name="send" value="/viewcardtrades ' + n + '">' + (n + 1) + '</button>';
                    }).join("&nbsp;");
                }
            }
            // add the stuff to navigation buttons
            navigationButtons = "<center>" + min + middle + max + "</center>";
        }
        // add the navigation buttons to the popup
        user.lastTradeCommand = "/viewcardtrades " + target;
        tradeScreen += navigationButtons;
        user.popup(tradeScreen);
    },
 
    tradeaction: function (target, room, user) {
        if (!target) return false; // due to the complexity of the command, this should only be used through the viewtrades screen
        let parts = target.split(",").map(p => p.trim());
        let action = toId(parts.shift());
        const backButton = '<button name="send" value="' + (user.lastTradeCommand || '/viewcardtrades') + '" style="background-color:aliceblue;height:30px">< Retour</button><br /><br />';
        const tradeError = "|html|" + backButton + '<center><font color="red"><b>ERREUR: Echange invalide / Vous ne pouvez pas échanger avec vous même!</b></font><center>';
        let trade;
        switch (action) {
        case 'confirmaccept':
        case 'accept':
            if (!parts[0]) return false;
            if (action === "accept") {
                // make the user confirm the decision
                // build a back button
                return user.popup("|html|" + backButton + // back button
                '<center><button name="send" value="/tradeaction confirmaccept, ' + parts[0] + '" style="background-color:red;height:65px;width:150px"><b>Confirmer l'échange</b></button></center>');
            }
            // finalize trade
            // get the trade
            trade = Db('cardtrades').get(parts[0], null);
            if (!trade) return user.popup(tradeError);
 
            // check if the trade involves the user
            let accepter, otherTarget;
            if (trade.to === user.userid) {
                accepter = "to";
                otherTarget = "from";
            } else {
                // user has no say in this trade
                return user.popup(tradeError);
            }
 
            let match;
            // now double check that both users still have those cards
            // check user first
            match = false;
            let userCards = Db('cards').get(user.userid, []);
            for (let i = 0; i < userCards.length; i++) {
                if (userCards[i].title === trade[accepter + "Exchange"]) {
                    match = true;
                    break;
                }
            }
 
            if (!match) return this.parse('/tradeaction forcecancel, ' + trade.id);
 
            // check target
            match = false;
            let targetCards = Db('cards').get(trade[otherTarget], []);
            for (let i = 0; i < targetCards.length; i++) {
                if (targetCards[i].title === trade[otherTarget + "Exchange"]) {
                    match = true;
                    break;
                }
            }
            if (!match) return this.parse('/tradeaction forcecancel, ' + trade.id);
 
            // now go ahead with the trade!
            // for "from" first
            addCard(trade.from, trade.toExchange);
            removeCard(trade.fromExchange, trade.from);
 
            // apply the actions to "to"
            addCard(trade.to, trade.fromExchange);
            removeCard(trade.toExchange, trade.to);
 
            // update points
            Db('points').set(trade.to, getPointTotal(trade.to));
            Db('points').set(trade.from, getPointTotal(trade.from));
 
            // remove the trade
            Db('cardtrades').delete(parts[0]);
 
            // on trade success
            // send popups to both user and target saying the trade with user was a success
            // and a button to view the card they just received
            let targetUsers = [Users.get(trade.to), Users.get(trade.from)];
            if (targetUsers[0]) {
                targetUsers[0].popup("|html|" + backButton + "<center>Votre échange avec " + trade.from + " a été fait." +
                "<br /><button name=\"send\" value=\"/cs card, " + trade.fromExchange + "\">Regarder la carte échangée</button></center>"); // show card
            }
            if (targetUsers[1]) {
                targetUsers[1].popup("|html|<center>Votre échange avec " + trade.to + " a été fait." +
                "<br /><button name=\"send\" value=\"/cs card, " + trade.toExchange + "\">Regarder la carte échangée</button></center>");
            }
 
            // log trades and delete the data from list of trades.
            let now = Date.now().toString();
            Db('completedTrades').set(now, trade);
            break;
        case 'forcecancel':
        case 'cancel':
        case 'reject':
            if (!parts[0]) return false;
            // check for trade
            trade = Db('cardtrades').get(parts[0], null);
 
            if (!trade) return user.popup(tradeError);
 
            // additional consts
            const popupText = {
                forcecancel: "L'échange a été automatiquement annulé come l'un des participants na plus cette carte.",
                cancel: "Vous avez annulé l'échange",
            };
 
            // check if user is involved
            if (trade.from === user.userid || trade.to === user.userid) {
                // check that the action is correct
                if (trade.from === user.userid && action === "reject") action = "cancel";
                if (trade.to === user.userid && action !== "reject" && action !== "forcecancel") action = "reject";
            } else {
                return user.popup(tradeError);
            }
 
            // remove the trade
            Db('cardtrades').delete(parts[0]);
 
            // letting the users involved know
            let targetUser;
            if (action === "reject") {
                targetUser = Users.get(trade.from);
                if (targetUser) targetUser.popup("Votre échange avec " + user.userid + " a été rejeté");
                user.popup("|html|" + backButton + "Vous avez rejeté l'échange de " + trade.from + ".");
            } else {
                user.popup("|html|" + backButton + popupText[action]);
            }
            break;
        }
    },
 
    confirmtransfercard: 'transfercard',
    transfercard: function (target, room, user, connection, cmd) {
        if (!target) return this.errorReply("/transfercard [Nom de l'utilisateur], [ID de la carte]");
        if (toId(target) === user) return this.errorReply("Vous ne pouvez pas transférer des cartes à vous-même.");
        let parts = target.split(",").map(p => toId(p));
        // find targetUser and the card being transfered.
        let targetUser = parts.shift();
        let card = parts[0];
        if (!targetUser || !card) return this.errorReply("/transfercard [Nom de l'utilisateur], [ID de la carte]");
 
        if (cmd === "transfercard") {
            return user.popup('|html|<center><button name="send" value="/confirmtransfercard ' + target + '" style="background-color:red;height:65px;width:150px"><b><font color="white" size=3>Confirmer le transfert de ' + targetUser + '</font></b></button>');
        }
        // check if card can been removed
        let canTransfer = removeCard(card, user.userid);
        if (!canTransfer) return user.popup("Carte invalide.");
        // complete transfer
        addCard(targetUser, card);
 
        Db('points').set(targetUser, getPointTotal(targetUser));
        Db('points').set(user.userid, getPointTotal(user.userid));
 
        // build transfer profile
        let newTransfer = {
            from: user.userid,
            to: targetUser,
            transfer: card,
        };
        // log it
        let now = Date.now().toString();
        Db('completedTrades').set(now, newTransfer);
        user.popup("Vous avez transféré avec succès " + card + " à " + targetUser + ".");
    },
 
    confirmtransferallcards: 'transferallcards',
    transferallcards: function (target, room, user, connection, cmd) {
        if (!target) return this.errorReply("/transferallcards [Nom de l'utilisateur]");
        if (toId(target) === user) return this.errorReply("Vous ne pouvez pas transférer de cartes à vous-même.");
        let targetUser = toId(target);
        if (!targetUser) return this.errorReply("/transferallcards [Nom de l'utilisateur]");
        let userCards = Db('cards').get(user.userid, []);
        let targetCards = Db('cards').get(targetUser, []);
 
        if (!userCards.length) return this.errorReply("Vous n'avez pas de cartes.");
 
        // confirmation
        if (cmd === "transferallcards") {
            return user.popup('|html|<center><button name="send" value="/confirmtransferallcards ' + target + '" style="background-color:red;height:65px;width:150px"><b><font color="white" size=3>Confirmer le transfert de ' + targetUser + '</font></b></button>');
        }
 
        // now the real work
        Db('cards').set(targetUser, targetCards.concat(userCards));
        Db('cards').set(user.userid, []);
 
        Db('points').set(targetUser, getPointTotal(targetUser));
        Db('points').set(user.userid, getPointTotal(user.userid));
 
        user.popup("Vous avez transféré toutes vos cartes à " + targetUser + ".");
 
        let newTransfer = {
            from: user.userid,
            to: targetUser,
            transfer: "all",
        };
 
        let now = Date.now().toString();
        Db('completedTrades').set(now, newTransfer);
    },
 
    psgo: 'cardshelp',
    cardshelp: function (target, room, user) {
        if (!this.runBroadcast()) return;
        return this.sendReplyBox("<center><b><u>Pokeland TCG:</u></b></center><br>" +
            "<b>/buypack</b> - Achète un pack depuis le shop.<br>" +
            "<b>/packshop</b> - Affiche le shop pour acheter des packs.<br>" +
            "<b>/openpack</b> - Ouvre un pack qui a été acheté depuis le shop.<br>" +
            "<b>/packs</b> - Affiche tous les packs non ouverts.<br>" +
            "<b>/showcase</b> - Affiche toutes les cartes que vous avez.<br>" +
            "<b>/card</b> - Affiche les informations d'une carte.<br>" +
            "<b>/cardladder</b> - Affiche le ladder de toutes les personnes ayant le plus de points.<br>" +
            "<b>/cardsearch</b> - Ouvre une fenêtre pour chercher toutes les cartes.<br>" +
            "<b>/trade</b> - /trade [carte], [Nom de l'utilisateur], [carte de l'autre utilisateur] - démarre une demande d'échange.<br>" +
            "<b>/trades</b> - Affiche vos demandes d'échanges en cours.<br>" +
            "<b>/transfercard</b> - /transfercard [Nom de l'utilisateur], [carte] - transfère une carte à la personne souhaitée.<br>" +
            "<b>/transferallcards</b> - /transferallcards [Nom de l'utilisateur] - transfère toutes vos cartes à la personne souhaitée.<br>"
        );
    },
 
    givecard: 'spawncard',
    spawncard: function (target, room, user, connection, cmd) {
        if (!this.can('declare')) return false;
        if (!target) return this.errorReply("/givecard [user], [card ID]");
        let parts = target.split(",").map(p => toId(p));
        // find targetUser and the card being given.
        let targetUser = parts.shift();
        let card = parts[0].trim();
        if (!targetUser || !card) return this.errorReply("/givecard [user], [card ID]");
        if (!cards.hasOwnProperty(card)) return this.sendReply(target + ": card not found.");
        //Give the card to the user.
        card = cards[card];
        addCard(targetUser, card.title);
        user.popup("You have successfully given " + card.name + " to " + targetUser + ".");
    },
 
    takecard: function (target, room, user, connection, cmd) {
        if (!this.can('declare')) return false;
        if (!target) return this.errorReply("/takecard [user], [card ID]");
        let parts = target.split(",").map(p => toId(p));
        // find targetUser and the card being taken.
        let targetUser = parts.shift();
        let card = parts[0].trim();
        if (!targetUser || !card) return this.errorReply("/takecard [user], [card ID]");
        if (!cards.hasOwnProperty(card)) return this.sendReply(target + ": card not found.");
        //Take the card from the user.
        card = cards[card];
        removeCard(card.title, targetUser);
        user.popup("You have successfully taken " + card.name + " from " + targetUser + ".");
    },
};

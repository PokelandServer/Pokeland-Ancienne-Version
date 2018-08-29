'Use Strict';

/* Original code by panpawn! Modified for roleplau by Prince Sky!*/

var color = require('../config/color');
hashColors = function(name, bold) {
	return (bold ? "<b>" : "") + "<font color=" + color(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Chat.escapeHTML(Users.getExact(name).name) : Chat.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
}

exports.commands = {
	credits: 'credit',
	credit: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Credits pokeland</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + hashColors('Distrib', true) + " (Fondateur, Développeur)<br />" +
                    "- " + hashColors('Saitochi', true) + " (Fondateur, Développeur)<br />" +
                    "- " + hashColors('Shiruushi', true) + " (Administrateur, Traducteur )<br />" +
                    "- " + hashColors('Kitokuari', true) + " (Administrateur)<br />" +
                    "- " + hashColors('Wally', true) + " (Développeur)<br />" +
					"- " + hashColors('Panur', true) + " (Développeur)<br />" +
					"- " + hashColors('Lionyx', true) + " (Développeur)<br />" +
					"<br />" +
					"<u>Remerciements:</u><br />" +
					"- L'équipe actuelle du staff<br />" +
					"- Nos utilisateurs réguliers<br />");
	},
				pgregles: 'pgregles',
	pgregles: function (target, room, user) {
		this.popupReply("|html|" + '<b>Voici les règles de la room Pokemon Generations, il ne tient qu à toi de les respecter:</b><br><br>1. Le respect: Aucune insulte n est tolérée<br>2. /!\ Ne pas spammer les boutons sous peine de BAN.<br>3. Pas de pub sans demander la permission<br>4. Si vous avez un problème, demander au %, @ & #<br>6. Amusez vous bien!' );

	},

	    regles: function(target, room, user) {
        target = user.userid;
        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if(targetUser) {
            targetUser.popup('|html|<p>Voici le règlement du serveur, veuillez le lire attentivement.</p><br/><p>Règle N°1: Soyez respectueux. Si une personne vous manque de respect, contactez un membre du staff (%Driver, @Modérateur ou &Leader).  Si vous répliquez au lieu de prévenir, votre plainte ne sera pas prise en compte et vous serez autant puni que cette personne.</p><br/><p>Règle N°2: Le serveur possède un système de rangs. Veuillez respecter la hiérarchie (%Driver, @Modérateur, &Leader, ~Administrateur, etc). Aucune sanction non justifiée et tolérée. Si un membre du staff venait à abuser de ses droits, contactez un &Leader ou un ~Administrateur en lui envoyant une capture de PC.</p><br/><p>Règle N°3: Le staff est mis en place par les administrateurs. Veuillez ne pas contester un promote ou un demote effectué par un ~Administrateur et ne demandez pas aux membres du staff un promote (+Voice etc). Ces derniers jugent bon de promote ou de demote un membre en fonction de sa présence et de son implication sur le serveur.</p><br/><p>Règle N°4: Les décisions sont prises par le Staff (%, @, &, ~). Ces derniers sont donc les seuls autorisés à prendre des décisions importantes mais dans certains cas les administrateurs peuvent être les seuls habilités à prendre la ou les décisions.</p><br/><p>Règle N°5: Les bucks sont la monnaie virtuelle. Ils se gagnent lors de tournois, de mini-jeux. Les boutons provoquant un transfert automatique de bucks sont également interdits , entraînent des lourdes sanction et cela vaut pour toutes les salles du serveur.</p><br/><p>Règle N°6: Plusieurs actes sont passibles de sanctions, comme par exemple le spam, le flood, la vulgarité. Les sanctions peuvent être prises par notre Robot qui surveille les éventuels manquements aux règles. Plusieurs sanctions sont possibles comme le mute, le lock, ou le ban. Tout bold non autorisé sera sanctionné. Si vous contournez le système de banword vous pourriez avoir une sanction</p><br/><p>Règle N°7: Le lobby est un lieu qui représente le serveur, c le lieux depuis lequel les nouveaux arrivants se forgent une image du serveur. Le langage doit donc y être respectueux. Les discussions liées au sexe, que ce soit en privé ou dans le chat, sont formellement interdites par Pokémon Showdown et par conséquent. Veuillez donc évitez ce genre de discussion. Évitez également les messages à tendance raciste.</p><br/><p>Règle N°8: Les liens sont interdits un sujet intéressant. Tout lien publié étant publicitaire, choquant, ou considéré comme hors sujet par un membre du staff devra être immédiatement supprimé par le biais un warn puis  sanction supérieure en cas de récidive ou si le lien posté est considéré comme méritant une sanction plus lourde.</p><br/><p>Règle N°9. Si un membre du staff reçoit une plainte, votre rang dans la room sera supprimée par un ~Administrateur ou par le #Room Owner. Leak (donner le lien ou le nom sur une room publique) une room secrète sera passible de sanction.</p></p>');
        }
    },

};
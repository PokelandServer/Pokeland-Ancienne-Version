exports.commands = {

'!jc': true,
	jc: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
'Avis à toute la communauté Pokéland ! Distrib et Nuffy vous invitent à consulter leur nouvelle chaîne Youtube dédiée aux courts métrages où vous pourrez notamment revoir Titus L'étrangleur et ses suite !<br><br> Consultez le Facebook officiel : <a href="https://www.facebook.com/J.C.PROD2018/?modal=admin_todo_tour">https://www.facebook.com/J.C.PROD2018/?modal=admin_todo_tour</a><br><br><br> Rendez-vous sur le Discord pour obtenir un grade exclusif ! : <a href="https://discord.gg/d6fjhce">https://discord.gg/d6fjhce</a><br><br><br>Vous pouvez aussi nous écrire à notre adresse mail: J.CProductions@outlook.fr<br><br><br>Et le meilleur pour la fin....La chaîne Youtube officielle de J.C Productions ! : <a href="https://www.youtube.com/channel/UCcUiqkkcN2ooS3Wk5y9-mdQ?view_as=subscriber">https://www.youtube.com/channel/UCcUiqkkcN2ooS3Wk5y9-mdQ?view_as=subscriber</a><br><br><br>Toute l'équipe de J.C Productions vous souhaite un bon divertissement !';
);
	},
  }

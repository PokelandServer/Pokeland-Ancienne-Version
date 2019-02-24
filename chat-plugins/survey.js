'use strict';
let moment = require('moment');
// if 'target' !== dans les réponses > l'ajouter
class Response { 
	constructor(room, author, str) {
		this.room = room; 
		this.author = author;
		this.str = str;
		this.upvotes = 0;
		this.downvotes = 0;
		this.voters = {};
		this.votersIps = {};
		this.replyTime = new Date();
	}

	score() {
		return (this.upvotes - this.downvotes);
	}

	upvote(voter) {
		let ip = voter.latestIp;
		let userid = voter.userid;
		if (!this.room.survey) return voter.sendTo(this.room, "Il n'y a pas de sondage en cours.");

		this.upvotes++;
		this.voters[userid] = 1;
		this.votersIps[ip] = 1;
		this.room.survey.update();
	}

	downvote(voter) {
		let ip = voter.latestIp;
		let userid = voter.userid;
		if (!this.room.survey) return voter.sendTo(this.room, "Il n'y a pas de sondage en cours.");

		this.downvotes++;
		this.voters[userid] = 1;
		this.votersIps[ip] = 1;
		this.room.survey.update();
	}

	show() { // mettre if survey ended (show (end?)) > montre pas les boutons 
		let output = '<b style="color:'+ hashColor(this.author.userid) +'">'+ this.author.name.replace(/[^a-zA-Z0-9 ]+/g, '') +'</b>: <i>'+ Chat.escapeHTML(this.str).trim() +'</i></td> <td style="float: right;"><span style="display: block; width: 107px;">';
		output += '<button class="button" title="Vous êtes d\'accord avec la réponse" name="send" value="/survey upvote '+ this.author.userid +'"><i class="fa fa-thumbs-up" aria-hidden="true"></i> <b style="color: green;">'+ this.upvotes +'</b></button> ';
		output += '<button class="button" title="Vous n\'êtes pas d\'accord avec la réponse" name="send" value="/survey downvote '+ this.author.userid +'"><i class="fa fa-thumbs-down" aria-hidden="true"></i> <b style="color: red;">'+ this.downvotes +'</b></button>';
		output += '</span></td>';
		return output;
	}

	showadmin() {
		let output = '<button class="button" name="send" value="/survey del '+ this.author.userid +'" title="Supprimer"><i class="fa fa-times-circle"></i></button> ';
		output += '<b style="color:'+ hashColor(this.author.userid) +'">'+ this.author.name.replace(/[^a-zA-Z0-9 ]+/g, '') +'</b>: <i>'+ Chat.escapeHTML(this.str).trim() +'</i> | ';
		output += '<i class="fa fa-thumbs-up"></i><b style="color: green;" title="'+ this.upvotes +' approbation(s)">'+ this.upvotes +'</b> ',
		output += '<i class="fa fa-thumbs-down"></i><b style="color: red;" title="'+ this.downvotes +' désapprobation(s)">'+ this.downvotes +'</b> ';
		output += '• <b>'+ this.score() +'</b> | '
		output += 'Posté: '+ moment(this.replyTime).format('lll');
		return output;
	}
}

class Survey {
	constructor(room, question) {
		if (room.surveyNumber) {
			room.surveyNumber++;
		} else {
			room.surveyNumber = 1;
		}
		this.room = room;
		this.question = question;
		this.repliers = {};
		this.repliersIps = {};
		this.totalReplies = 0;
		this.replies = {};
		this.inAdminMode = {}; 
	}

	answer(user, reply) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.repliers || ip in this.repliersIps) {
			return user.sendTo(this.room, "Vous avez déjà répondu au sondage.");
		}

		this.replies[userid] = new Response(this.room, user, reply);
		
		this.repliers[userid] = 1;
		this.repliersIps[ip] = 1;
		this.totalReplies++;

		this.update();
	}

	blankanswer(user, reply) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.repliers || ip in this.repliersIps) {
			// Rien 
		} else {
			this.repliers[userid] = 0;
			this.repliersIps[ip] = 0;
		}

		this.updateTo(user);
	}

	generateQuestion() {
		let output = '<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Sondage</span> <strong style="font-size:11pt">' + Chat.escapeHTML(this.question).trim() + '</strong></p>';
		output += '<div style="margin-top: 3px">N\'oubliez pas que vos réponses sont publiques.</div>';
		output += '<div style="margin-top: 5px;">Utilisez <big><b>/survey answer [réponse]</b></big> pour répondre.</div>';
		output += '<div style="margin-top: 5px;"><button class="button" value="/survey results" name="send" title="Voir les résultats - Après avoir regardé les résultats, vous ne pourrez plus répondre au sondage."><small>(Voir les résultats)</small></button><small>(Après avoir regardé les résultats, vous ne pourrez plus répondre au sondage)</small></div>';
		output += '</div>';
		return output;
	}

	generateResults(ended) {
		let icon = '<span style="border:1px solid #' + (ended ? '777;color:#555' : '6A6;color:#484') + ';border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> ' + (ended ? "Sondage fini" : "Sondage") + '</span>';
		let output = '<div class="infobox"><p style="margin: 2px 0 5px 0">' + icon + ' <strong style="font-size:11pt">' + Chat.escapeHTML(this.question).trim() + '</strong></p>';
		output += '<table>'
		let arr = [], count = 1; 
		for(let i in this.replies) {
			arr.push(this.replies[i]);
		};
		let byScore = arr.slice(0);
		byScore.sort(function(a, b) {
			return b.score() - a.score();
		});
		for(let j in byScore) {
			output += '<tr> <td><b><abbr title="Rang">'+ count +'</abbr> <abbr title="Score">('+ byScore[j].score() +')</abbr> • </b>' + byScore[j].show() + '</tr>';
			count++;
		}
		output += '</table></div>';
		return output;
	}

	update() {
		let results = this.generateResults(false);
		let panel = this.generateAdminPanel();
		for(let i in this.room.users) {
			let user = this.room.users[i];
			if (user.userid in this.inAdminMode) {
				user.sendTo(this.room, '|uhtmlchange|survey' + this.room.surveyNumber + '|' + panel);
			} else if (user.userid in this.repliers || user.latestIp in this.repliersIps) {
				user.sendTo(this.room, '|uhtmlchange|survey' + this.room.surveyNumber + '|' + results);
			} 
		}
	}

	updateTo(user) {
		let results = this.generateResults(false);
		let question = this.generateQuestion();
		if (user.userid in this.repliers || user.latestIp in this.repliersIps) {
			user.sendTo(this.room, '|uhtmlchange|survey' + this.room.surveyNumber + '|' + results);
		} else {
			user.sendTo(this.room, '|uhtmlchange|survey' + this.room.surveyNumber + '|' + question);
		}
	}

	display() {
		let results = this.generateResults(false);
		let question = this.generateQuestion();
		for(let i in this.room.users) {
			let thisUser = this.room.users[i];
			if (thisUser.userid in this.repliers || thisUser.latestIp in this.repliersIps) {
				thisUser.sendTo(this.room, '|uhtml|survey' + this.room.surveyNumber + '|' + results);
			} else {
				thisUser.sendTo(this.room, '|uhtml|survey' + this.room.surveyNumber + '|' + question);
			}
		}
	}

	displayTo(user, connection) {
		let results = this.generateResults(false);
		let question = this.generateQuestion();
		if (!connection) connection = user;
		if (user.userid in this.repliers || user.latestIp in this.repliersIps) {
			connection.sendTo(this.room, '|uhtml|survey' + this.room.surveyNumber + '|' + results);
		} else {
			connection.sendTo(this.room, '|uhtml|survey' + this.room.surveyNumber + '|' + question);
		}
	}

	hasReplied(user) {
		let userid = user.userid;
		let userIp = user.latestIp;
		if (userid in this.repliers) return true;
		if (userIp in this.repliersIps) return true;
		return false;
	}

	onConnect(user, connection) {
		this.displayTo(user, connection);
	}

	end() {
		let results = this.generateResults(true);

		this.room.send('|uhtmlchange|survey' + this.room.surveyNumber + '|<div class="infobox">(Sondage fini)</div>');
		this.room.add('|html|' + results);
	}

	generateAdminPanel() {
		let output = '<div class="infobox">';
		output += '<button class="button" name="send" value="/survey leaveadmin" style="float: right;" title="Fermer"><i class="fa fa-times" aria-hidden="true"></i></button>';
		output += '<p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Sondage</span> <strong style="font-size:11pt">' + Chat.escapeHTML(this.question).trim() + '</strong></p>';
		output += '<div style="margin-top: 3px;"><big>Panneau d\'administration</big></div>';
		output += '<div style="margin-top: 3px;">';
		for(let i in this.replies) {
			output += this.replies[i].showadmin();
			output += '<br />';
		}
		output += '</div></div>';
		return output;
	}

	displayAdminPanel(user) {
		if (!this.hasReplied(user)) return false;
		if (user.userid in this.inAdminMode) return false;
		this.inAdminMode[user.userid] = 1;
		user.sendTo(this.room, '|uhtmlchange|survey' + this.room.surveyNumber + '|' + this.generateAdminPanel());
	}

	leaveAdminPanel(user) {
		this.updateTo(user);
		delete this.inAdminMode[user.userid];
	}
}

function validateAnswer(room, message) {
	if (!room) return true;
	if (!room.banwordRegex) {
		if (room.banwords && room.banwords.length) {
			//room.banwordRegex = new RegExp('(?:\\b|(?!\\w))(?:' + room.banwords.join('|') + ')', 'i');
			room.banwordRegex = new RegExp('(?:\\b|(?!\\w))(?:' + room.banwords.join('|') + ')(?:\\b|\\B(?!\\w))', 'i');
		} else {
			room.banwordRegex = true;
		}
	}
	if (!message) return true;
	if (room.banwordRegex !== true && room.banwordRegex.test(message)) {
		return false;
	}
	return true;
}

exports.commands = {
	survey: {
		admin: function(target, room, user) {
			if (!this.can('declare', null, room)) return false;
			if (!room.survey) return this.errorReply("Il n'y a pas de sondage en cours.");

			room.survey.displayAdminPanel(user);
		},

		leaveadmin: function(target, room, user) {
			if (!this.can('declare', null, room)) return false;
			if (!room.survey) return this.errorReply("Il n'y a pas de sondage en cours.");
			if (user.userid in room.survey.inAdminMode) {
				room.survey.leaveAdminPanel(user);			
			} else {
				return false;
			}
		},

		del: function(target, room, user) {
			if (!this.can('declare', null, room)) return false;
			if (!room.survey) return this.errorReply("Il n'y a pas de sondage en cours.");
			if (!target) return false;

			if (toId(target) in room.survey.replies) {
				this.sendReply("Vous avez supprimé la réponse de "+ toId(target) +", il ne pourra pas en poster une nouvelle.");
				delete room.survey.replies[toId(target)];
				return room.survey.update();
			}
		},

		upvote: function(target, room, user) {
			if (!room.survey) return this.errorReply("Il n'y a pas de sondage en cours.");
			if (!target) return false; 

			for(let i in room.survey.replies) {
				if (i === toId(target)) {
					if (user.userid in room.survey.replies[i].voters || user.latestIp in room.survey.replies[i].votersIps) {
						return this.errorReply('Vous avez déjà voté.')
					}
					room.survey.replies[i].upvote(user);
					return this.sendReply('Vous avez approuvé la réponse de '+ room.survey.replies[i].author.name);
				}
			}
		},

		downvote: function(target, room, user) {
			if (!room.survey) return this.errorReply("Il n'y a pas de sondage en cours.");
			if (!target) return false;

			for(let i in room.survey.replies) {
				if (i === toId(target)) {
					if (user.userid in room.survey.replies[i].voters || user.latestIp in room.survey.replies[i].votersIps) {
						return this.errorReply('Vous avez déjà voté.')
					}
					room.survey.replies[i].downvote(user);
					return this.sendReply('Vous avez désapprouvé la réponse de '+ room.survey.replies[i].author.name);
				}
			}
		},

		htmlcreate: 'new',
		create: 'new',
		new: function (target, room, user, connection, cmd, message) {
			if (!target) return this.errorReply("/survey new [question]");
			if (target.length > 300) return this.errorReply("Sondage trop long.");

			if (!this.can('declare', null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (room.survey) return this.errorReply("There is already a survey in progress in this room.");
			let allowHTML = toId(cmd) === 'htmlcreate';
			if (allowHTML && !user.can('declare', null, room)) return false;

			room.survey = new Survey(room, target, allowHTML);
			room.survey.display();

			
			return this.privateModCommand("(A survey was started by " + user.name + ".)");
		},

		answer: function (target, room, user, connection, cmd, message) {
			if (!room.survey) return this.errorReply("Pas de sondage en cours.");
			if (!target) return this.parse('/help survey answer');
			if (target.length > 100) return this.errorReply('Votre réponse est trop longue.');
			if (!validateAnswer(room, target)) return this.errorReply('Votre réponse contient un mot banni.');
			target = Chat.escapeHTML(target);
			target = target.replace(/&apos;/gi, "'");
			target = target.replace(/&quot;/gi, '"');
			room.survey.answer(user, target);
		},
		answerhelp: ["/survey answer [réponse] - Répondre à un sondage."],

		results: function (target, room, user, connection, cmd, message) {
			if (!room.survey) return this.errorReply("Pas de sondage en cours.");
			return room.survey.blankanswer(user);
		},

		show: 'display',
		display: function (target, room, user, connection, cmd, message) {
			if (!room.survey) return this.errorReply("Pas de sondage en cours.");
			if (!this.runBroadcast()) return;
			room.update();

			if (this.broadcasting) {
				room.survey.display();
			} else {
				room.survey.displayTo(user, connection);
			}
		},

		delete: 'remove',
		remove: function (target, room, user, connection, cmd, message) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.survey) return this.errorReply("There is no survey running in the room.");

			if (!target) return this.errorReply("Please select an answer to remove.");
			target = toId(target);
			if (!room.survey.repliers[target]) return this.errorReply("The user " + target + " has not responded to the survey.");
			for (let i in room.survey.repliersIps) {
				if (room.survey.repliersIps[i] === room.survey.repliers[target]) {
					room.survey.repliersIps[i] = 0;
					room.survey.repliers[target] = 0;
					break;
				}
			}
			room.survey.update();
			this.sendReply(target + '\'s answer was removed.');
		},

		close: 'end',
		stop: 'end',
		end: function (target, room, user, connection, cmd, message) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.survey) return this.errorReply("There is no poll running in this room.");

			room.survey.end();
			delete room.survey;
			return this.privateModCommand("(The survey was ended by " + user.name + ".)");
		},

		'': function (target, room, user, connection, cmd, message) {
			return this.sendReply('/survey answer pour répondre')
		},
	}
};

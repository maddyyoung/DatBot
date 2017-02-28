// THINGS TO DO
// ADD QUALIA COMMAND
// ADD !BOI COMMAND
// EDIT MESSAGE COMMAND TO ALLOW FOR THE SENDING OF COMMAND RESULTS


var Discord = require("discord.js");

var mybot = new Discord.Client();

var mongojs = require('mongojs');
var collections = ['aliases', 'quotes', 'karma', 'karmaReasons', 'deadlines', 'commands'];
var url = "mongodb://localhost:27017/datbotdb";
var db = mongojs(url, collections);
var users;

//db.aliases.ensureIndex({name:1},{unique:true});
//db.quotes.ensureIndex({quoteID:1},{unique:true});
//db.karma.ensureIndex({name:1},{unique:true});

var commands = {
	//!time - for testing
	"TIME": {
		description: "Replies with the time according to our good friend, Jesse McCree.",
		syntax: "!time",
		process: function(bot, msg, suff){
			msg.reply("it's hiiiiiigh noon!");
		}
	},
	"ALIAS": {
		description: "Allows users to create an alias for a command e.g. !ping == !say pong.",
		syntax: "!alias <alias_name> <command>",
		process: function(bot, msg, suff){
			var commandUsed = suff[1].toUpperCase();
			var name = suff[0].toUpperCase();
			var owner = msg.author.id;
			var command = suff.splice(1).join(" ");
			console.log(command);

			function alias(name, owner, command){
				this.name = name;
				this.owner = owner; // discord user id
				this.command= command; 
			}

			if (name in commands) {
				msg.reply("you cannot overwrite a command with an alias.");
			} else {
				if(commandUsed in commands){
					var alias = new alias(name, owner, command);
					//msg.reply("Creating alias " + suff[0] + " with command " + command + " belonging to " + owner);
					//check if alias exists already
					db.aliases.find({name: name.toUpperCase()}, function(err, aliases){
							if (err || aliases.length == 0){
									db.aliases.save(alias, function(err, savedAlias) {
										if (err || !savedAlias) {
											msg.reply("alias " + "!"+suff[0] + " not added to database due to error.");
										} else {
											msg.reply("alias " + "!"+suff[0] + " added to database.");
										}
									});
							} else {
								msg.reply("an alias with the name " + suff[0] + " already exists.");
							}
					} );

				} else {
					msg.reply("incorrect syntax. Your alias name must be followed by a valid command.");
				}
			}
		}
	},
	"ALIAS.UPDATE": {
		description: "Allows a user to update an already existing alias. You must own an alias in order to update it.",
		syntax: "!alias.update <alias_name> to <new command>",
		process: function(bot, msg, suff){
			if (suff.length >= 3){
				var aliasName = suff[0];
				if (suff[1] == "to"){
					var comm = suff[2];	
					var command = suff.splice(2, suff.length).join(" ")
					// ADD CHECK TO MAKE SURE NEW COMMAND IS STILL A COMMAND
					
					if (comm.toUpperCase() in commands){
						db.aliases.find({name: aliasName.toUpperCase()}, function(err, aliases){
							if (err || aliases.length == 0){
								msg.reply("there is no alias with that name.");
							} else {
								aliases.forEach(function (alias){
									if (msg.author.id == alias.owner){
										db.aliases.update({name: aliasName.toUpperCase()},{$set: {command: command}}, function(err, aliases) {
											if (err || aliases.length == 0){
												msg.reply("was unable to update alias due to error.");
											} else {
												msg.reply("alias " + suff[0] + " updated (was '" + alias.command + "', now '"+ command + "'').");
											}
										});
									} else {
										msg.reply("you must own an alias in order to update it.");
									}
								});
							}
						});
					} else {
						msg.reply("incorrect syntax. Your alias must begin with a command.");
					}
				} else {
					msg.reply("incorrect syntax. Correct syntax is !alias.update <alias_name> to <new command>.");
				}
			} else {
				msg.reply("incorrect syntax. Please include name of alias to update and new command. Correct syntax is !alias.update <alias_name> to <new command>.");
			}
		}
	},
	"ALIAS.DELETE": {
		description: "Allows a user to delete an already existing alias. You must own an alias in order to delete it.",
		syntax: "!alias.delete <alias_name>",
		process: function(bot, msg, suff){
			if (suff.length > 0){
				var aliasName = suff[0];
				db.aliases.find({name: aliasName.toUpperCase()}, function(err, aliases){
					if (err || aliases.length == 0){
						msg.reply("there is no alias with that name.");
					} else {
						aliases.forEach(function (alias){
							if (msg.author.id == alias.owner){
								db.aliases.remove({name: aliasName.toUpperCase()}, function(err, aliases) {
									if (err || aliases.length == 0){
										msg.reply("was unable to delete alias due to error");
									} else {
										msg.reply("alias " + suff[0] + " removed from the database");
									}
								});
							} else {
								msg.reply("you must own an alias in order to delete it.");
							}
						});
					}
				});
			} else {
				msg.reply("incorrect syntax. Please include the name of the alias you want to delete.");
			}	

		}
	},
	"SAY": {
		description: "Makes DatBot say a given message in the current channel.",
		syntax: "!say <message>",
		process: function(bot, msg, suff){
			console.log(suff);
			msg.channel.sendMessage(suff.join(' '));
		}
	},
	"REPLY": {
		description: "Makes DatBot reply to you in the current channel with a given message.",
		syntax: "!reply <message>",
		process: function(bot, msg, suff){
			msg.reply(suff);
		}
	},
	"MESSAGE": { 
		description: "Makes DatBot send a private message to a given user. If there are multiple users with the same username, you must include their discriminator e.g. DatBot#4434.",
		syntax: "!message <username>[#<discriminator>] <message>",
		process: function(bot, msg, suff){
			if (suff.length >= 2){
				var usernameID = suff[0].split('#');
				var messageText = suff.splice(1).join(" ");
				var allUsers = users.array();
				var targetUser;
				var count = 0;

				if (usernameID.length == 2){
					for (i = 0; i < allUsers.length; i++){
						if (allUsers[i].user.discriminator == usernameID[1] && allUsers[i].user.username == usernameID[0]){
							targetUser = allUsers[i].user;
							count = 1;
							break;
						}
					}
				} else {
					for (i = 0; i < allUsers.length; i++){
						if (allUsers[i].user.username == usernameID[0]){
							targetUser = allUsers[i].user;
							count++;
						}
					}
				}

				if (count == 0){
					console.log("user " + usernameID[0] + " does not exist.");
				} else if (count > 1){
					msg.reply("there is more than one user with that username. Please include the discriminator of the user you wish to message e.g. DatBot#4434.")
				} else {
					targetUser.sendMessage(messageText);
				}

			} else {
				if (suff.length == 0){
					console.log("incorrect syntax. Please include a user and a message.");
				} else {
					console.log("incorrect syntax. Please include a message.");
				}
			}
			//console.log("sending message " + messageText + " to " + username + " from " + msg.author.username)
		}
	},
	"COMMANDS": {
		description: "Private messages the user with a link to the list of commands.",
		syntax: "!commands",
		process: function(bot, msg, suff){
			msg.author.sendMessage("this command hasn't been implemented yet :(");
		}
	},
	"HELP":{
		description: "Private messages the user with the description and syntax of a given command.",
		syntax: "!help <command>",
		process: function(bot, msg, suff){
			if (suff.length != 0){
				var commandHelp = suff[0];
				var sender = msg.author;
				if (commandHelp.toUpperCase() in commands){
					sender.sendMessage('Desc: '+commands[commandHelp.toUpperCase()].description);
					sender.sendMessage('Syntax: '+commands[commandHelp.toUpperCase()].syntax);
				} else {
					sender.sendMessage("There is no command with that name. For a list of commands use !commands.");
				}
			} else {
				sender.sendMessage("Please provide the name of the command you want help with. e.g. !help quote.");
			}
		}
			
	},
	"QUOTE": { 
		description: "Allows users to save a quote to the database. If no username given, will save the most recent message not made by the user or DatBot. If no snippet given, will ssave the most recent message made by the given user. If both username and snippet given, will save the most recent message containing the snippet made by the user.",
		syntax: "!quote | !quote <username> | !quote <username> /<snippet>/",
		process: function(bot, msg, suff){

				var owner = msg.author.id;
				var ownerUsername = msg.author.username;
				var messageNumber = 100
				var quoteID = 0;

				function quote(quoteID, contentLines, quotees, owner){
					this.quoteID = quoteID;
					this.contentLines = contentLines;
					// update so this is a array - needs to be able to have multiple quotees
					this.quotees = quotees; // current discord user name. if two users have the same username then they share quotes
					this.owner = owner; // discord user id
				}
				function addQuote(quote, msg){
					var reply = "";
					db.quotes.save(quote, function(err, savedQuote) {
						if (err || !savedQuote) {
							console.log(err);
							console.log(savedQuote);
							reply = "quote not saved due to error";
						} else {
							reply = "quote '" + quote.contentLines[0] + "' saved to database with id " + quote.quoteID;
						}
						msg.reply(reply);
						
					});
				}

				db.quotes.find().limit(1).sort({$natural:-1}, function(err, result){
					if (err || !result) {
					} else {
						result.forEach(function(res){
							quoteID = res.quoteID;
						});
					}

					// if there is a suffix
					if (suff.length > 0){
						var quotee = [suff[0]];
						for (i = 1; i < suff.length;i++){
							if (!suff[i].startsWith('/')){
								quotee.push(suff[i]);
								
							} else {
								break;
							}
						}
						var contains = [];
						if (suff.length > quotee.length){
							contains.push(suff[quotee.length].substring(1,suff[quotee.length].length));
							if (!contains[0].endsWith('/')){
								for (i = quotee.length+1; i < suff.length; i++){
									if (suff[i].endsWith('/')){
										contains.push(suff[i].substring(0,suff[i].length-1));
										break;
									} else {
										contains.push(suff[i]);
									}		
								}
							} else {
								contains[0] = contains[0].substring(0,contains[0].length-1);
							}
						}
						//console.log(quotee);
						//console.log(contains);
						contains = contains.join(" "); 
						quotee = quotee.join(' ');
						

						if (quotee != ownerUsername && quotee != 'DatBot'){
							msg.channel.fetchMessages({limit:messageNumber}).then(mess => {
								mess = mess.array();
								var found = false;
								// check last _ messages
								for (i = 0; i < mess.length; i++){
									// if message is made by the desired person
									if (mess[i].author.username == quotee){
										var content = mess[i].toString();
										if (contains != "") {
											if (content.includes(contains)){
												found = true;
												quoteID += 1;
												var quotees = [quotee];
												content = '<'+quotee+'> '+content;
												var contentLines = [content];
												var newQuote = new quote(quoteID, contentLines, quotees, owner);
												addQuote(newQuote, msg);
												break;
											}
										} else {
											found = true;
											quoteID += 1;
											var quotees = [quotee];
											content = '<'+quotee+'> '+content;							
											var contentLines = [content];
											var newQuote = new quote(quoteID, contentLines, quotees, owner);
											addQuote(newQuote,msg);
											break;
										}	
									}
								}
								if (found == false && contains == ""){
									msg.reply("there are no recent messages made by that user.");
								} else if (found == false && contains != ""){
									msg.reply("there are no recent messages made by that user containing that snippet.");
								}
							});
						} else {
							msg.reply("you cannot quote yourself or DatBot.");
						}

					} else {
						msg.channel.fetchMessages({limit:messageNumber}).then(mess => {
							mess = mess.array();
							var found = false;
							for (i = 0; i < mess.length; i++){
								console.log(mess[i].toString());
								if (mess[i].author.id != owner && mess[i].author.username != 'DatBot'){
									found = true;
									var quotee = mess[i].author.username;
									var content = mess[i].toString();
									quoteID += 1;
									var quotees = [quotee];
									content = '<'+quotee+'> '+content;
									var contentLines = [content];
									console.log("content: "+ contentLines[0]);
									var newQuote = new quote(quoteID, contentLines, quotees, owner);
									addQuote(newQuote, msg);
									break;
								}
							}
							if (found == false){
								msg.reply("couldn't find any recent messages not made by you or DatBot.");
							}
						});
						
					}
		
				});
			}
	},
	"QUOTEN": {
	description: "Allows users to save quotes spanning multiple lines to the database. Most recent message is message 1 with this number increasing the futher back you go. You cannot quote something more than 100 lines back.",
	syntax: "!quoten <start point> [<end point>]",
	process: function(bot, msg, suff){
			//msg.reply("This command has not been implemented yet :(");
			var owner = msg.author.id;
			var ownerUsername = msg.author.username;
			var messageNumber = 100
			var quoteID = 0;

			function quote(quoteID, contentLines, quotees, owner){
				this.quoteID = quoteID;
				this.contentLines = contentLines;
				// update so this is a array - needs to be able to have multiple quotees
				this.quotees = quotees; // current discord user name. if two users have the same username then they share quotes
				this.owner = owner; // discord user id
			}
			function addQuote(quote, msg){
				var reply = "";
				db.quotes.save(quote, function(err, savedQuote) {
					if (err || !savedQuote) {
						console.log(err);
						console.log(savedQuote);
						reply = "quote not saved due to error.";
					} else {
						reply = "multiline quote: '";
						for (i = 0; i < savedQuote.contentLines.length;i++){
							reply += savedQuote.contentLines[i] + " ";
						}
						reply += "'' saved to database with id " + savedQuote.quoteID;
						//change to account for multiline quotes
						//reply = "quote '" + quote.contentLines + "' saved to database with id " + quote.quoteID;
					}
					msg.reply(reply);
					
				});
			}

			if (suff.length >= 2){
				var start = suff[0];
				var end = suff[1];
				var contentLines = [];
				var quotees = [];
				var quoteID = 0;
				if (start < end){
					if ((end-start<10)){	
						if (end > 100){
							// 0 = least recent message
							db.quotes.find().limit(1).sort({$natural:-1}, function(err, result){
								if (err || !result) {
								} else {
									result.forEach(function(res){
										quoteID = res.quoteID;
									});
								}
								var containsOwner = false;
								msg.channel.fetchMessages({limit:end+1}).then(mess => {
									mess = mess.array();
									for (i = end;i>=start;i--){
										if (!quotees.includes(mess[i].author.username)){
											quotees.push(mess[i].author.username);
										}
										contentLines.push('<'+mess[i].author.username+'> '+mess[i].toString());
										// console.log(i);
										// console.log('<'+mess[i].author.username+'> '+mess[i].toString());
									}
									quoteID++;
									var newQuote = new quote(quoteID, contentLines, quotees, owner);
									addQuote(newQuote, msg);

								});
							});	
						} else {
							msg.reply('you cannot quote things more than 100 messages in the past.');
						}
					} else {
						msg.reply('multiline quotes cannot be longer than 10 lines.');
					}
				} else {
					msg.reply("your start point must be before your end point.");
				}
			} else {
				msg.reply("incorrect syntax. Please include the start the end point of your quote.");
			}
		}
	},
	"QUOTE.DELETE": {
		description: "Allows the user to delete a quote by giving its ID. You must own a quote in order to delete it.",
		syntax: "!quote.delete <quote_id>",
		process: function(bot, msg, suff){
				if (suff.length > 0){
					var id = suff[0];
					db.quotes.find({quoteID: parseInt(id)}, function(err, quotes){
						if (err || quotes.length == 0){
							msg.reply("there is no quote with that ID.");
						} else {
							quotes.forEach(function(quote){
								if (msg.author.id == quote.owner){
									db.quotes.remove({quoteID: parseInt(id)}, function(err, quotes) {
										if (err || quotes.length == 0){
											msg.reply("was unable to delete quote due to error.");
										} else {
											reply = "quote '";
											for (i = 0; i < quote.contentLines.length;i++){
												reply += quote.contentLines[i]+ " ";
											}
											reply += "' removed from database";
											msg.reply(reply);
										}
									});
								} else {
									msg.reply("you must own a quote in order to delete it.");
								}
							});
						}
					});
				} else {
					msg.reply("please include the ID of the quote you want to delete.");
				}
				//msg.reply("this command has not been implemented yet :(");
			}
	},
	"QUOTE.GET":{
		description: "Replies with the quote matching the given ID.",
		syntax: "!quote.get <quote_id>",
		process: function(bot, msg, suff){
				if (suff.length > 0){
					var id = suff[0];

					db.quotes.findOne({quoteID: parseInt(id)}, function(err, quote){
						if (err || !quote){
							msg.reply("there is no quote with that ID.");
						} else {
							for (i = 0; i < quote.contentLines.length;i++){
								msg.channel.sendMessage(quote.contentLines[i]);
							}
						}
					});
				} else {
					msg.reply("incorrect syntax. Please include the ID of the quote you want to find.");
				}
				//msg.reply("this command has not been implemented yet :(");
			}
	},
	"QUOTE.RANDOM":{
		description: "Replies with a random quote from the given user.",
		syntax: "!quote.random <username>",
		process: function(bot, msg, suff){
				if (suff.length > 0){
					var username = suff[0];
					db.quotes.find({quotees: username}, function(err, quotes){
							if (err || quotes.length == 0){
								msg.reply("there are no quotes available for this user.");
							} else {
								var random = Math.floor(Math.random() * (quotes.length))
								for (i = 0; i < quotes[random].contentLines.length;i++){
									msg.channel.sendMessage(quotes[random].contentLines[i]);
								}
							}
					} );
				} else {
					msg.reply("incorrect syntax. Please include a username.");
				}
				//msg.reply("this command has not been implemented yet :(");

			}
	},
	"QUOTE.ALL":{
		description: "Replies with a link to the webpage containing all the quotes for the given user.",
		syntax: "!quote.all <username>",
		process: function(bot, msg, suff){
				msg.reply("this command has not been implemented yet :(");
			}
	},
	"KARMA.REASONS": {
		description: "Replies with a link to the webpage containing all the reasons for a given karma item.",
		syntax: "!karma.reason <karma_item>",
		process: function(bot, msg, suff){
				msg.reply("this command has not been implemented yet :(");
			}
	},
	"KARMA.RANDOM": {
		description: "Replies with a random reason for a given karma item.",
		syntax: "!karma.random <karma_item>",
		process: function(bot, msg, suff){
				if (suff.length > 0){
					var karmaItem = suff[0];
					db.karmaReasons.find({name: karmaItem.toUpperCase()}, function(err, reasons){
							if (err || reasons.length == 0){
								msg.reply("there are no reasons available for this karma item.");
							} else {
								var random = Math.floor(Math.random() * (reasons.length))
								var verbChange = "";
								switch (reasons[random].change){
									case 1: verbChange = "increased"; break;
									case 0: verbChange = "unchanged"; break;
									case -1: verbChange = "decreased";  break;
								}
								msg.reply("karma of " + karmaItem + " " + verbChange + " " + reasons[random].reason +".");
							}
					} );
				} else {
					msg.reply("incorrect syntax. Please include a karma item.");
				}
			}
	},
	"LOGOUT": {
		description: "Allows the user to log out DatBot. You must be the owner of the server in order to use this command.",
		syntax: "!logout",
		process: function(bot, msg, suff){
			var server = mybot.guilds.array();
			var owner = server[0].ownerID;
			if (msg.author.id == owner){
				msg.channel.sendMessage("o shit farewell").then(
					msg.channel.sendMessage("").then(
						bot.destroy()
					)
				);
			} else {
				msg.reply("you must be the owner of this server in order to log me out :)")
			}
		}
	},
	"KARMA.FIND": {
		description: "Allows users to search for already existing karma items containg the given string.",
		syntax: "!karma.find <string>",
		process: function(bot, msg, suff){
				if (suff.length > 0){
					var string = suff[0].toUpperCase();
					var items = "";
					db.karma.find(function(err, karmaItems){
							if (err || karmaItems.length == 0){
								msg.reply("there are no karma items that match this string.");
							} else {
								karmaItems.forEach(function(karmaItem){
									if (karmaItem.name.includes(string)){
										items += karmaItem.name + ", ";
									}
								});
								msg.reply(items);
							}
					} );
					
				} else {
					msg.reply("incorrect syntax. Please include a string.");
				}
			}
		},
	"IN": {
		description: "Allows users to tell DatBot to perform a command in a given amount of time. Time format is #d#h#m#s e.g 1d2h0m0s.",
		syntax: "!in <time> <command>",
		process: function(bot, msg, suff){
				//msg.reply("this command has not been implemented yet :(");
				//setTimeout(function(){console.log("hiya");},5000);
				if (suff.length > 1){
					var time = suff[0].toLowerCase();
					var commandName = suff[1].toUpperCase();
					//console.log(commandName);
					if (commandName in commands){
						var suffix = suff.splice(2,suff.length);
						if (time.match(/^([0-9]*d)([0-9]*h)([0-9]*m)([0-9]*s)$/g) != null){	
							var times = time.split(/[a-z]/g);
							var days = times[0];
							var hours = times[1];
							var mins = times[2];
							var secs = times[3];
							var millisecs = (secs*1000)+(mins*1000*60)+(hours*1000*60*60)+(days*1000*60*60*24);
							var command = commands[commandName];
							setTimeout(function(){
								command.process(bot, msg, suffix);
							},millisecs);
						} else {
							msg.reply("incorrect syntax for time. Please give time in format #d#h#m#s e.g 1d2h0m0s.")
						}
					} else {
						msg.reply("incorrect syntax. You must include a valid command for DatBot to execute.")
					}
				} else {
					msg.reply("incorrect syntax. Correct syntax is '!in <time> <command>'." );
				}
			}
		},
	"AT": {
		description: "Allows users to tell DatBot to perform a command at a given time. Format is 24h time then dd/mm/yy date e.g. 1745 01/12/2017",
		syntax: "!at <time> <date> <command>",
		process: function(bot, msg, suff){
				//msg.reply("this command has not been implemented yet :(");
				if (suff.length > 2){
					var time = suff[0];
					var date = suff[1];
					var commandName = suff[2].toUpperCase();
					if (commandName in commands){
						var suffix = suff.splice(3,suff.length);
						if (time.match(/^[0-1][0-9][0-5][0-9]|2[0-4][0-5][0-9]$/g) != null){
							if (date.match(/^(([1-2][0-9]|3[0-1]|0[1-9])[/](1[0-2]|0[1-9])[/]([0-9][0-9][0-9][0-9]))$/g) != null){
								var day = date.substring(0,2);
								var month = date.substring(3,5);
								var year = date.substring(6,10);
								var hours = time.substring(0,2);
								var mins = time.substring(2,4);
								var today = new Date();
								var timeDate = new Date(parseInt(year),parseInt(month)-1,parseInt(day),parseInt(hours),parseInt(mins),0,0);
								if (today < timeDate){
									var diff = timeDate - today;
									var command = commands[commandName];
									setTimeout(function(){
										//console.log(timeDate.toString());
										command.process(bot, msg, suffix);
									},diff);
								} else {
									msg.reply("you cannot use this command with a date that is in the past.");
								}
							} else {
								msg.reply("incorrect syntax. Please give the date in dd/mm/yyyy format e.g. 01/12/2017.");
							}
						} else {
							msg.reply("incorrect syntax. Please give the time in 24h format e.g. 1745.");
						}
					} else {
						msg.reply("incorrect syntax. You must include a valid command for DatBot to execute.")
					}
				} else {
					msg.reply("incorrect syntax. Correct syntax is '!at <time> <date> <command>'.");
				}
			}
		},
	"ROLL": { // update to include multiple dice
	description: "Simulates dice rolls. Allow for dice with any number of sides, with or without adv/disadv, and additions e.g. a[2d10+2].",
	syntax: "!roll [<dice size>]",
	process: function(bot, msg, suff){

			var char;

			function parseNum(){
				console.log("parsing number");
				var num = "";
				while (char.length > 0){
					if (char[0].search(/\d/) != -1){
						console.log("found number: " + char[0]);
						num += char.shift();
					} else {
						break;
					}
				}
				console.log("final number: " + num);
				return parseInt(num);
			}

			function parseDice(adv){
				console.log("parsing dice");
				function dice(adv, diceNum, diceSize, addition){
					console.log("creating dice object");
					this.adv = adv; // 1 = adv, 2 = disadv, 0 = neither
					this.diceNum = diceNum; // default = 1, number of dice
					this.diceSize = diceSize; // default = 20, size of dice
					this.addition = addition; // default = 0, number added to end of dice roll, can be negative or positive
				}
				var diceSize = 20;
				var diceNum = 1;
				var addition = 0;

				console.log("dice starts with num");
				if (char[0].search(/\d/) != -1){
					// parse num
					diceNum = parseNum();

				} 
				console.log("removing d");
				char.shift() // remove the d
				diceSize = parseNum();
				if (char.length > 0){
					//char.shift();
					switch(char[0]){
						case '+':
							console.log("found +");
							char.shift();
							addition = parseNum();
							break;
						case '-':
							console.log("found -");
							char.shift();
							addition = parseNum()*(-1);
							break;
					}
				}
				var dice = new dice(adv, diceNum, diceSize,addition);
				return dice; 
			}
			
			function parseSuffix(){
				
				var adv = 0;
				var dice;
				switch(char[0]){
					case 'a':
						console.log("found a");
						adv = 1;
						console.log("remove a");
						char.shift();
						console.log("remove [");
						char.shift();
						dice = parseDice(adv);
						break;
					case 'd': 
						console.log("found d");
						if (char[1] == '['){
							adv = 2;
							console.log("remove d");
							char.shift();
							console.log("remove [");
							char.shift();
						} 
						dice = parseDice(adv);
						break;
					default:
						dice = parseDice(adv);
				}
				return dice;
			}		

			function rollDice(dice){
				var random = 0;
				for (i = 0; i< dice.diceNum; i++){
					console.log("rolling dice: " + i);
					var diceValue = Math.floor(Math.random() * (dice.diceSize)+1);
					console.log("dice result: " + diceValue);
					random += diceValue
				}
				console.log("all dice result: " + random);
				var result = random+dice.addition;
				if (result < 1){
					result = 1;
				}
				console.log("final result: " + result);
				return result;
			}

			function interpretDiceRoll(dice){
				console.log("interpreting roll");
				console.log("ad: "+dice.adv);
				console.log("dice num: "+dice.diceNum);
				console.log("dice size: "+dice.diceSize);
				console.log("addition: "+dice.addition);
				var result;
				switch (dice.adv){
					case 0:
						console.log("neither adv nor disadv");
						result = rollDice(dice);
						break;
					case 1: // advantage
						console.log("adv");
						result1 = rollDice(dice);
						result2 = rollDice(dice);
 						if (result1 > result2){
							result = result1
						} else {
							result = result2;
						}
						result += " (Roll 1:"+result1+", Roll 2: "+result2+")";
						console.log("result: " + result);
						break;
					case 2: // disadvantage
						console.log("disadv");
						result1 = rollDice(dice);
						result2 = rollDice(dice);
						if (result1 < result2){
							result = result1
						} else {
							result = result2;
						}
						result += " (Roll 1: "+result1+", Roll 2: "+result2+")";
						console.log("result: " + result);
						break;
				}
				
				return result;
			}

			if (suff.length > 0){
				var dicePattern = /^([0-9]*[d][1-9][0-9]*(([+|-][0-9]+)?))$/g
				var advPattern = /^([a|d]\[([0-9]*[d][1-9][0-9]*(([+|-][0-9]+)?))\])$/g	
				if (suff[0].match(advPattern) != null || suff[0].match(dicePattern) != null){
					char = suff[0].split('');
					console.log(char);
					var dice = parseSuffix();
					console.log("dice: " +dice);
					var answer = interpretDiceRoll(dice);
					msg.reply(answer);
				} else {
					msg.reply("Invalid dice syntax");
				}
			} else {
				var answer = Math.floor(Math.random() * (20)+1);
				msg.reply(answer);				
			}

		}
	},
	"DAY": {
	description: "Replies with the day of the current year.",
	syntax: "!day",
	process: function(bot, msg, suff){
			var daysInMonths;
			var today = new Date();
			var dd = today.getDate();
			var	mm = today.getMonth(); //January is 0
			var	yyyy = today.getFullYear();
			var leapYear = false;

			if (yyyy%4 == 0){
				leapYear = true;
				if (yyyy%100 == 0){
					leapYear = false;
					if (yyyy%400 == 0){
						leapYear = true;
					}
				}
			}

			if (leapYear == true){
				daysInMonths = [31,29,31,30,31,30,31,31,30,31,30,31];
			} else {
				daysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31];
			}

			var days = 0;
			for (i = 0; i < mm; i++){
				days += daysInMonths[i];
			}

			days += dd

			msg.reply("it is day " + days + " of the current year");

		}
	},
	"YEAR": {
	description: 'Replies with the "current" year',
	syntax: "!year",
	process: function(bot, msg, suff){
			msg.reply("it's 2012.");
		}
	},
	"DATE": {
	description: "Replies with the current day of the week, day of the month, month and year.",
	syntax: "!date",
	process: function(bot, msg, suff){
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octpber", "November", "December"];
			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var today = new Date();
			var dd = today.getDate();
			var	mm = today.getMonth(); //January is 0
			var	yyyy = today.getFullYear();
			var day = today.getDay();
			var time = today.toLocaleTimeString();	
			msg.reply("it is currently "+time+" on " + days[day] + " " + dd + " " + months[mm] + " " + yyyy + "");
			if (day = 1){
				// message phillammon
			}
		}
	},
	"DEADLINE": {
	description: "Allows a user to add a deadline to the database. Use in conjunction with !timeleft. Date should be given in format dd/mm/yy time (24h e.g. 1700).",
	syntax: "!deadline <identifier> <date due> <time due>",
	process: function(bot, msg, suff){
			//msg.reply("This command has not been implemented yet :(");

			function deadline(deadlineName, deadlineDate, owner){
				this.deadlineName = deadlineName;
				this.deadlineDate = deadlineDate;
				this.owner = owner;
			}

			var today = new Date();
			if (suff.length >= 3){
				var date = suff[suff.length-2];
				if (date.match(/^(([1-2][0-9]|3[0-1]|0[1-9])[/](1[0-2]|0[1-9])[/]([0-9][0-9][0-9][0-9]))$/g) != null){					
					// correct syntax for date
					var day = date.substring(0,2);
					var month = date.substring(3,5);
					var year = date.substring(6,10);
						var time = suff[suff.length-1];
						if (time.match(/^(([0-1][0-9]|2[0-3])[0-5][0-9])$/g) != null){
							var hours = time.substring(0,2);
							var mins = time.substring(2,4);
							var deadlineDate = new Date(parseInt(year),parseInt(month)-1,parseInt(day),parseInt(hours),parseInt(mins),0,0);
							if (deadlineDate > today){
								//remove date and time;
								suff.pop();
								suff.pop();
								var identifier = suff.join(" ");
								var owner = msg.author.id;
								var deadline = new deadline(identifier.toUpperCase(),deadlineDate, owner);
								db.deadlines.find({deadlineName: identifier.toUpperCase()}, function(err, deadlines){
										if (err || deadlines.length == 0){
												db.deadlines.save(deadline, function(err, savedDeadline) {
													if (err || !savedDeadline) {
														msg.reply("deadline " + identifier + " not added to database due to error.");
													} else {
														msg.reply("deadline " + identifier + " added to database.");
													}
												});
										} else {
											msg.reply("a deadline with the identifier " + identifier + " already exists.");
										}
								} );

							} else {
								msg.reply("you cannot create a deadline for a date that is in the past.");
							}
							
						} else {
							msg.reply("incorrect syntax. Please give time in the 24h format e.g. 1700.");
						}

					
				} else {
					msg.reply("incorrect syntax. Please give date in the format dd/mm/yyyy.");
				}	
			} else {
				msg.reply("incorrect syntax. Please include an identifier for your deadline and the date/time it is due.");
			}
		}
	},
	"TIMELEFT": {
	description: "Replies with how much time is left before a given deadline's date.",
	syntax: "!timeleft <identifier>",
	process: function(bot, msg, suff){
			//msg.reply("This command has not been implemented yet :(");
			if (suff.length > 0){
				var identifier = suff.join(" ");
				db.deadlines.find({deadlineName: identifier.toUpperCase()}, function(err, deadlines){
					if (err || deadlines.length == 0){
						msg.reply('there is no deadline with that identifier.');	
					} else {
						deadlines.forEach( function(deadline){
							var today = new Date();
							if (deadline.deadlineDate < today){
								msg.reply("the deadline for " + identifier + " has already passed.");
							} else {
								var difference = deadline.deadlineDate - today;
								difference = difference/1000;
								var secs = Math.floor(difference%60);
								difference = difference/60;
								var mins = Math.floor(difference%60);
								difference = difference/60;
								var hours = Math.floor(difference%24);
								var days = Math.floor(difference/24);
								msg.reply(identifier + " is due in "+days+" days, "+hours+" hours, "+mins+" minutes and "+secs+" seconds on " + deadline.deadlineDate.toDateString()+" at " + deadline.deadlineDate.toLocaleTimeString());
							}				
						});
					}
				} );
	
			}
		}
	},
	"DEADLINE.DELETE": {
	description:"Allows users to delete deadlines.",
	syntax: "!deadline.delete <identifier>",
	process: function(bot,msg,suff){
			if (suff.length > 0){
				var identifier = suff.join(" ");
				db.deadlines.find({deadlineName: identifier.toUpperCase()}, function(err, deadlines){
					if (err || deadlines.length == 0){
						msg.reply("there is no deadline with that identifier.");
					} else {
						deadlines.forEach(function (deadline){
							if (msg.author.id == deadline.owner){
								db.deadlines.remove({deadlineName: identifier.toUpperCase()}, function(err, deadlineItem) {
									if (err || deadlineItem.length == 0){
										msg.reply("was unable to delete deadline due to error");
									} else {
										msg.reply("deadline " + identifier + " removed from the database");
									}
								});
							} else {
								msg.reply("you must own a deadline in order to delete it.");
							}
						});
					}
				});
			} else {
				msg.reply("incorrect syntax. Please include the name of the deadline you want to delete.");
			}	
		}
	},
	"ROT13": {
	description: "Translates the given text using rot13.",
	syntax: "!rot13 <text>",
	process: function(bot, msg, suff){
			//msg.reply("This command has not been implemented yet :(");
			if (suff.length > 0){
				var alphabetLower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
				var alphabetUpper = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
				var text = [];
				for (i = 0; i< suff.length; i++){
					var word = suff[i].split('');
					text = text.concat(word);
					if (i != suff.length-1){
						text.push(" ");	
					}
				}
				//console.log(text);
				var rot13 = [];
				for (i = 0; i < text.length; i++){
					var index;
					var newValue;
					if (text[i].match(/[a-z]/)){
						index = alphabetLower.indexOf(text[i]);
						if ((index+14) > 26){
							index = (index-13);
						} else {
							index = (index+13);
						}
						newValue = alphabetLower[index];
					} else if (text[i].match(/[A-Z]/)){
						index = alphabetUpper.indexOf(text[i]);
						if ((index+14) > 26){
							index = (index-13);
						} else {
							index = (index+13);
						}
						newValue = alphabetUpper[index];
					} else {
						newValue = text[i];
					}
					rot13.push(newValue);
				}
				var translated = "";
				for (i = 0; i< rot13.length; i++){
					translated+=rot13[i];
				}
				msg.channel.sendMessage(translated);

			} else {
				msg.reply("incorrect syntax. Please include the text you want to translate.");
			}
		}
	},
	"QUALIA": {
		description: "it's for nerds",
		syntax: "!qualia <thing>",
		process: function(bot,msg,suff){
			// console.log(suff);
			var thing = "";
			if (suff.length == 0){
				thing = msg.author.username;
				// console.log(thing);
			} else {
				thing = suff.join(" ");
				// console.log(thing);
			}
			msg.reply(thing + " is for nerds");
		}
	}
}

// on connect.
mybot.on("ready", function(){
	console.log("Ready!");
	var server = mybot.guilds.array();
	users = server[0].members;
	
});

// on disconnect. triggered on logout or disconnect due to error
mybot.on("disconnect", function(){
	console.log("Bye bye!");
	process.exit(1); 
});

mybot.on("guildMemberAdd",function(){
	console.log("new member added :)");
	var server = mybot.guilds.array();
	users = server[0].members;
});

// on a message being made in any channel that the bot is in
mybot.on("message", function(message) {

	// bot should not respond to it's own messages
	if (message.author != mybot.user){
		// get message content
		var input = message.content;
		var inputArray = input.split(" ");
		// if the content looks like it will be a command
		if(input.startsWith("!")){
			
			// gets command e.g. time. takes off !
			var commandText = inputArray[0].substring(1);
			if (commandText.toUpperCase() in commands){
				var suffix = inputArray.splice(1,inputArray.length);
				console.log("Treating " + input + " from " + message.author.username + " as a command.")
				var command = commands[commandText.toUpperCase()];
				command.process(mybot, message, suffix);
			} else {
				console.log("Treating " + input + " from " + message.author.username + " as an alias.")
				db.aliases.find({name: commandText.toUpperCase()}, function(err, aliases){
						if (err || aliases.length == 0){
							console.log("Unrecognised alias");
						} else {
							aliases.forEach( function(alias){
								// get what alias does
								var alias = alias.command;
								// turn into an array
								var aliasArray = alias.split(" ");
								// get the command the array is
								var commandText = aliasArray[0];

								//get all values that aren't the inital command
								var suffix = aliasArray.splice(1, aliasArray.length);
								//anything that comes after the alias
								var suffix2 = inputArray.splice(aliasArray.length, inputArray.length);

								var command = commands[commandText.toUpperCase()];
								var suffix = suffix.concat(suffix2)
								command.process(mybot, message, suffix);

							});
						}
				} );
			}
			
			
		} else if (message.isMentioned(mybot.user)){
			message.reply("o shit waddup");
		}
		

		function karma(name, amount){
			this.name = name;
			this.amount = amount;
		}

		function karmaReason(name, reason, change){
			this.name = name;
			this.reason = reason;
			this.change = change;
		}

		function addReason(karmaItem, reason, change){
			var karmaR = new karmaReason(karmaItem, reason, change);
			db.karmaReasons.save(karmaR, function(err, savedReason){
				if (err || !savedReason){
					console.log("Reason not logged due to error.");
				}
			});
		}

		function updateKarma(item, reason, change){
			// if karma item already exists, update
			// if it doesn't create it
			var reply = "";
			db.karma.find({name: item.toUpperCase()}, function(err, karmaItems){		
				if (err || karmaItems.length == 0){
					console.log("Creating new karma item: " + item);
					var newKarmaItem = new karma(item.toUpperCase(), 0+change);
					db.karma.save(newKarmaItem, function(err, savedKarma) {
						if (err || !savedKarma) {
							reply = "karma of " + item + " not updated due to error";
						} else {
							if (change == 0){
								reply = "karma of " + item + " unchanged (was 0, still 0)";
							} else {
								reply = "karma of " + item + " updated (was 0, now " + (0+change) + ")";
							}
							if (reason != ""){
								reply += " with reason '" + reason + "'";
								addReason(karma.name, reason, change);
							}
						}
						message.reply(reply);
						
					});
				} else {
					karmaItems.forEach( function(karma){
						var currentAmount = karma.amount;
						var newAmount = currentAmount+change;
						console.log("Updating karma item: " + item);
						db.karma.update({name: karma.name}, {$set: {amount: newAmount}}, function(err, updatedKarma){
							if (err || !updatedKarma){
								reply = "karma of " + item + " not updated due to error";
							} else {
								if (change == 0){
									reply = "karma of " + item + " unchange (was " + currentAmount + ", still " + newAmount + ")";
								} else {
									reply = "karma of " + item + " updated (was " + currentAmount + ", now " + newAmount + ")";	
								}
								if (reason != ""){
									reply += " with reason '" + reason + "'";
									addReason(karma.name, reason, change);
								}
								
							}
							message.reply(reply+".");
						});

					});
				}
				
			} );	
		}


		function isolateReason(inputArray, index){
			// if thing after karma item starts with brackets, check every word after for bracket end. if found put whole of statement in reason, otherwise throw error
			var reasonStart = inputArray[index+1];
			var reason = "";
			if (reasonStart.startsWith('(')){
				//console.log("found start of reason");
				var i = index+1;
				while (i < inputArray.length) {
					var item = inputArray[i];
					reason += item + " ";
					//console.log(inputArray[i]);
					if (item.substring(item.length-1) == ')'){
						//console.log("found end of reason: " + reason);
						i = inputArray.length;
					} else if (i == inputArray.length-1){
						//console.log("end of reason of reason not found");
						reason = "";
					}
					i++;
				}
				//console.log(reason);
			} else if (reasonStart == "for" || reasonStart == "because"){
				inputArray = inputArray.splice(index+1, inputArray.length);
				reason = inputArray.join(" ");
			} 
			return reason;
		}

		var count = 0;
		for (var word in inputArray){			
			var item = inputArray[word];


			if (item.length >= 3){
				var change = item.substring(item.length-2);
				var reason = "";		
				switch (change){
					case "++":
						if (inputArray.length-count > 1){
							reason = isolateReason(inputArray, count);
						}
						updateKarma(item.substring(0, item.length-2), reason, 1);
						break;
					case "--": 
						if (inputArray.length-count > 1){
							reason = isolateReason(inputArray, count);
						}
						updateKarma(item.substring(0, item.length-2), reason, -1);
						break;
					case "+-": 
						if (inputArray.length-count > 1){
							reason = isolateReason(inputArray, count);
						}
						updateKarma(item.substring(0, item.length-2), reason, 0);
						break;	
				}
			}
			count++;
		}
	} 

});

mybot.login("MjExODU1MzY1MDA2OTUwNDAw.CojZcA.htvbnh7xRCzjqMxwwLNOuGWg8s8");



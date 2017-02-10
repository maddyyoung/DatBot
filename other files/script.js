var mongojs = require('mongojs');
var collections = ['aliases', 'quotes', 'karma', 'karmaReasons', 'deadlines', 'commands'];
var url = "mongodb://localhost:27017/datbotdb";
var db = mongojs(url, collections);


var commands = {
	//!time - for testing
	"TIME": {
		commandName: "time",
		desc: "Replies with the time according to our good friend, Jesse McCree.",
		syntax: "!time",
		type: "Time"
	},
	"ALIAS": {
		commandName: "alias",
		desc: "Allows users to create an alias for a command e.g. !ping == !say pong.",
		syntax: "!alias <alias_commandName> <command>",
		type: "Alias"
	},
	"ALIAS.UPDATE": {
		commandName: "alias.update",
		desc: "Allows a user to update an already existing alias. You must own an alias in order to update it.",
		syntax: "!alias.update <alias_name> to <new command>",
		type: "Alias"
	},
	"ALIAS.DELETE": {
		commandName: "alias.delete",
		desc: "Allows a user to delete an already existing alias. You must own an alias in order to delete it.",
		syntax: "!alias.delete <alias_name>",
		type: "Alias"
	},
	"SAY": {
		commandName: "say",
		desc: "Makes DatBot say a given message in the current channel.",
		syntax: "!say <message>",
		type: "General"
	},
	"REPLY": {
		commandName: "reply",
		desc: "Makes DatBot reply to you in the current channel with a given message.",
		syntax: "!reply <message>",
		type: "General"
	},
	"MESSAGE": {
		commandName: "message", 
		desc: "Makes DatBot send a private message to a given user. If there are multiple users with the same username, you must include their discriminator e.g. DatBot#4434.",
		syntax: "!message <username>[#<discriminator>] <message>",
		type: "General"
	},
	"COMMANDS": {
		commandName: "commands",
		desc: "Private messages the user with a link to the list of commands.",
		syntax: "!commands",
		type: "General"
	},
	"HELP":{
		commandName: "help",
		desc: "Private messages the user with the desc and syntax of a given command.",
		syntax: "!help <command>",
		type: "General"
			
	},
	"QUOTE": { 
		commandName: "quote",
		desc: "Allows users to save a quote to the database. If no username given, will save the most recent message not made by the user or DatBot. If no snippet given, will ssave the most recent message made by the given user. If both username and snippet given, will save the most recent message containing the snippet made by the user.",
		syntax: "!quote | !quote <username> | !quote <username> /<snippet>/",
		type: "Quote"
	},
	"QUOTEN": {
		commandName: "quoten",
		desc: "Allows users to save quotes spanning multiple lines to the database. Most recent message is message 1 with this number increasing the futher back you go. You cannot quote something more than 100 lines back.",
		syntax: "!quoten <start point> [<end point>]",
		type: "Quote"
	},
	"QUOTE.DELETE": {
		commandName: "quote.delete",
		desc: "Allows the user to delete a quote by giving its ID. You must own a quote in order to delete it.",
		syntax: "!quote.delete <quote_id>",
		type: "Quote"
	},
	"QUOTE.GET":{
		commandName: "quote.get",
		desc: "Replies with the quote matching the given ID.",
		syntax: "!quote.get <quote_id>",
		type: "Quote"
	},
	"QUOTE.RANDOM":{
		commandName: "quote.random",
		desc: "Replies with a random quote from the given user.",
		syntax: "!quote.random <username>",
		type: "Quote"
	},
	"QUOTE.ALL":{
		commandName: "quote.all",
		desc: "Replies with a link to the webpage containing all the quotes for the given user.",
		syntax: "!quote.all <username>",
		type: "Quote"
	},
	"KARMA.REASONS": {
		commandName: "karma.reasons",
		desc: "Replies with a link to the webpage containing all the reasons for a given karma item.",
		syntax: "!karma.reason <karma_item>",
		type: "Karma"
	},
	"KARMA.RANDOM": {
		commandName: "karma.random",
		desc: "Replies with a random reason for a given karma item.",
		syntax: "!karma.random <karma_item>",
		type: "Karma"
	},
	"LOGOUT": {
		commandName: "logout",
		desc: "Allows the user to log out DatBot. You must be the owner of the server in order to use this command.",
		syntax: "!logout",
		type: "General"
	},
	"KARMA.FIND": {
		commandName: "karma.find",
		desc: "Allows users to search for already existing karma items containg the given string.",
		syntax: "!karma.find <string>",
		type: "Karma"
		},
	"IN": {
		commandName: "in",
		desc: "Allows users to tell DatBot to perform a command at a given time. Time format is 24h e.g. 1745.",
		syntax: "!in <time> <command>",
		type: "Time"
		},
	"AT": {
		commandName: "at",
		desc: "Allows users to tell DatBot to perform a command in a given amount of time. Time format is #y#m#d#s e.g 1y2m0d0s.",
		syntax: "!at <time> <command>",
		type: "Time"
		},
	"ROLL": { 
		commandName: "roll",
		desc: "Simulates dice rolls. Allow for dice with any number of sides, with or without adv/disadv, and additions e.g. a[2d10+2].",
		syntax: "!roll [<dice size>]",
		type: "General"
	},
	"DAY": {
		commandName: "day",
		desc: "Replies with the day of the current year.",
		syntax: "!day",
		type: "Time"
	},
	"YEAR": {
		commandName: "year",
		desc: 'Replies with the "current" year',
		syntax: "!year",
		type: "Time"
	},
	"DATE": {
		commandName: "date",
		desc: "Replies with the current day of the week, day of the month, month and year.",
		syntax: "!date",
		type: "Time" 
	},
	"DEADLINE": {
		commandName: "deadline",
		desc: "Allows a user to add a deadline to the database. Use in conjunction with !timeleft. Date should be given in format dd/mm/yy time (24h e.g. 1700).",
		syntax: "!deadline <identifier> <date due> <time due>",
		type: "Time"
	},
	"TIMELEFT": {
		commandName: "timeleft",
		desc: "Replies with how much time is left before a given deadline's date.",
		syntax: "!timeleft <identifier>",
		type: "Time"
	},
	"DEADLINE.DELETE": {
		commandName: "deadline.delete",
		desc:"Allows users to delete deadlines.",
		syntax: "!deadline.delete <identifier>",
		type: "Time"
	},
	"ROT13": {
		commandName: "rot13",
		desc: "Translates the given text using rot13.",
		syntax: "!rot13 <text>",
		type: "General"
	},
}

function commandObject(id, commandName, syntax, desc, type){
	this.id = id;
	this.commandName = commandName;
	this.syntax = syntax;
	this.desc = desc;
	this.type = type;
}


var count = 1;
for (comm in commands){
	var command = new commandObject(count,commands[comm].commandName,commands[comm].syntax,commands[comm].desc,commands[comm].type);
	count++;
	//console.log(command);
	db.commands.insert(command, function(err, savedComm){
		console.log("inserted: " + savedComm.commandName);
	});
}

'use strict';

var TelegramBot = require('node-telegram-bot-api');
var moment = require('moment-timezone');

var token = process.env.RUBOT_TOKEN;
var bot = new TelegramBot(token, { polling: true });

bot.getMe().then(function(obj) {
  console.log(obj);
}).catch(function(err) {
  throw err;
});

bot.on('text', function(msg) {
  var chatId = msg.chat.id;
  var messageId = msg.message_id;

  var format = "hh:mm:ss a";
  var timezone;
  var time;
  if (msg.text == '/andrey') {
    // Asia/Novosibirsk
    timezone = "Asia/Novosibirsk";
    time = moment().tz(timezone).format(format);
  }

  if (msg.text == '/mi') {
    // America/Detroit
    timezone = "America/Detroit";
    time = moment().tz(timezone).format(format);
  }

  var tz_i = msg.text.indexOf("/tz");
  if (tz_i >= 0) {
    timezone = msg.text.slice(tz_i + 3).trim();
    console.log(timezone);

    if (timezone == "list") {
      return bot.sendMessage(chatId, listToStrings(moment.tz.names()));
    }

    time = moment().tz(timezone).format(format);
  }

  bot.sendMessage(chatId, time);
});

function listToString(arr) {
  var content = "";

  for (var i = 0; i < arr.length; i++) {
    content += arr[i] + "\n";
  }

  return content;
}

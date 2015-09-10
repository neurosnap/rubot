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
  var out_msg = "Current time: ";
  if (msg.text == '/andrey') {
    timezone = "Asia/Novosibirsk";
    out_msg += moment().tz(timezone).format(format);
    return bot.sendMessage(chatId, out_msg);
  }

  if (msg.text == '/mi') {
    timezone = "America/Detroit";
    out_msg += moment().tz(timezone).format(format);
    return bot.sendMessage(chatId, out_msg);
  }

  if (msg.text == '/joshua') {
    timezone = "CST6CDT";
    out_msg += moment().tz(timezone).format(format);
    return bot.sendMessage(chatId, out_msg);

  }

  if (msg.text == '/mal') {
    timezone = "America/Los_Angeles";
    out_msg += moment().tz(timezone).format(format);
    return bot.sendMessage(chatId, out_msg);

  }

  var tz_i = msg.text.indexOf("/tz");
  if (tz_i >= 0) {
    timezone = msg.text.slice(tz_i + 3).trim();

    var list_i = timezone.indexOf("list");
    if (list_i >= 0) {
      var list = moment.tz.names();
      var tz_per_page = 20;
      var page = parseInt(timezone.slice(list_i + 4).trim());
      if (isNaN(page)) page = 1;
      var total_pages = parseInt((list.length / tz_per_page) + 1);

      if (page < 1 || page > total_pages) {
        return bot.sendMessage(chatId, "Page number must be greater than 0 and less than " + total_pages);
      }

      out_msg = "";
      for (var i = (page-1)*tz_per_page; i < page*tz_per_page && i < list.length; i++) {
        out_msg += list[i] + "\n";
      }
      out_msg += "Page " + page + " out of " + total_pages;

      return bot.sendMessage(chatId, out_msg);
    }

    var search_i = timezone.indexOf("search");
    if (search_i >= 0) {
      var list = moment.tz.names();
      var search = timezone.slice(search_i + 6).trim().toLowerCase();
      var min_chars = 3;
      if (search.length <= min_chars) {
        return bot.sendMessage(chatId, "Search must be at least " + min_chars + " long");
      }

      out_msg = "";
      for (var i = 0; i < list.length; i++) {
        if (list[i].toLowerCase().indexOf(search) >= 0) {
          out_msg += list[i] + "\n";
        }
      }

      return bot.sendMessage(chatId, out_msg);
    }

    out_msg += moment().tz(timezone).format(format);
    return bot.sendMessage(chatId, out_msg);
  }
});


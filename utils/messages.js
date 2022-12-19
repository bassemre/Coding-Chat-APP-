const moment = require("moment");

class formatMessage {
  constructor(username, text) {
    this.username = username;
    this.text = text;
    this.time = moment().format("h:mm a");
  }
}

module.exports = formatMessage;

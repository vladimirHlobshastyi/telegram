const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require("fs").promises;
const path = require("path");

const messagesFile = path.resolve("messages", `${Date.now()}.json`);
const parsedMessagesFile = path.resolve(
  "messages",
  `${Date.now()}_parsed.json`
);

const apiId = 17620472;
const apiHash = "402a0787337887b617443fd09a7f3329";
let stringSession = new StringSession(
  `1AgAOMTQ5LjE1NC4xNjcuNTABu3lDMHm0X08BNUyA6B2QzN28pIkiHlrSRoMkgoOfGdS894bVG6pxnjYTxpCTePl/TbNzkDb4SlUhgle+7nxffyuBGIjr6bkDbM2W2wFC++wmuwv3MkgXTAoKhG7YJbsBa+W6QVstIF7co7EIRwKFQVMzkNDv04IgyRnFIhNYHOid61ZftL5LsfnkAYZ7xWB0Ark5QVSxSnbU0KnMoaYarExprntabierxvTxuf7cHQNx/wgxE1spYEXQ6NKV5l+vDDwayvroDBFsfYU0C+FqhakBY9T5s65ZbGb0q1ptoepnK0M5cDJhomHgHEHs/wpPUfoO79qsGzQHJPisZ2jH+DM=`
);

const client = new TelegramClient(stringSession, apiId, apiHash, {});

let pts = /* 14968  */ 14978; // TODO: get the pts value from previously saved message
let messagesToPoll = 1;
let pollingInterval = 10 * 1000; // 2 min

function getNewMessages(pts, limit) {
  return client.invoke(
    new Api.updates.GetChannelDifference({
      channel: "air_alert_ua",
      filter: new Api.ChannelMessagesFilterEmpty(),
      pts,
      limit,
      force: true,
    })
  );
}

function isTooManyUpdates(response) {
  return response && response.className === "updates.ChannelDifferenceTooLong";
}

function isNewMessagesResponse(response) {
  return response && response.className === "updates.ChannelDifference";
}

async function writeMessagesToFile(data, file) {
  try {appendFile
    // write received messages to the local file
    await fs.appendFile(file, JSON.stringify(data));
  } catch (err) {
    console.log("Append file error: ", err.message);
    await fs.writeFile(file, JSON.stringify(data));
  }
}

function alarmState(message) {
  if (message.match(/🟢/)) return "stop";
  if (message.match(/🔴/)) return "start";
  if (message.match(/🟡/)) return "partial";
}

function getRegion(message) {
  return message.match(/(?<=\#)(.*?)$/g)[0];
}

function getTime(message) {
  return new Date(message.date * 1000).toLocaleTimeString();
}

function parseMessages(messages) {
  return messages.map((messageData) => ({
    message: messageData.message,
    timestamp: messageData.date,
    time: getTime(messageData),
    region: getRegion(messageData.message),
    state: alarmState(messageData.message),
  }));
}

(async function run() {
  // for initial req only - to get the StringSession value
  /*   await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  stringSession = client.session.save();
  console.log(stringSession); */

  await client.connect();

  setInterval(async () => {
    console.log("Sending request...");
    console.log("pts: ", pts);
    let result = await getNewMessages(pts, messagesToPoll);

    // too many new messages available, try to read them all before proceeding
    while (isTooManyUpdates(result)) {
      messagesToPoll += 50;
      console.log(
        "Too many updates, increasing the receiving messages number to ",
        messagesToPoll
      );
      result = await getNewMessages(pts, messagesToPoll);
    }

    if (isNewMessagesResponse(result)) {
      await writeMessagesToFile(result.toJSON(), messagesFile);
      const parsedMessages = parseMessages(result.newMessages);
      await writeMessagesToFile(parsedMessages, parsedMessagesFile);
      pts = result.pts;
      messagesToPoll = 1; // decreasing the messages number to initial
      console.log(
        "Got the response, number of new messages: ",
        result.newMessages.length
      );
    } else {
      console.log("No updates");
    }
  }, pollingInterval);
})();

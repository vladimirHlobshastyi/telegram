const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const apiId = 11569401;
const apiHash = "1cacad5b77f1eab5b9def5fd11deb55a";

const session = new StringSession("");
const client = new TelegramClient(session, apiId, apiHash, {});

(async function run() {
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  await client.connect();

  const result = await client.invoke(
    // new Api.channels.GetFullChannel({
    //   channel: "air_alert_ua",
    // })
    new Api.updates.GetChannelDifference({
      channel: "air_alert_ua",
      filter: /* new Api.ChannelMessagesFilter({
        ranges: [
          new Api.MessageRange({
            minId: 0,
            maxId: 1000000,
          }),
        ],
        excludeNewMessages: true,
      }) */ new Api.ChannelMessagesFilterEmpty(),
      pts: 43,
      limit: 10000,
      force: true,
    })
  );

  //+380661206215
  setInterval(() => console.log(result.messages[0].message), 2000);
  //console.log(result); // prints the result
})();

/* let a = {
  CONSTRUCTOR_ID: 2763835134,
  SUBCLASS_OF_ID: 696872797,
  className: "updates.ChannelDifferenceTooLong",
  classType: "constructor",
  flags: 1,
  final: true,
  timeout: null,
  dialog: {
    CONSTRUCTOR_ID: 2834157813,
    SUBCLASS_OF_ID: 1120787796,
    className: "Dialog",
    classType: "constructor",
    flags: 1,
    pinned: false,
    unreadMark: false,
    peer: {
      CONSTRUCTOR_ID: 2728736542,
      SUBCLASS_OF_ID: 47470215,
      className: "PeerChannel",
      classType: "constructor",
      channelId: [Integer],
    },
    topMessage: 14544,
    readInboxMaxId: 14544,
    readOutboxMaxId: 0,
    unreadCount: 0,
    unreadMentionsCount: 0,
    unreadReactionsCount: 0,
    notifySettings: {
      CONSTRUCTOR_ID: 2822439974,
      SUBCLASS_OF_ID: 3475030132,
      className: "PeerNotifySettings",
      classType: "constructor",
      flags: 4,
      showPreviews: null,
      silent: null,
      muteUntil: 2147483647,
      iosSound: null,
      androidSound: null,
      otherSound: null,
    },
    pts: 14549,
    draft: null,
    folderId: null,
  },
  messages: [
    {
      CONSTRUCTOR_ID: 940666592,
      SUBCLASS_OF_ID: 2030045667,
      className: "Message",
      classType: "constructor",
      out: false,
      mentioned: false,
      mediaUnread: false,
      silent: false,
      post: true,
      fromScheduled: false,
      legacy: false,
      editHide: false,
      ttlPeriod: null,
      id: 14544,
      fromId: null,
      peerId: [Object],
      fwdFrom: null,
      viaBotId: null,
      replyTo: null,
      date: 1655368045,
      message:
        "🟢 11:27 Відбій тривоги в Сумська область.\n" +
        "Слідкуйте за подальшими повідомленнями.\n" +
        "#Сумська_область",
      media: null,
      replyMarkup: null,
      entities: [Array],
      views: 17127,
      forwards: 0,
      replies: null,
      editDate: null,
      pinned: false,
      postAuthor: null,
      groupedId: null,
      restrictionReason: null,
      action: undefined,
      noforwards: false,
      reactions: null,
      flags: 17536,
    },
  ],
  chats: [
    {
      CONSTRUCTOR_ID: 2187439201,
      SUBCLASS_OF_ID: 3316604308,
      className: "Channel",
      classType: "constructor",
      flags: 139360,
      creator: false,
      left: false,
      broadcast: true,
      verified: false,
      megagroup: false,
      restricted: false,
      signatures: false,
      min: false,
      scam: false,
      hasLink: false,
      hasGeo: false,
      slowmodeEnabled: false,
      callActive: false,
      callNotEmpty: false,
      fake: false,
      gigagroup: false,
      noforwards: false,
      id: [Integer],
      accessHash: [Integer],
      title: "Повітряна Тривога",
      username: "air_alert_ua",
      photo: [Object],
      date: 1655197789,
      restrictionReason: null,
      adminRights: null,
      bannedRights: null,
      defaultBannedRights: null,
      participantsCount: 192593,
    },
  ],
  users: [
    {
      CONSTRUCTOR_ID: 1073147056,
      SUBCLASS_OF_ID: 765557111,
      className: "User",
      classType: "constructor",
      flags: 33570859,
      self: false,
      contact: false,
      mutualContact: false,
      deleted: false,
      bot: true,
      botChatHistory: false,
      botNochats: false,
      verified: false,
      restricted: false,
      min: false,
      botInlineGeo: false,
      support: false,
      scam: false,
      applyMinPhoto: true,
      fake: false,
      botAttachMenu: false,
      id: [Integer],
      accessHash: [Integer],
      firstName: "Channel",
      lastName: null,
      username: "Channel_Bot",
      phone: null,
      photo: [Object],
      status: null,
      botInfoVersion: 4,
      restrictionReason: null,
      botInlinePlaceholder: null,
      langCode: null,
    },
  ],
}; */

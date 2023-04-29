/**
 * @fileoverview Provides tools for handling groups of connections should the app need that
 */
const WebSocket = require("ws");

let connections = [];

let server;

let connectionHandler = (serverSocket) => {};

let messageHandler = (msg, sender) => {};

const onConnection = (cb) => {
  connectionHandler = cb;
};

const onMessage = (cb) => {
  messageHandler = cb;
};

const IDLength = 4;

/**
 * Checks if an id exists in an array of objects with an ID field
 * @param {String} id the id to check
 * @param {Object} items a collection of objects with an ID field for
 *                      which id must be unique
 * @returns {Boolean}
 */
const tokenExists = (token, items) => items.includes(token);

/**
 * Takes an array of items and generates a unique ID
 * @param {Object[]} existingItems an array of objects, each with a property named ID
 * @returns {String} an ID string that's unique within the context of the given array
 */
const generateToken = (existingItems = []) => {
  let id = "";

  for (let i = 0; i < IDLength; i++) {
    let charCode = Math.round(Math.random() * 25 + 97);

    id += String.fromCharCode(charCode).toUpperCase();
  }

  return tokenExists(id, existingItems) ? generateToken(existingItems) : id;
};

const getGroupTokens = () => connections.map((c) => c.groupToken);

const getUserTokens = () => connections.map((c) => c.user.token);

const generateGroupToken = () => generateToken(getGroupTokens());

const generateUserToken = () => generateToken(getUserTokens());

class SocketUser {
  data = null;

  token = null;

  lastActive = new Date().getTime();

  socket = null;

  SocketUser(socket, token, data = {}) {
    this.data = data;

    this.token = token;

    this.socket = socket;
  }
}

class SocketConnection {
  groupToken = null;

  user = null;

  socket = null;

  /**
   *
   * @param {String} token
   * @param {WebSocket} socket
   * @param {SocketUser} user
   */
  SocketConnection(socket, token, user = {}) {
    this.groupToken = token;

    this.user = user;

    this.socket = socket;
  }
}

const getSocketConnectionBySocket = (socket) => {
  const matches = connections.filter((c) => c.socket === socket);

  return matches.length === 1 ? matches[0] : null;
};

/**
 * Creates a connection group by generating a token and giving it to the sender, then sends a message back
 * with the sender's group token and user data
 * @param {Object} msg
 * @param {WebSocket} sender
 */
const createGroup = (msg, sender) => {
  const groupToken = generateGroupToken();
  const sc = getSocketConnectionBySocket(sender);

  console.log(msg);

  sc.user.data = msg.data;
  sc.groupToken = groupToken;
  sc.lastActive = new Date().getTime();

  send(sender, "group-created", {
    user: {
      token: sc.user.token,
      data: sc.user.data,
    },
    groupToken,
  });
};

const joinGroup = (msg, sender) => {
  const sc = getSocketConnectionBySocket(sender);

  if (sc) {
    sc.lastActive = new Date().getTime();
    sc.user.data = msg.data.user;
    sc.groupToken = msg.data.groupToken;

    const message = {
      user: {
        token: sc.user.token,
        data: sc.user.data,
      },
      groupToken: sc.groupToken,
    };

    broadcastToGroup(msg.data.groupToken, "new-user-joined", message, [
      message.user.token,
    ]);

    send(sender, "user-joined", message);

    //sc.user.data = msg.data.user;
    //sc.user.token =
  }
};

const messageHandlers = {
  "create-group": createGroup,
  "join-group": joinGroup,
};

/**
 * When a socket first connects we need to create a connection for it
 * as well as user info and add it to the socket array
 * @param {WebSocket} serverSocket
 */
const internalConnectionHandler = (serverSocket) => {
  const sc = new SocketConnection(serverSocket);
  sc.user = new SocketUser();
  sc.user.token = generateUserToken();
  sc.socket = serverSocket;

  connections.push(sc);

  serverSocket.on("message", (msg) => {
    internalMessageHandler(msg, serverSocket);
    messageHandler(msg, serverSocket);
  });
};

/**
 * Out of the box the manager can handle certain low level actions like
 * create-group
 * join-group
 * @param {String} msg
 * @param {WebSocket} sender
 */
const internalMessageHandler = (msg, sender) => {
  msg = JSON.parse(msg);
  const handler = messageHandlers[msg.action];

  if (handler) {
    handler(msg, sender);
  }
  //
};

const pruneThreshold = 3 * 60 * 60 * 1000; //3 hours

const pruneConnections = () => {
  const now = new Date().getTime();

  connections = connections.filter(
    (c) => now - c.user.lastActive < pruneThreshold
  );

  console.log(connections.length); //I don't think we're actually pruning anything?
};
/**
 * Starts the server at the given port
 * @param {Int} port the port to listen on
 * @returns WebSocketServer
 */
const startServer = (port = 8081) => {
  server = new WebSocket.Server({
    port,
  });

  server.on("connection", (s) => {
    pruneConnections();
    internalConnectionHandler(s);
    connectionHandler(s);
  });

  console.log(`Starting Web Socket server at port ${port}`);

  return server;
};

/**
 * Sends some data with an action slug to the given web socket
 * @param {WebSocket} recipient
 * @param {String} action
 * @param {Any} data
 */
const send = (recipient, action, data = null) => {
  //console.log(recipient);

  recipient.send(
    JSON.stringify({
      action,
      data,
    })
  );
};

const broadcastToGroup = (groupToken, action, data, except = []) => {
  const groupConnections = connections.filter(
    (c) => c.groupToken === groupToken
  );

  groupConnections
    .filter((c) => !except.includes(c.user.token))
    .forEach((sc) => {
      send(sc.socket, action, data);
    });
};

module.exports = {
  startServer,
  onConnection,
  onMessage,
  send,
  broadcastToGroup,
  createGroup,
  joinGroup,
};

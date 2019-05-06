import { Base64 } from "js-base64";

const sshWebSocket = {};

sshWebSocket.bindTerminal = function(
  term,
  websocket,
  bidirectional,
  bufferedTime
) {
  term.socket = websocket;

  let messageBuffer = null;
  let handleWebSocketMessage = function(ev) {
    if (bufferedTime && bufferedTime > 0) {
      if (messageBuffer) {
        messageBuffer += ev.data;
      } else {
        messageBuffer = ev.data;
        setTimeout(function() {
          term.write(messageBuffer);
        }, bufferedTime);
      }
    } else {
      term.write(ev.data);
    }
  };
  let handleTerminalData = function(data) {
    websocket.send(
      JSON.stringify({
        type: "terminal",
        data: {
          base64: Base64.encode(data) // encode data as base64 format
        }
      })
    );
  };

  websocket.onmessage = handleWebSocketMessage;
  if (bidirectional) {
    term.on("data", handleTerminalData);
  }

  // send heartbeat package to avoid closing webSocket connection in some proxy environmental such as nginx.
  let heartBeatTimer = setInterval(function() {
    websocket.send(JSON.stringify({ type: "heartbeat", data: "" }));
  }, 20 * 1000);

  websocket.addEventListener("close", function() {
    websocket.removeEventListener("message", handleWebSocketMessage);
    term.off("data", handleTerminalData);
    delete term.socket;
    clearInterval(heartBeatTimer);
  });
};

export default sshWebSocket;

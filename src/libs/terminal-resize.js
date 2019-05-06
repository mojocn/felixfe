const resize = {
  bindTerminalResize: function(term, websocket) {
    let onTermResize = size => {
      websocket.send(
        JSON.stringify({
          type: "resize",
          data: { rows: size.rows, cols: size.cols }
        })
      );
    };
    // register resize event.
    term.on("resize", onTermResize);
    // unregister resize event when WebSocket closed.
    websocket.addEventListener("close", function() {
      term.off("resize", onTermResize);
    });
  }
};

export default resize;

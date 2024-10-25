export const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const sendJson = (ws: WebSocket, data: any, type: string) => {
  ws.send(
    JSON.stringify({
      head: {
        type,
      },
      body: data,
    })
  );
};

export const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const sendJson = (ws: WebSocket | null, data: any, type: string) => {
  if (!ws) {
    console.error("WebSocket is not connected! Data not sent.", type, data);
    return;
  }
  ws.send(
    JSON.stringify({
      head: {
        type,
      },
      body: data,
    })
  );
};

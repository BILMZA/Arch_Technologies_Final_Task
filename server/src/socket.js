let io;

const initSocket = (socketIO) => {
  io = socketIO;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};
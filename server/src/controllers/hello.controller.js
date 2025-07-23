const hello = (req, res) => {
  res.json({ message: "Hello World" });
};

const goodbye = (req, res) => {
  res.json({ message: "Goodbye World" });
};

export { hello, goodbye };
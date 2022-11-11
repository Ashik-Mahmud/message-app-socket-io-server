const { app, http } = require("./App");

const port = process.env.PORT || 5000;

/* First Routes */
app.get("/", (req, res) => {
  res.send({ message: "Welcome to Socket.io Chat App" });
});



/* listen port */
app.listen(port, () => {
  console.log("listening on *:5000");
});

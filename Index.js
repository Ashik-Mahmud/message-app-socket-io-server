const { app, http } = require("./App");

/* First Routes */
app.get("/", (req, res) => {
  res.send({ message: "Welcome to Socket.io Chat App" });
});



/* listen port */
http.listen(5000, () => {
  console.log("listening on *:5000");
});

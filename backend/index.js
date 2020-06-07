// http bhi use korle.
const app = require("./app");

var port = process.env.PORT || 9090;


app.listen(port, () => {
  console.log(`Server is listening in port: ${port}`);
});

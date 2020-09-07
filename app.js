const path = require("path");
const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKeys);
const exphbs = require("express-handlebars");
const { cursorTo } = require("readline");

const app = express();
// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Index Route
app.get("/", (req, res) => {
  res.render("index", {
    stripePublishableKeys: keys.stripePublishableKeys,
  });
});

app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) => {
      stripe.charges
        .create({
          amount,
          description: "Web Development Ebooks",
          currency: "inr",
          customer: customer.id,
        })
        .then((charge) => res.render("success"));
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

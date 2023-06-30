const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require("./date");
const _ = require("lodash");
const fs = require('fs');

const PORT = 3000;
const posts = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dataFilePath = './public/data.json';
const rawData = fs.readFileSync(dataFilePath, 'utf-8');
const data = JSON.parse(rawData);

const homeStartingContent = data.homeStartingContent;
const aboutContent = data.aboutContent;
const contactContent = data.contactContent;


app.get("/", (req, res) => {
  res.render("home", { startingContent: homeStartingContent, posts: posts });
});

app.get("/about", (req, res) => {
  res.render("about", { startingContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { startingContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:title", (req, res) => {
  let requestedTitle = _.lowerCase(req.params.title);
  let requiredPost = posts.find(post => {
    let selectedTitle = _.lowerCase(post.title);
    return requestedTitle === selectedTitle;
  });
  if(!requiredPost) {
    res.render("post", { post: {
      title: "404",
      date: "That's an error.",
      post: "The requested URL was not found on this server. Thats all we know.",
      author: "Daily Journal"
    } });
  } else {
    res.render("post", { post: post });
  }
});

app.post("/compose", (req, res) => {
  let blog = {
    title: req.body.blogTitle,
    date: date.formatDate(),
    post: req.body.blogPost,
    author: req.body.blogAuthor
  };
  posts.push(blog);
  res.redirect("/");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//MongoDB connection through Mongoose
mongoose.connect(
  "mongodb+srv://Tennis_247:Trx%402407%23@cluster0.uunbpu6.mongodb.net/wikiDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

//Requests Targeting All Articles

app.route("/articles")
  .get(function ( req, res ) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });



//Requests Targeting A Specific Article
app.route("/articles/:articleTitle")
  .get( function(req, res){
    Article.findOne( { title: req.params.articleTitle }, function(err , foundArticle){
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No Matching Articles found");
        }
    });

  })

  // put method will replace the entire data instead of just updating the value
  .put( function(req, res){  
    Article.findOneAndUpdate(  // to use findOneAndUpdate if we are using mongoose, update might not work with mongoose p.s - it didn't work for me
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }, //new: true to use this if data is not being updated
      function (err) {
        if (!err) {
          res.send("Succesfully updated Article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch( function(req, res){
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body },
        { new: true },
        function(err){
            if (!err){
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    )

  })
  .delete( function(req,res){
    Article.findOneAndDelete(
        { title: req.params.articleTitle },
        function(err){
            if(err){
                res.send(err);
            } else {
                res.send("Successfully deleted the corresponding article.");
            }
        }
    )
  } );









app.listen(3000, function(){
    console.log("Server started on port 3000");
});
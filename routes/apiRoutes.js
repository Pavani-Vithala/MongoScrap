var axios = require("axios");
var cheerio = require("cheerio");


// Require all models
var db = require("../models");
module.exports = function (app) {
    //Load the initial index file for the 
    app.get("/", function (req, res) {
        res.render("index");
    });


    // A GET route for scraping the echoJS website
    app.get("/Scrap", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.nytimes.com/").then(function (response) {

            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            var results = [];
            $("article.css-8atqhb").each(function (i, element) {
                var result = {};

                result.title = $(element)
                    .find("h2")
                    .text();
                result.link = $(element)
                    .find("a")
                    .attr("href");
                result.summary = $(element).find("li").text();
                if (result.title !== "" && result.link !== "" && result.summary !== "")
                    results.push(result);
            });
           
                    
            db.Article.create(results)
                .then(function () {

                    db.Article.find({})
                        .then(function (dbArticle) {

                            res.json(dbArticle);
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            res.json(err);
                        });


                }).catch(function (err) {
                    console.log(err);
                });
            



        });

    });
    //Route for Handling the saving of articles

    app.put("/api/Save/:id", function (req, res) {
        var Clientid = req.params.id;

        db.Article.updateOne(
            {
                _id: Clientid
            },
            {

                $set: {
                    SaveFlag: true
                }
            },
            function (error, edited) {

                if (error) {
                    console.log(error);
                    res.send(error);
                }
                else {

                    console.log(edited);
                    res.json(edited);
                }
            });
    });

    //Route for handling the Clear articles 

    app.delete("/api/Clear/", function (req, res) {
        db.Article.deleteMany({}).then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // Route for getting all saved Articles from the db
    app.get("/api/SavedArticles/", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({ SaveFlag: true })
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

// Route for getting all the saved Notes for an article
app.get("/api/SavedNotes/:id", function (req, res) {
    var ClientId = req.params.id;
    // Grab every document in the Articles collection
    db.Note.find({ Article: ClientId })
    // ..and populate all of the notes associated with it
     .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

//Route to handle posting of Notes for an article

app.post("/Notes/:id",function(req,res){
    var clientId = req.params.id;
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If we were able to successfully update a note, send it back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });



});


//Route for handling the Delete specific articles 

app.delete("/api/DeleteArticle/:id", function (req, res) {
    var Clientid = req.params.id;
    db.Article.deleteOne({ _id: Clientid }).then(function (dbArticle) {
        console.log(dbArticle);
        res.json(dbArticle);
    }).catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});
};


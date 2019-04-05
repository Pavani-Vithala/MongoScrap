$(document).ready(function () {
 // $("#confirmBox").hide();
  $("#Scrap").on("click", function () {

    console.log("Hello there:");
    $.get("/Scrap", function (data) {

      if (data) {
        for (var i = 0; i < data.length; i++) {
          // Display the approp information on the page
          var site = "https://www.nytimes.com"
          var articlediv = $("<div>");
          var save = $("<button>");
          save.addClass("btn btn-success");
          save.attr("padding", "20px");
          save.text("SAVE ARTICLE");
          save.css("margin", "20px");
          articlediv.attr("id", i);
          $("#" + i).addClass("articles");
          articlediv.css("background-color", "beige");
          articlediv.css("margin", "10px");
          articlediv.css("padding", "10px");
          $(".background-image").append(articlediv);
          articlediv.html('<a href =' + site + data[i].link + '><h4>' + data[i].title + data[i].summary + '</h4></a>');
          articlediv.append(save);
          articlediv.css("color", "black");
          save.attr("id", data[i]._id);
        }
      } else {
        var text = "No new articles to scrap.Check Saved articles";
        var articleh2 = $("<h2>");
        articleh2.text(text);
        $(".background-image").append(articleh2);
      }


    });


  });

  //Handle the Save Article button
  $(document).on("click", ".btn.btn-success", function () {
    var id = this.id;
    $.ajax({
      url: "/api/Save/" + id,
      type: 'PUT',
    }).then(function (data) {
      if (data) {
        $("#" + id).parent().hide();
      }
      
    });
  });

  //Handle the Clear Articles Button
  $("#Clear").on("click", function () {
    $.ajax({
      url: "/api/Clear/",
      type: 'DELETE',
    }).then(function (data) {
      if (data) {
        window.location = "/";
      }
    });
  });

  // Handle the Save Articles list
  $("#Saved").on("click", function () {
    //Get API call to get the data scraped
    $.ajax({
      url: "/api/SavedArticles/",
      type: 'GET',
    }).then(function (data) {
      $("articlediv").remove();
      //Check if any data returned and if yes, execute the below 
      if (data) {
        //For each record returned,execute the below loop
        for (var i = 0; i < data.length; i++) {
          console.log("Displaying saved article" + i);
          //store the site url to a variable so that it can be appended with the link from the response object
          var site = "https://www.nytimes.com"
          //Create a div to display the scrapped articles
          var articleSavediv = $("<div>");
          //Create a button for deleting the articles
          var Delete = $("<button>");
          //Create a button to add Notes for the article
          var addNote = $("<button>");
          // Assign a class to the Delete button
          Delete.addClass("btn btn-danger Delete");
          //Assign a class to the addNote button
          addNote.addClass("btn btn-primary Notes");
          //Add padding to the delete button
          Delete.attr("padding", "10px");
          //Add padding to the addNote button
          addNote.attr("padding", "10px");
          //Add the text to be displayed on the delete button
          Delete.text("DELETE ARTICLE");
          //Add the text to be displayed on the add note button
          addNote.text("Add Notes");
          //Add margin of 20px to the delete button
          Delete.css("margin", "20px");
          //Add a margin of 20px to the addNote button
          addNote.css("margin", "20px");
          //Assign an id attribute to the div whcih is the index of the response data object
          articleSavediv.attr("id", i);
          //Add class called Savedarticles to the div as we assigned the id of the div as i in the previous step
          $("#" + i).addClass("Savedarticles");
          //Set the background color of the div
          articleSavediv.css("background-color", "beige");
          //Set margin and padding of the div
          articleSavediv.css("margin", "10px");
          articleSavediv.css("padding", "10px");
          //Append the div to the class called .background-image which displays the newyork times image
          $(".background-image").append(articleSavediv);
          //Set the html of div as the various attributes of the data object returned from server like link, title,summary 
          articleSavediv.html('<a href =' + site + data[i].link + '><h3>' + data[i].title + data[i].summary + '</h3></a>');
          //Append the delete button to the div
          articleSavediv.append(Delete);
          //Append the addNote button to the div
          articleSavediv.append(addNote);
          //Set the colorof the div to black
          articleSavediv.css("color", "black");
          //set the id of the delete button as the id attribute of the article returned in the response object so that this can be used to pass the id to delete the article with id from the db
          Delete.attr("id", data[i]._id);
           //set the id of the addNote button as the id attribute of the article returned in the response object so that this can be used to add notes to the same article with id as the addNote button
          addNote.attr("id", data[i]._id);

        }
        //If no data is returned, display text as "No Saved Articles. Scrap new articles"
      } else {
        var text = "No Saved articles.Scrap new articles";
        var articleh2 = $("<h2>");
        articleh2.text(text);
        $(".background-image").append(articleh2);
      }

    });
  });
  //Handle the Delete Articles Button
  $(document).on("click", ".btn.btn-danger.Delete", function () {
    var id = this.id;
    console.log("The id of article to delete is" + id);
    $.ajax({
      url: "/api/DeleteArticle/" + id,
      type: 'DELETE',
    }).then(function (data) {
      if (data) {
        $("#" + id).parent().hide();
      }
    
    });
  });
//handle modal close button
$(document).on("click", ".btn.btn-secondary", function () {
  console.log("Entered the close modal function:");
  $(".AddedNotes").html("");
  $("#confirmBox").hide();
});


  //Route to handle Add Note button
  $(document).on("click", ".btn.btn-primary.Notes", function () {
    console.log("Entered add Note route:");
    var id = this.id;
    console.log("The id of the article to add note is" + id);
    $("#confirmBox").show();
    $("h4").text("Note for article" + id);
     $.ajax({
       url: "/api/SavedNotes/" + id,
       type: 'GET',
     }).then(function (data) {
        if(data)
        {
          for(var i =0;i<data.length;i++)
          {
            $(".AddedNotes").append("<br>" + data[i].body );
          }
         } else{
            var msg = "No Notes yet for the article";
            $(".AddedNotes").append("<br>"+msg);
           // $(".Add-Notes").append(msg);
          
        }
        
     });
    
     $("#Submit").attr("data-id",id);
  });


//Function SubmitNotes to submit the notes for the article

  //function submitNotes(id) {
      $(".CreateNote").on("submit", function (event) {
       event.preventDefault();
      var passId = $("#Submit").attr("data-id");
      var clientTitle = "Note for article with id" + passId;
      var clientBody = $("#NoteText").val().trim();
      $("#NoteText").val("");
      console.log("The title of he note is " + clientTitle);
      console.log("The body of the note is " + clientBody);
      $.ajax({
        method: "POST",
        url: "/Notes/" + passId,
        data:
        {
          title: clientTitle,
          body: clientBody,
          Article: passId
        }
      })
        .then(function(data) {
           console.log(data);
           $(".AddedNotes").append("<br>" + clientBody);
          // $(".Add-Notes").append(clientBody);
          
        });
    
    });

  //}


});

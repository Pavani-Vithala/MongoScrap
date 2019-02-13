$(document).ready(function () {
 // $("#confirmBox").hide();
  $("#Scrap").on("click", function () {

    console.log("Hello there:");
    $.get("/Scrap", function (data) {

      if (data) {
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
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
          // save.css("float","right");
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
      // window.location()
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
    $.ajax({
      url: "/api/SavedArticles/",
      type: 'GET',
    }).then(function (data) {
      $("articlediv").remove();
      if (data) {
        console.log("Entered clear articles loop");
        console.log("Successfully removed articles div");
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          console.log("Displaying saved article" + i);
          var site = "https://www.nytimes.com"
          var articleSavediv = $("<div>");
          var Delete = $("<button>");
          var addNote = $("<buton>");
          Delete.addClass("btn btn-danger Delete");
          addNote.addClass("btn btn-primary Notes");
          Delete.attr("padding", "10px");
          addNote.attr("padding", "10px");
          Delete.text("DELETE ARTICLE");
          addNote.text("Add Notes");
          Delete.css("margin", "20px");
          addNote.css("margin", "20px");
          articleSavediv.attr("id", i);
          $("#" + i).addClass("Savedarticles");
          articleSavediv.css("background-color", "beige");
          articleSavediv.css("margin", "10px");
          articleSavediv.css("padding", "10px");
          // save.css("float","right");
          $(".background-image").append(articleSavediv);
          articleSavediv.html('<a href =' + site + data[i].link + '><h3>' + data[i].title + data[i].summary + '</h3></a>');
          articleSavediv.append(Delete);
          articleSavediv.append(addNote);
          articleSavediv.css("color", "black");
          Delete.attr("id", data[i]._id);
          addNote.attr("id", data[i]._id);

        }

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
      // window.location()
    });
  });
//handle modal close button
$(document).on("click", ".btn.btn-secondary", function () {
  console.log("Entered the close modal function:");
  $(".AddedNotes").html("");
  //$("#NoteText").html("");
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
           // $(".AddedNotes").append(data[i].body);
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

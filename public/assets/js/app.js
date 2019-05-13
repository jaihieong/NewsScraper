console.log("Javascript file connected");

// $(function () {
function displayScrape() {
    //$(".scrape-new").on("click", function(event) {
console.log("Will scrape articles");
        $.ajax({
            type: "GET",
            url: "/scrape"
        }).then(function(data) {
            
            console.log("recipes scraped");
            console.log(data);
            $("#saved").hide();
            $("#scrapeResults").show();
            displayResults(data);
            hideContainer();
            showScrapeResults();
        
            //location.replace("/scrapped");

        })
    //})
};

//Function for displaying results (all articles from DB)
function displayResults(data) {
    $.getJSON("/display-results", function (data) {
        console.log(data);
        $("#nyt-0").empty();
        $("#nyt-1").empty();
        $("#nyt-2").empty();
        $("#total-number").text(data.length);
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card grey lighten-2");
            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content black-text");
            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.attr("data-id", data[i]._id);
            spanTitle.attr("id", "title-" + data[i]._id);
            spanTitle.text(data[i].title);
            var p = $("<p>");
            p.text(data[i].summary);
            p.attr("id", "summary-" + data[i]._id);
            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);
            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.attr("id", "link-" + data[i]._id);
            a.text("Go to the article");
            cardActionDiv.append(a);
            var saveArticle = $("<a>");
            saveArticle.addClass("waves-effect waves-light btn save-button");
            saveArticle.attr("id", data[i]._id);
            saveArticle.text("Save Article");
            var byline = $("<p>");
            byline.text(data[i].byline);
            byline.attr("id", "byline-" + data[i]._id);
            cardActionDiv.append(byline);
            // cardActionDiv.append(button);
            cardActionDiv.append(saveArticle);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);
            $("#nyt-" + String(i % 3)).append(mainDiv);
        };
    });
};

// When click on delete article button
$(document).on('click', '.delete-button', function () {
    var thisId = $(this).attr("id");
    console.log("Will delete: " + thisId)
    var summary = $("#summary-" + thisId).text();
    var title = $("#title-" + thisId).text();
    var link = $("#link-" + thisId).attr('href');
    var byline = $("#byline-" + thisId).text();
    var data = {
        "_id": thisId
    };
    $.ajax({
        type: "DELETE",
        url: "/delete",
        data: data,
        success: function (data, textStatus) {
            $("#main-" + thisId).remove();
        }
    })
});

    var hideContainer = function() {
        $(".alert").hide();
    
    };
    
    var showScrapeResults = function() {
        $("#scrapeResults").show(600);
    };
    
//When click on save single article button
$(document).on("click", '.save-button', function(){
    var articleId = $(this).attr('id');
    console.log("Article ID: " + articleId);

    $.ajax({
        type: "PUT",
        url: "/save-article/" + articleId,
    }).then(function(response) {
        alert("Your article have been saved");
        console.log(JSON.stringify(response));
        
    });
});
   
//Display all saved articles
function displaySaved() {
    $.getJSON("/display-saved", function (data) {
        $("#nyt-0").empty();
        $("#nyt-1").empty();
        $("#nyt-2").empty();
        $("#total-number").text(data.length);
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card grey lighten-2");
            mainDiv.attr("id", "main-" + data[i]._id);
            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content black-text");
            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.attr("data-id", data[i]._id);
            spanTitle.attr("id", "title-" + data[i]._id);
            spanTitle.text(data[i].title);
            var p = $("<p>");
            p.text(data[i].summary);
            p.attr("id", "summary-" + data[i]._id);
            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);
            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.attr("id", "link-" + data[i]._id);
            a.text("Go to the article");
            cardActionDiv.append(a);
            var button = $("<a>");
            button.addClass("waves-effect waves-light white btn create-note modal-trigger");
            button.attr("data-id", data[i]._id);
            button.attr("data-toggle", "modal");
            button.attr("data-target", "#notes");
            button.text("Create Notes");
            var deleteArticle = $("<a>");
            deleteArticle.addClass("waves-effect waves-light white btn delete-button");
            deleteArticle.attr("id", data[i]._id);
            deleteArticle.text("Delete");
            var byline = $("<p>");
            byline.text(data[i].byline);
            cardActionDiv.append(byline);
            cardActionDiv.append(button);
            cardActionDiv.append(deleteArticle);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);

            $("#nyt-" + String(i % 3)).append(mainDiv);
        }
    });
};

//When app loads we see all articles from DB scraped earlier, if any
$(document).ready(function(){      
    displayResults(); 
});


// create note
$(document).on("click", ".create-note", function (data) {
    //alert($(this).attr("data-id"));
    $("#savenote").attr("data-id", $(this).attr("data-id"));
    // <div id="display-note"></div>
    console.log("Creating note for this article: ", $(this).attr("data-id"));
    var aid = $(this).attr("data-id");
    //console.log(title);
    $("#display-title").empty();
    // $("#display-title").text(title);
    $("#textarea1").val("");
    $.ajax({
        method: "GET",
        url: "/notes/" + aid
      }).then(function(data) { 
        //$("#display-note").text("Notes for the Article: " + data.note.title);
        // console.log(data.note.title);
        // console.log(data.note.body);
        console.log(data.title);            

        //var notetext = "Notes: " + data[0].body;
        $("#display-note").empty();
        var title = $("#display");
        title.text(data.title);
        var noteList = $("<ul>");
        noteList.addClass("collection with-header");
        var hli = $("<li>");
        hli.addClass("collection-header")
        hli.text("Saved notes");
        noteList.append(hli);
        // console.log(data.note.title);
        // console.log(data.note._id);
        // console.log(data.note.body);
        for (var i = 0; i < data.notes.length; i++) {        
            console.log(data.notes[i]._id);

            //$("#notetitle").append(data.note.title);
            var ili = $("<li>");
            ili.attr("id", data.notes[i]._id);
            ili.addClass("collection-item");

            var idiv = $("<div>");
            // idiv.text(data.notes[i].body);

            // var button = $("<button>");
            // button.attr("button-id", data.notes[i]._id);
            // button.addClass("note-delete-button");
            // button.attr("type", "delete");

            // idiv.append(data.notes[i].body);

            var adelete = $("<a>");
            adelete.addClass("secondary-content");
            adelete.attr("note-id", data.notes[i]._id);
            adelete.attr("href", "#");
            adelete.addClass("deletenote");
            // adelete.attr("onclick", 'deletenote("' + data.notes[i]._id + '")');
            var xdelete = $("<i>");
            xdelete.addClass("material-icons");
            xdelete.attr("note-id", data.notes[i]._id);
            xdelete.html("delete");
            adelete.append(xdelete);
            idiv.append(data.notes[i].body, " ", adelete);
            ili.append(idiv);
            noteList.append(ili);        
            $("#display-note").append(noteList);

        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    // get the user input value 
    var thisId = $(this).attr("data-id");
    var text = $("#textarea1").val();
    var notetitle = $("#notetitle").val();
   console.log(text);
    // console.log(thisId);, data.note
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        type: "POST",
        url: "/notes/" + thisId,
        data: {
            title: notetitle,
            body: text
        },
    })
    //when it's done
    .then(function(data) {
        $('.modal').modal('hide');
        // Log the response
        console.log(data);

    })
});

// delete note button
$(document).on("click", ".deletenote", function () {
    var noteId = $(this).attr("note-id");
    console.log(noteId);
    var data = {
        "_id": noteId
    };
    $.ajax({
        type: "DELETE",
        url: "/deletenote",
        data: data,
        success: function (data, textStatus) {
            console.log("note deleted");
            console.log(data);
            $("#display-note" + noteId).remove();
            $('.modal').modal('hide');
        }
    })
});
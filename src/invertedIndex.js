"use strict";
// var InvertedIndex = function() {}

var Index = function() {
  this.notAcceptedCharacters = ["a", "an", "and", "or", "the", "for", "of", "into", "to", "in"];
  this.dictionary = {};
};

Index.prototype = {
  createIndex: function(filepath) {
    var index = this;
    // Read the JSON file get the books and create an index
    return index.readJSONfile(filepath, function(jsonContent) {
      index.populateIndex(jsonContent);
    });
  },
  populateIndex: function(bookArray) {
    var that = this,
      bookObjectPosition = 0;

    // Loop through the book extracts
    Array.prototype.forEach.call(bookArray, function(book) {
      // concatenate the book title and text, to get all the words for a proper search
      var allTextualContent = (book.title + " " + book.text).replace(/(\.|\,|\:|\;)/g, "");

      // split the concatenated string to get all the words
      var allTheWords = allTextualContent.split(/\s/);

      // Loop through them adding them to the dictonary object if they are already existing
      allTheWords.forEach(function(word) {
        var word = word.toLowerCase(),
          dict = that.dictionary;

        // check to see that it does no exist
        if (!dict.hasOwnProperty(word) && that.notAcceptedCharacters.indexOf(word) == -1) {
          // then add it
          dict[word] = [bookObjectPosition];
        }
      });

      bookObjectPosition++;
    })
  },
  searchIndex: function(search_terms) {
    var results = [];

    if (arguments.length > 1) {
      // eg. searchIndex("home", "hole", "king", "hobbit"...)
      search_terms = arguments;
    } else {
      // If an array was not passed then a single term was passed
      if (Object.prototype.toString.call(search_terms) !== '[object Array]') {
        // wrap it up to a single value in an array
        search_terms = [search_terms];
      }
    }
    // console.log("Arg", search_terms)

    // Now check for the existence of every word in the array
    for (var x = 0, searchSize = search_terms.length; x < searchSize; x++) {
      var index = this.findIndex(search_terms[x]);
      results.push(index);
    }

    if (arguments.length == 1 && Array.isArray(arguments[0]) == false) {
      return results[0];
    }
    return results;
  },
  findIndex: function(word) {
    var dict = this.getIndex(),
      word = word.toLowerCase();

    if (dict[word]) {
      return dict[word];
    }
    return -1;
  },
  getIndex: function() {
    return this.dictionary;
  },
  readJSONfile: function(filepath, callback) {
    var that = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200 || window.location.href.indexOf("http") == -1) {
          that.jsonContent = JSON.parse(xmlhttp.responseText);
          // console.log("The JSON Content: ", that.jsonContent);
          callback(that.jsonContent);
        } else {
          console.error("An error has occured making the request");
          return false;
        }
      }
    }

    xmlhttp.open("GET", filepath, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    return this
  },
  then: function(callback) {
    var that = this;
    if (typeof callback == "function") {
      setTimeout(function() {
        callback(that.jsonContent);
      }, 0);
    }
  }
}

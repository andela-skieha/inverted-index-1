'use strict';

var Index = function() {
  this.notAcceptedCharacters = ['a', 'an', 'and', 'or', 'the', 'for', 'of', 'into', 'to', 'in'];
  this.dictionary = {};
};

Index.prototype = {
  createIndex: function(filepath, callback) {
    var index = this;
    // Read the JSON file get the books and create an index
    return index.readJSONfile(filepath, function(jsonContent) {
      index.populateIndex(jsonContent);
      // check if the callback is a function
      if (typeof callback === 'function') {
        callback(jsonContent);
      }
    });
  },
  populateIndex: function(bookArray) {
    var that = this,
      bookObjectPosition = 0;

    // Loop through the book extracts
    bookArray.forEach(function(book) {
      // concatenate the book title and text, to get all the words for a proper search
      var allTextualContent = (book.title + ' ' + book.text).replace(/(\.|\,|\:|\;)/g, '');

      // split the concatenated string to get all the words
      var allTheWords = allTextualContent.split(/\s/);

      // Loop through them adding them to the dictonary object if they are already existing
      allTheWords.forEach(function(word) {
        var dict = that.dictionary;

        word = word.toLowerCase();

        // check to see that it does no exist
        if (!dict.hasOwnProperty(word) && that.notAcceptedCharacters.indexOf(word) === -1) {
          // then add it
          dict[word] = [bookObjectPosition];
        }
        // the word already exists in the dictionary
        // only confirm it is not one of word conjuctions
        else if (that.notAcceptedCharacters.indexOf(word) === -1) {

          var bookPositionStored = false;

          // loop through the book array positional reference,
          // to see if the book already exists in the array
          dict[word].some(function(bookPos) {
            // check if this is the same book position, using the currrent book object position
            if (bookPos === bookObjectPosition) {
              bookPositionStored = true;
              // break this loop: http://stackoverflow.com/a/2641374/1709647
              // This works because "some" array looping function returns true as soon as any of the callbacks,
              // executed in array order, return true, short-circuiting the execution of the rest.
              // saving computation power, used to finish a loop even when a result was acquired
              return bookPositionStored;
            }
          });

          // If not, add this book's positional value in the book array
          if (!bookPositionStored) {
            dict[word].push(bookObjectPosition);
          }
        }
      });

      bookObjectPosition++;
    });
  },
  searchIndex: function(searchTerms) {
    var results = [];

    if (arguments.length > 1) {
      // eg. searchIndex('home', 'hole', 'king', 'hobbit'...)
      searchTerms = arguments;
    } else {
      // If an array was not passed then a single term was passed
      if (Object.prototype.toString.call(searchTerms) !== '[object Array]') {
        // wrap it up to a single value in an array
        searchTerms = [searchTerms];
      }
    }

    // Now check for the existence of every word in the array
    for (var x = 0, searchSize = searchTerms.length; x < searchSize; x++) {
      var index = this.findIndex(searchTerms[x]);
      results.push(index);
    }

    // If one argument was provided and it is not an array
    if (arguments.length === 1 && !Array.isArray(arguments[0])) {
      return results[0];
    }
    return results;
  },
  findIndex: function(word) {
    var dict = this.getIndex();

    // require all none numeric/symbolic characters to be lowercased
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
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200 || window.location.href.indexOf('http') === -1) {
          that.jsonContent = JSON.parse(xmlhttp.responseText);
          callback(that.jsonContent);
        } else {
          console.error('An error has occured making the request');
          return false;
        }
      }
    };

    xmlhttp.open('GET', filepath, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(null);
    return this;
  }
};

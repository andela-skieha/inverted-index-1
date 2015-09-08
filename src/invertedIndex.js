"use strict";

var Index = function() {
    this.indexes = {};
}

var IndexingClass = function() {};
IndexingClass.prototype = {
    createIndex: function(filepath) {
        // body...
    },
    getIndex: function(doc_object) {
        // body...
    },
    searchIndex: function(search_terms) {
        // body...
    },
    populateIndex: function(object_arr) {
        // body...
    },
    readJSONfile: function(filepath) {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200 || window.location.href.indexOf("http") == -1) {
                    var jsonObj = JSON.parse(xmlhttp.responseText);
                    console.log("The JSON: ", jsonObj);
                    return jsonObj;
                } else {
                    console.error("An error has occured making the request");
                    return false;
                }
            }
        }

        xmlhttp.open("GET", filepath, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
    }
}

var indexing = new IndexingClass();
var obj = indexing.readJSONfile('../src/books.json')
console.log(obj);

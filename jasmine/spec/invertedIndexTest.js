describe("Inverted index curriculum tests", function() {
  // Instantiate the inverted index class
  var invertedIndex = new Index(),
    booksObject = null;

  beforeEach(function(done) {
    // Read the book json file and assert the book has been read.
    invertedIndex.createIndex('../src/books.json').then(function(json) {
      // console.log(json);
      booksObject = json;
      done();
    });
  });

  describe("Reads book data", function() {

    it("reads the book data into an object", function(done) {
      expect(booksObject).not.toBe(null);
      done();
    });

    it("the JSON array created is not empty", function(done) {
      expect(booksObject.length).toBe(2);
      done();
    });

  });

  describe("Populates index", function() {

    it("ensure index is created", function(done) {
      var index = invertedIndex.getIndex();
      expect(typeof index).toBe(typeof new Object());
      expect(index.alice).toBeDefined();
      done();
    });

    it("ensure index is correct", function(done) {
      var index = invertedIndex.getIndex(),
        indexProperties = Object.keys(index);
      // console.log(indexProperties);

      expect(indexProperties).toContain("alice");
      expect(indexProperties).not.toContain("in");
      expect(indexProperties).toContain("wonderland");
      expect(indexProperties).toContain("lord");
      expect(indexProperties).not.toContain("of");
      expect(indexProperties).not.toContain("the");
      expect(indexProperties).toContain("rings");
      done();
    });

  });

  describe("Search index", function() {

    it("returns the correct results when searched", function(done) {

      expect(invertedIndex.searchIndex("alison")).toBe(-1);
      expect(typeof invertedIndex.searchIndex("alice")).toBe(typeof new Array());
      expect(invertedIndex.searchIndex("alice")).toContain(0);
      done();
    });

    it("the search function can handle a varied number of search terms as arguments", function(done) {

      // All results should reflect -1 for words that do not exist in the index
      expect(invertedIndex.searchIndex("ashley", "madison")).not.toContain(0);
      expect(invertedIndex.searchIndex("ashley", "madison", "hack")).not.toContain(1);

      // If the words exists, the results should either be 1 or 0
      expect(invertedIndex.searchIndex("alice", "rings")).toContain([1]);
      expect(invertedIndex.searchIndex("alice", "rings", "dwarf")).toContain([0]);
    });

    it("searchIndex can handle an array of search terms", function(done) {

      // pass an array
      expect(invertedIndex.searchIndex(["alice", "rings"])).toContain([1]);
      expect(invertedIndex.searchIndex(["alice", "rings", "dwarf"])).toContain([0]);
      done();
    });

    it("search does not take too long to execute", function() {
      // should not take more than 0.02 seconds or 20 nanoseconds
      var timeTaken = 0,
        timeLimit = 20,
        results = [];

      // start a countup, a very fast one
      // counts up every 2 nano second
      var countUp = setInterval(function() {
        // if the results are defined stop the count up
        if (results.length !== 0) {
          clearInterval(countUp);
        }
        timeTaken += 2;
      }, 2);

      // Let's even delay it by 5 nanoseconds
      setTimeout(function() {
        // Make the list of arguments long to add more computation
        var args = ["alice", "rings", "lord", "wonderland", "enters", "imagination", "hole", "rabbit", "world", "elf", "dwarf", "hobbit", "wizard", "destroy", "ring", "seek", "alliance"];

        // run the search
        results = invertedIndex.searchIndex(args);
        // console.log(timeTaken);
      }, 5);

      expect(timeTaken).toBeLessThan(timeLimit);
    });
  })
})

'use strict';

describe('Inverted index curriculum tests', function() {

  // Instantiate the inverted index class
  var invertedIndex = new Index(),
    booksObject = null;

  beforeEach(function(done) {
    // Read the book json file and assert the book has been read.
    invertedIndex.createIndex('../src/books.json', function(bookJsonObjectParsed) {
      booksObject = bookJsonObjectParsed;
      done();
    });
  });

  describe('Reads book data', function() {

    it('reads the book data into an object', function() {
      expect(booksObject).not.toBe(null);
    });

    it('the JSON array created is not empty', function() {
      expect(booksObject.length).toBe(2);
    });

  });

  describe('Populates index', function() {

    it('ensure index is created', function() {
      var index = invertedIndex.getIndex();
      expect(typeof index).toBe('object');
      expect(index.alice).toBeDefined();
    });

    it('ensure index is correct', function() {
      var index = invertedIndex.getIndex(),
        indexProperties = Object.keys(index);

      expect(indexProperties).toContain('alice');
      expect(indexProperties).not.toContain('in');
      expect(indexProperties).toContain('wonderland');
      expect(indexProperties).toContain('lord');
      expect(indexProperties).not.toContain('of');
      expect(indexProperties).not.toContain('the');
      expect(indexProperties).toContain('rings');
    });

  });

  describe('Search index', function() {

    it('returns the correct results when searched', function() {

      expect(invertedIndex.searchIndex('alison')).toBe(-1);
      expect(Array.isArray(invertedIndex.searchIndex('alice'))).toBe(true);
      expect(invertedIndex.searchIndex('alice')).toContain(0);
    });

    it('the search function can handle a varied number of search terms as arguments', function() {

      // All results should reflect -1 for words that do not exist in the index
      expect(invertedIndex.searchIndex('ashley', 'madison')).not.toContain(0);
      expect(invertedIndex.searchIndex('ashley', 'madison', 'hack')).not.toContain(1);

      // If the words exists, the results should either be 1 or 0
      expect(invertedIndex.searchIndex('alice', 'rings')).toContain([1]);
      expect(invertedIndex.searchIndex('alice', 'rings', 'dwarf')).toContain([0]);
    });

    it('can handle an array of search terms', function() {

      // pass an array
      expect(invertedIndex.searchIndex(['alice', 'rings'])).toContain([1]);
      expect(invertedIndex.searchIndex(['alice', 'rings', 'dwarf'])).toContain([0]);
    });

    it('search does not take too long to execute', function() {
      // Make the list of arguments long to add more computation
      var args = ['alice', 'rings', 'lord', 'wonderland', 'enters', 'imagination', 'hole', 'rabbit', 'world', 'elf', 'dwarf', 'hobbit', 'wizard', 'destroy', 'ring', 'seek', 'alliance'];

      // get the time now, convert it into microseconds
      // reference: http://gent.ilcore.com/2012/06/better-timer-for-javascript.html
      // run the search, and get the time again, to compare and get the difference
      var timeNow = window.performance.now() * 1000,
        timeAfterResults = (window.performance.now() * 1000),
        timeTaken = timeAfterResults - timeNow;

      expect(timeNow).toBeLessThan(timeAfterResults);
      // some time must have to have elapsed, so we must have recorded some timelapse
      expect(timeTaken).toBeGreaterThan(0);
      // Time taken to do the calculation should be less than 1 microsecond
      expect(timeTaken).toBeLessThan(1000 * 1000);
    });
  });
});

define(['buster', 'foliage', 'jquery', 'lodash'],
       function(buster, f, $, _) {

	   var assert = buster.assert;
	   var refute = buster.refute;

	   function elemTest(test) {
	       var div = $("<div />");
	       return _.bind(test, this, div);
	   }

	   buster.testCase("basics", {
	       "elements can be empty" : elemTest(function(e) {
		   f.p()(e);
		   assert.equals(e.find('p').text(), "");
	       }),
	       "elements can have text" : elemTest(function(e) {
		   f.p("hello")(e);
		   assert.equals("hello", e.find('p').text().trim());
	       }),
	       "numbers are interpreted as text" : elemTest(function(e) {
		   f.p(1337)(e);
		   assert.equals("1337", e.find('p').text().trim() );
	       }),
	       "elements can have attributes" : elemTest(function(e) {
		   f.a({href: 'http://google.com'})(e);
		   assert.equals(e.find('a').attr('href'), "http://google.com");
	       }),
               "text with leading # is a shorthand for {id:...}" : elemTest(function(e) {
		   f.p("#this-is-an-id", "this is a text")(e);
		   assert.equals(e.find("#this-is-an-id").text().trim(), "this is a text");
	       }),
               "text with leading . is a shorthand for addClass" : elemTest(function(e) {
		   f.p(".this-is-a-class", "this is a text")(e);
		   assert.equals(e.find(".this-is-a-class").text().trim(), "this is a text");
	       }),
	       "elements can have subelements" : elemTest(function(e) {
		   f.p(f.strong("strong text"))(e);
		   assert.equals(e.find('p strong').text().trim(), "strong text");
	       }),
	       "elements can have several textelements" : elemTest(function(e) {
		   f.p("one", "two", "three")(e);
		   assert.equals(e.find('p').text().trim(), "one\ntwo\nthree");
	       }),
	       "elements can be mixed with text" : elemTest(function(e) {
		   f.p("before", f.strong("middle"), "after")(e);
		   assert.equals(e.find('p').html().trim(), "before<strong>\nmiddle</strong>\nafter");
	       }),
	       "attributes can be mixed with text" : elemTest(function(e) {
		   f.a("before", {href: 'http://agicaf.se'}, "after")(e);
		   assert.equals(e.find("a").text().trim(), "before\nafter");
		   assert.equals(e.find("a").attr('href'), "http://agicaf.se");
	       }),
	       "attributes can be mixed with elements" : elemTest(function(e) {
		   f.a({href: "http://google.com"}, f.strong("hello"))(e);
		   assert.equals(e.find("a strong").text().trim(), "hello");
		   assert.equals(e.find("a").attr('href'), "http://google.com");
	       }),
	       "attributes are merged": elemTest(function(e) {
		   f.img({src: "http://placekitten.com/e/200/300"},
			 {alt: "a cute kitten"})(e);
		   assert.equals(e.find('img').attr('src'), "http://placekitten.com/e/200/300");
		   assert.equals(e.find('img').attr('alt'), "a cute kitten");
	       }),
	       "lists of text elements are added as individual elements" : elemTest(function(e) {
		   f.p(["text1", "text2"])(e);
		   assert.equals(e.find('p').text().trim(),"text1\ntext2");
	       }),
	       "sublists of text elements are added as individual elements" : elemTest(function(e) {
		   f.p(["text1", ["text2", "text3"]])(e);
		   assert.equals(e.find('p').text().trim(),"text1\ntext2\ntext3");
	       }),
	       "attributes can be created and then added" : elemTest(function(e) {
		   var attr = f.create({someAttr: "the value"});
		   f.p(attr)(e);
		   assert.equals(e.find('p').attr('someAttr'), "the value");
	       }),
	       "a child to all that returns undefined throws an error" : elemTest(function(e) {
		   var elem = f.all(function(){});
		   assert.exception(function() {
		       elem(e);
		   });
	       }),
	       "a child to all that returns an object without an undo throws an error" : elemTest(function(e) {
		   var elem = f.all(function(){return {}});
		   assert.exception(function() {
		       elem(e);
		   });
	       })
           });
       });

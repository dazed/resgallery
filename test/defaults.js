QUnit.test( 'Defaults', function( assert ) {
  
  var $fixture = $('#qunit-fixture');
  $fixture.append('<div id="gallery"></div>');
  
  var gallery = $fixture.find('#gallery').resgallery({});

  //  Returns jQuery object
  assert.equal(gallery instanceof jQuery, true, 'Returns jQuery object');

});
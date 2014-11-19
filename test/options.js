QUnit.test( 'Options', function( assert ) {
  
  var $fixture = $('#qunit-fixture');
  $fixture.append('<div id="gallery"><div class="slide"><div class="slide-wrappper"><img src="../demo/img1.jpg" alt="" class="img" /></div></div></div>');
  
  var options = {
    trill: true
  };
  var gallery = $fixture.find('#gallery').resgallery(options).cycle({
    'slides': '.slide'
  });
  var data = gallery.data('resgallery');
  
  
  //  Options are valid JSON
  assert.equal(data.options.trill, true, 'Options are combined successfully');

});
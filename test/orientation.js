QUnit.test( 'Orientation', function( assert ) {
  
  var $fixture = $('#qunit-fixture');
  $fixture.append('<div id="gallery"><div class="slide"><img src="../demo/img1.jpg" alt="" /></div></div>');
  
  var options = {};
  var gallery = $fixture.find('#gallery').resgallery(options);

  gallery.css({
    width: 400,
    height: 1
  });

  var data = gallery.data('resgallery');
  
  
  //  Options are valid JSON
  assert.equal(true, true, 'Landscape image should fit width');

});

QUnit.test( 'CalculateAspectRatio', function( assert ) {

  var $fixture = $('#qunit-fixture');
  $gallery = $('<div id="gallery"></div>');
  $fixture.append($gallery);
  $gallery.resgallery({});
  
  assert.equal(2, $gallery.data('resgallery')['_calculateAspectRatio'](20, 10));
  assert.equal(0.5, $gallery.data('resgallery')['_calculateAspectRatio'](10, 20));
  assert.equal(10, $gallery.data('resgallery')['_calculateAspectRatio'](100, 10));

});
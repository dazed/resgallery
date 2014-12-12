# ResGallery #
A jQuery plugin to make your content fit as much space as possible.

## Quick Start ##
First, you'll need to install all node modules. Go to the folder you have ResGallery installed in via the command line, and then input...
```npm install```

Next, you'll need to install the bower compenents.
``` bower install```

Now, run the demo.
```grunt```

Open your browser to http://0.0.0.0:8000/demos/simple/

## Sample Markup ##
```
<div id="gallery">

  <div class="slide">
    <div class="slide-wrapper">
      <img src="image1.jpg" alt="images are cool" />
    </div>
  </div>
  
  <div class="slide">
    <div class="slide-wrapper">
      <img src="image2.jpg" alt="images are still cool" />
    </div>
  </div>
  
</div>
```

## Options ##
**slide** (string) ```default: '.slide'```  
CSS Selector for your slides.  
*Note: This should be identical to your cycle2 slides*

**wrapper** (string) ```default: '.slide-wrapper'```  
CSS Selector for your slide contents wrapper.

**image** (string) ```default: '.img'```  
CSS Selector for your slide contents

**center** (boolean) ```default: true```  
Vertically center slides that are set to `fit-width`.  

**preload** (boolean) ```default: false```  
If set to true, the plugin will dynamically load in your slides as necessary.  
*Note: This requires your slide to have an attribute of data-url*

**contents** (object) ```default: {}```  
To specify custom content measurements for your slide, add it in here. Just make sure your function returns the new slide. Your function gets 3 parameters, the default slide data already calculated, the data from the AJAX request, and the slide number your function is evaluating.

```
<div class="slide" data-slide-layout="vimeo"></div>
```

```
contents: {
  vimeo: function(defaultSlide, ajaxData, slideNum) {
    //  return slide;
    var slide = defaultSlide;
    slide.width = 100;
    return slide;
  }
}
```


### Dependencies ###
* [jQuery](http://jquery.com/)
* [cycle2](http://jquery.malsup.com/cycle2/)
* [underscore.js](http://underscorejs.org/)

### To run a demo ###
```grunt```


### To JSHint ###
```grunt jshint```



## Contributing ##
For contributing to ResGallery, you will need to have Node, Grunt, and Bower.

### To install dependencies ###
```npm install```

```bower install```

### Testing ###
All unit tests are written in [QUnit](http://qunitjs.com/). If you contribute, please write tests for them.

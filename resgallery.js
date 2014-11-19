/*
ResGallery
*/

(function ($, undefined) {

  "use strict";

  var ResGallery = function(element, options) {
    var root = this;

    this.$el = $(element);
    this.state = {};
    this.slides = [];

    this.$el.on({
      'cycle-post-initialize': function(e, cycleOpts) {

        root._create(options, cycleOpts);
        root.$el.trigger('resgallery.init');

      },
      'cycle-after': function(e, cycleOpts, outSlide, inSlide, forward) {

        root._resize();
        
        var $imgs = cycleOpts.slides;
        var slideNum = $imgs.index(inSlide);
        var slide = root.slides[slideNum];

        root.$el.trigger('resgallery.after', [cycleOpts, slide]);

      },
      'cycle-before': function(e, opts, outSlide, inSlide, forward) {
        
        var $imgs = opts.slides;
        var slideNum = $imgs.index(inSlide);

        if (root.options.preload) {

          var next = (!!$imgs.eq(slideNum + 1).length && !$imgs.eq(slideNum + 1).children().length);
          var prev = (!!$imgs.eq(slideNum - 1).length && !$imgs.eq(slideNum - 1).children().length);

          //  Determine if incoming slide needs to be loaded
          if (!$(inSlide).children().length) {
            root._preload(slideNum);
          }

          //  Determine if slide after needs to be loaded
          if (next) {
            root._preload(slideNum + 1);
          }

          //  Determine if slide before needs to be loaded
          if (prev) {
            root._preload(slideNum - 1);
          }

        }

        root.$el.trigger('resgallery.before', [slideNum]);

      }
    });

  };

  ResGallery.DEFAULTS = {
    image: '.img',
    wrapper: '.slide-wrapper',
    slide: '.slide',
    preload: false,
    center: true,
    contents: {}
  };

  //  Private Methods
  ResGallery.prototype._create = function (options, cycleOpts) {

    var root = this;
    var prev = cycleOpts.currSlide - 1;
    var next = cycleOpts.currSlide + 1;
    root._resizing = _.throttle($.proxy(root._resize, root), 10);


    if (prev < 0) {
      prev = cycleOpts.slideCount-1;
    }

    if (next > cycleOpts.slideCount) {
      next = 0;
    }

    //  Merge Options with Defaults
    this.options = $.extend(true, {}, ResGallery.DEFAULTS, options);

    if (root.options.preload) {

      //  Add current slide to slide collection
      root.slides[cycleOpts.currSlide] = root._slide(root.$el, cycleOpts.currSlide);

      //  Load in previous slide
      root._preload(prev);

      //  Load in next slide
      root._preload(next);

    } else {

      //  Add in all slides to slide collection
      for (var i = 0; i <= cycleOpts.slides.length; i++) {
        var $slide = $(cycleOpts.slides).eq(i);
        root._slide($slide, i);
        root._orientation(i);
      }

    }

    //  Bind orientation to window resize
    $(window).on('resize', root._resizing).trigger('resize');

  };

  /**
  * Destroy ResGallery instance and remove data
  *
  */
  ResGallery.prototype._destroy = function() {

    var root = this;

    //  Remove resizing event
    $(window).off('resize', root._resizing);

    //  Remove classes from slides
    $(root.options.slide).removeClass('fit-height fit-width');

    //  Remove styling from slide wrapper
    $(root.options.wrapper).css('marginTop', '');

    //  Remove data from jQuery element(s)
    root.$el.removeData('resgallery');

  };

  ResGallery.prototype._offset = function($el, containerHeight, i) {

    var root = this;
    var slide = this.slides[i];
    var orientation = this.state.orientation;
    var offset = slide.img.imagesLoaded(function () {
      var offset = (orientation === 'fit-width') ?
          (containerHeight - slide.img.height()) / 2 :
          0;

      $el.find(root.options.wrapper).css('marginTop', offset);

      return offset;
    });

    return offset;

  };


  /**
  * Determine orientation of image and browser
  *
  * @param $el {jQuery} Number of slide to load
  * @return orientation {String} 'fit-width' or 'fit-height'
  */
  ResGallery.prototype._orientation = function(i) {

    var root = this;
    var $container = this.$el;
    var $el = $($container.data('cycle.opts').slides[i]);

    if (_.isEmpty(this.slides[i])) {
      //  Keep 'this' context in check
      //  https://github.com/jashkenas/underscore/issues/494
      return _(function () {
        root._orientation(i);
      }).chain().bind(this).delay(100);
    }

    var containerRatio = root._calculateAspectRatio($container.width(), $container.height());

    var orientation = (containerRatio > this.slides[i].ratio) ?
      'fit-height' :
      'fit-width';

    if (orientation === 'fit-height') {
      $el.removeClass('fit-width').addClass('fit-height');
    } else {
      $el.removeClass('fit-height').addClass('fit-width');
    }

    this.state.orientation = orientation;

    if (this.options.center) {
      this._offset($el, $container.height(), i);
    }

    return orientation;

  };

  /**
  * Preload slide for lighter DOM footprint
  *
  * @param i {Object} Number of slide to load
  * @return this {jQuery} jQuery object
  */
  ResGallery.prototype._preload = function (i) {

    
    //  Get placeholder element of slide
    //  Get URL to fetch 
    var root = this;
    var $placeholder = this.$el.data('cycle.opts').slides.eq(i);
    var url = $placeholder.data('url');

    var slide;
  
    //  Retrieve data for slide
    $.ajax({
      url: url
    }).success(function (data) {
      
      //  Create slide
      var slide = root._slide(data, i);
      var $img = slide.wrapper;

      //  Empty placeholder element and insert slide data
      $placeholder.empty().append($img);
      
      //  Set orientation for item
      root._orientation(i);

    });

   return slide;

  };

  ResGallery.prototype._resize = function() {

      //  Determine orientation for current image
      var cycle = this.$el.data('cycle.opts');
      this._orientation(cycle.currSlide);
      this.$el.trigger('resgallery.resize');

  };

  ResGallery.prototype._calculateAspectRatio = function(width, height){
    return Math.round((width / height)*100)/100;
  };

  /**
  * Create slide
  *
  * @param data {String} HTML String to be wrapped in jQuery
  * @param i {Number} Slide number being processed
  * @return this {jQuery} jQuery object
  */
  ResGallery.prototype._slide = function (data, i) {

    var root = this;
    var $data = $(data);
    var $slide = (this.options.preload) ?
          $data.find(this.options.wrapper).closest(this.options.slide) :
          $data;

    var $img = $slide.find(this.options.image);
    var slide = {
      $el: $slide,
      img: $img,
      wrapper: $slide.find(this.options.wrapper),
      width: $img.attr('width'),
      height: $img.attr('height'),
      get ratio() {
        return root._calculateAspectRatio(this.width, this.height);
      }
    };
      
    var customSlide = $slide.data('slide-layout');

    if (!_.isUndefined(customSlide)) {
      slide = (root.options.contents.hasOwnProperty(customSlide) && _.isFunction(root.options.contents[customSlide])) ?
        this.options.contents[customSlide].apply(root.$el, [slide, data, i]) :
        slide;
    }

    this.slides[i] = slide;
    
    return slide;

  };


  //  Public Methods
  ResGallery.prototype.destroy = function () {
    this._destroy();
  };

  ResGallery.prototype.resize = function () {
    this._resize();
  };

  ResGallery.prototype.update = function (newOptions) {
    var opts = this.options;
    $.extend(true, opts, newOptions);
  };

  /**
  * Add ResGallery to jQuery function
  *
  * @param options {Object} Options for initialization
  * @return this {jQuery} jQuery object
  */
  $.fn.resgallery = function resgallery(options) {
    
    var thisCall = typeof options;
    thisCall = thisCall || {};

    switch (thisCall) {
      
      //  Call upon a method
      case 'string':
        var args = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
          var instance = $.data(this, 'resgallery');
          if (!instance) {
            return false;
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return false;
          }
          instance[options].apply(instance, args);
        });
        break;

      //  Create new instance of plugin or update options
      case 'object':
        this.each(function () {
          var instance = $.data(this, 'resgallery');
          if (instance) {
            // update options of current instance
            instance.update(options);
          } else {
            // initialize new instance
            instance = new ResGallery(this, options);
            $.data(this, 'resgallery', instance);
          }
        });

        break;

    }

    //  Return 'this' for jQuery chainability
    return this;

  };

  //  AMD Compatibility
  if (typeof define === 'function' && define.amd) {
    define('resgallery', [], function() {
      return $.fn.resgallery;
    });
  }

})(jQuery);

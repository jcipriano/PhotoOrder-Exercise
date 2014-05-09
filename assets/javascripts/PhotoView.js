(function () {

  var htmlTmp = '<div id="{{id}}" class="gallery-photoview"  draggable="true"><div class="gallery-photoview-content" style="background-image: url(\'{{src}}\');"></div></div>';

  gallery.PhotoView = function (data) {

    this.data = data;
    this.events = new EventPublisher();
  };

  gallery.PhotoView.prototype.render = function () {

    this.html = htmlTmp.replace('{{id}}', this.data.id).replace('{{src}}', this.data.src).replace('{{name}}', this.data.name);
    
    this.el = $(this.html);
    this.stage = $('body');
    this.galleryOffset = $('.gallery-content').offset();

    this.eventSetup();

    var that = this;
    $(window).resize(function () {
      that.galleryOffset = $('.gallery-content').offset();
    });

    return this.el;
  };

  gallery.PhotoView.prototype.eventSetup = function () {

    var that = this;
    
    // mouse events
    this.el.mousedown(function(e){
      
      e.preventDefault();
      e.stopPropagation();

      that.activate();

      that.offsetX = that.galleryOffset.left + (e.x - that.el.offset().left);
      that.offsetY = that.galleryOffset.top + (e.y - that.el.offset().top);

      that.stage.mousemove(function(e){
        that.onDrag(e);
      });

      that.stage.mouseup(function(){
        that.stage.unbind('mousemove');
        that.deactivate(true);
      });
    });

    // touch events
    this.el.bind('touchstart', function(e){

      e.preventDefault();
      e.stopPropagation();

      that.activate();

      that.offsetX = that.galleryOffset.left + (e.pageX - that.el.offset().left);
      that.offsetY = that.galleryOffset.top + (e.pageY - that.el.offset().top);

      that.stage.bind('touchmove', function(e){
        that.onDrag(e);
      });

      that.stage.bind('touchend', function(){
        that.stage.unbind('touchmove');
        that.deactivate(true);
      });
    });
  };
  
  gallery.PhotoView.prototype.hovering = function (id) {
    if(!this.hoverId || this.hoverId !== id) {
      this.hoverId = id;
      this.events.publish('hovering', {
        source: this,
        target: this.hoverId
      });
    }
  };

  gallery.PhotoView.prototype.isActive = function () {
    return this.el.hasClass('activated');
  };

  gallery.PhotoView.prototype.activate = function () {
    this.el.addClass('activated');
    this.events.publish('activated', this.data);
  };

  gallery.PhotoView.prototype.deactivate = function (publish) {
    this.el.removeClass('activated');
    if(publish) {
      this.events.publish('deactivated', this.data);
    }
  };

  gallery.PhotoView.prototype.setPosition = function (x, y, animate) {

    this.el.css({
      '-webkit-transition': animate ? '-webkit-transform 0.15s ease-out' : 'none',
      '-webkit-transform': 'translate(' + x + 'px, ' + y + 'px)'
    });
  };

  gallery.PhotoView.prototype.onDrag = function (e) {
    this.setPosition( (e.x ? e.x : e.pageX) - this.offsetX, (e.y ? e.y : e.pageY) - this.offsetY);

    var overEl = document.elementFromPoint(e.pageX, e.pageY);
    if($(overEl).hasClass('gallery-photoview')){
      this.hovering(overEl.id);
    };
  };

})();
(function() {

  // namespace
  var gallery = this.gallery = {};

  // hard coded data
  gallery.data = [
    {
      'id': 'photo-1',
      'name': 'photo',
      'src': "assets/images/dsc_6001.jpg"
    },
    {
      'id': 'photo-2',
      'name': 'photo',
      'src': "assets/images/dsc_6013.jpg"
    },
    {
      'id': 'photo-3',
      'name': 'photo',
      'src': "assets/images/dsc_6268.jpg"
    },
    {
      'id': 'photo-4',
      'name': 'photo',
      'src': "assets/images/dsc_6397.jpg"
    },
    {
      'id': 'photo-5',
      'name': 'photo',
      'src': "assets/images/dsc_6345.jpg"
    },
    {
      'id': 'photo-6',
      'name': 'photo',
      'src': "assets/images/dsc_6378.jpg"
    },
    {
      'id': 'photo-7',
      'name': 'photo',
      'src': "assets/images/dsc_6413.jpg"
    },
    {
      'id': 'photo-8',
      'name': 'photo',
      'src': "assets/images/dsc_6417.jpg"
    }
  ];

  gallery.init = function () {

    this.el = $('#gallery .gallery-content');
    this.photos = [];
    this.photosHash = [];

    var i = 0, len = gallery.data.length,
    photoView;

    for(i; i<len; i++) {
      photoView = new gallery.PhotoView(gallery.data[i]);
      photoView.events.add('activated', this.photoActivated, this);
      photoView.events.add('deactivated', this.photoDeactivated, this);
      photoView.events.add('hovering', this.photoHovering, this);
      this.el.append( photoView.render() );
      this.photos.push(photoView);
      this.photosHash[photoView.data.id] = photoView;
    }

    this.reorder();
  };
  
  gallery.photoActivated = function (data) {

    var i = 0, len = gallery.data.length,
    photoView;

    for(i; i<len; i++) {
      photoView = this.photos[i];
      if(photoView.data.id !== data.id) {
        photoView.deactivate();
      }
    }
  };
  
  gallery.photoDeactivated = function (data) {
    this.reorder();
  };

  gallery.photoHovering = function (data) {

    var targetPhotoView = this.photosHash[data.target],
    currentPhotoView = data.source;
    targetIndex = this.photos.indexOf(targetPhotoView);

    console.log(targetPhotoView.data.id);

    this.photos.splice(this.photos.indexOf(currentPhotoView), 1);
    this.photos.splice(targetIndex, 0, currentPhotoView);
    
    // timeout hack, got a little lazy here
    setTimeout(function () {
      currentPhotoView.hoverId = '';
    }, 150);

    this.reorder();
  };

  gallery.reorder = function () {

    var i = 0, len = gallery.data.length,
    photoView,
    r = 0, c = 0,
    rLen = 3, cLen = 2,
    size = 200;

    for(i; i<len; i++) {
      photoView = this.photos[i];

      if(!photoView.isActive()){
        photoView.setPosition(r * size, c * size, true);
      }

      if(r == rLen) {
        r = 0;
        c = c + 1;
      } else {
        r = r + 1;
      }
    }
  };

  // Document Ready
  $(function(){
    gallery.init();
  });

})();
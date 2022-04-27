(function($) { // Begin jQuery
  $(function() { // DOM ready
    // Toggle open and close nav styles on click
    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var navbarHeight = $('.navigation').outerHeight();
    var delta = 5;

    $(window).scroll(function(event){
      didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
          hasScrolled();
          didScroll = false; // resetting variable
        }
    }, 100);

    function hasScrolled() {
      var st = $(this).scrollTop();

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
        return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){ // Scroll Down
        // slide the navbar up
        $('.navigation').removeClass('nav-down').addClass('nav-up');

        // close list if open
        if ($('#nav-toggle').hasClass('active')) {
          $('.navigation nav ul').css({'maxHeight': '0'});
        }
        $('#nav-toggle').removeClass('active');
      } else { // Scroll Up
        // slide the navbar down
        if(st + $(window).height() < $(document).height()) {
          $('.navigation').removeClass('nav-up').addClass('nav-down');
        }
      }

      lastScrollTop = st;
    }

    $('.nav-mobile').click(function() {
      if ($('#nav-toggle').hasClass('active')) {
        $('.navigation nav ul').css({'maxHeight': '0'});
      } else {
        var listHeight = document.getElementsByClassName('nav-list')[0].scrollHeight;
        var dropdowns = document.getElementsByClassName('nav-dropdown');
        for (var i = 0; i < dropdowns.length; i++) {
          listHeight += dropdowns[i].scrollHeight;
        }

        /* make navbar span the entire remaining height in the viewport if it is too big
        to fit inside the screen */
        if ($(window).innerHeight() - navbarHeight < listHeight) {
          listHeight = $(window).innerHeight() - navbarHeight;
        }
        $('.navigation nav ul').css({'maxHeight': listHeight + 'px'});
      }

      $('#nav-toggle').toggleClass('active');
    });
  }); // end DOM ready
})(jQuery); // end jQuery

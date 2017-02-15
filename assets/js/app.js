var PleaseDontGo = (function() {
  var s;

  return {
    settings: {
      originalTitle: document.title,
      // New title when tab is changed
      newTitle: 'Please Don\'t Go!',
      favicon: document.querySelectorAll('[rel="icon"]')[0],
      originalFavicon: document.querySelectorAll('[rel="icon"]')[0].href,
      // New favicon when tab is changed
      newFavicon: '/assets/images/favicon-dontgo.ico'
    },

    init: function() {
      s = this.settings;
      this.visibility();
    },

    visibility: function() {
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
          setTimeout(function() {
            document.title = s.newTitle;
            s.favicon.setAttribute('href', s.newFavicon);
          }, 1500);
        } else {
          document.title = s.originalTitle;
          s.favicon.setAttribute('href', s.originalFavicon);
        }
      });
    }
  }
})();

var ActiveClass = (function() {
  var s;

  return {
    settings: {
      page: document.body.id,
      nav: document.getElementsByClassName('header__list')[0]
    },

    init: function() {
      s = this.settings;
      this.addClass();
    },

    addClass: function() {
      var active = s.nav.querySelectorAll('[href="/' + s.page + '"]')[0];
      if (active) {
        var activeLink = active.getAttribute('href').substring(1);
        if (activeLink === 'portfolio' || activeLink === 'blog' || activeLink === 'about') {
          active.classList.add('js-active');
        }
      }
    }
  }
})();

var ScreenSaver = (function() {
  var s;

  return {
    settings: {
      screensaver: document.getElementsByClassName('screensaver')[0],
      timeout: 0,
      active: false
    },

    init: function() {
      s = this.settings;
      this.timeout();
      this.mousemove();
    },

    timeout: function() {
      s.timeout = setTimeout(function() {
        ScreenSaver.show();
      }, 30000);
    },

    mousemove: function() {
      document.addEventListener('mousemove', function() {
        clearTimeout(s.timeout);
        if (s.active) {
          ScreenSaver.hide();
        }

        ScreenSaver.timeout();
      });
    },

    show: function() {
      s.active = true;
      s.screensaver.style.display = 'block';
    },

    hide: function() {
      s.active = false;
      s.screensaver.style.display = 'none';
    }
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  PleaseDontGo.init();
  ActiveClass.init();
  ScreenSaver.init();

  if (document.body.id === 'about') {
    instafetch.init({
      accessToken: '30115961.1677ed0.903e99e5b4944d8aad1694d879b7d981',
      numOfPics: 6,
    });
  }
});

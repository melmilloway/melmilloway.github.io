// ----------------------------------------------
// Page Transition
// ---------------------------------------------- 
const PageTransition = (() => {
  let s;
  const noTransition = 'no-transition';

  return {
    settings() {
      return {
        transitionLinks: document.querySelectorAll(`a[href^="http://${top.location.host.toString()}"]:not(${noTransition}), a[href^="/"]:not(${noTransition}), a[href^="./"]:not(${noTransition}), a[href^="../"]:not(${noTransition})`),
        body: document.body,
        window: window,
        exit: 600,
        entrance: 400
      };
    },

    init() {
      if (window === window.top) {
        s = this.settings();
        this.bindEvents();
      } else {
        setTimeout(() => {
          document.body.classList.add('js-page-loaded');
        }, 800);
      }
    },

    bindEvents() {
      this.loadingClasses();
      this.transitionPage();
      this.firefox();
      this.safari();
    },

    loadingClasses() {
      setTimeout(() => {
        s.body.classList.add('js-page-loaded');
      }, s.entrance);
    },

    transitionPage() {
      [].forEach.call(s.transitionLinks, link => {
        link.addEventListener('click', e => {
          if (s.body.classList.contains(noTransition) || e.metaKey || e.ctrlKey || e.shiftKey) {
            return;
          }
          e.preventDefault();

          const linkLocation = link.href;

          s.body.classList.add('js-page-exiting');

          setTimeout(() => {
            window.location = linkLocation;
          }, s.exit);
        });
      });
    },

    firefox() {
      s.window.addEventListener('unload', () => {
        s.window.unbind('unload');
      });
    },

    safari() {
      s.window.addEventListener('pageshow', e => {
        if (e.persisted) {
          window.location.reload();
        }
      });
    }
  };
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default PageTransition;

// ----------------------------------------------
// Screen Saver
// ----------------------------------------------
const ScreenSaver = (() => {
  let s;

  return {
    settings() {
      return {
        screensaver: document.getElementsByClassName('screensaver')[0],
        timeout: 0,
        active: false
      };
    },

    init(sec) {
      s = this.settings();
      this.mousemove(sec);
    },

    mousemove(sec) {
      document.addEventListener('mousemove', () => {
        clearTimeout(s.timeout);
        if (s.active) {
          ScreenSaver.hide();
        }

        s.timeout = setTimeout(() => {
          ScreenSaver.show();
        }, 1000 * sec);
      });
    },

    show() {
      s.active = true;
      s.screensaver.classList.add('js-active');
    },

    hide() {
      s.active = false;
      s.screensaver.classList.remove('js-active');
    }
  }
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default ScreenSaver;

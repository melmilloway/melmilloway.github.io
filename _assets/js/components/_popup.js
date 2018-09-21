// ----------------------------------------------
// Popup
// ----------------------------------------------
const Popup = (() => {
  let s;

  return {
    settings() {
      return {
        html: document.documentElement,
        body: document.body,
        open: 'js-popup-open',
        overflow: 'js-overflow',
        closing: 'js-popup-closing'
      };
    },

    init() {
      s = this.settings();
      this.bindEvents();
    },

    bindEvents() {
      this.togglePopup();
    },

    togglePopup() {
      document.querySelector('.popup__open').addEventListener('click', () => {
        s.body.classList.add(s.open);
        s.html.classList.add(s.overflow);
      });

      document.querySelector('.popup').addEventListener('click', e => {
        if (!document.querySelector('.popup__container').contains(e.target)) {
          this.popupClose();
        }
      });

      document.addEventListener('keyup', e => {
        if (s.body.classList.contains(s.open) && e.which === 27) {
          this.popupClose();
        }
      });
    },

    popupClose() {
      s.body.classList.add(s.closing);
      s.body.classList.remove(s.open);
      s.html.classList.remove(s.overflow);

      setTimeout(() => {
        s.body.classList.remove(s.closing);
      }, 800);
    }
  };
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default Popup;

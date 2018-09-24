// ----------------------------------------------
// Active Class
// ----------------------------------------------
const ActiveClass = (() => {
  let s;

  return {
    settings() {
      return {
        page: document.body.id,
        nav: document.getElementsByClassName('header__list')[0]
      };
    },

    init() {
      s = this.settings();
      this.addClass();
    },

    addClass() {
      const active = s.nav.querySelectorAll(`[href="/${s.page}"]`)[0];

      if (active) {
        const activeLink = active.getAttribute('href').slice(1);

        if (activeLink === 'portfolio' || activeLink === 'blog' || activeLink === 'about') {
          active.classList.add('js-active');
        }
      }
    }
  };
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default ActiveClass;

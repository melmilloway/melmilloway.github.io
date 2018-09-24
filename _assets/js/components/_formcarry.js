// ----------------------------------------------
// Formcarry
// ----------------------------------------------
const Formcarry = (() => {
  let s;

  return {
    settings() {
      return {
        html: document.documentElement,
        body: document.body,
        form: document.querySelector('.form'),
        formAction: document.querySelector('.form').action,
        formMessage: document.querySelector('.form__message'),
        animation: 'fade-in',
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
      this.ajax();
    },

    ajax() {
      s.form.addEventListener('submit', e => {
        e.preventDefault();

        const request = new XMLHttpRequest();

        request.open('POST', s.formAction, true);
        request.setRequestHeader('accept', 'application/json');

        const formData = new FormData(s.form);

        request.send(formData);

        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) {
            s.body.classList.add(s.closing);
            s.body.classList.remove(s.open);
            s.html.classList.remove(s.overflow);

            setTimeout(() => {
              s.form[0].reset();
              s.body.removeClass(s.closing);
            }, 800);
          } else {
            setTimeout(() => {
              s.formMessage.classList.remove(s.animation);
              s.formMessage.classList.add(s.animation);
              s.formMessage.textContent = 'Something Went Wrong';
            }, 750);
          }
        };
      });
    }
  };
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default Formcarry;

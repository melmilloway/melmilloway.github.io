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
        formSubmit: document.querySelector('.form .btn'),
        formError: document.querySelector('.form__error'),
        formFirstName: document.getElementById('form-first-name'),
        formLastName: document.getElementById('form-last-name'),
        formEmail: document.getElementById('form-email'),
        formMessage: document.getElementById('form-message'),
        animation: 'fade-in',
        open: 'js-popup-open',
        overflow: 'js-overflow',
        closing: 'js-popup-closing',
        error: 'js-error'
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
      s.formSubmit.addEventListener('click', e => {
        e.preventDefault();

        if (s.form.checkValidity()) {
          s.formFirstName.classList.remove(s.error);
          s.formLastName.classList.remove(s.error);
          s.formEmail.classList.remove(s.error);
          s.formMessage.classList.remove(s.error);

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
                s.form.reset();
                s.body.classList.remove(s.closing);
              }, 800);
            } else {
              setTimeout(() => {
                s.formError.classList.remove(s.animation);
                s.formError.classList.add(s.animation);
                s.formError.textContent = 'Something Went Wrong';
              }, 750);
            }
          };
        } else {
          if (!s.formFirstName.checkValidity()) {
            s.formFirstName.classList.add(s.error);
          } else {
            s.formFirstName.classList.remove(s.error);
          }

          if (!s.formLastName.checkValidity()) {
            s.formLastName.classList.add(s.error);
          } else {
            s.formLastName.classList.remove(s.error);
          }

          if (!s.formEmail.checkValidity()) {
            s.formEmail.classList.add(s.error);
          } else {
            s.formEmail.classList.remove(s.error);
          }

          if (!s.formMessage.checkValidity()) {
            s.formMessage.classList.add(s.error);
          } else {
            s.formMessage.classList.remove(s.error);
          }

          s.formError.classList.remove(s.animation);
          s.formError.classList.add(s.animation);
          s.formError.textContent = 'All Fields Required';
        }
      });
    }
  };
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default Formcarry;

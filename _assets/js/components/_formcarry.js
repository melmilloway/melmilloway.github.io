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
        form: $('#form'),
        formAction: $('#form').attr('action'),
        formMessage: $('.form__message'),
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
      s.form.submit(e => {
        e.preventDefault();

        $.ajax({
          url: s.formAction,
          method: 'POST',
          data: s.form.serialize(),
          dataType: 'json',
          success: () => {
            s.body.classList.add(s.closing);
            s.body.classList.remove(s.open);
            s.html.classList.remove(s.overflow);

            setTimeout(() => {
              s.form[0].reset();
              s.body.removeClass(s.closing);
            }, 800);
          },
          error: () => {
            setTimeout(() => {
              s.formMessage.classList.remove(s.animation);
              s.formMessage.classList.add(s.animation);
              s.formMessage.text('Something Went Wrong');
            }, 750);
          }
        });
      });
    }
  };
})();

// ----------------------------------------------
// Exports
// ----------------------------------------------
export default Formcarry;

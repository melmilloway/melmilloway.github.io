// ----------------------------------------------
// Imports
// ----------------------------------------------
import Rellax from 'rellax';
import ActiveClass from './components/_activeClass.js';
import Formcarry from './components/_formcarry.js';
import PageTransition from './components/_pageTransition.js';
import PleaseDontGo from './components/_pleaseDontGo.js';
import Popup from './components/_popup.js';
// import ScreenSaver from './components/_screenSaver.js';

// ----------------------------------------------
// Inits
// ----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementsByClassName('rellax').length) {
    const rellax = new Rellax('.rellax');
  }

  ActiveClass.init();
  Formcarry.init();
  PageTransition.init();
  PleaseDontGo.init();
  Popup.init();
  // ScreenSaver.init(120);

  if (document.body.id === 'about') {
    instafetch.init({
      accessToken: '30115961.1677ed0.903e99e5b4944d8aad1694d879b7d981',
      numOfPics: 6
    });
  }

});

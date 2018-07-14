// ----------------------------------------------
// Imports
// ----------------------------------------------
import Rellax from 'rellax';
import ActiveClass from './components/_activeClass.js';
import PleaseDontGo from './components/_pleaseDontGo.js';
import ScreenSaver from './components/_screenSaver.js';

// ----------------------------------------------
// Inits
// ----------------------------------------------
document.addEventListener('DOMContentLoaded', function() {

  if (document.getElementsByClassName('rellax').length) {
    const rellax = new Rellax('.rellax');
  }

  PleaseDontGo.init();
  ActiveClass.init();
  ScreenSaver.init(120);

  if (document.body.id === 'about') {
    instafetch.init({
      accessToken: '30115961.1677ed0.903e99e5b4944d8aad1694d879b7d981',
      numOfPics: 6,
    });
  }

});

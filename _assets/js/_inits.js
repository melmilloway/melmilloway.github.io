// ----------------------------------------------
// Imports
// ----------------------------------------------
import axios from 'axios';
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
    axios.get('https://instagram.com/melmilloway/?__a=1').then(response => {
      const targetEl = document.getElementById('instafetch');
      const photos = [];
      let article, a, figure, img;

      response.data.graphql.user.edge_owner_to_timeline_media.edges.forEach(edge => {
        if (edge.node && edge.node) {
          photos.push(edge.node);
        }
      });

      for (let i = 0; i < 6; i++) {
        article = document.createElement('article');
        a = document.createElement('a');
        a.href = `https://www.instagram.com/p/${photos[i].shortcode}`;
        a.target = '_blank';
        figure = document.createElement('figure');
        img = document.createElement('img');
        img.src = photos[i].display_url;
        figure.appendChild(img);
        a.appendChild(figure);
        article.appendChild(a);

        targetEl.appendChild(article);
      }
    }).catch(err => {
      return err;
    });
  }

});

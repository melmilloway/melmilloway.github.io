document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded, running animations");

  const loadingScreen = document.getElementById('loading-screen');
  const pinePoint = document.getElementById('pine-point');
  const pointAnimation = document.getElementById('point-animation');
  const container = document.querySelector('.container');
  const backgroundMusic = document.getElementById('background-music');
  const audioOn = document.getElementById('audio-on');
  const audioOff = document.getElementById('audio-off');
  let isAudioPlaying = false;

  pinePoint.addEventListener('click', async function (e) {
    e.preventDefault();
    console.log("Pine point clicked");

    pointAnimation.style.left = (e.clientX + 40) + 'px';
    pointAnimation.style.top = (e.clientY - 30) + 'px';
    pointAnimation.classList.add('show');

    try {
      await backgroundMusic.play();
      isAudioPlaying = true;
      audioOn.classList.remove('hidden');
      audioOff.classList.add('hidden');

      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        container.classList.remove('hidden');
        startAnimations();
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 800);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  });

  const hillsContainer = document.getElementById('hills-container');
  const signContainer = document.getElementById('sign-container');
  const audioToggle = document.getElementById('audio-toggle');
  const beginShiftBtn = document.getElementById('begin-shift');

  console.log("Hills container:", hillsContainer);
  console.log("Sign container:", signContainer);

  container.classList.remove('hidden');
  hillsContainer.classList.remove('animate');
  signContainer.classList.add('hidden');
  signContainer.classList.remove('animate');

  backgroundMusic.volume = 0.5;
  backgroundMusic.loop = true;

  function toggleAudio() {
    console.log("Toggle audio clicked");
    if (isAudioPlaying) {
      backgroundMusic.pause();
      isAudioPlaying = false;
      audioOn.classList.add('hidden');
      audioOff.classList.remove('hidden');
    } else {
      backgroundMusic.play().catch(console.error);
      isAudioPlaying = true;
      audioOn.classList.remove('hidden');
      audioOff.classList.add('hidden');
    }
  }

  isAudioPlaying = true;
  audioOn.classList.remove('hidden');
  audioOff.classList.add('hidden');

  audioToggle.addEventListener('click', toggleAudio);
  backgroundMusic.load();

  function tryPlayAudio(event) {
    if (!isAudioPlaying) {
      backgroundMusic.play().then(() => {
        console.log("Audio started successfully");
        isAudioPlaying = true;
        audioOn.classList.remove('hidden');
        audioOff.classList.add('hidden');
        document.removeEventListener('mousemove', tryPlayAudio);
        document.removeEventListener('touchstart', tryPlayAudio);
        document.removeEventListener('keydown', tryPlayAudio);
      }).catch(console.error);
    }
  }

  document.addEventListener('mousemove', tryPlayAudio);
  document.addEventListener('touchstart', tryPlayAudio);
  document.addEventListener('keydown', tryPlayAudio);

  // ⬇️ NEW: Redirect to Rise lesson on Begin Shift click
  beginShiftBtn.addEventListener('click', function () {
    console.log("Begin Shift clicked, sending message to parent to change lesson");
    parent.postMessage('go-to-lesson', '*');
  });

  function startAnimations() {
    console.log("Starting animation sequence");
    const cloudRight = document.getElementById('cloud-right');

    setTimeout(() => {
      console.log("Animating hills");
      hillsContainer.classList.add('animate');

      setTimeout(() => {
        console.log("Showing sign");
        signContainer.classList.remove('hidden');
        setTimeout(() => {
          console.log("Animating sign");
          signContainer.classList.add('animate');

          setTimeout(() => {
            cloudRight.classList.add('animate');
            const cloudLeft = document.getElementById('cloud-left');
            const cloudLowerRight = document.getElementById('cloud-lower-right');
            const cloudUpperLeft = document.getElementById('cloud-upper-left');
            cloudLeft.classList.add('animate');
            cloudLowerRight.classList.add('animate');
            cloudUpperLeft.classList.add('animate');
          }, 500);
        }, 100);
      }, 1500);
    }, 500);
  }
});

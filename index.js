const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;
const rate = 2;
function getGrayScales(pixels) {
  let d = pixels.data;
  let grayScales = [];
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];
    let grayScale = toGrayScale(r, g, b);
    grayScales.push(grayScale);
  }
  return grayScales;
}

// convert grayScales to Characters
// const grayRamp =
//   '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const grayRamp = '@%#*+=-:. ';

const rampLength = grayRamp.length;

const getCharacterForGrayScale = (grayScale) =>
  grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];

// listen video playing then draw the ascii video
window.onload = function () {
  document.getElementById('videoobj').addEventListener(
    'play',
    () => {
      drawVideo();
      window.requestAnimationFrame(drawVideo);
    },
    false,
  );
};

// draw the video
const textArea = document.getElementById('textArea');
function drawVideo() {
  let videoObj = document.getElementById('videoobj');
  const textArea = document.getElementById('textArea');
  const width = videoObj.clientWidth / rate;

  // if not playing, quit
  if (videoObj.paused || videoObj.ended) return false;

  let bc = document.createElement('canvas');
  bc.width = videoObj.clientWidth / rate;
  bc.height = videoObj.clientHeight / rate;

  let ctx = bc.getContext('2d');
  ctx.drawImage(
    videoObj,
    0,
    0,
    videoObj.clientWidth / rate,
    videoObj.clientHeight / rate,
  );
  let pData = ctx.getImageData(
    0,
    0,
    videoObj.clientWidth / rate,
    videoObj.clientHeight / rate,
  );

  // grayscale it and set to display canvas
  let grayScales = getGrayScales(pData);
  const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
    let nextChars = getCharacterForGrayScale(grayScale);
    if ((index + 1) % width === 0) {
      nextChars += '\n';
    }

    return asciiImage + nextChars;
  }, '');
  textArea.textContent = ascii;
  window.requestAnimationFrame(drawVideo);
}
let state = false;
const video = document.querySelector('#videoobj');
const button = document.querySelector('.button');
button.addEventListener('click', (e) => {
  console.log('click');
  e.preventDefault();
  state = !state;
  if (state) {
    video.play();
  } else {
    video.pause();
  }
});

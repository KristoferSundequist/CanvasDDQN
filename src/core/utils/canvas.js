/** @var {HTMLCanvasElement|Element} */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/**
 * Resize the canvas to full screen and make sure it looks good on retina
 * screens.
 *
 * Source:
 * https://stackoverflow.com/questions/24395076/canvas-generated-by-canvg-is-blurry-on-retina-screen
 */
const resizeCanvas = (width, height) => {
    //const pixelRatio = window.devicePixelRatio || 1;
    const pixelRatio = 1;

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.width = canvas.width * pixelRatio;
  canvas.height = canvas.height * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

export {
  canvas, ctx, resizeCanvas,
};

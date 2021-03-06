import './spin-images.scss';
import { Direction } from '../../utilities/axis';
import { Touch$Next, Touch$ } from '../../api/touch';

function setSpriteSize({
  elSprite,
  quantityFrames = 0,
}: {
  elSprite: Element;
  quantityFrames: number;
}) {
  const htmlSprite = elSprite as HTMLElement;

  // eslint-disable-next-line no-param-reassign
  htmlSprite.style.width = `${100 * quantityFrames}%`;
}

function getFramePersentSize(quantityFrames = 0) {
  return 100 / quantityFrames;
}

function activateSprite(el: Element) {
  el.classList.add('is-loaded');
}

function rotate({
  elSprite,
  rotated = 0,
}: {
  elSprite: HTMLElement;
  rotated: number;
}) {
  elSprite.style.transform = `translateX(${(-100 + rotated) % 100}%)`; // eslint-disable-line no-param-reassign
}

interface SpinImagesArgs {
  quantityFrames: number;
  el?: HTMLElement;
  autoRotateTime?: number;
  clockwise?: boolean;
  rotateOnScrollDebounce: number;
  onGrab?(): void;
  onDrop?(): void;
}

type SpinImages = (args: SpinImagesArgs) => void;

const spinImages: SpinImages = ({
  quantityFrames = 1,
  el = document.querySelector('[data-jo="spinimages"]') as HTMLElement,
  autoRotateTime = 0,
  clockwise = true,
  onGrab,
  onDrop,
  rotateOnScrollDebounce = 0,
}) => {
  if (!el) return;

  const elSprite: Element | null = el.querySelector(
    '[data-jo="spinimages-sprite"]',
  );
  let frameSize = 0;
  let rotated = 0;

  if (!quantityFrames || !el) return;

  function onSpriteLoaded(cb: () => void) {
    cb();
  }

  function rotateCounterclockwise() {
    if (!elSprite) return;

    rotated = (rotated + frameSize) % 100;
    rotate({ elSprite: elSprite as HTMLElement, rotated });
  }

  function rotateClockwise() {
    rotated = (rotated - frameSize) % 100;
    rotate({ elSprite: elSprite as HTMLElement, rotated });
  }

  function autoRotate() {
    const rotateWise = clockwise ? rotateClockwise : rotateCounterclockwise;

    setInterval(() => {
      rotateWise();
    }, autoRotateTime);
  }

  function handleGrab() {
    if (!el) return;

    el.classList.add('is-active');
    if (onGrab) onGrab();
  }

  function handleDrop() {
    if (!el) return;

    el.classList.remove('is-active');
    if (onDrop) onDrop();
  }

  onSpriteLoaded(() => {
    activateSprite(el);

    if (autoRotateTime) {
      autoRotate();
    }
  });

  setSpriteSize({ elSprite: elSprite as Element, quantityFrames });
  frameSize = getFramePersentSize(quantityFrames);

  if (!el) return;

  const touch$ = Touch$({
    el,
    gap: {
      x: rotateOnScrollDebounce,
      y: rotateOnScrollDebounce,
    },
  });

  touch$.grab$.subscribe(handleGrab);

  touch$.drop$.subscribe(handleDrop);

  touch$.drag$.subscribe((dragEvent: Touch$Next) => {
    if (
      dragEvent.direction === Direction.LEFT ||
      dragEvent.direction === Direction.DOWN_LEFT ||
      dragEvent.direction === Direction.UP_LEFT
    ) {
      rotateClockwise();
    }

    if (
      dragEvent.direction === Direction.RIGHT ||
      dragEvent.direction === Direction.DOWN_RIGHT ||
      dragEvent.direction === Direction.UP_RIGHT
    ) {
      rotateCounterclockwise();
    }
  });
};

export default spinImages;

/**
 * Karigra - Interactive Before/After Image Comparison Slider
 */

export function initImageCompareSlider(containerEl) {
  if (!containerEl) return;

  const afterEl = containerEl.querySelector('.image-compare-after');
  const sliderEl = containerEl.querySelector('.image-compare-slider');
  const handleEl = containerEl.querySelector('.image-compare-handle');

  if (!afterEl || !sliderEl) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = containerEl.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    if (pos < 0.05) pos = 0.05;
    if (pos > 0.95) pos = 0.95;

    const percentage = pos * 100;
    afterEl.style.width = `${percentage}%`;
    sliderEl.style.left = `${percentage}%`;
  }

  function onPointerDown(e) {
    isDragging = true;
    containerEl.classList.add('dragging');
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  }

  function onPointerUp() {
    isDragging = false;
    containerEl.classList.remove('dragging');
  }

  // Mouse & Touch events
  containerEl.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  containerEl.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Set initial 50% split
  afterEl.style.width = '50%';
  sliderEl.style.left = '50%';
}

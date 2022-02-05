
class SlidesViewer extends Component {

  constructor(viewerId, slidesData) {
    super();
    this.viewerId = viewerId;
    this.slidesData = slidesData;
    this.numSlides = 6; // XXX: Update
    this.currentSlideIdx = 0;
    this.tutorialActive = true;

    this.sliderProgress = 0.0;
    this.mouseSliderOffset = null;

    // References
    this.overlayPrev = null;
    this.overlayNext = null;

    this.slideImgs = [];

    this.slider = null;
    this.sliderTrack = null;
    this.progressText = null;
  }

  getSliderRect() {
    return this.slider.getBoundingClientRect();
  }

  getSliderTrackRect() {
    return this.sliderTrack.getBoundingClientRect();
  }

  calculateSliderProgress() {
    let sliderRect = this.getSliderRect();
    let trackRect = this.getSliderTrackRect();
    let sliderTrackOffset = sliderRect.left - trackRect.left;
    let trackWidth = trackRect.right - trackRect.left;
    let sliderWidth = sliderRect.right - sliderRect.left;
    let progress = Math.min(
      1.0,
      Math.max(0.0, sliderTrackOffset / (trackWidth - sliderWidth))
    );
    return progress;
  }

  calculateSliderOffset(mouseX) {
      let sliderRect = this.getSliderRect();
      let sliderWidth = sliderRect.right - sliderRect.left;
      let trackRect = this.getSliderTrackRect();
      let trackWidth = trackRect.right - trackRect.left;
      if (mouseX == null) {
        // Use currentSlideIdx to calculate offset.
        let spacer = (trackWidth - sliderWidth) / (this.numSlides - 1);
        return (spacer * this.currentSlideIdx);
      } else {
        // Use mouse
        let mouseTrackOffset = mouseX - trackRect.left;
        let position = mouseTrackOffset - this.mouseSliderOffset
        return Math.min(Math.max(0, position), trackWidth - sliderWidth);
      }
  }

  getMouseX(event) {
    if (event.type.toLowerCase().startsWith("mouse")) {
      return event.clientX; // XXX: Want this one???
    } else {
      return event.touches[0].clientX;
    }
  }

  onMouseDown(event) {
    let mouseX = this.getMouseX(event);
    let sliderRect = this.getSliderRect();
    this.mouseSliderOffset = mouseX - sliderRect.left;
    document.body.style.cursor = "pointer";
  }

  onMouseUp(event) {
    this.mouseSliderOffset = null;
    document.body.style.cursor = "default";
  }

  onMouseMove(event) {
    if (this.mouseSliderOffset !== null) {
      this.hideUITutorial();

      // Move slider
      let mouseX = this.getMouseX(event);
      let sliderTrackOffset = this.calculateSliderOffset(mouseX);
      this.updateSliderPosition(sliderTrackOffset);

      // Update progress
      this.sliderProgress = this.calculateSliderProgress();

      // Handle progress update
      this.onProgressUpdate();
    }
  }

  updateSliderPosition(sliderTrackOffset) {
      this.slider.style.marginLeft = sliderTrackOffset + 'px';
  }

  onProgressUpdate() {
    let slideIdx = Math.floor(Math.min(0.999, this.sliderProgress) * this.numSlides);
    if (this.currentSlideIdx !== slideIdx) {
      this.swapSlide(slideIdx);
    }
    this.currentSlideIdx = slideIdx;
    this.updateProgressText();
  }

  swapSlide(toShowIdx) {
    this.slideImgs[toShowIdx].classList.remove("hidden");
    this.slideImgs[this.currentSlideIdx].classList.add("hidden");
  }

  updateProgressText() {
    this.progressText.innerHTML = (this.currentSlideIdx + 1) + " of " + this.numSlides;
  }

  nextSlide() {
    this.hideUITutorial();

    let prevSlideIdx = this.currentSlideIdx;
    if ((this.currentSlideIdx + 1) <= (this.numSlides - 1)) {
      this.currentSlideIdx = this.currentSlideIdx + 1;
      this.slideImgs[this.currentSlideIdx].classList.remove("hidden");
      this.slideImgs[prevSlideIdx].classList.add("hidden");
    }

    // Update progress
    this.sliderProgress = this.currentSlideIdx / (this.numSlides - 1.0);

    // Move slider (will use position)
    let sliderTrackOffset = this.calculateSliderOffset();
    this.updateSliderPosition(sliderTrackOffset);

    // Update progress text
    this.updateProgressText()
  }

  hideUITutorial() {
    if (this.tutorialActive === true) {
      let leftEl = document.querySelector(".hit-l .indicator-container")
      leftEl.classList.add("hidden");

      let rightEl = document.querySelector(".hit-r .indicator-container")
      rightEl.classList.add("hidden");
    }
  }

  prevSlide() {
    this.hideUITutorial();

    let prevSlideIdx = this.currentSlideIdx;
    if ((this.currentSlideIdx - 1) >= 0) {
      this.currentSlideIdx = this.currentSlideIdx - 1;
      this.slideImgs[this.currentSlideIdx].classList.remove("hidden");
      this.slideImgs[prevSlideIdx].classList.add("hidden");
    }
    // Update progress
    this.sliderProgress = this.currentSlideIdx / (this.numSlides - 1.0);

    // Move slider (will use position)
    let sliderTrackOffset = this.calculateSliderOffset();
    this.updateSliderPosition(sliderTrackOffset);

    // Update progress text
    this.updateProgressText()
  }

  buildViewerHitHtml() {
    let html = '\n' +
    '<div class="overlay-hit">' +
      '\n<div class="hit-l no-highlights">' +
        '\n<div class="indicator-container">' +
          '\n<div class="click-next-anim">' +
            '\n<div class="pointer-frame">' +
              '\n<img src="./tap-hand.svg" class="pointer"></img>' +
            '\n</div>' +
            '\n<div class="click-frame">' +
              '\n<img src="./tap-hand-effect.svg" class="click"></img>' +
            '\n</div>' +
          '\n</div>' +
          '\n<div class="next-text">Prev</div>' +
        '\n</div>' +
      '\n</div>' +

      '\n<div class="hit-c"></div>' +

      '\n<div class="hit-r">' +
        '\n<div class="indicator-container">' +
          '\n<div class="click-next-anim">' +
            '\n<div class="pointer-frame">' +
              '\n<img src="./tap-hand.svg" class="pointer"></img>' +
            '\n</div>' +
            '\n<div class="click-frame">' +
              '\n<img src="./tap-hand-effect.svg" class="click"></img>' +
            '\n</div>' +
          '\n</div>' +
          '\n<div class="next-text">Next</div>' +
        '\n</div>' +
      '\n</div>' +
    '\n</div>';
    return html;
  }

  buildSlidesHtml() {
    /*
    <div class="slides-cont">
      <img id="slides-1-0" class="slides-slide" src="./slides-0.png"></img>
      ...
      <img id="slides-1-9" class="slides-slide hidden" src="./slides-9.png"></img>
    </div>
    */
    let img_tmpl = '<img id="slides-{{VIEWER_ID}}-{{SLIDE_ID}}" class="{{CLASS_MEMBERS}}" src="./nslides-{{SLIDE_ID}}.png"></img>'

    var html = ""
    html += '<div class="slides-cont">'
    for (var slideIdx = 0; slideIdx < this.numSlides; slideIdx++) {

      // Determine which classes
      // - Set first slide to active (non-hidden)
      var classMembers = "slides-slide hidden";
      if (slideIdx === 0) {
        classMembers = "slides-slide";
      }

      // Add Slide
      var slideImg = img_tmpl
        .replaceAll("{{VIEWER_ID}}", this.viewerId)
        .replaceAll("{{SLIDE_ID}}", slideIdx)
        .replaceAll("{{CLASS_MEMBERS}}", classMembers)
      html += '\n  ' + slideImg;
    }
    html += '\n</div>'

    return html;
  }

  buildControlsHtml() {
    let html = '' +
    '\n<div class="slidesviewer-controls">' +

      // Track bar
      '\n<div class="track-bar">' +
      '\n</div>' +


      // Slider
      '\n<div class="slider">' +
        '\n<img class="arrow left" src="./vc-pkf.svg"></img>' +
        '\n<div class="progress">' +
          '\n<div class="progress-text">1 of '+ this.numSlides + '</div>' +
        '\n</div>' +
        '\n<img class="arrow right" src="./vc-nkf.svg"></img>' +
      '\n</div>' +


    '\n</div>';
    return html;
  }

  buildHtml() {
    var html = '';

    // Vid container
    html += '\n' + '<div class="slidesviewer">';
    html += '\n' + this.buildViewerHitHtml();
    html += "\n" + this.buildSlidesHtml();
    html += "\n" + '</div>';

    // Controls container
    html += "\n" + this.buildControlsHtml();

    return html;
  }

  buildRefs() {
    let rootElId = "#" + this.rootContainerId;
    var element = null;

    // Overlay hit boxes
    // - Left
    // - Right
    // - Center (maybe?)
    // element = document.querySelector(rootElId + " "#slider-01 .controls .slider");
    // this.overlayPrev = element;
    this.overlayNext = document.querySelector(rootElId + " .overlay-hit .hit-r");
    console.assert(this.overlayNext != null);

    this.overlayPrev = document.querySelector(rootElId + " .overlay-hit .hit-l");
    console.assert(this.overlayPrev != null);

    // Slides
    // - slides 1-N
    for (var slideIdx = 0; slideIdx < this.numSlides; slideIdx++) {
      this.slideImgs.push(
        document.getElementById('slides-' + this.viewerId + '-' + slideIdx)
      );
    }
    console.log(this.slideImgs);

    // Controls UI
    // - Slider
    // - Progress Info
    this.slider = document.querySelector(rootElId + " .slidesviewer-controls .slider");
    console.assert(this.slider != null);

    this.sliderTrack = document.querySelector(rootElId + " .slidesviewer-controls");
    console.assert(this.sliderTrack != null);

    this.progressText = document.querySelector(rootElId + " .slidesviewer-controls .progress-text");
    console.assert(this.progressText != null);
    // this.sliderTrack = document.querySelector(rootElId + " .slidesviewer-controls .slider");
  }

  buildEventHandlers() {

    // Overlay Controls (hidden on top of video)
    // Next/Prev
    this.overlayNext.addEventListener('click', () => {this.nextSlide()});
    this.overlayPrev.addEventListener('click', () => {this.prevSlide()});

    // Slider controls
    this.slider.addEventListener('mousedown', (event) => {this.onMouseDown(event)});
    this.slider.addEventListener('touchstart', (event) => {this.onMouseDown(event)});

    document.addEventListener('mouseup', (event) => {this.onMouseUp(event)});
    document.addEventListener('touchend', (event) => {this.onMouseUp(event)});

    document.addEventListener('mousemove', (event) => {this.onMouseMove(event)});
    document.addEventListener('touchmove', (event) => {this.onMouseMove(event)});
  }
}

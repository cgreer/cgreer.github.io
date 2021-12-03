
class SlidesPlayer extends Component {

  constructor(playerId, numSlides, srcRoot) {
    super();

    this.playerId = playerId;
    this.numSlides = numSlides;
    this.srcRoot = srcRoot;

    this.currentIdx = 0;
    this.slideImgs = [];
    this.prevButton = null;
    this.nextButton = null;
  }

  nextSlide() {
    let prevActiveSlide = this.currentIdx;
    if ((this.currentIdx + 1) <= (this.numSlides - 1)) {
      this.currentIdx = this.currentIdx + 1;
      this.slideImgs[this.currentIdx].classList.remove("hidden");
      this.slideImgs[prevActiveSlide].classList.add("hidden");
    }
  }

  prevSlide() {
    let prevActiveSlide = this.currentIdx;
    if ((this.currentIdx - 1) >= 0) {
      this.currentIdx = this.currentIdx - 1;
      this.slideImgs[this.currentIdx].classList.remove("hidden");
      this.slideImgs[prevActiveSlide].classList.add("hidden");
    }
  }

  buildHtml() {
    /*
    <div class="slides-cont">
      <img id="slides-1-0" class="slides-slide" src="./slides-0.png"></img>
      ...
      <img id="slides-1-9" class="slides-slide hidden" src="./slides-9.png"></img>
    </div>
    <div id="slides-button-p" class="slides-button"></div>
    <div id="slides-button-n" class="slides-button"></div>
    */
    var html = ""

    let img_tmpl = '<img id="slides-{{PLAYER_ID}}-{{SLIDE_ID}}" class="{{CLASS_MEMBERS}}" src="./slides-{{SLIDE_ID}}.png"></img>'

    html += '<div class="slides-cont">'
    for (var slideIdx = 0; slideIdx < this.numSlides; slideIdx++) {

      // Determint which classes
      // - Set first slide to active (non-hidden)
      var classMembers = "slides-slide hidden";
      if (slideIdx === 0) {
        classMembers = "slides-slide";
      }

      // Add Slide
      var slideImg = img_tmpl
        .replaceAll("{{PLAYER_ID}}", this.playerId)
        .replaceAll("{{SLIDE_ID}}", slideIdx)
        .replaceAll("{{CLASS_MEMBERS}}", classMembers)
      html += '\n  ' + slideImg;
    }
    html += '\n</div>'

    // Buttons
    let pButtonTmpl = '\n<div id="slides-{{PLAYER_ID}}-button-p" class="slides-button"></div>';
    html += pButtonTmpl.replaceAll('{{PLAYER_ID}}', this.playerId);

    let nButtonTmpl = '\n<div id="slides-{{PLAYER_ID}}-button-n" class="slides-button"></div>';
    html += nButtonTmpl.replaceAll('{{PLAYER_ID}}', this.playerId);

    return html;
  }

  buildRefs() {
    this.prevButton = document.getElementById('slides-' + this.playerId + '-button-p');
    console.log("prevButton", this.prevButton);
    this.nextButton = document.getElementById('slides-' + this.playerId + '-button-n');
    console.log("nextButton", this.nextButton);

    for (var slideIdx = 0; slideIdx < this.numSlides; slideIdx++) {
      this.slideImgs.push(
        document.getElementById('slides-' + this.playerId + '-' + slideIdx)
      );
    }
  }

  buildEventHandlers() {
    this.prevButton.addEventListener('click', () => {this.prevSlide()});
    this.nextButton.addEventListener('click', () => {this.nextSlide()});
  }
}

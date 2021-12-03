
class VideoPlayer extends Component {

  constructor(playerId, videoData) {
    super();
    this.playerId = playerId;
    this.videoData = videoData;

    // this.videoEl;
    // this.videoSrc = "./media/Untitled_3.mp4";
    this.videoSrc = this.videoData.videoSrc;
  }

  pause() {
    this.videoEl.pause();
    this.playButton.classList.remove("hidden");
    this.pauseButton.classList.add("hidden");
  }

  play() {
    this.videoEl.play();
    this.playButton.classList.add("hidden");
    this.pauseButton.classList.remove("hidden");
  }

  togglePlay() {
    console.log("here");
    if (this.videoEl.paused || this.videoEl.ended) {
      this.play();
    } else {
      this.pause();
    }
  }

  updateProgress() {
    let kf = this.videoData.findKeyframe(this.videoEl.currentTime) + 1;
    let numFrames = this.videoData.keyframes.length;
    this.progressText.innerHTML = kf + " of " + numFrames;
  }

  resetVideo() {
    this.pause();
    this.videoEl.currentTime = 0.0;
  }

  nextKeyFrame() {
    this.pause();

    let currentKf = this.videoData.findKeyframe(this.videoEl.currentTime);
    let numFrames = this.videoData.keyframes.length;
    let nextKf = Math.min(currentKf + 1, numFrames - 1);
    this.videoEl.currentTime = this.videoData.keyframes[nextKf];
  }

  prevKeyFrame(video) {
    this.pause();

    let currentKf = this.videoData.findKeyframe(this.videoEl.currentTime);
    let numFrames = this.videoData.keyframes.length;
    let prevKf = Math.max(currentKf - 1, 0);
    this.videoEl.currentTime = this.videoData.keyframes[prevKf];
  }

  buildHitHtml() {
    let tmpl = '\n' +
    '<div id="vid-hit-cont-{{PLAYER_ID}}" class="vid-hit-container">' + '\n' +
      '<div id="vid-hit-pkf-{{PLAYER_ID}}" class="vid-hit-l"></div>' + '\n' +
      '<div id="vid-hit-play-{{PLAYER_ID}}" class="vid-hit-c"></div>' + '\n' +
      '<div id="vid-hit-nkf-{{PLAYER_ID}}" class="vid-hit-r"></div>' + '\n' +
    '</div>';
    let html = tmpl.replaceAll("{{PLAYER_ID}}", this.playerId);
    return html;
  }

  buildVideoHtml() {
    let tmpl = '' +
    '<video' +
      ' id="video-{{PLAYER_ID}}"' +
      ' class="aligncenter"' +
      ' width="320"' +
      ' height="210"' +
      ' preload="auto"' +
      ' loop="false"' +
      ' muted' +
      ' webkit-playsinline' +
      ' playsinline' +
    '>' +
      '\n<source src="{{VIDEO_SOURCE}}#t=0.01" type="video/mp4">' +
      '\nYour browser does not support playing videos' +
    '\n</video>';

    let html = tmpl
      .replaceAll("{{PLAYER_ID}}", this.playerId)
      .replaceAll("{{VIDEO_SOURCE}}", this.videoSrc)
    return html;
  }

  buildControlsHtml() {

    let tmpl = '' +
    '\n<div class="controls-container">' +
      '\n<div id="vc-hit-cont-{{PLAYER_ID}}" class="controls-hit-container">' +
        '\n<div id="vc-hit-restart-{{PLAYER_ID}}" class="controls-hit-l"></div>' +
        '\n<div id="vc-hit-play-{{PLAYER_ID}}" class="controls-hit-c"></div>' +
        '\n<div class="controls-hit-r">' +
          '\n<div id="vc-hit-pkf-{{PLAYER_ID}}" class="controls-hit-rl"></div>' +
          '\n<div id="vc-hit-nkf-{{PLAYER_ID}}" class="controls-hit-rr"></div>' +
        '\n</div>' +
      '\n</div>' +
      '\n<div id="vc-cont-{{PLAYER_ID}}" class="controls-ui-container">' +
        '\n<div class="controls-left">' +
          '\n<img id="vc-restart-{{PLAYER_ID}}" class="controls-restart" src="./vc-restart.svg"></img>' +
        '\n</div>' +
        '\n<div class="controls-center">' +
          '\n<img id="vc-play-{{PLAYER_ID}}" class="controls-play" src="./vc-play.svg"></img>' +
          '\n<img id="vc-pause-{{PLAYER_ID}}" class="controls-play hidden" src="./vc-pause.svg"></img>' +
        '\n</div>' +
        '\n<div class="controls-right">' +
          '\n<img id="vc-pkf-{{PLAYER_ID}}" class="controls-prev-kf" src="./vc-pkf.svg"></img>' +
          '\n<div class="controls-frame-progress">' +
            '\n<div id="vc-progress-{{PLAYER_ID}}">1 of N</div>' +
          '\n</div>' +
          '\n<img id="vc-nkf-{{PLAYER_ID}}" class="controls-next-kf" src="./vc-nkf.svg"></img>' +
        '\n</div>' +
      '\n</div>' +
    '\n</div>';
    let html = tmpl .replaceAll("{{PLAYER_ID}}", this.playerId);
    return html;
  }

  buildHtml() {
    var html = '';

    // Vid container
    html += '\n' + '<div class="video-container">';
    html += '\n' + this.buildHitHtml();
    html += "\n" + this.buildVideoHtml();
    html += "\n" + '</div>';

    // Controls container
    html += "\n" + this.buildControlsHtml();

    return html;
  }

  buildRefs() {
    console.log("building refs");
    var elId = "";

    elId = "video-" + this.playerId;
    console.log(elId);
    this.videoEl = document.getElementById(elId);
    console.log(this.videoEl);

    // Overlay hit boxes
    elId = "vid-hit-play-" + this.playerId;
    this.overlayPlay = document.getElementById(elId);
    console.log(this.overlayPlay);

    elId = "vid-hit-pkf-" + this.playerId;
    this.overlayPkf = document.getElementById(elId);

    elId = "vid-hit-nkf-" + this.playerId;
    this.overlayNkf = document.getElementById(elId);

    // Controls Hit boxes
    elId = "vc-hit-restart-" + this.playerId;
    this.controlsRestart = document.getElementById(elId);

    elId = "vc-hit-play-" + this.playerId;
    this.controlsPlay = document.getElementById(elId);

    elId = "vc-hit-pkf-" + this.playerId;
    this.controlsPkf = document.getElementById(elId);

    elId = "vc-hit-nkf-" + this.playerId;
    this.controlsNkf = document.getElementById(elId);

    // Controls UI
    elId = "vc-progress-" + this.playerId;
    this.progressText = document.getElementById(elId);

    elId = "vc-play-" + this.playerId;
    this.playButton = document.getElementById(elId);

    elId = "vc-pause-" + this.playerId;
    this.pauseButton = document.getElementById(elId);
  }

  buildEventHandlers() {

    // Vid Overlay Controls (hidden on top of video)
    this.overlayPlay.addEventListener(
      'click',
      () => {this.togglePlay()}
    );
    this.overlayNkf.addEventListener(
      'click',
      () => {this.nextKeyFrame()}
    );
    this.overlayPkf.addEventListener(
      'click',
      () => {this.prevKeyFrame()}
    );

    // Vid Controls
    this.controlsRestart.addEventListener(
      'click',
      () => {this.resetVideo()}
    );
    this.controlsPlay.addEventListener(
      'click',
      () => {this.togglePlay()}
    );
    this.controlsPkf.addEventListener(
      'click',
      () => {this.prevKeyFrame()}
    );
    this.controlsNkf.addEventListener(
      'click',
      () => {this.nextKeyFrame()}
    );

    this.videoEl.addEventListener('timeupdate', () => {this.updateProgress()});
    // this.videoEl.addEventListener('loadedmetadata', handleMetaData);
  }
}

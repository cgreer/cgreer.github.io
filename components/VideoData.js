
class VideoData {
  constructor(videoSrc, keyframes) {
    this.videoSrc = videoSrc;
    this.keyframes = keyframes;
  }

  findKeyframe(vidProgress) {
    for (let idx = 0; idx < this.keyframes.length; idx++) {
      if (vidProgress >= this.keyframes[idx]) {
        continue;
      }
      return idx - 1;
    }
    return this.keyframes.length - 1;
  }
}

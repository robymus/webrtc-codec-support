# webrtc-codec-support

Simple browser library to check if WebRTC supports the specified codecs for receiving and publishing.

Inspired by my long troubleshooting session in Firefox with disabled H.264 plugin and Firefox incorrectly reporting it as ICE communication problem.

# Install

Install with npm (`npm install webrtc-codec-support --save`) or download a prebundled package from Releases (webpack umd2 module format, includes the sdp parser library dependencies already). 

# Usage

## Codecs 

The library exports a WebrtcCodec class, with static instances for each codec it supports:

```
Video codecs:
  WebRtcCodec.VP8
  WebRtcCodec.VP9
  WebRtcCodec.H264
Audio codecs:
  WebRtcCodec.OPUS
  WebRtcCodec.ISAC
``` 

WebRTC always supports the VP8 and OPUS codecs, these are included for completeness.

## Receiving

The `isWebrtcReceiveCodecSupported`function returns a boolean Promise.

```js
isWebrtcReceiveCodecSupported(WebrtcCodec.H264).then((supported)=>{
  if (supported) console.log("H.264 supported");
});
```

## Publishing

The `isWebrtcPublishCodecSupported`function takes a pre-acquired [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object returns a boolean Promise. The MediaStream object must contain a video track if checking for video codecs, and an audio track if checking for audio codecs. It can contain both as well.

```js
navigator.mediaDevices.getUserMedia({video:true, audio:true}).then((mediaStream) => {

  isWebrtcPublishCodecSupported(mediaStream, WebrtcCodec.H264).then((supported)=>{
    if (supported) console.log("H.264 supported");
  });

});
```

# How?

When checking if receiving a codec is possible, we build a dummy minimal SDP as if coming from signaling, and ask the browser to create an answer sdp, which we parse and check if the specified codec is present in the answer.

For publishing, a media stream has to be acquired already and we simply analyze the offer SDP created by the WebRTC stack, parsing it for codecs.

# License

[Unlicense](https://unlicense.org]) - Human knowledge belongs to the world.

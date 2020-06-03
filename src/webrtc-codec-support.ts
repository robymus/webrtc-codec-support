import {toSessionJSON, toSessionSDP} from "sdp-jingle-json";

interface CodecPayload {
  channels: number,
  clockrate: number,
  id: string,
  name: string
}

/**
 * WebrtcCodec: static variables describe each supported codecs for detection
 */
class WebrtcCodec {

  static readonly VP8 = new WebrtcCodec("video", {
    channels: 1,
    clockrate: 90000,
    id: "96",
    name: "VP8"
  });

  static readonly VP9 = new WebrtcCodec("video", {
    channels: 1,
    clockrate: 90000,
    id: "100",
    name: "VP9"
  });

  static readonly H264 = new WebrtcCodec("video", {
    channels: 1,
    clockrate: 90000,
    id: "108",
    name: "H264"
  });

  static readonly OPUS = new WebrtcCodec("audio", {
    channels: 2,
    clockrate: 48000,
    id: "111",
    name: "OPUS"
  });

  static readonly ISAC = new WebrtcCodec("audio", {
    channels: 1,
    clockrate: 32000,
    id: "104",
    name: "ISAC"
  });

  private constructor(public readonly type: "audio"|"video", public readonly payload: CodecPayload ) {
  }
}

/**
 * Checks if the specified codec is supported for receiving webrtc video or audio
 *
 * Sets up a pseudo server offer, with only the specified codec, and checks if local answer covers that codec
 *
 * @param codec one of WebrtcCodec static variables
 * @return true if codec is supported
 */
async function isWebrtcReceiveCodecSupported(codec: WebrtcCodec): Promise<boolean> {
  try {
    // build offer from server with specified codec (minimal and incomplete)
    const sdpOfferDesc = {
      groups: [{ contents: [codec.type], semantics: 'BUNDLE' }],
      contents: [{
        name: codec.type,
        application: {
          applicationType: "rtp",
          media: codec.type,
          mux: true,
          payloads: [codec.payload]
        },
        transport: {
          candidates: [],
          fingerprints: [{ hash: "sha-256", setup: "actpass", value: Array(32).fill("00").join(":") }],
          pwd: "0".repeat(22),
          transportType: "iceUdp",
          ufrag: "0".repeat(8)
        }
      }]
    };
    const sdpOffer = toSessionSDP(sdpOfferDesc, { role: 'initiator', direction: 'outgoing' })

    // set up peerconnection to negotiate SDPs
    const peerConnection = new RTCPeerConnection({ 'iceServers': [] });
    await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: sdpOffer }));
    const sdpAnswer = await peerConnection.createAnswer();
    const sdpAnswerDesc = toSessionJSON(sdpAnswer.sdp, { role: 'responder', direction: 'outgoing' });

    // process answer SDP
    if (sdpAnswerDesc.contents === undefined) return false;
    for (let content of sdpAnswerDesc.contents) {
      if (content.application?.payloads === undefined) continue;
      for (let payload of content.application.payloads) {
        // check if answer payload has the same codec name - other parameters are not checked
        if (payload?.name?.toUpperCase() == codec.payload.name.toUpperCase()) return true;
      }
    }

    // if none of the contents/payloads matches the requested codec, codec is not supported
    return false;
  }
  catch (e) {
    console.warn("Can't determine if receive codec "+codec.payload.name+" is supported", e)
    return false;
  }
}

/**
 * Checks if the specified codec is supported for publishing webrtc video or audio
 *
 * This must called with a previously acquired MediaStream object.
 * Make sure that the stream has the appropriate channels (audio and/or video) for the codec decetion
 *
 * @param mediaStream a previously acquire MediaStream object
 * @param codec one of WebrtcCodec static variables
 * @return true if codec is supported
 */
async function isWebrtcPublishCodecSupported(mediaStream: MediaStream, codec: WebrtcCodec): Promise<boolean> {
  try {
    // setup peerconnection
    const peerConnection = new RTCPeerConnection({ 'iceServers': [] });
    if (codec.type == 'video') {
      for (let track of mediaStream.getVideoTracks()) {
        peerConnection.addTrack(track, mediaStream);
      }
    } else { // 'audio'
      for (let track of mediaStream.getAudioTracks()) {
        peerConnection.addTrack(track, mediaStream);
      }
    }

    const sdpOffer = await peerConnection.createOffer();
    const sdpOfferDesc = toSessionJSON(sdpOffer.sdp, { role: 'initiator', direction: 'outgoing' });

    // process offer SDP
    if (sdpOfferDesc.contents === undefined) return false;
    for (let content of sdpOfferDesc.contents) {
      if (content.application?.payloads === undefined) continue;
      for (let payload of content.application.payloads) {
        // check if answer payload has the same codec name - other parameters are not checked
        if (payload?.name?.toUpperCase() == codec.payload.name.toUpperCase()) return true;
      }
    }

    return false;
  }
  catch (e) {
    console.warn("Can't determine if publish codec "+codec.payload.name+" is supported", e)
    return false;
  }
}

export { WebrtcCodec, isWebrtcReceiveCodecSupported, isWebrtcPublishCodecSupported };

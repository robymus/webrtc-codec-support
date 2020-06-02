import {toSessionJSON, toSessionSDP} from "sdp-jingle-json";

function isWebrtcCodecSupported(codec: string): boolean {
  return toSessionJSON(codec, {}) == true;
}

export { isWebrtcCodecSupported };

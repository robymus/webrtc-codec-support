import {WebrtcCodec, isWebrtcReceiveCodecSupported} from '../src/webrtc-codec-support';
import { retry } from './retry-helper';

beforeAll(async ()=>{
  await retry(()=>page.goto('http://127.0.0.1:9999/test-receive-codec.html'), 5, 2000);
})

// H.264 is not supported in puppeteer chromium, but check for true/false nevertheless, might change in the future
test("H264", async ()=> {
  await expect(page).toMatchElement('span#h264', { text: /true|false/, timeout: 5000 });
})

test("VP8", async ()=> {
  await expect(page).toMatchElement('span#vp8', { text: 'true', timeout: 5000 });
})

test("VP9", async ()=> {
  await expect(page).toMatchElement('span#vp9', { text: 'true', timeout: 5000 });
})

test("OPUS", async ()=> {
  await expect(page).toMatchElement('span#opus', { text: 'true', timeout: 5000 });
})

// ISAC may or may not be supported (it is now, but as it's not mandatory, might change)
test("ISAC", async ()=> {
  await expect(page).toMatchElement('span#isac', { text: /true|false/, timeout: 5000 });
})

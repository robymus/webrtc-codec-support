import {WebrtcCodec, isWebrtcReceiveCodecSupported} from '../src/webrtc-codec-support';
import { retry } from './retry-helper';

beforeAll(async ()=>{
  await retry(()=>page.goto('http://127.0.0.1:9999/test-receive-codec.html'), 5, 2000);
})

// h264 may or may not be supported (in my puppeteer it is reported not supported, but in chrome it is)
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

// h264 may or may not be supported (it is now, but as it's not mandatory, might change)
test("ISAC", async ()=> {
  await expect(page).toMatchElement('span#isac', { text: /true|false/, timeout: 5000 });
})

let socket;
let sounds = {};
let mic;
let micInitialized = false;
let startTouchY = null;
let endTouchY = null;
let angle = 0;
let lastSoundPlayed = "";
let lastSoundTime = 0;
const displayDuration = 2000;
let lastTapTime = 0;
const doubleTapThreshold = 300;

function preload() {
  sounds.happy = loadSound(
    "https://cdn.glitch.global/39166237-1f12-4266-93ae-a3a76e75ce4d/happy_sound.mp3?v=1737919890082"
  );
  sounds.meh = loadSound(
    "https://cdn.glitch.global/39166237-1f12-4266-93ae-a3a76e75ce4d/meh_sound.wav?v=1737930559665"
  );
  sounds.confused = loadSound(
    "https://cdn.glitch.global/8679d99b-17a8-4630-809d-e698c1133bb9/confused_sound.mp3"
  );
  sounds.crazy = loadSound(
    "https://cdn.glitch.global/8679d99b-17a8-4630-809d-e698c1133bb9/crazy_sound.mp3"
  );
  sounds.sad = loadSound(
    "https://cdn.glitch.global/8679d99b-17a8-4630-809d-e698c1133bb9/sad_sound.mp3"
  );
}

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  background(180, 220, 255);

  // Socket.io setup
  socket = io();
  socket.on("connect", () => console.log("Connected to server"));
  socket.on("connect_error", (err) => console.error("Connection error:", err));
  socket.on("play sound", (soundName) => playSound(soundName, true));

  // Microphone setup
  mic = new p5.AudioIn();
  mic.start(
    () => { micInitialized = true; },
    (err) => { console.error("Mic error:", err); }
  );

  // Check mic volume
  setInterval(() => {
    if (micInitialized && mic.getLevel() > 0.5) playSound("confused");
  }, 100);

  // Shake detection
  setShakeThreshold(30);

  // Canvas event listeners
  let canvasElt = myCanvas.elt;
  
  canvasElt.addEventListener("touchstart", (e) => {
    // Auto-request motion permission on first interaction (iOS)
    if (typeof DeviceMotionEvent?.requestPermission === "function" && !window.motionRequested) {
      window.motionRequested = true;
      DeviceMotionEvent.requestPermission()
        .then(response => console.log("Motion permission:", response))
        .catch(console.error);
    }

    // Swipe/double-tap logic
    if (e.changedTouches?.length > 0) startTouchY = e.changedTouches[0].clientY;
    const currentTime = millis();
    if (currentTime - lastTapTime < doubleTapThreshold) playSound("meh");
    lastTapTime = currentTime;
  }, false);

  canvasElt.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  
  canvasElt.addEventListener("touchend", (e) => {
    if (e.changedTouches?.length > 0) {
      endTouchY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  }, false);
}

function draw() {
  background(50, 100, 200, 20);
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  noStroke();
  fill(255, 200, 0, 80);
  ellipse(0, 0, 200, 200);
  pop();
  angle += 0.01;

  if (millis() - lastSoundTime < displayDuration) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(lastSoundPlayed.toUpperCase() + "!", width / 2, height / 2);
  }
}

function deviceShaken() {
  sounds.crazy.setVolume(0.4);
  playSound("crazy");
}

function handleSwipe() {
  if (startTouchY === null || endTouchY === null) return;
  const dy = endTouchY - startTouchY;
  if (dy < -50) playSound("happy");
  else if (dy > 50) playSound("sad");
  startTouchY = endTouchY = null;
}

function playSound(name, isRemote = false) {
  const snd = sounds[name];
  if (!snd) return;
  if (snd.isPlaying()) snd.stop();
  snd.play();
  lastSoundPlayed = name;
  lastSoundTime = millis();
  if (!isRemote && socket?.connected) socket.emit("play sound", name);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
---
title: sketch.js
---
# Introduction

This document will walk you through the implementation of the interactive sound and motion detection features in <SwmPath>[public/sketch.js](/public/sketch.js)</SwmPath>. The purpose of this code is to create a dynamic user experience by integrating sound effects and motion-based interactions.

We will cover:

1. How sounds are preloaded and managed.
2. The setup of the canvas and socket connections.
3. The integration of microphone input and motion detection.
4. The handling of user interactions such as swipes and shakes.
5. The logic for playing sounds and displaying feedback.

# Sound management

<SwmSnippet path="/public/sketch.js" line="14">

---

The <SwmToken path="/public/sketch.js" pos="14:2:2" line-data="function preload() {">`preload`</SwmToken> function is responsible for loading the sound files. This ensures that all necessary audio assets are available before the application starts. The sounds are stored in a dictionary for easy access.

```
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
```

---

</SwmSnippet>

# Canvas and socket setup

<SwmSnippet path="/public/sketch.js" line="32">

---

In the <SwmToken path="/public/sketch.js" pos="32:2:2" line-data="function setup() {">`setup`</SwmToken> function, we initialize the canvas and establish a connection to the server using [Socket.io](http://Socket.io). This allows the application to communicate with a server for real-time interactions.

```
function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  background(180, 220, 255);

  // Socket.io setup
  socket = io();
  socket.on("connect", () => console.log("Connected to server"));
  socket.on("connect_error", (err) => console.error("Connection error:", err));
  socket.on("play sound", (soundName) => playSound(soundName, true));
```

---

</SwmSnippet>

# Microphone input

<SwmSnippet path="/public/sketch.js" line="42">

---

The microphone is initialized to capture audio input from the user. This is crucial for detecting sound levels and triggering actions based on audio input.

```
  // Microphone setup
  mic = new p5.AudioIn();
  mic.start(
    () => { micInitialized = true; },
    (err) => { console.error("Mic error:", err); }
  );
```

---

</SwmSnippet>

# Microphone volume check

<SwmSnippet path="/public/sketch.js" line="49">

---

A periodic check is set up to monitor the microphone's volume level. If the volume exceeds a certain threshold, a specific sound is played. This feature adds an interactive element based on the user's environment.

```
  // Check mic volume
  setInterval(() => {
    if (micInitialized && mic.getLevel() > 0.5) playSound("confused");
  }, 100);
```

---

</SwmSnippet>

# Motion and touch event handling

<SwmSnippet path="/public/sketch.js" line="54">

---

Motion detection and touch events are set up to enhance user interaction. The code listens for touch events and requests motion permissions if necessary, particularly for <SwmToken path="/public/sketch.js" pos="61:18:18" line-data="    // Auto-request motion permission on first interaction (iOS)">`iOS`</SwmToken> devices.

```
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
```

---

</SwmSnippet>

# Swipe and <SwmToken path="/public/sketch.js" pos="69:5:7" line-data="    // Swipe/double-tap logic">`double-tap`</SwmToken> logic

<SwmSnippet path="/public/sketch.js" line="69">

---

The logic for detecting swipes and double-taps is implemented to trigger different sounds. This allows users to interact with the application through gestures.

```
    // Swipe/double-tap logic
    if (e.changedTouches?.length > 0) startTouchY = e.changedTouches[0].clientY;
    const currentTime = millis();
    if (currentTime - lastTapTime < doubleTapThreshold) playSound("meh");
    lastTapTime = currentTime;
```

---

</SwmSnippet>

# Touch event listeners

<SwmSnippet path="/public/sketch.js" line="74">

---

Additional touch event listeners are added to handle the end of touch interactions and prevent default behaviors. This ensures that the application responds correctly to user gestures.

```
  }, false);

  canvasElt.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  
  canvasElt.addEventListener("touchend", (e) => {
    if (e.changedTouches?.length > 0) {
      endTouchY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  }, false);
}
```

---

</SwmSnippet>

# Visual feedback

<SwmSnippet path="/public/sketch.js" line="86">

---

The <SwmToken path="/public/sketch.js" pos="86:2:2" line-data="function draw() {">`draw`</SwmToken> function provides visual feedback by updating the canvas with animations and displaying the name of the last sound played. This enhances the user experience by providing a visual cue for audio interactions.

```
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
```

---

</SwmSnippet>

# Shake and swipe handling

<SwmSnippet path="/public/sketch.js" line="105">

---

Functions are defined to handle device shakes and swipes. These functions determine the type of interaction and play the corresponding sound, adding another layer of interactivity.

```
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
```

---

</SwmSnippet>

# Sound playback logic

<SwmSnippet path="/public/sketch.js" line="118">

---

The <SwmToken path="/public/sketch.js" pos="40:18:18" line-data="  socket.on(&quot;play sound&quot;, (soundName) =&gt; playSound(soundName, true));">`playSound`</SwmToken> function manages the playback of sounds. It checks if a sound is already playing, stops it if necessary, and plays the requested sound. It also handles remote sound playback via the socket connection.

```
function playSound(name, isRemote = false) {
  const snd = sounds[name];
  if (!snd) return;
  if (snd.isPlaying()) snd.stop();
  snd.play();
  lastSoundPlayed = name;
  lastSoundTime = millis();
  if (!isRemote && socket?.connected) socket.emit("play sound", name);
}
```

---

</SwmSnippet>

# Canvas resizing

<SwmSnippet path="/public/sketch.js" line="128">

---

The <SwmToken path="/public/sketch.js" pos="128:2:2" line-data="function windowResized() {">`windowResized`</SwmToken> function ensures that the canvas adjusts to changes in the window size, maintaining the layout and functionality across different screen dimensions.

```
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBR2xpdGNoU2hha2UlM0ElM0FGVEZTQQ==" repo-name="GlitchShake"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>

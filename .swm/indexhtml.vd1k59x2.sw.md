---
title: Index.html
---
# Introduction

This document will walk you through the structure and design decisions made in the <SwmPath>[public/index.html](/public/index.html)</SwmPath> file for the Gesture Sound App. The purpose of this file is to set up the basic HTML structure and include necessary scripts and styles for the app's functionality and user interface.

We will cover:

1. Why specific external libraries are included.
2. The purpose of the UI panel and its elements.
3. How the HTML structure supports the app's functionality.

# Including external libraries

The HTML file includes several external libraries via script tags. These libraries are crucial for the app's functionality:

<SwmSnippet path="/public/index.html" line="1">

---

- <SwmToken path="/public/index.html" pos="6:19:21" line-data="    &lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.js&quot;&gt;&lt;/script&gt;">`p5.js`</SwmToken> and <SwmToken path="/public/index.html" pos="7:31:33" line-data="    &lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/addons/p5.sound.min.js&quot;&gt;&lt;/script&gt;">`p5.sound`</SwmToken>: These are used for creative coding and sound manipulation, which are core to the app's gesture-based sound interactions.
- [**Socket.io**](http://Socket.io): This library facilitates real-time, bidirectional communication between the client and server, essential for handling gesture inputs.
- **Font Awesome**: Provides icons used in the UI to visually represent gestures.

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Gesture Sound App</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/addons/p5.sound.min.js"></script>
    <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
    <script src="sketch.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/js/all.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; overflow: hidden; }
      #defaultCanvas0 { position: absolute; top: 0; left: 0; z-index: 0; }
      .ui-panel {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 300px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        padding: 20px;
        z-index: 1;
      }
      .ui-panel h1 { font-size: 1.25rem; margin-bottom: 0.75rem; }
      .ui-panel p { margin-bottom: 0.5rem; }
      .gestures-list { list-style: none; margin: 0.5rem 0 1rem; padding: 0; }
      .gestures-list li { margin: 0.25rem 0; display: flex; align-items: center; }
      .gestures-list li i { margin-right: 0.5rem; color: #444; }
```

---

</SwmSnippet>

# UI panel and its elements

<SwmSnippet path="/public/index.html" line="31">

---

The UI panel is a key component of the user interface, providing users with a guide to the available gestures and their corresponding sound effects. This panel is styled to be visually distinct and informative.

```
    </style>
  </head>
  <body>
    <div class="ui-panel">
      <h1>Gesture Sound App</h1>
      <p>Try these gestures:</p>
      <ul class="gestures-list">
        <li><i class="fa-solid fa-arrow-up"></i> Swipe Up → Happy</li>
        <li><i class="fa-solid fa-arrow-down"></i> Swipe Down → Sad</li>
        <li><i class="fa-solid fa-wave-square"></i> Shake → Crazy</li>
        <li><i class="fa-solid fa-microphone"></i> Make Noise → Confused</li>
        <li><i class="fa-solid fa-hand-point-up"></i> Double Tap → Meh</li>
      </ul>
    </div>
```

---

</SwmSnippet>

# HTML structure

<SwmSnippet path="/public/index.html" line="45">

---

The HTML structure is straightforward, with a focus on embedding the necessary scripts and defining the UI panel. This setup ensures that the app is ready to handle gesture inputs and display the corresponding sound effects to the user.

```
  </body>
</html> 
```

---

</SwmSnippet>

By organizing the HTML in this manner, the app efficiently loads the required resources and presents a user-friendly interface for interacting with gesture-based sound effects.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBR2xpdGNoU2hha2UlM0ElM0FGVEZTQQ==" repo-name="GlitchShake"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>

# ImagePanZoom
Simple pan/zoom solution for Images in HTML.It works for <b>desktop, mobile devices and hybrid application(Both and Android, IOS)</b>. It adds events listeners for mouse scroll, pan in desktop and for touch related event in mobile device:
* JavaScript API for control of pan and zoom behavior

It works cross-browser. 

Demos
-----
Add and remove pan functionality from Image by click on div:
* [Add and remove pan functionality](https://samantachinmoy.github.io/ImagePanZoom/)

How To Use
----------

Reference the [ImageMove.js file] from your HTML document. 
Then call the init method:

```js
var imgMove = new ImageMove("container", "image");
```

First argument to function should be Id of Image Container Element and second argument to function should be Id of Image Element .

Now for adding pan functionality in image :

```js
imgMove.addPanEvents();
```
Now to remove pan functionality from image :

```js
imgMove.removePanEvents();
```
Supported Browsers
------------------
* Chrome
* Firefox
* Safari
* Opera
* Internet Explorer 8+ 

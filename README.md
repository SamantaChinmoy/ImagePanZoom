# ImagePanZoom
Simple pan/zoom solution for Images in HTML. It adds events listeners for mouse scroll, pan, plus it optionally offers:
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

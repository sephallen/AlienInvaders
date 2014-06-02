Feeling Invaders
================
It's like Space Invaders,  but with feelings.
---------------------------------------------

How many misunderstood aliens have needlessly died at the hands of the human race while they attempted to visit us and show off their lovely missiles? Too many.

Until now, the alien visitors didn't even have a voice, but thanks to the fine folks over at http://wefeelfine.org their last words can seen for all when they are being murdered.
At least now, we humans may feel a slight bit of guilt when we take away a loved Father, Mother, child alien from its family.

Technical stuffs
----------------

This game uses feelings from the API over at http://wefeelfine.org
Because of the JavaScript CORS "Cross Origin Request Security" model (http://www.w3.org/wiki/CORS_Enabled), I am unable to get data from the API live, to work around this I have cached a sample of 1500 feelings in a text file. If the game was hosted on a live server, it should be trivial to update this text file periodically using PHP or node.js.
However, as this game is designed to be ran locally, another problem arises. JavaScript is also unable to access local files from the users, machine without permission. To work around this the files can be uploaded to a webserver, or hosted on a local server such as MAMP, WAMP, LAMP etc, node.js or my personal favourite due to simplicity, Python.

If you have Python installed on your machine, fire up a terminal, `cd` to the game directory and type `python -m SimpleHTTPServer` then point your browser to `localhost:8000` and play!

Original README from forked project
-----------------------------------

A Simple HTML5 Game To-be used in a Tutorial

Slides up at:
http://www.slideshare.net/cykod/html5-game-development-introduction-5815787
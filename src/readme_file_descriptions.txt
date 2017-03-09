DESCRIPTION OF FILES

ximpel.js -- maybe touch
This file defines the main ximpel namespace. Every property/method directly attached to the ximpel object is globally accessible because the ximpel object stored in a global variable.

XimpelApp.js -- don't touch
XimpelApp is the main object to create XIMPEL players. For each XIMPEL player that you want to add on your page you create an instance of XimpelApp. This object can load playlist and config files from the server, then ask the parser to parse the XML documents and create a playlist that plays the PlaylistModel anc ConfigModel that the parser produced. So XimpelApp manages everything to start the player. When it has started the Player() object does everything.

XimpelAppView.js
The XimpelAppView object creates the main XIMPEL elements (such ass the appElement, a wrapper element, the player element, the controls element, control buttons, etc.). It draws these elements based on the XimpelApp model which contains all information needed to do this.

Architecture Player Overview:
SequencePlayer  --calls--> MediaPlayer
ParallelPlayer  --calls--> MediaPlayer n times
MediaPlayer     --calls--> Custom Media Type (e.g. Terminal.js)
    Including presentational elements

MediaPlayer The MediaPlayer object plays one single media definition. A media definition specifies a media item that is to be played including all the presentational elements (overlays, questions, etc.) that are to be shown during the playback of that media item. All the information of a media definition is stored within a MediaModel.
The MediaPlayer uses a MediaModel to determine what to play and which presentational elements to show at which times. The MediaPlayer can play different media types (images, videos, etc) by creating an instance of a media type and then tell that instance to start playing. For example if a MediaModel indicates that a video is to be played, then the MediaPlayer will create an instance of the Video media type and tell that instance to start playing. The MediaPlayer also makes sure other presentational elements are shown at the right time. It shows and hides overlays at the correct time and it uses a QuestionManager object to display questions at the appropriate time.
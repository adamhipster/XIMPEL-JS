DESCRIPTION OF FILES

ximpel.js -- maybe touch
This file defines the main ximpel namespace. Every property/method directly attached to the ximpel object is globally accessible because the ximpel object stored in a global variable.

XimpelApp.js -- don't touch
XimpelApp is the main object to create XIMPEL players. For each XIMPEL player that you want to add on your page you create an instance of XimpelApp. This object can load playlist and config files from the server, then ask the parser to parse the XML documents and create a playlist that plays the PlaylistModel anc ConfigModel that the parser produced. So XimpelApp manages everything to start the player. When it has started the Player() object does everything.

XimpelAppView.js
The XimpelAppView object creates the main XIMPEL elements (such ass the appElement, a wrapper element, the player element, the controls element, control buttons, etc.). It draws these elements based on the XimpelApp model which contains all information needed to do this.

Models.js
PlaylistModel
SubjectModel
SequenceModel
ParallelModel
MediaModel
QuestionListModel
QuestionModel
QuestionOptionModel
VariableModifierModel
ConditionModel
LeadsToModel
OverlayModel
ConfigModel
CustomElementModel
XimpelAppModel

Architecture Player Overview:
SequencePlayer  --calls--> MediaPlayer
ParallelPlayer  --calls--> MediaPlayer n times
MediaPlayer     --calls--> Custom Media Type (e.g. Terminal.js)
    Including presentational elements

Example: SequencePlayer --> MediaPlayer --> Terminal.js or Video.js
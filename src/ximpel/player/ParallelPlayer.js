//Under construction! -- Melvin

// ParallelPlayer
// The XIMPEL Player plays subjects and each subject has a SequenceModel which contains
// the list of things that need to be played (videos, audio, etc.) The SequencePlayer
// plays this SequenceModel. It makes sure that each item is played one after another.
// ############################################################################

//To create:
//parallelplayer, parallelmodel (note: already scaffold in Models.js)

ximpel.ParallelPlayer = function( player, parallelModel ){
	// The ParallelPlayer uses and is used by the Player() object and as such it has a reference to it and all of the Player()'s data.
	this.player = player;

	// // The sequence players used that are nested in parallel model.
	this.sequencePlayers = [];

	// This will contain the parallel model that is being played by the parallel player.
	this.parallelModel = null;

	// This will hold the model that is currently being played. note that this can either be a mediaModel or a sequenceModel.
	this.currentModel = null;

	// PubSub is used to subscribe callback functions for specific events and to publish those events to the subscribers.
	this.pubSub = new ximpel.PubSub();

	// Initialize the sequence player's state to the stopped state.
	this.state = this.STATE_STOPPED;

	if( parallelModel ){
		this.use( parallelModel, true );
	}
};

ximpel.ParallelPlayer.prototype.EVENT_PARALLEL_END = 'EVENT_PARALLEL_END';
ximpel.ParallelPlayer.prototype.STATE_PLAYING = 'state_pp_playing';
ximpel.ParallelPlayer.prototype.STATE_PAUSED = 'state_pp_paused';
ximpel.ParallelPlayer.prototype.STATE_STOPPED = 'state_pp_stopped';


// The use() method can be called to start using the given sequenceModel. This resets the entire SequencePlayer and will then
// use the new sequence model for playback.
ximpel.ParallelPlayer.prototype.use = function( parallelModel, preventReset ){
	// Reset this sequence player to its starting state from where it can start playing the sequence model again. If the preventReset argument
	// is set to true then the reset is not done, this can be used when you know the sequence player is in its default state already.
	if( !preventReset ){
		this.reset();
	}

	this.parallelModel = parallelModel;
}



// The reset function resets the sequence player into the start state from where it can start playing a sequence model again.
// After this method the sequence player has no visual elements displayed anymore. Ie. Its media player and parallel player are stopped.
ximpel.ParallelPlayer.prototype.reset = function( clearRegisteredEventHandlers ){
	this.state = this.STATE_STOPPED;
	this.currentModel = null;
	for(var i = 0; i < this.sequencePlayers.length; i++){
		this.sequencePlayers[i].stop();
	}

	if( clearRegisteredEventHandlers ){
		this.clearEventHandlers(); 		// resets the pubsub of the sequence player so that all registered callbacks are unregistered.
	}
}



// Start playing the current parallel model or if one is specified as an argument then play that SequenceModel
ximpel.ParallelPlayer.prototype.play = function( parallelModel ){
	// If a parallelModel model is specified as an argument then we use it. This resets the parallelModel player, causing it to stop
	// playing whatever is is currently playing and return into a stopped state where it can start playing again.
	if( parallelModel ){
		this.use( parallelModel );
	}

	// If no parallel model is specified as an argument nor is one set at an earlier moment, then there
	// is nothing to play so give an error message and return.
	if( !this.parallelModel ){
		ximpel.error("ParallelPlayer.play(): cannot start playing because no parallel model has been specified.");
		return;
	}

	// Ignore this play() call if the sequence player is already playing (ie. is in a playing state).
	if( this.isPlaying() ){
		ximpel.warn("ParallelPlayer.play(): play() called while already playing.");
		return this;
	} 
	else if( this.isPaused() ){
		// The player is in a paused state so we just resume.
		this.resume();
		return this;
	}

	// Indicate that we are in a playing state.
	this.state = this.STATE_PLAYING;

	// Call the playback controller which will determine what to play.
	this.playbackController(parallelModel);
	return this;
}



// The playback controller decides what should be played next.
ximpel.ParallelPlayer.prototype.playbackController = function(parallelModel){
	// var itemToPlay =  this.getNextItemToPlay();

	// maybe I should also include the media tag -- melvin
	// Do I need to throw some form of event listeners?

	var amntEventsEnded = 0;
	for (var i = 0; i < parallelModel.list.length; i++) {
		var child = parallelModel.list[i];
		if(child.state === ximpel.SequencePlayer.prototype.STATE_STOPPED){
			amntEventsEnded++;
		}
		if(amntEventsEnded === parallelModel.list.length){
			return;
		}
	}


	for (var i = 0; i < parallelModel.list.length; i++) {
		var child = parallelModel.list[i];
		// we do not do any checking, but we should... we just assume it's wrapped in a sequence model.
		child.parallelModelIsParent = true;
		this.sequencePlayers[i] = new ximpel.SequencePlayer( this.player, child );
		
		this.playSequenceModel(child, i);

	}

}

ximpel.ParallelPlayer.prototype.playSequenceModel = function( sequenceModel, i ){
	this.sequencePlayers[i].play( sequenceModel );
}


// Resume playing the sequence model.
ximpel.ParallelPlayer.prototype.resume = function(){
	// Ignore this resume() call if the sequence player is already in a playing state.
	if( !this.isPaused() ){
		ximpel.warn("SequencePlayer.resume(): resume() called while not in a paused state.");
		return this;
	}

	// Tell the sequenceplayers to resume
	for(var i = 0; i < this.sequencePlayers.length; i++){
		this.sequencePlayers[i].resume();
	}

	// Indicate the sequence player is now in a playing state again.
	this.state = this.STATE_PLAYING;

	return this;
}

// Start playing a media model.
// TO DO!!! -- melvin
// ximpel.SequencePlayer.prototype.playMediaModel = function( mediaModel ){
// 	this.currentModel = mediaModel;

// 	// Apply all variable modifiers that were defined for the mediaModel that is about to be played.
// 	this.player.applyVariableModifiers( mediaModel.variableModifiers );

// 	this.mediaPlayer.play( mediaModel );
// }



// Pause the sequence player.
// Note: the SequencePlayer.pause() is also adapted to see if a parallel player exists.
ximpel.ParallelPlayer.prototype.pause = function(){
	// Ignore this pause() call if the sequence player is not in a playing state.
	if( ! this.isPlaying() ){
		ximpel.warn("SequencePlayer.pause(): pause() called while not in a playing state.");
		return this;
	}

	// Indicate that we are in a paused state.
	this.state = this.STATE_PAUSED;

	// Tell the sequence players to pause
	for(var i = 0; i < this.sequencePlayers.length; i++){
		this.sequencePlayers[i].pause();
	}

	return this;
}

// Stop the sequence player.
// Note: the SequencePlayer.stop() is also adapted to see if a parallel player exists.
ximpel.ParallelPlayer.prototype.stop = function(){
	// Ignore this stop() call if the sequence player is already in the stopped state.
	if( this.isStopped() ){
		ximpel.warn("SequencePlayer.stop(): stop() called while already in a stopped state.");
		return this;
	}

	// Indicate that we are in a stopped state.
	this.state = this.STATE_STOPPED;

	// Tell the media player to stop.
	this.reset();
	return this;
}



ximpel.ParallelPlayer.prototype.isPlaying = function(){
	return this.state === this.STATE_PLAYING;
}



ximpel.ParallelPlayer.prototype.isPaused = function(){
	return this.state === this.STATE_PAUSED;
}



ximpel.ParallelPlayer.prototype.isStopped = function(){
	return this.state === this.STATE_STOPPED;
}



// This is the method that gets called when the media player has ended and wants to give back control to the
// sequence player. Then the sequence player will decide what to do next. 
ximpel.SequencePlayer.prototype.handleMediaPlayerEnd = function(){
	this.playbackController();
}

// Add an event handler to this sequence player.
ximpel.ParallelPlayer.prototype.addEventHandler = function( event, callback ){
	this.pubSub.subscribe( event, callback );
	return this;
}



// Clear all event handlers for this sequence player.
ximpel.ParallelPlayer.prototype.clearEventHandlers = function( callback ){
	this.pubSub.reset();
	return this;
}
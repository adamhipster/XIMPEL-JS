// should be passed to the constructor function:
// - customElements - contains the child elements that were within the <image> tag in the playlist.
// - customAttributes - contains the attributes that were on the <image> tag in the playlist.
// - $parentElement - The element to which the image will be appended (the ximpel player element).
// - player - A reference to the player object, so that the media type can use functions from the player.
ximpel.mediaTypeDefinitions.TextBlock = function( customElements, customAttributes, $parentElement, player ){
	this.customElements = customElements;
	this.customAttributes = customAttributes;
	this.$attachTo = $parentElement;
	this.player = player;
	this.x = this.customAttributes.x || 'center';
	this.y = this.customAttributes.y || 'center';
	this.width = this.customAttributes.width;
	this.height = this.customAttributes.height;
	this.$rectangle = $('<div class="ximpel_textblock"></div>')
    this.$rectangle.text(this.customAttributes.text);
    if(this.customAttributes.fontsize){
        this.$rectangle.css({
            'color': this.customAttributes.fontcolor || 'black',
            'font-size': this.customAttributes.fontsize || '100px'
        })
    }
	this.state = this.STATE_STOPPED;
}
ximpel.mediaTypeDefinitions.TextBlock.prototype = new ximpel.MediaType();
ximpel.mediaTypeDefinitions.TextBlock.prototype.STATE_PLAYING = 'state_image_playing';
ximpel.mediaTypeDefinitions.TextBlock.prototype.STATE_PAUSED = 'state_image_paused';
ximpel.mediaTypeDefinitions.TextBlock.prototype.STATE_STOPPED = 'state_image_stopped';


ximpel.mediaTypeDefinitions.TextBlock.prototype.mediaPlay = function(){
	if( this.state === this.STATE_PLAYING ){
		return;
	} else if( this.state === this.STATE_PAUSED ){
		this.resumePlayback();
		return;
	}

    if(this.customAttributes.color){
        this.$rectangle.css({
            'background-color': this.customAttributes.color,
        })
    }
    else {
        this.$rectangle.css({
            'background-color': '#fff',
        })
    }
    this.calculatePositionAndDimensions()
    this.$attachTo.append( this.$rectangle );
	this.state = this.STATE_PLAYING;	
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.resumePlayback = function(){
	this.state = this.STATE_PLAYING;
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.mediaPause = function(){
	if( this.state !== this.STATE_PLAYING ){
		return;
	}
	this.state = this.STATE_PAUSED;
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.mediaStop = function(){
	if( this.state === this.STATE_STOPPED ){
		return;
	}

	this.state = this.STATE_STOPPED;

	this.$rectangle.detach();
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.mediaIsPlaying = function(){
	return this.state === this.STATE_PLAYING;
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.mediaIsPaused = function(){
	return this.state === this.STATE_PAUSED;
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.mediaIsStopped = function(){
	return this.state === this.STATE_STOPPED;
}

ximpel.mediaTypeDefinitions.TextBlock.prototype.calculatePositionAndDimensions = function(){
	var playerElementWidth = this.$attachTo.width();
	var playerElementHeight = this.$attachTo.height();

	var x = this.x === 'center' ? '0px' : this.x; 
	var y = this.y === 'center' ? '0px' : this.y;
	
	this.$rectangle.css({
		'position': 'absolute',
		'left': x,
		'top': y,
        'width': this.width,
		'height': this.height,
	});

	if( this.x === 'center' ){
		var x = Math.round( Math.abs( this.$attachTo.width() - this.$rectangle.width() ) / 2 );
	}
	if( this.y === 'center' ){
		var y = Math.round( Math.abs( this.$attachTo.height() - this.$rectangle.height() ) / 2 );
	}
	this.$rectangle.css({
		'left': x,
		'top': y
	});

}

var mediaTypeRegistrationObject = new ximpel.MediaTypeRegistration( 
	'textblock', 						
	ximpel.mediaTypeDefinitions.TextBlock, 	
	{
		'allowedAttributes': ['text', 'color', 'width','height','x','y', 'fontsize'], 
		'requiredAttributes': ['text', 'width', 'height'],	
		'allowedChildren': [],			
		'requiredChildren': []			
	}
);

ximpel.registerMediaType( mediaTypeRegistrationObject );
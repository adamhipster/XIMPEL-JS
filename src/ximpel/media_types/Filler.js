ximpel.mediaTypeDefinitions.Message = function( customEl, customAttr, $el, player ){
    this.customElements = customEl;
    this.customAttributes = customAttr;
    this.$parentElement = $el;
    this.player = player;
    this.fillerMessagePreamble = 'filler is '
    this.state = 'stopped';
}
ximpel.mediaTypeDefinitions.Message.prototype = new ximpel.MediaType();
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaPlay = function(){
    this.state = 'playing';
    console.log(this.fillerMessagePreamble + this.state);
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaPause = function(){
    this.state = 'paused';
    console.log(this.fillerMessagePreamble + this.state);
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaStop = function(){
    this.state = 'stopped';
    console.log(this.fillerMessagePreamble + this.state);
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaIsPlaying = function(){
    return this.state === 'playing';
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaIsPaused = function(){
    return this.state === 'paused';
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaIsStopped = function(){
    return this.state === 'stopped';
}
 
// Register the media type with XIMPEL
var r = new ximpel.MediaTypeRegistration('filler', ximpel.mediaTypeDefinitions.Message, {
        'allowedAttributes': [],
        'requiredAttributes': [],
        'allowedChildren': [],
        'requiredChildren': [],
} );
ximpel.registerMediaType( r );
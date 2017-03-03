ximpel.mediaTypeDefinitions.Message = function( customEl, customAttr, $el, player ){
    this.customElements = customEl;
    this.customAttributes = customAttr;
    this.$parentElement = $el;
    this.player = player;

    this.$messageSpan = $('<span></span>');
    this.$messageSpan.html( this.customAttributes.text );
    this.$messageSpan.css({
        'color': 'red',
        'font-size': '100px'
    });
  
    this.state = 'stopped';
}
ximpel.mediaTypeDefinitions.Message.prototype = new ximpel.MediaType();
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaPlay = function(){
    this.state = 'playing';
    this.$parentElement.append( this.$messageSpan );
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaPause = function(){
    this.state = 'paused';
}
  
ximpel.mediaTypeDefinitions.Message.prototype.mediaStop = function(){
    this.state = 'stopped';
    this.$messageSpan.detach();
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
var r = new ximpel.MediaTypeRegistration('message', ximpel.mediaTypeDefinitions.Message, {
        'allowedAttributes': ['text'],
        'requiredAttributes': ['text'],
        'allowedChildren': [],
        'requiredChildren': [],
} );
ximpel.registerMediaType( r );
ximpel.mediaTypeDefinitions.Terminal = function( customEl, customAttr, $el, player ){
    this.customElements = customEl;
    this.customAttributes = customAttr;
    this.$parentElement = $el;
    this.player = player;
  
    this.$terminalSpan = $('<span></span>');
    this.$terminalSpan.html( this.customAttributes.text );
    this.$terminalSpan.css({
        'color': 'red',
        'font-size': '100px'
    });
  
    this.state = 'stopped';
}
ximpel.mediaTypeDefinitions.Terminal.prototype = new ximpel.MediaType();
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaPlay = function(){
    this.state = 'playing';
    this.$parentElement.append( this.$terminalSpan );
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaPause = function(){
    this.state = 'paused';
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaStop = function(){
    this.state = 'stopped';
    this.$terminalSpan.detach();
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaIsPlaying = function(){
    return this.state === 'playing';
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaIsPaused = function(){
    return this.state === 'paused';
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaIsStopped = function(){
    return this.state === 'stopped';
}
 
// Register the media type with XIMPEL
var r = new ximpel.MediaTypeRegistration('terminal', ximpel.mediaTypeDefinitions.Terminal, {
        'allowedAttributes': ['text'],
        'requiredAttributes': ['text'],
        'allowedChildren': [],
        'requiredChildren': [],
} );
ximpel.registerMediaType( r );
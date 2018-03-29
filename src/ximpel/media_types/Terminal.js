//Load needed libraries in only once
$.getScript("ximpel/media_types/terminal_assets/socket.io.js", function(){
    console.log('socket-io client loaded and listening.');
    
    //socket io listeners -- with global socket variable!!!
    socket = io('http://localhost:8080');

    socket.on('connect',function() {
        console.log('Client has connected to the server!');
    });
    
    socket.on('exit', function(data){
        add_content(data);
    })
    
    socket.on('message', function(data) {
        var buf = String.fromCharCode.apply(null, new Uint8Array(data));
        add_content(buf, false);
    });

    socket.on('cmd_message', function(data) {
        var buf = String.fromCharCode.apply(null, new Uint8Array(data));
        add_content(buf, true);
    });

});

function add_content(bashOutput, isCommand){
    if(isCommand === true){
        $('.terminalDiv').prepend('<p class="terminalCommand">' + bashOutput + '</p>');
    }
    else{
        $($('.terminalCommand')[0]).append('<p class="terminalOutput">' + bashOutput + '</p>');
    }
}

ximpel.mediaTypeDefinitions.Terminal = function( customEl, customAttr, $el, player ){
    this.customElements = customEl;
    this.customAttributes = customAttr;
    this.$parentElement = $el;
    this.player = player;

    this.$terminalTestText =  $('<span class="terminalText"></span>');
    this.$terminalTestText.html( this.customAttributes.text );

    this.$terminalWindow = $('<div class="terminalWrapper"> \
                                <form class="terminalForm">      \
                                &gt; <input class="terminalInput">\
                                </form> \
                                <div class="terminalDiv"></div> \
                                </div>');

    //cannot do this: this.$terminalWindow = $('<div class="terminalWrapper"></div>').load("commandline_plugin/terminal.html");

    this.$sidePanel = $('<div class="sidePanel"></div>').load("ximpel/media_types/terminal_assets/sidepanel.html", function(){
        //add new stylesheet to the document
        var link = document.createElement( "link" );
        link.href =  "ximpel/media_types/terminal_assets//custom.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen,print";
        document.getElementsByTagName( "head" )[0].appendChild( link );
    });


    //load event listener
    var input = this.$terminalWindow.find('.terminalInput');
    this.$terminalWindow.find('.terminalForm').submit(function(event){
        event.preventDefault()

        socket.send(input.val());

        //clean the prompt
        input.val(''); 

        //leave the content on the page
        return false;
    });

    //let a cursor focus on the input when the page is loaded
    input.focus();

    this.state = 'stopped';
}
ximpel.mediaTypeDefinitions.Terminal.prototype = new ximpel.MediaType();
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaPlay = function(){
    this.state = 'playing';
    this.$parentElement.append( this.$sidePanel );
    this.$parentElement.append( this.$terminalTestText );
    this.$parentElement.append( this.$terminalWindow );

    
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaPause = function(){
    this.state = 'paused';
}
  
ximpel.mediaTypeDefinitions.Terminal.prototype.mediaStop = function(){
    this.state = 'stopped';
    this.$terminalTestText.detach();
    this.$terminalWindow.detach(); 
    this.$sidePanel.detach();
    //same as remove but keeps jquery data associated with the removed elements
    //so when you click play it will appear again
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
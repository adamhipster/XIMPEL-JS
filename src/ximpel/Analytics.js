ximpel.Analytics = function(){
  this.subjectHistory = [];
}

ximpel.Analytics.prototype.addSubject = function(subject){
  this.subjectHistory.push({
    subjectId: subject.getId(),
    startTime: Date.now(),
    mouseMoves: [],
    mouseClicks: [],
    facialExpressions: []
  });
  console.log('this.subjectHistory');
  console.log(this.subjectHistory);
}

//while it captures x,y coordinates for XIMPEL. It is not aware of what
//it clicks on. It could become aware of the HTML5 thing it clicks on
//but not of the XIMPEL tag itself
ximpel.Analytics.prototype.initializeAnalyticsEventHandlers = function(){
  document.addEventListener('mousemove', this.addMouseMove.bind(this));
  document.addEventListener('click', this.addMouseClick.bind(this));
}

ximpel.Analytics.prototype.addMouseMove = function(event){
  var mouseMove = {
    x: event.clientX,
    y: event.clientY
  };
  this.subjectHistory[this.subjectHistory.length-1].mouseMoves.push(mouseMove);
}

ximpel.Analytics.prototype.addMouseClick = function(event){
  var mouseClick = {
    x: event.clientX,
    y: event.clientY
  };
  this.subjectHistory[this.subjectHistory.length-1].mouseClicks.push(mouseClick);
}
// var gatesDropped = 0;
var levelNum = 1;
var maxLevelNum = 5;
var outputResult = [];
var numbers = ["And", "Or", "Not", "Xor"];
var inputs = null;
var outputs = null;
var connections = null;
var waveSignals = null;
var waveSignalNames = null;
loadLevelInfo(loader);

function loadLevelInfo(callback){
    $.getJSON("/levels/levelsStructure.json", function(data) {

             console.log("data.Level"+levelNum+".Renderer_Connections");
             var connectionData = eval("data.Level"+levelNum+".Renderer_Connections");
             var outputData = eval("data.Level"+levelNum+".Renderer_Output");
             var inputData = eval("data.Level"+levelNum+".Renderer_Input");
             var gateData = eval("data.Level"+levelNum+".Renderer_Gates");
             var signals = eval("data.Level"+levelNum+".Renderer_Wave_Signals");
             var signalsNames = eval("data.Level"+levelNum+".Renderer_Wave_Name");
             callback(connectionData,outputData,inputData,gateData,signals,signalsNames);
    })

}  

function loader(connectionData,outputData,inputData,gateData,signals,signalsNames){
    connections = connectionData;
    console.log(connections);
    outputs = outputData;
    inputs = inputData;
    numbers = gateData;
    waveSignals = signals;
    waveSignalNames = signalsNames;

    console.log(waveSignalNames)

    $(init());
}


function init() {
    
    gatesDropped = 0;
    outputResult = []; 


    // Reset the game
    correctCards = 0;
    $('#gateStock').html('');
    $('#gateSlots').html('');
    $('#inputSignal').html('');
    $('#outputSignal').html('');
    $('#waveTypes').html('');

    function waveInput(signal,id) {
        $('<div align="left">'+id+":"+'</div>').appendTo('#waveTypes');
        $('<canvas width="400" height="40"></canvas><br><br>').data('number', "chart"+id).attr('id', "chart"+id).appendTo('#waveTypes');

        var chart = new SmoothieChart({
            interpolation: 'step',
            maxValue: 2,
            minValue: -2
        });
        var timeSeries = new TimeSeries();
        chart.addTimeSeries(timeSeries, {
            lineWidth: 2,
            strokeStyle: '#00ff00'
        });
        chart.streamTo(document.getElementById("chart"+id), 1000);

        var lowValue = 0,
            value = lowValue;

        var index = 0

        // Add points to trace out a square wave
        setInterval(function() {
            if (index == signal.length) {
                index = 0;
            }
            var t = new Date().getTime();
            timeSeries.append(t, value);
            // Toggle the value between high and low levels
            value = signal[index];
            index++;
        }, 1000);

    }

    for(var i = 0; i<waveSignalNames.length; i++){
        waveInput(waveSignals[i],waveSignalNames[i]);
            console.log(i);
    }




    for (var i = 0; i < inputs.length; i++) {
        $('<div class="inputBox">' + inputs[i] + '<br></div><br><br>').data('number', inputs[i]).attr('id', inputs[i]).appendTo('#inputSignal');
    }

    for (var i = 0; i < outputs.length; i++) {
        $('<div class="outputBox">' + outputs[i] + '</div><br><br>').data('number', outputs[i]).attr('id', outputs[i]).appendTo('#outputSignal');
    }


    for (var i = 0; i < numbers.length; i++) {
        $('<div class="gate well col-xs-4">' + numbers[i] + '</div>').data('number', numbers[i]).attr('id', 'card' + numbers[i]).appendTo('#gateStock').draggable({
            containment: '#content',
            stack: '#gateStock div',
            cursor: 'move',
            revert: true
        });
    }

    // Create the Gate slots
    for (var i = 1; i <= numbers.length; i++) {
        $('<div class="slot well">' + "Slot " + (i - 1) + '</div><br><br>').data('number', i).attr('id', "Slot" + (i - 1)).appendTo('#gateSlots').droppable({
            accept: '#gateStock div',
            hoverClass: 'hovered',
            drop: slotInteraction
        });
    }

    function connect(start, end) {
        jsPlumb.ready(function() {
            jsPlumb.connect({
                source: start,
                target: end,
                anchors: ["Right", "Left"]

            });
        });
    }

    function makeConnection(connections) {
        for (var i = 0; i < connections.length; i++) {
            connect(connections[i][0], connections[i][1]);

        }
    }

    makeConnection(connections)


}

function slotInteraction(event, ui) {
    var slotNumber = $(this).data('number');
    var gateNumber = ui.draggable.data('number');

    console.log("Slot:" + slotNumber);
    console.log("GateType:" + gateNumber);
    outputResult[slotNumber - 1] = gateNumber;


    ui.draggable.addClass('correct');
    ui.draggable.draggable('disable');
    $(this).droppable('disable');
    ui.draggable.position({
        of: $(this),
        my: 'left top',
        at: 'left top'
    });
    ui.draggable.draggable('option', 'revert', false);
    gatesDropped++;

    console.log(gatesDropped);

    if (gatesDropped == numbers.length) {
        console.log(outputResult);
        gateProcessor(outputResult,displayMessage,levelNum);
        
    }

    function displayMessage(verdict){
            console.log(verdict);
        if(verdict == true){
            
            alert("Correct")
            levelNum++;
            if(levelNum>2){
                alert("Game Over");
                window.location.href="http://localhost:8000/";
            }
            loadLevelInfo(loader);
            init();
            

        }
        else{

            alert("Incorrect")
            init();
        }

    }

}
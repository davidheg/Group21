//Gets the gate inputs/outputs from the JSON level file
function gateProcessor(gatesSelected,callback,level) {
    
        $.getJSON("/levels/levelsStructure.json", function(data) {

             var result = FPA(data,gatesSelected,level);
             callback(result);
        })
        .fail(function() {
            console.log("Error Connecting To File");
        })


    /*Foward Proprogation Algorithm. This takes the input signals
    passes them through a gate. After that it gets the returned output 
    and stores it in a dictionary. On the preceeding iterations the dictionary
    is searched if the result is from a slot.  */
    function FPA(data,gatesSelected,level) {
        var gateInSlot = gatesSelected;
        var dict = {};
        var signals = [];
        var slotType="";
        var urla = "data.Level"+level+".Slots";
        var urlb = "data.Level"+level+".Inputs";
        var urlc = "data.Level"+level+".Outputs";
        console.log(urla);
        console.log(urlb);
        console.log(urlc);

        /*Iterate through each of the slots and pass in an
        input to achieve and output*/

        $.each(eval(urla), function(k, input) {
            slotType=input.Name;
            console.log("YOYO:"+input.Name);
            $.each(input.Inputs, function(k, val) {
                $.each(eval(urlb), notFound=function(k, location) {
                    if (location.Name == val) {
                        signals.push(location.Signal);
                    }
                });
                var value = dict[val]
                signals.push(value);

            });
            var result = process(signals,gateInSlot.shift());
            console.log("Type = "+slotType+" = "+result);
            dict[slotType]=result;
            signals = [];

        });

        //Compare the output of the slots to the desired output
        var outcome = null;
        $.each(eval(urlc), function(k, output) {
            var sourceName = output.Source;
            var sourceValue = output.Signal;
            console.log("CHECKER")
            console.log(sourceName+" "+sourceValue)
            console.log(dict[sourceName].toString())
            if(dict[sourceName].toString() === sourceValue.toString()){
                if(outcome !=false){
                outcome = true;
            }
            }
            else{
                outcome = false;

            }



        });
        console.log("My:"+outcome);
        return outcome;

    }

}
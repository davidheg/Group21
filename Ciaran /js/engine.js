
function gateProcessor(gatesSelected,callback,level) {
    
        $.getJSON("/levels/levelsStructure.json", function(data) {

             var result = FPA(data,gatesSelected,level);
             callback(result);
        })
        .fail(function() {
            console.log("Error Connecting To File");
        })


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
            console.log(sourceName+" "+sourceValue)
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
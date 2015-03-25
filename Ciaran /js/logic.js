//Works out the outputs of the gates
function process(inputs, gate) {
    var result = 0;
    switch (gate) {
        case "Nor":
            result = norGate(inputs);
            break;

        case "Or":
            result = orGate(inputs);
            break;

        case "And":
            result = andGate(inputs);
            break;

        case "Not":
            result = notGate(inputs);
            break;

        case "Xor":
            result = xorGate(inputs);
            break;

        case "Nand":
            result = nandGate(inputs);
            break;

        case "Xnor":
            result = xnorGate(inputs);
            break;
    }

    return result;
}

function norGate(inputs) {
    var result = [
        []
    ];
    for (var i in inputs) {
        for (var j in inputs[i]) {
            if (i < 1) {
                result[0].push(inputs[i][j]);
            } else {
                var element = result[0].shift()
                result[0].push(element | inputs[i][j]);
            }
        }
    }
    result = notGate(result);
    return result;
}

function orGate(inputs) {
    var result = [];
    for (var i in inputs) {
        for (var j in inputs[i]) {
            if (i < 1) {
                result.push(inputs[i][j]);
            } else {
                var element = result.shift()
                result.push(element | inputs[i][j]);
            }
        }
    }
    return result;
}

function andGate(inputs) {
    var result = [];
    for (var i in inputs) {
        for (var j in inputs[i]) {
            if (i < 1) {
                result.push(inputs[i][j]);
            } else {
                var element = result.shift()
                result.push(element & inputs[i][j]);
            }
        }
    }
    return result;
}

function notGate(inputs) {
    var result = [];
    if (inputs.length > 1) {
        console.log("ERROR :: ONE INPUT EXCLUSIVELY")
    } else {
        for (var i in inputs[0]) {
            var val = parseInt(inputs[0][i])
            if (val == 1) {
                val = 0
            } else if (val === 0) {
                val = 1
            }
            result.push(val)
        }
    }
    return result;
}

function xorGate(inputs) {
    var result = [];
    for (var i in inputs) {
        for (var j in inputs[i]) {
            if (i < 1) {
                result.push(inputs[i][j]);
            } else {
                var element = result.shift()
                result.push(element ^ inputs[i][j]);
            }
        }
    }
    return result;
}

function nandGate(inputs) {
    var result = [
        []
    ];
    for (var i in inputs) {
        for (var j in inputs[i]) {
            if (i < 1) {
                result[0].push(inputs[i][j]);
            } else {
                var element = result[0].shift()
                result[0].push(element & inputs[i][j]);
            }
        }
    }
    result = notGate(result);
    return result;
}

function xnorGate(inputs) {
    var result = [
        []
    ];
    for (var i in inputs) {
        for (var j in inputs[i]) {
            if (i < 1) {
                result[0].push(inputs[i][j]);
            } else {
                var element = result[0].shift()
                result[0].push(element ^ inputs[i][j]);
            }
        }
    }
    result = notGate(result);
    return result;
}

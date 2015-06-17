var navigation = {
    stateArray:[],
    go:function(targetPage, args) {
        console.log("Read from: " + targetPage.toLowerCase().split(".")[0]);
        console.log("State object: " + this.stateArray);
        $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateArray[targetPage.toLowerCase().split(".")[0]]});
    },
    saveState:function(state) {
        console.log("Saved to: " + window.thisPage.toLowerCase().split(".")[0]);
        this.stateArray[window.thisPage.toLowerCase().split(".")[0]] = state;
    }
}
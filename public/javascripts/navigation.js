var navigation = {
    stateArray:{},
    go:function(targetPage, args) {
        $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateArray[targetPage.toLowerCase().split(".")[0]]});
    },
    saveState:function(state) {
        this.stateArray[window.thisPage.toLowerCase().split(".")[0]] = state;
    }
}
var navigation = {
    foo:"bar",
    pages:[
        "home",
        "changeInventory",
        "pullInventory",
        "editInventory",
        "addProduct",
        "editProduct",
        "deleteProduct",
        "viewProduct",
        "displayInventory",
        "preDefinedReports",
        "makeMyOwnReport",
        "audit",
        "logs",
        "addUsers",
        "deleteUsers",
        "viewUsers"
        ],
    bar:function(){
        console.log("baz");
    },
    go:function(targetPage, args) {
        //for(var page in this.pages) {
          //  if(page.toLowerCase() === targetPage.toLowerCase()) {
                $("#main_cont").load('/load/Home.html', {foo:"THIS IS A TEST AND ONLY A TEST"});
           // }
       // }
    }
}
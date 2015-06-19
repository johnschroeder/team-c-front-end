/**
 * Created by Kun on 6/18/2015.
 */

function gotoPullInventory(pid)
{
    //alert("ddddddddddddd");
    navigation.go("PullInventory.html",
        { ProductID: pid,
        //ProductName: pname,
        //TotalQuantity: ttlq,
        PreviousPage: "DisplayInventory.html"});
}

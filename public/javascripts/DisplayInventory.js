/**
 * Created by Kun on 6/18/2015.
 */

function gotoPullInventory(pid,pname,tlq)
{
    navigation.go("PullInventory.html",
        { ProductID: pid,
        ProductName: pname,
        TotalQuantity: tlq,
        PreviousPage: "DisplayInventory.html"});
}

/**
 * Created by elijah on 6/21/15.
 */
function populateByCartId(){
    $.ajax({
        url:"http://localhost:50001/Carts/GetCartsByUser/test01/",
        type:"Get",
        async:true,
        success:function(result){}
    });
    console.log(result);
}
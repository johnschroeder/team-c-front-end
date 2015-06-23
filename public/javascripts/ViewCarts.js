/**
 * Created by elijah on 6/21/15.
 */
function populateByCartId(){

    $.ajax({
        url:window.apiRoute + "/Carts/GetCartsByUser/don",
        type:"Get",
        async:true,
        success:function(result){
            var dropDownDiv = document.getelementbyID("selectDropDown");
            var dropSelect  = document.createElement("Select")
            var i;
            var cId = $.parseJSON(result);
            for(var i = 0; i < result.length; i++ ){
                var option = document.createElement("option");
                option.value = i;
                option.text = cId[i].CartID;
                dropSelect.option.add(option);
            }
            console.log(cId);
            dropDownDiv.appendChild(dropSelect);
        }
    });
}
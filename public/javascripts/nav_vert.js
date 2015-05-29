$(document).ready(function () {
    $('#nav_vert > li > button').click(function(){
        $('#nav_vert li ul').css('listStyleType', 'none');
        if ($(this).attr('class') != 'active'){
            $('#nav_vert li ul').slideUp();
            $(this).next().slideToggle();
            $('#nav_vert li button').removeClass('active');
            $(this).addClass('active');
        }

    });
});

function Home(){
    $('#main_cont').load('Home.html');
}

function ChangeIventory(){
    $('#main_cont').load('ChangeInventory.html');
}

function PullInventory(){
    $('#main_cont').text("PullInvetory");
}

function EditInventory(){
    $('#main_cont').text("EditInvetory");
}

function AddProduct(){
    $('#main_cont').text("AddProduct");
}

function EditProduct(){
    $('#main_cont').load("EditProduct.html");
}

function DeleteProduct(){
    $('#main_cont').text("DeleteProduct");
}

function ViewProducts(){
    $('#main_cont').text("ViewProducts");
}

function DisplayInventories(){
    $('#main_cont').load('DisplayInventory.html');
}

function PreDefinedReports(){
    $('#main_cont').text("PreDefinedReports");
}

function MakeMyOwnReport(){
    $('#main_cont').text("MakeMyOwnReport");
}

function Audit(){
    $('#main_cont').text("Audit");
}

function Logs(){
    $('#main_cont').text("Logs");
}

function AddUsers(){
    $('#main_cont').text("AddUsers");
}

function DeleteUsers(){
    $('#main_cont').text("DeleteUsers");
}

function ViewUsers(){
    $('#main_cont').text("ViewUsers");
}
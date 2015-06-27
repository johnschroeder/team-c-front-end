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

    $('.show-mobile-menu').on('touchend click', function (event) {

        event.preventDefault();

        var nav_vert = $('#nav_vert');

        if (nav_vert.css('display') == 'none') {
            nav_vert.css('display', 'block');
            $(this).text("^");
        }
        else {
            nav_vert.css('display', 'none');
            $(this).text("V");
        }

    });

    $('.subbutton').on('touchend click', function (event) {
        event.preventDefault();

        if ($('.show-mobile-menu').css('display') != 'none' && $('#nav_vert').css('display') != 'none')
            $('#nav_vert').css('display', 'none');
    });
});

function preventBehavior(e)
{
    e.preventDefault();
};

document.addEventListener("touchmove", preventBehavior, false);

function Home(){
    navigation.go("Home.html");
}

function loginPage() {
    navigation.go("loginForm.html");
}

function ChangeInventory() {
    navigation.go('ChangeInventory.html');
}

function PullInventory(){
    navigation.go("PullInventory.html")
}

function ViewCarts(){
    navigation.go("ViewCarts.html");
}

function EditCart() {
    navigation.go("EditCart.html")
}

function EditInventory(){
    $('#main_cont').text("EditInvetory");
}

function AddProduct(){
    $('#main_cont').text("AddProduct");
}

function EditProduct(){
    navigation.go("EditProduct.html");
}

function DeleteProduct(){
    $('#main_cont').text("DeleteProduct");
}

function ViewProducts(){
    $('#main_cont').text("ViewProducts");
}

function DisplayInventories(){
    navigation.go("DisplayInventory.html");
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
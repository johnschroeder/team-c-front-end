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

    $('#DisplayInventory').on( 'touchend click', function( event ){
        event.preventDefault();
        DisplayInventories();
    });

    $('#ViewCarts').on( 'touchend click', function( event ){
        event.preventDefault();
        ViewCarts();
    });

    $('#AddProduct').on( 'touchend click', function( event ){
        event.preventDefault();
        AddProduct();
    });

    $('#PreDefined').on( 'touchend click', function( event ){
        event.preventDefault();
        PreDefinedReports();
    });

    $('#MakeMyOwn').on( 'touchend click', function( event ){
        event.preventDefault();
        MakeMyOwnReport();
    });

    $('#Audit').on( 'touchend click', function( event ){
        event.preventDefault();
        Audit();
    });

    $('#Logs').on( 'touchend click', function( event ){
        event.preventDefault();
        Logs();
    });

    $('#AddUsers').on( 'touchend click', function( event ){
        event.preventDefault();
        AddUsers();
    });

    $('#DeleteUsers').on( 'touchend click', function( event ){
        event.preventDefault();
        DeleteUsers();
    });

    $('#ViewUsers').on( 'touchend click', function( event ){
        event.preventDefault();
        ViewUsers();
    });

    $('#login').on( 'touchend click', function( event ){
        event.preventDefault();
        loginPage();
    });

    $('.header-logo').on( 'touchend click', function( event ){
        event.preventDefault();
        Home();
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

    $('#nav_vert .action-button').on('touchend click', function (event) {
        event.preventDefault();

        if ($('.show-mobile-menu').css('display') != 'none' && $('#nav_vert').css('display') != 'none')
            $('#nav_vert').css('display', 'none');
    });
});

function preventBehavior(e)
{
    e.preventDefault();
};

function Home(){
    navigation.go("Home.html");
}

//
function CreateUser(){
    navigation.go("CreateUser.html");
}

function ViewCarts(){
    navigation.go("ViewCarts.html");
}

function AddProduct(){
    navigation.go("NewProduct.html");
}

function DisplayInventories(){
    navigation.go("DisplayInventory.html");
}

// Reports
function PreDefinedReports(){
    $('#main_cont').text("PreDefinedReports");
}

function MakeMyOwnReport(){
    $('#main_cont').text("MakeMyOwnReport");
}

// Administrator
function Audit(){
    $('#main_cont').text("Audit");
}

function Logs(){
    navigation.go("Logs.html");
}

function AdminLogs()
{
    navigation.go("AdminLogs.html");
}

function AddUsers(){
    $('#main_cont').text("AddUsers");
}

function DeleteUsers(){
    $('#main_cont').text("DeleteUsers");
}

function ViewUsers(){
    navigation.go("ManageUsers.html");
}

function loginPage() {
    navigation.go("loginForm.html");
}

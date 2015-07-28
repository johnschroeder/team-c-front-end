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


    $('#AdminLogs').on( 'touchend click', function( event ){
        event.preventDefault();
        AdminLogs();
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
    $('#logOut').on( 'touchend click', function( event ){
        event.preventDefault();
        logOutPage();
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

function getCurrentFileName(){
    var pagePathName= window.location.pathname;
    return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}

function stayOrRedirect()
{
    var stayPage = getCurrentFileName();
    if (stayPage == "")
    {
        Home();
    }
}


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

// Administrator

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
function logOutPage(){
    $("#AdminBar").addClass("hidden");
    $("#AdminLogs").addClass("hidden");
    $("#AddUsers").addClass("hidden");
    $("#DeleteUsers").addClass("hidden");
    $("#ViewUsers").addClass("hidden");
    navigation.hit("/getUserInfo", function(userName){
    navigation.hit("/Login/LogOut/" + userName.Username,function(res){
        loginPage();
        });
    });
}

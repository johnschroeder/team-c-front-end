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

    $('#ManageUsers').on( 'touchend click', function( event ){
        event.preventDefault();
        ManageUsers();
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

function logOutPage(){
    $("#AdminBar").addClass("hidden");
    $("#AdminLogs").addClass("hidden");
    $("#ManageUsers").addClass("hidden");

    navigation.get("/getUserInfo", function(err, userName){
        if(err){
            console.log(err);
        }
        else {
            navigation.get("/Login/LogOut/" + userName.Username, function (err, res) {
                if(err){
                    console.log(err);
                }
                else {
                    loginPage();
                }
            });
        }
    });
}

// Menu

function Home(){
    navigation.clearPageHistory();
    navigation.go("Home.html");
}

function CreateUser(){
    navigation.clearPageHistory();
    navigation.go("CreateUser.html");
}

function ViewCarts(){
    navigation.clearPageHistory();
    navigation.go("ViewCarts.html");
}

function AddProduct(){
    navigation.clearPageHistory();
    navigation.go("NewProduct.html");
}

function DisplayInventories(){
    navigation.clearPageHistory();
    navigation.go("DisplayInventory.html");
}

function Logs(){
    navigation.clearPageHistory();
    navigation.go("Logs.html");
}

// Administrator

function AdminLogs()
{
    navigation.clearPageHistory();
    navigation.go("AdminLogs.html");
}

function ManageUsers(){
    navigation.clearPageHistory();
    navigation.go("ManageUsers.html");
}

function loginPage() {
    navigation.clearPageHistory();
    navigation.go("loginForm.html");
}

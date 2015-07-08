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

    $('#nav_vert .action-button').on('touchend click', function (event) {
        event.preventDefault();

        if ($('.show-mobile-menu').css('display') != 'none' && $('#nav_vert').css('display') != 'none')
            $('#nav_vert').css('display', 'none');
    });

    jQuery.get(window.apiRoute+"/getUserInfo", function(result){
        jQuery('#usersName').text(function(){return result.FirstName+" "+result.LastName});
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

//
function CreateUser() {
    navigation.go("CreateUser.html");
}
function resetPassword(){
    navigation.go('ResetPassword.html');
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

function AddUsers(){
    $('#main_cont').text("AddUsers");
}

function DeleteUsers(){
    $('#main_cont').text("DeleteUsers");
}

function ViewUsers(){
    $('#main_cont').text("ViewUsers");
}

function loginPage() {
    navigation.go("loginForm.html");
}

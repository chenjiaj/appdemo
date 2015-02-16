/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-27
 * Time: 下午3:13
 */

function userLoad(){
    var loginStorage = COM.loginStorage;
    loginStorage.currentPage = '#user';
    var tocken = loginStorage.checkTocken();
    if(tocken){
        $("#user .username").html(localStorage.username);
        $(".exit").show();
    }else{
        $("#user .username").html('<a href="#login">登录</a>');
        $(".exit").hide();
    }

    $('.exit').bind("click",function(){
        loginStorage.exitLogin();
    });
}

function unuserLoad(){
    $('.exit').unbind('click');
}

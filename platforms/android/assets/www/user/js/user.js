/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-27
 * Time: 下午3:13
 */

function userLoad(){
    var loginStorage = XDJ.loginStorage;
    var tocken = loginStorage.checkTocken();
    localStorage.currentPage = '#user';

    $('.exit').bind("click",function(){
        loginStorage.exitLogin();
    });
}

function unuserLoad(){
    $('.exit').unbind('click');
}

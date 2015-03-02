/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-2
 * Time: 上午11:21
 */
function moreLoad(){
    var loginStorage = COM.loginStorage;
    loginStorage.currentPage = '#more';
    $('.exit').bind("click",function(){
        loginStorage.exitLogin();
    });
}

function unmoreLoad(){
    $('.exit').unbind('click');
}

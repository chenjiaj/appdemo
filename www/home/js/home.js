/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-30
 * Time: 下午7:10
 */
var index = null;
function homeLoad(){
    var tocken = loginStorage.checkTocken();
    index = 0;
    document.addEventListener("backbutton", onBackKeyDown, false);//注册返回事件

}

function onBackKeyDown(){//连续点击返回键，退出香道佳系统
    index ++;
    setTimeout(function(){
        index = 0;
    },2000);
    if(index == 1){
        tip('再按一次返回键退出香道佳');
    }else if(index > 1){
        navigator.app.exitApp();
    }
}

function unhomeLoad(){
    document.removeEventListener('backbutton',onBackKeyDown,false);//取消返回事件
    index = null;
}
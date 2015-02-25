/*
 * author chenjiajun
 * date 2015/1/15
 * 此js 包含以下对象
 * 1.设置app framework 默认ui样式
 * 2.loginStorage请求用户信息时需要调用的接口
 * 3.注册网络监测，当连接网络和断开网络是需要调用的函数
 * 4.COM.sendXHR  请求封装，请求前检查网络是否连接
 例如：
 COM.sendXHR(function(){
 $.ajax('http://'+XDJURL.$domainsName+'/login/index',data,function(res){
 .....
 },'json');
 });
 * 5.重写window.alert函数 使用方式与原生方式相同
 * 6.重写window.confirm函数 使用方法有变化
 例如：confirm("确定退出登录",function(){
 })
 实现  window.confirm = function(msg,done,cancel){...}
 需要传递显示的信息 点击确定调用的函数
 * 7.showLoading（）加载旋转
 * 8.tip() 弹出小提示
 *
 * */
var COM = {
    isOnline:true
};//定义全局变量，为一些对象提供外部接口

(function(){
    $(function(){
        //app入口
        var app = {
            init:function(){//初始化
                this.bindEvent();
                $.ui.animateHeaders = false;//设置头部不可动
                if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window))
                {
                    var script = document.createElement("script");
                    script.src = "/common/plugins/af.desktopBrowsers.js";
                    var tag = $("head").append(script);
                }
            },
            bindEvent:function(){
                $.ui.ready(function(){ //设置app framework 默认ui样式
                    $("#afui").get(0).className='ios7';
                }); //设置属于那种风格
            }
        };
        app.init();

        /**
         * loginStorage请求用户信息时需要调用的接口
         * 登录模块、需要用户信息请求模块
         * 当请求需要用户信息时调用，此对象，此对象提供外部接口 COM.loginStorage
         * 使用方法：
         * 1.var tocken = COM.loginStorage.checkTocken();//获取tocken
         * 2.localStorage.currentPage = '#user';//设置当前pannel的ID,若跳转值登录页后可以跳转回来,若不提供则默认goback()
         * 3.退出账号，调用XDJ.loginStorage.exitLogin()函数
         * 4.进入登录页登录时，为登录按钮绑定 COM.loginStorage.submitLogin()函数
         * **/
        var loginStorage = {
            $tocken:localStorage.tocken,
            $username:localStorage.username,
            $password:localStorage.password,
            init:function(){
                this.checkSuport();
            },
            checkSuport:function(){//检查是否支持本地存储
                if(!window.localStorage){
                    alert('您的系统不支持本地存储，无法为您保存用户信息');
                }
            },
            checkTocken:function(){//检查tocken是否存在，当请求需要发送用户信息时需要调用此函数
                if(this.$tocken && this.$tocken != 'undefined' && this.$tocken != ''){
                    return this.$tocken;
                }else if(this.$password && this.$username){
                    this.login();
                }else{
                    this.returnLoginPage();
                }
            },
            returnLoginPage:function(){//回到登录页面
                $.ui.loadContent("#login", false, false, "up");
            },
            requestFailedCallback:function(){//当需要发送用户信息的请求请求失败时调用此函数，一般是tocken失效或过期
                if(this.$password && this.$username){
                    this.login();
                }else{
                    this.returnLoginPage();
                }
            },
            getRequestData:function(){//获得请求数据
                return {
                    name:this.$username,
                    pass:this.$password
                }
            },
            login:function(){
                var _this = this;
                var data = _this.getRequestData();
                COM.sendXHR(function(){
                    var loginBtn  = $("#loginBtn");
                    if(!loginBtn.hasClass('disabled')){
                        if(!BTN.isLoading(loginBtn) || BTN.isLoading(loginBtn) == 'false'){
                            BTN.addLoading(loginBtn,'登录中','loading');
                            $.ajax({
                                type:"post",
                                dataType:'json',
                                success:function(res){
                                    BTN.removeLoading(loginBtn,'登录');
                                    if(res.code == 0){
                                        if(res.data){
                                            var tocken = res.msg;
                                            if(tocken){
                                                //localStorage.tocken = tocken;
                                                //_this.$tocken = tocken;
                                                localStorage.tocken = tocken;
                                                _this.$tocken = tocken;
                                                localStorage.password = _this.password;
                                            }
                                            if(localStorage.currentPage){//需要在请求用户接口保存当页信息
                                                $.ui.loadContent(localStorage.currentPage, false, false, "up");
                                            }else{
                                                $.ui.goBack();
                                            }
                                        }
                                    }else{
                                        alert("用户名或密码错误");
                                        _this.returnLoginPage();
                                    }
                                },
                                url:AJAXURL.$loginUrl,
                                data:data,
                                error:function(e){
                                    BTN.removeLoading($("#loginBtn"),'登录');
                                    alert("请求失败，请检查网络连接！");
                                }
                            });
                        }
                    }

                });
            },
            submitLogin:function(){
                var username = $("#loginForm").find('#username').val();
                var password = $("#loginForm").find('#password').val();
                var _this = this;
                _this.$username = username;
                _this.$password = password;
                localStorage.username = username;
                _this.login();
            },
            exitLogin:function(){
                var _this = this;
                confirm("确定退出登录",function(){
                    _this.$password = null;
                    _this.$tocken = null;
                    localStorage.removeItem("tocken");
                    localStorage.removeItem("password");
                    _this.returnLoginPage();
                })
            }
        }

        loginStorage.init();//页面加载时调用，检查是否支持本地存储

        COM.loginStorage = loginStorage;//COM.loginStorage是loginStorage的外部接口


        /**
         * 请求封装，请求前检查网络是否连接
         * **/
        COM.sendXHR=function(fun){
            if(COM.isOnline){
                fun();
            }else{
                alert("网络连接失败，请查看网络配置！");
            }
        };

        /**
         * 网络监测
         * 注册网络监测，当连接网络和断开网络是需要调用的函数
         * **/
        document.addEventListener("offline", onOffline, false);

        function onOffline() {
            alert("网络连接失败，请查看网络配置！");
            COM.isOnline = false;
        }
        document.addEventListener("online", onOnline, false);

        function onOnline() {
            if( COM.isOnline === false){
                tip('网络已经连接');
            }
            COM.isOnline = true;
        }
        /*
         function checkConnection() {
         console.log(navigator.connection);
         var networkState = navigator.connection.type;

         var states = {};
         states[Connection.UNKNOWN]  = 'Unknown connection';
         states[Connection.ETHERNET] = 'Ethernet connection';
         states[Connection.WIFI]     = 'WiFi connection';
         states[Connection.CELL_2G]  = 'Cell 2G connection';
         states[Connection.CELL_3G]  = 'Cell 3G connection';
         states[Connection.CELL_4G]  = 'Cell 4G connection';
         states[Connection.CELL]     = 'Cell generic connection';
         states[Connection.NONE]     = 'No network connection';

         alert('Connection type: ' + states[networkState]);
         }

         checkConnection();*/

        /**
         * 设置定时显示的showLoading
         *
         * **/
        window.showLoading = function(text,timer){
            $.ui.showMask(text);
            var time = timer || 2000;
            setTimeout(function(){
                $.ui.hideMask();
            },time);
        }

        /**
         * 显示提示
         * tip的样式在base.less
         * **/
        window.tip = function(text,timer){
            var div  = $('<div class="com-tip">'+text+'</div>');
            $("body").append(div);
            div.css({
                "margin-left":-div.width()/2
            });
            var time = timer || 2000;
            setTimeout(function(){
                $(div).remove();
            },time);
        }

        /**
         * 重写window.alert函数
         * 此alert依赖af提供的插件af.popup.js
         * **/
        window.alert = function(msg){
            $("#afui").popup({
                title:' ',
                message:msg,
                cancelOnly: "true",//此属性决定显示的是alert还是confirm的样式
                cancelText:"确定"
            });
        }

        /**
         * 重写window.confirm函数
         * 此alert依赖af提供的插件af.popup.js
         * **/
        window.confirm = function(msg,done,cancel){
            $("#afui").popup({
                title:" ",
                message:msg,
                cancelText:"确定",
                cancelCallback: done,
                doneText:"取消",
                doneCallback: cancel,
                cancelOnly:false,
                doneClass:'button',
                cancelClass:'button',
                onShow:function(){console.log("showing popup");},
                autoCloseDone:true, //default is true will close the popup when done is clicked.
                suppressTitle:false //Do not show the title if set to true
            });
        }


    });

})();

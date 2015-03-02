/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-2
 * Time: 下午2:07
 */
function userLoad(){
    window.userLoadObj = {
        $content:$("#user .user"),
        init:function(){
            this.renderPage();
            window.itemMark = true;
        },
        renderPage:function(){
            var _this = this;
            COM.sendXHR(function(){
                $.ui.showMask('加载中...');
                _this.$content.html('');
                _this.tocken = COM.loginStorage.checkTocken();
                if(_this.tocken){
                    $.ajax({
                        type:'get',
                        dataType:'json',
                        data:{
                            run:Math.random()
                        },
                        url:AJAXURL.$ItemDetail,
                        success:function(res){
                            $.ui.hideMask();
                            _this.successCallBack(res);
                        },
                        error:function(e){
                            $.ui.hideMask();
                            if(window.itemMark){
                                alert("请求失败，请检查网络连接！" + JSON.stringify(e));
                            }
                        }
                    });
                }else{
                    $.ui.goBack();
                }
            });
        },
        successCallBack:function(res){
            var div = '<ul class="list">'+
                '<li><span class="key">账户</span> <span class="right">zhangzhan</span></li>'+
                '<li><span class="key">姓名</span> <span class="right">张展</span></li>'+
                '<li><span class="key">邮箱</span> <span class="right">zhangzhan@163.com</span></li>'+
                '<li><span class="key">手机</span> <span class="right">13212322334</span></li>'+
            '</ul>';
            this.$content.html(div);
        }
    }
    window.userLoadObj.init()
}

function unuserLoad(){
    window.itemMark = false;
}
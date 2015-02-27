/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-26
 * Time: 下午2:33
 */

function itemWarnLoad(){
    var monitorLoad = {
        $content:$(".warn-list"),
        $itemName:$(".monwarn-wrapper .item-name"),
        $monitorName:$(".monwarn-wrapper .monitor-name"),
        itemid:window.itemID,//传递过来的参数
        monitorName:window.monitorName,//传递过来的参数
        monitorId:window.monitorId,
        itemname:window.name,//传递过来的参数
        init:function(){
            this.renderPage();
            window.itemMark = true;
        },
        renderPage:function(){//初始化页面
            var _this = this;
            _this.$itemName.html(_this.itemname);
            _this.$monitorName.html(_this.monitorName);

            //发送请求获得监控点列表
            COM.sendXHR(function(){
                $.ui.showMask('加载中...');
                _this.$content.html('');
                _this.tocken = COM.loginStorage.checkTocken();
                if(_this.itemid && _this.tocken){
                    $.ajax({
                        type:'get',
                        dataType:'json',
                        data:{
                            id:_this.itemid,
                            run:Math.random(),
                            tocken: _this.tocken,
                            monitorId:_this.monitorId
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
        successCallBack:function(res){//请求成功后调用的回调函数
            var _this = this;
            var data = res.maintainers;
            if(data.length > 0){

                for(var i = 0;i<data.length;i++){
                    var item = data[i];
                    var itemHtml ='<table>' +
                        '<tr data-monitor-id="1" data-monitor-name = "监控点名称">'+
                            '<td>最后报警时间</td>'+
                            '<td>2015-02-03</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>上报内容</td>'+
                            '<td>data uplod failed ....</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>重复次数</td>'+
                            '<td>5</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>初次报警时间</td>'+
                            '<td>2015-02-03 12:43:23</td>'+
                        '</tr>'+
                        '</table>';
                    _this.$content.append(itemHtml);
                }
            }else{
                var info = '<p class="no-item">暂无监控点，请登录web版关注' +
                    '</br>' +
                    '<a href="#" class="refresh">点击刷新</a>' +
                    '</p>';
                $(".refresh").click(function(e){
                    e.preventDefault();
                    $.ui.loadContent("#monitor",false,false,"up");
                });
                _this.$content.append(info);
            }
        }
    }
    monitorLoad.init();
}

function unitemWarnLoad(){
    window.itemMark = null;
    $(".warn-list").html('');
    $.ui.hideMask();
}
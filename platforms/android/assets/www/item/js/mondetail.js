/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-27
 * Time: 上午9:03
 */

function monDetailLoad(){
    var monDetailLoad = {
        $itemName:$(".monDetail-wrapper .item-name"),
        $smonitor:$(".monDetail-wrapper .smonitor"),
        $content:$('.monitor-Detail'),
        itemid:window.itemID,//传递过来的参数
        itemname:window.name,//传递过来的参数
        monitorId:window.monitorId,//传递过来的参数
        monitorName:window.monitorName,
        init:function(){
            window.mark = true;
            this.renderPage();
        },
        renderPage:function(){//渲染页面
            var _this = this;
            _this.$itemName.html(_this.itemname);
            _this.$smonitor.html(_this.monitorName);

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
                            if(window.mark){
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
            var _this = this;
            var div = '<table>'+
                '<tr>'+
                '<td>监控点</td>'+
                '<td>data_upload</td>'+
            '</tr>'+
                '<tr>'+
                    '<td>名称</td>'+
                    '<td>数据上传</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>监控状态</td>'+
                    '<td>监控中</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>类型</td>'+
                    '<td>直接触发</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>关注人数</td>'+
                    '<td>2</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>创建人</td>'+
                    '<td>李孟君</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>最后报警时间</td>'+
                    '<td>2015-02-04 21:01:32</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>操作</td>'+
                    '<td><a href="#item-warn">查看报警记录</a></td>'+
                '</tr>'+
            '</table>';
            _this.$content.html(div);
        }
    }

    monDetailLoad.init();
}

function unmonDetailLoad(){
    window.mark = null;
    $.ui.hideMask();
}
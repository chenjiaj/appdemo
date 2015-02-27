/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-26
 * Time: 下午2:33
 */

function monitorLoad(){
    var monitorLoad = {
        $content:$(".monitor-list"),
        $itemName:$(".monlist-wrapper .item-name"),
        $monitorText:$(".monlist-wrapper .smonitor"),
        $headTitle:$(".head-title"),
        itemid:window.itemID,//传递过来的参数
        monitorMark:window.monitorMark,//传递过来的参数
        itemname:window.name,//传递过来的参数
        init:function(){
            this.renderPage();
            window.itemMark = true;
        },
        renderPage:function(){//初始化页面
            var _this = this;
            _this.$itemName.html(_this.itemname);
            var monitorText = _this.getMonitorText();
            _this.$monitorText.html(monitorText);
            _this.$headTitle.html(monitorText);

            //发送请求获得监控点列表
            var monitorCode = _this.getSendMonitorStatus();
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
                                status:_this.getSendMonitorStatus()
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
        getMonitorText:function(){//获得页面显示文本
            if(this.monitorMark == 'all'){
                return '所有监控点';
            }else if(this.monitorMark == 'open'){
                return '已开启监控点';
            }else{
                return '24小时内报警点';
            }
        },
        getSendMonitorStatus:function(){//获得发送请求的监控状态值
            if(this.monitorMark == 'all'){
                return 0;
            }else if(this.monitorMark == 'open'){
                return 1;
            }else{
                return -1;
            }
        },
        successCallBack:function(res){//请求成功后调用的回调函数
            var _this = this;
            var data = res.maintainers;
            if(data.length > 0){
                var table = ' <table>'+
                    '<tr>'+
                        '<th>监控点</th>'+
                        '<th>名称</th>'+
                        '<th style="width: 120px">操作</th>'+
                    '</tr>';

                for(var i = 0;i<data.length;i++){
                    var item = data[i];
                    var tr = '<tr data-monitor-id="1" data-monitor-name = "监控点名称">'+
                                '<td>data_upload</td>'+
                                '<td>数据上传</td>'+
                                '<td>' +
                                    '<a href="#" class="look">查看</a>' +
                                    '&nbsp;' +
                                    '<a href="#" class="warnList">报警记录</a>' +
                                '</td>'+
                            '</tr>';
                        table += tr;
                }
                table += '</table>';
                _this.$content.html(table);
                _this.bindEvent();
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
        },
        bindEvent:function(){//请求成功后注册事件
            $(".look").click(function(e){
                e.preventDefault();
                window.monitorId = $(this).closest("tr").attr("data-monitor-id");//传递监控点ID
                window.monitorName = $(this).closest("tr").attr("data-monitor-name");//传递监控点name
                console.log(window.monitorId);
                $.ui.loadContent("#monitordetail",false,false,"up");
            });
            $(".warnList").click(function(e){
                e.preventDefault();
                window.monitorId = $(this).closest("tr").attr("data-monitor-id");//传递监控点ID
                window.monitorName = $(this).closest("tr").attr("data-monitor-name");//传递监控点name
                console.log( window.monitorId);
                $.ui.loadContent("#item-warn",false,false,"up");
            });
        }
    }
    monitorLoad.init();
}

function unmonitorLoad(){
    window.itemMark = null;
    $(".monitor-list").html('');
    $.ui.hideMask();
}
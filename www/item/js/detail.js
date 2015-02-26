/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-25
 * Time: 下午5:00
 */
function detailLoad(){
    window.itemMark = true;//设置报错信息是否显示标识，防止切换到其它页面后再弹出请求失败提醒
    var detailLoad = {
        itemid:window.itemID,
        content:$(".item-intro"),
        init:function(){
            this.renderPage();
        },
        renderPage:function(){
            var _this = this;
            COM.sendXHR(function(){
                $.ui.showMask('加载中...');
                _this.content.html('');
                _this.tocken = COM.loginStorage.checkTocken();
                if(_this.itemid && _this.tocken){
                    $.ajax({
                        type:'get',
                        dataType:'json',
                        data:{
                            id:_this.itemid,
                            run:Math.random(),
                            tocken: _this.tocken
                        },
                        url:AJAXURL.$ItemDetail,
                        success:function(res){
                            $.ui.hideMask();
                            var div = '<table class="item" data-id="'+window.itemID+'" data-name="某项目名称">'+
                                '<tr>'+
                                    '<td>项目名称</td>'+
                                    '<td class="item-name">永奥图</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td>项目负责人</td>'+
                                    '<td class="manager">张展</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td>相关人数</td>'+
                                    '<td class="manager">5</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td>ApiKey</td>'+
                                    '<td class="apikey">234sdjlvklsdf832flsdfsdfl2348fs</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td>项目简介</td>'+
                                    '<td class="intor">永奥图-App项目平台运营部设备云中心牵头项目</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td>监控点</td>'+
                                    '<td class="monitor">'+
                                        '<a href="#" class="all-monitor">监控点总数：1</a>'+
                                        '<a href="#" class="open-monitor">已开启监控点：1</a>'+
                                        '<a href="#" class="warn-monitor">24小时内报警点：1</a>'+
                                    '</td>'+
                                '</tr>'+
                            '</table>';
                            _this.content.html(div);
                            _this.bindEvent();
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
        bindEvent:function(){
            $(".all-monitor").click(function(e){
                e.preventDefault();
                window.itemID =  $(this).closest(".item").attr("data-id");//传递查询的项目ID
                window.monitorMark = 'all';
                window.name = $(this).closest(".item").attr("data-name");//传递查询的项目名称
                console.log(window.itemID,window.monitorMark,window.name);
                $.ui.loadContent("#monitor",false,false,"up");
            });

            $(".open-monitor").click(function(e){
                e.preventDefault();
                window.itemID =  $(this).closest(".item").attr("data-id");//传递查询的项目ID
                window.name = $(this).closest(".item").attr("data-name");//传递查询的项目名称
                window.monitorMark = 'open';
                console.log(window.itemID,window.monitorMark,window.name);
                $.ui.loadContent("#monitor",false,false,"up");
            });

            $(".warn-monitor").click(function(e){
                e.preventDefault();
                window.itemID =  $(this).closest(".item").attr("data-id");//传递查询的项目ID
                window.name = $(this).closest(".item").attr("data-name");//传递查询的项目名称
                window.monitorMark = 'warn';
                console.log(window.itemID,window.monitorMark,window.name);
                $.ui.loadContent("#monitor",false,false,"up");
            });
        }
    }
    detailLoad.init();
}

function undetailLoad(){
    window.itemMark = null;
    $.ui.hideMask();
}
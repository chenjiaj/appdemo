/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-2
 * Time: 上午9:03
 */

function warnLoad(){
    if(window.warnListLoadObj){
        window.warnListLoadObj.renderPage();
    }else{
        window.warnListLoadObj = {
            $content:$(".warn-list"),
            init:function(){
                this.renderPage();
                this.bindEvent();
                window.itemMark = true;
            },
            renderPage:function(){//初始化页面
                this.renderData();
            },
            renderData:function(){
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
            successCallBack:function(res){//请求成功后调用的回调函数
                var _this = this;
                var data = res.maintainers;
                if(data.length > 0){
                    var table = ' <table>'+
                        '<tr>'+
                        '<th>项目</th>'+
                        '<th>监控点</th>'+
                        '<th>名称</th>'+
                        '<th style="width:80px">操作</th>'+
                        '</tr>';

                    for(var i = 0;i<data.length;i++){
                        var item = data[i];
                        var tr = '<tr data-monitor-id="1" data-monitor-name = "监控点名称"  data-item-id ="2"  data-item-name ="项目名称">'+
                            '<td>某项目名称</td>'+
                            '<td>data_upload</td>'+
                            '<td>数据上传</td>'+
                            '<td>' +
                            '<a href="#" class="warnList">报警记录</a>' +
                            '</td>'+
                            '</tr>';
                        table += tr;
                    }
                    table += '</table>';
                    _this.$content.html(table);
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
                this.$content.on('click','.warnList',function(e){
                    e.preventDefault();
                    var the = $(this);
                    window.itemID =the.closest("tr").attr("data-monitor-id");//传递项目ID
                    window.name =the.closest("tr").attr("data-item-name");//传递项目名称
                    window.monitorId = the.closest("tr").attr("data-monitor-id");//传递监控点ID
                    window.monitorName = the.closest("tr").attr("data-monitor-name");//传递监控点name
                    console.log( window.monitorId);
                    $.ui.loadContent("#item-warn",false,false,"up");
                });
            }
        }
        window.warnListLoadObj.init();

    }

}

function unwarnLoad(){
    window.itemMark = null;
    $(".warn-list").html('');
    $.ui.hideMask();
}
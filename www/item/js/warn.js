/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-26
 * Time: 下午2:33
 */

function itemWarnLoad(){
    //如果写成局部变量来生成对象，当有外部引用时，对象不会被销毁，绑定的事件也不会被销毁，可能造成重复绑定事件，和性能问题（内存泄漏）
    if(window.WarnLoad){
        window.WarnLoad.renderData();
    }else{
        window.WarnLoad = {
            $content:$(".warn-list"),
            $info:$('.monwarn-wrapper .refresh-div'),
            $itemName:$(".monwarn-wrapper .item-name"),
            $monitorName:$(".monwarn-wrapper .monitor-name"),
            init: function(){
                this.renderData();
                this.bindEvent();
            },
            initData:function(){
                this.pageIndex = 0;
                this.sumPage = 1;
                this.sendFist = true;
                window.itemMark = true;
                this.itemid = window.itemID;//传递过来的参数
                this.monitorId = window.monitorId;//传递过来的参数
                this.itemname = window.name;//传递过来的参数
                this.monitorName = window.monitorName;
                this.$info.html("");
            },
            renderData:function(){
                this.initData();
                this.renderPage();
            },
            bindEvent:function(){
                var  _this = this;
                $.ui.ready(function () {
                    _this.myScroller = $("#item-warn").scroller();
                    _this.myScroller.addInfinite();
                    //myScroller1.addPullToRefresh();
                    _this.myScroller.runCB=true;
                    _this.myScroller.enable();
                    _this.isscroll = false;

                    $.bind(_this.myScroller, "infinite-scroll", function () {
                        var self = this;
                        $.bind(_this.myScroller, "infinite-scroll-end", function () {
                            if(!_this.isscroll){
                                _this.sendFist = false;
                                if(_this.pageIndex < _this.sumPage){
                                    _this.pageIndex ++;
                                    _this.sendRequest();

                                }
                            }

                            self.clearInfinite();
                            $.unbind(_this.myScroller, "infinite-scroll-end");
                        });
                    });
                });
            },
            renderPage:function(){//初始化页面
                var _this = this;
                _this.$itemName.html(_this.itemname);
                _this.$monitorName.html(_this.monitorName);
                _this.pageIndex=0;
                _this.$content.html('');
                _this.sendRequest();
            },
            sendRequest:function(){
                //发送请求获得监控点列表
                var _this = this;
                COM.sendXHR(function(){
                    _this.isscroll = true;
                    if(!_this.sendFist){
                        if(_this.$content.find(".refresh-div").length <=0){
                            _this.$info.html("<span class='animate-spin icon-spin5'></span>加载中...");
                        }
                    }else{
                        $.ui.showMask('加载中...');
                    }
                    _this.tocken = COM.loginStorage.checkTocken();
                    if(_this.itemid && _this.tocken){
                        $.ajax({
                            type:'get',
                            dataType:'json',
                            data:{
                                id:_this.itemid,
                                run:Math.random(),
                                tocken: _this.tocken,
                                monitorId:_this.monitorId,
                                page:_this.pageIndex
                            },
                            url:AJAXURL.$ItemDetail,
                            success:function(res){
                                _this.successCallBack(res);
                                _this.isscroll = false;
                                _this.$info.html("上拉加载新数据");
                                if(!_this.sendFist){
                                    if(_this.pageIndex >= _this.sumPage){
                                        _this.$info.html("已经到达底部");
                                    }
                                }else{
                                    $.ui.hideMask();
                                }
                            },
                            error:function(e){
                                _this.$info.html("上拉加载新数据");
                                if(_this.sendFist){
                                    $.ui.hideMask();
                                }
                                if(window.itemMark){
                                    alert("请求失败，请检查网络连接！" + JSON.stringify(e));
                                }
                                _this.isscroll = false;
                            }
                        });
                    }else{
                        $.ui.goBack();
                    }
                });
            },
            successCallBack:function(res){//请求成功后调用的回调函数
                var _this = this;
                _this.sumPage = 4;
                var data = res.maintainers;
                if(data.length > 0){
                    for(var i = 0;i<data.length;i++){
                        var item = data[i];
                        var itemHtml = '<table>' +
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
                if(!_this.sendFist){
                    _this.myScroller.scrollToBottom();
                }
            }
        }
        window.WarnLoad.init();
    }

}

function unitemWarnLoad(){
    window.itemMark = null;
    $(".warn-list").html('');
    $.ui.hideMask();
}
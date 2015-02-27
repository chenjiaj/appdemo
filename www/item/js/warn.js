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
        pageIndex:0,
        sumPage:1,
        sendFist:true,
        isscroll:false,
        init:function(){
            window.itemMark = true;
            this.renderPage();
            this.bindEvent();
        },
        bindEvent:function(){
            var  _this = this;
            var myScroller1;
            $.ui.ready(function () {
                    myScroller1 = $("#item-warn").scroller(); //Fetch the scroller from cache
                    //Since this is a App Framework UI scroller, we could also do
                    // myScroller=$.ui.scrollingDivs['webslider'];
                    myScroller1.addInfinite();
                    window.myScroller = myScroller1;
                    //myScroller1.addPullToRefresh();
                    myScroller1.runCB=true;
                    myScroller1.enable();
                    myScroller1.scrollToTop();
                    console.log(myScroller1);
                    $.bind(myScroller1, "infinite-scroll", function () {
                        var self = this;
                        console.log(this);
                        $.bind(myScroller1, "infinite-scroll-end", function () {
                            $.unbind(myScroller1, "infinite-scroll-end");
                            _this.sendFist = false;
                            if(_this.pageIndex < _this.sumPage){
                                _this.pageIndex ++;
                                _this.sendRequest();
                                self.clearInfinite();
                                self.scrollToBottom();
                            }else{
                                _this.$content.append("<p style='color: #ccc;text-align: center;'>已经到达底部</p>");
                            }

                        });
                    });
                    _this.$content.css("overflow", "auto");
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
                        _this.$content.append("<div class='refresh-div'><span class='animate-spin icon-spin5'></span>加载中...</div>");
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
                            if(!_this.sendFist){
                                $(".refresh-div").remove();
                            }else{
                                $.ui.hideMask();
                            }
                            _this.successCallBack(res);
                        },
                        error:function(e){
                            if(!_this.sendFist){
                                $(".refresh-div").remove();
                            }else{
                                $.ui.hideMask();
                            }
                            _this.isscroll = false;
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
                _this.sumPage = 4;
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
            _this.isscroll = false;
        }
    }
    monitorLoad.init();
}

function unitemWarnLoad(){
    window.itemMark = null;
    $(".warn-list").html('');
    $.ui.hideMask();
    $(".refresh-div").remove();
    window.myScroller.scrollToTop();
}
/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-30
 * Time: 下午7:10
 */
var index = null;
function homeLoad(){
    if(window.homeLoadObj){
        window.homeLoadObj.renderPage();
    }else{
        window.homeLoadObj = {
            $content:$(".home-warn-list"),
            $info:$(".home .j_info"),
            init:function(){
                this.renderPage();
                this.bindEvent();
            },
            renderPage:function(){
                index = 0;
                localStorage.currentPage = '#home';
                this.initData();
                this.renderData();
            },
            initData:function(){
                this.pageIndex = 0;
                this.sumPage = 1;
                this.sendFist = true;
                window.itemMark = true;
                this.$info.html("");
            },
            bindEvent:function(){
                document.addEventListener("backbutton", onBackKeyDown, false);//注册返回事件
                this.bindScroll();
            },
            bindScroll:function(){
                var  _this = this;
                $.ui.ready(function () {
                    _this.myScroller = $("#home").scroller();
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
                                    _this.renderData();

                                }
                            }
                            self.clearInfinite();
                            $.unbind(_this.myScroller, "infinite-scroll-end");
                        });
                    });
                });
            },
            renderData:function(){
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
                    if(_this.tocken){
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
                            '<tr">'+
                            '<td>报警时间</td>'+
                            '<td>2015-02-03</td>'+
                            '<tr>'+
                            '<td>项目</td>'+
                            '<td>永奥图-APP</td>'+
                            '<tr>'+
                            '<td>监控点</td>'+
                            '<td>data_upload(数据上传)</td>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>上报内容</td>'+
                            '<td>data uplod failed ....</td>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>项目负责人</td>'+
                            '<td>张展</td>'+
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
                    _this.$content.html(info);
                }
                if(!_this.sendFist){
                    _this.myScroller.scrollToBottom();
                }
            }
        }

        window.homeLoadObj.init();
    }
}

function onBackKeyDown(){//连续点击返回键，退出香道佳系统
    index ++;
    setTimeout(function(){
        index = 0;
    },2000);
    if(index == 1){
        tip('再按一次返回键退出监控报警系统');
    }else if(index > 1){
        navigator.app.exitApp();
    }
}

function unhomeLoad(){
    index = null;
    window.itemMark = null;
    $(".home-warn-list").html('');
    $.ui.hideMask();
}
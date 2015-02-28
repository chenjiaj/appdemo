/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-25
 * Time: 上午11:11
 */
function itemLoad(){
    window.itemMark = true;//设置报错信息是否显示标识，防止切换到其它页面后再弹出请求失败提醒

    if(window.itemLoadObj){
        window.itemLoadObj.renderPage();
    }else{
        window.itemLoadObj = {
            itemWrapper:$(".item-wrapper"),
            init:function(){
                this.renderPage();
                this.bindEvent();
            },
            renderData:function(){
                var _this= this;
                _this.tocken = COM.loginStorage.checkTocken();
                if(_this.tocken){
                    COM.sendXHR(function(){
                        var itemWrapper = _this.itemWrapper;
                        if(itemWrapper.children(".item").length>0){
                            _this.itemExist = true;
                        }
                        if(_this.itemExist && $(".refresh-div").length<=0){//判断是否已经加载过了
                            _this.div = "<div class='refresh-div'><span class='animate-spin icon-spin5'></span>更新中...</div>";
                            itemWrapper.prepend(_this.div);
                        }else{
                            itemWrapper.html('');
                            $.ui.showMask('加载中...');
                        }
                        $.ajax({
                            type:'get',
                            dataType:'json',
                            url:AJAXURL.$myItemList,
                            data:{
                                descending:true,
                                limit:10,
                                include_docs:false
                            },
                            success:function(res){
                                _this.successCallBack(res);
                            },
                            error:function(e){
                                $.ui.hideMask();
                                if(window.itemMark){
                                    alert("请求失败，请检查网络连接！" + JSON.stringify(e));
                                }

                            }
                        });
                    });
                }
            },
            renderPage:function(){
                index = 0;
                this.renderData();
                localStorage.currentPage = '#item';
            },
            successCallBack:function(res){
                var _this = this;
                var itemWrapper = _this.itemWrapper;
                $.ui.hideMask();//更新时确保已隐藏，加载时隐藏
                itemWrapper.html('');//更新时也需清空，加载时确保已清空
                var len = res.rows.length;
                if(len > 0){
                    for(var i = 0; i < len ; i++){
                        var itemData = res.rows[i];
                        itemData.name="某项目名称";
                        var item = '<div class="item" data-id="'+itemData.id+'" data-name="'+itemData.name+'">'+
                            '<h2 class="item-head">某某项目名称(负责人:xx)'+
                            '<a href="#" class="item-lookup">查看<span class="icon icon-left-open">' +
                            '</span></a>'+
                            '</h2>'+
                            '<ul class="item-body clear-fix">'+
                            '<li>'+
                            '<a href="#" class="all-monitor">'+
                            '<p class="item-body-title">监控点</br>总数</p>'+
                            '<p class="item-body-value">'+itemData.value+'</p>'+
                            '</a>'+
                            '<span class="line"></span>'+
                            '</li>'+
                            '<li>'+
                            '<a href="#" class="open-monitor">'+
                            '<p class="item-body-title">已开启</br>监控点</p>'+
                            '<p class="item-body-value">'+itemData.value+'</p>'+
                            '</a>'+
                            '<span class="line"></span>'+
                            '</li>'+
                            '<li>'+
                            '<a href="#" class="warn-monitor">'+
                            '<p class="item-body-title">24小时内</br>报警点</p>'+
                            '<p class="item-body-value warn">'+itemData.value+'</p>'+
                            '</a>'+
                            '</li>'+
                            '</ul>'+
                            '</div>'

                        itemWrapper.append(item);
                    }//for循环结束



                }else{
                    var info = '<p class="no-item">您暂时还未添加项目，请登录web端添加项目！' +
                        '</br>' +
                        '<a href="#" class="refresh">点击刷新</a>' +
                        '</p>';
                    $(".refresh").click(function(){
                        $.ui.loadContent("#item",false,false,"up");
                    });
                    _this.itemWrapper.append(info);
                }
            },
            bindEvent:function(){
                this.itemWrapper.on('click','.item-lookup',function(e){//查看项目详情
                    e.preventDefault();
                    window.itemID = $(this).closest(".item").attr("data-id");//向查看页传递查询的项目ID
                    $.ui.loadContent("#detail",false,false,"up");
                });

                this.itemWrapper.on('click','.all-monitor',function(e){
                    e.preventDefault();
                    window.itemID =  $(this).closest(".item").attr("data-id");//传递查询的项目ID
                    window.monitorMark = 'all';
                    window.name = $(this).closest(".item").attr("data-name");//传递查询的项目名称
                    console.log(window.itemID,window.monitorMark,window.name);
                    $.ui.loadContent("#monitor",false,false,"up");
                });

                this.itemWrapper.on('click','.open-monitor',function(e){
                    e.preventDefault();
                    window.itemID =  $(this).closest(".item").attr("data-id");//传递查询的项目ID
                    window.name = $(this).closest(".item").attr("data-name");//传递查询的项目名称
                    window.monitorMark = 'open';
                    console.log(window.itemID,window.monitorMark,window.name);
                    $.ui.loadContent("#monitor",false,false,"up");
                });

                this.itemWrapper.on('click','.warn-monitor',function(e){
                    e.preventDefault();
                    window.itemID =  $(this).closest(".item").attr("data-id");//传递查询的项目ID
                    window.name = $(this).closest(".item").attr("data-name");//传递查询的项目名称
                    window.monitorMark = 'warn';
                    console.log(window.itemID,window.monitorMark,window.name);
                    $.ui.loadContent("#monitor",false,false,"up");
                });
            }
        }
        window.itemLoadObj.init();
    }

}

function unitemLoad(){
    $.ui.hideMask();
    window.itemMark = null;//离开就释放内存
}
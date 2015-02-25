/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-2-25
 * Time: 上午11:11
 */
function itemLoad(){
    window.itemMark = true;//设置报错信息是否显示标识，防止切换到其它页面后再弹出请求失败提醒
    var itemLoad = {
        init:function(){
            index = 0;
            this.renderPage();
            localStorage.currentPage = '#item';
        },
        getRenderData:function(){
            var _this= this;
            _this.tocken = COM.loginStorage.checkTocken();
            if(_this.tocken){
                COM.sendXHR(function(){
                    $(".item-wrapper").html('');
                    $.ui.showMask('加载中...');
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
                            $.ui.hideMask();
                            var len = res.rows.length;
                            if(len > 0){
                                for(var i = 0; i < len ; i++){
                                    var itemData = res.rows[i];
                                    var item = '<div class="item" data-id="'+itemData.id+'">'+
                                        '<h2 class="item-head">某某项目名称(负责人:xx)'+
                                            '<a href="#" class="item-lookup">查看<span class="icon icon-left-open">' +
                                            '</span></a>'+
                                        '</h2>'+
                                        '<ul class="item-body clear-fix">'+
                                            '<li>'+
                                                '<a href="#">'+
                                                    '<p class="item-body-title">监控点</br>总数</p>'+
                                                    '<p class="item-body-value">'+itemData.value+'</p>'+
                                                '</a>'+
                                            '<span class="line"></span>'+
                                            '</li>'+
                                            '<li>'+
                                                '<a href="#">'+
                                                    '<p class="item-body-title">已开启</br>监控点</p>'+
                                                    '<p class="item-body-value">'+itemData.value+'</p>'+
                                                '</a>'+
                                            '<span class="line"></span>'+
                                            '</li>'+
                                            '<li>'+
                                                '<a href="#">'+
                                                    '<p class="item-body-title">24小时内</br>报警点</p>'+
                                                    '<p class="item-body-value warn">'+itemData.value+'</p>'+
                                                '</a>'+
                                            '</li>'+
                                        '</ul>'+
                                        '</div>'

                                    $(".item-wrapper").append(item);
                                }//for循环结束

                                $(".item-lookup").click(function(e){
                                    e.preventDefault();
                                    window.itemID = $(this).closest(".item").attr("data-id");
                                    $.ui.loadContent("#detail",false,false,"up");
                                });
                            }else{
                                var info = '<p class="no-item">您暂时还未添加项目，请登录web端添加项目！' +
                                    '</br>' +
                                    '<a href="#" class="refresh">点击刷新</a>' +
                                    '</p>';
                                $(".refresh").click(function(){
                                    $.ui.loadContent("#item",false,false,"up");
                                });
                                $(".item-wrapper").append(info);
                            }

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
            this.getRenderData();
        }
    }
    itemLoad.init();
}

function unitemLoad(){
    $.ui.hideMask();
    window.itemMark = null;//离开就释放内存
}
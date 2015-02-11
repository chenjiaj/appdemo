/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-30
 * Time: 下午2:24
 */
var BTN = null;
(function(){
   var button = {
        /**
         * addLoading form提交的时候给按钮加上laoding图标，更改按钮文字为提交状态，给$button打上正在提交的标签
         * @param $button 提交按钮
         * @param buttonContent 提交按钮的innerHTML（不包含图标）
         * @param buttonIcon 提交按钮图标 如果不传此参数则没有提交按钮。 loading：菊花按钮(目前就只有菊花按钮)
         * */
        addLoading: function($button, buttonContent, buttonIcon){
            $button.data('isloading', true);

            buttonContent && ($button.html(buttonContent));

            if(buttonIcon){
                var iconHtml = {
                    'loading': '<i class="icon-spin5 animate-spin"></i>'
                };
                if(iconHtml[buttonIcon]){
                    $(iconHtml[buttonIcon]).prependTo($button);
                }
            }
        },

        /**
         * removeLoading form提交后取消laoding图标，更改按钮文字为默认状态，取消$button正在提交的标签
         * @param $button 提交按钮
         * @param buttonContent 提交按钮的innerHTML（不包含图标）
         * @param buttonIcon 提交按钮图标 如果不传此参数则没有提交按钮。 loading：菊花按钮(目前就只有菊花按钮)
         * */
        removeLoading: function($button, buttonContent, buttonIcon){
            $button.data('isloading', false);

            buttonContent && ($button.html(buttonContent));

            if(buttonIcon){
                var iconHtml = {
                    'loading': '<i class="icon-spin5 animate-spin"></i>'
                };
                if(iconHtml[buttonIcon]){
                    $(iconHtml[buttonIcon]).prependTo($button);
                }
            }
        },
        /**
         * isLoading 是否正在提交中
         * @param $button 提交的button
         * */
        isLoading: function($button){
            return $button.data('isloading');
        }
    };
    BTN = button;
})();

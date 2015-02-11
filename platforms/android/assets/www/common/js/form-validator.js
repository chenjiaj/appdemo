/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-30
 * Time: 上午8:54
 */
function FormValidator(form){
    this.$form = form;
}
FormValidator.prototype = {
    checkall:function(){
        var index = true;
        var inputs = this.$form.find("input");
        for(var i = 0 ;i<inputs.length;i++){
            var input = inputs.eq(i);
            if(!this.checkNull(input.val())){
                index = '表单信息为填写完整' ;
            }else{
                input.removeClass('input-error');
            }
        }
        return index;
    },
    checkNull:function(value){
        if(!value || value == " "){
            return false;
        }else{
            return true;
        }
    },
    checkNum:function(value){
        return !isNaN(value);
    },
    checkTel:function(value){
        var reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
        return reg.test(value);
    },
    checkEmail:function(value){
        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
        return reg.test(value);
    },
    checkREG:function(reg,value){
        return reg.test(value);
    }
}
/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-1-27
 * Time: 下午3:52
 */
function loginLoad(){
    var loginStorage = COM.loginStorage;
    var loginBtn = $('#loginBtn');
    var form = $("#loginForm");
    var validate = new FormValidator(form);

    if(validate.checkall() !== true){
        loginBtn.addClass('disabled');
    }

    $("input").bind('keyup',function(){
        if(validate.checkall() === true){
            loginBtn.removeClass('disabled');
        }else{
            loginBtn.addClass('disabled');
        }
    });

    loginBtn.bind("click",function(){
        if(!loginBtn.hasClass('disabled')){
            loginStorage.submitLogin();
        }
    });

    var username = localStorage.username;
    if(username){
        $("#loginForm").find('#username').val(localStorage.username);
    }
}

function unloginLoad(){
    $('#loginBtn').unbind('click');
    $("input").unbind('keypress');
    $("input").not('.button').val('');
}

function registerLoad(){
    var login = {
        $form:$("#registerForm"),
        $reBtn:$('#registerBtn'),
        $pass:$("#registerForm").find("#pass"),
        $username:$("#registerForm").find("#username"),
        $repass:$("#registerForm").find('#repass'),
        $email:$("#registerForm").find('input[type="email"]'),
        $tel:$("#registerForm").find('input[type="tel"]'),
        $warn:$("#registerForm").find('.alert'),
        init:function(){
            this.$reBtn.addClass('disabled');
            this.validate = new FormValidator(this.$form);
            this.bindEvent();

        },
        bindEvent:function(){
            var _this = this;
            $("input").bind('keyup',function(){
                if(_this.validate.checkall() === true){
                    _this.$warn.addClass('hide');
                    _this.$reBtn.removeClass('disabled');
                }else{
                    _this.$reBtn.addClass('disabled');
                }
            });

            _this.$reBtn.bind("click",function(){
                if(!_this.$reBtn.hasClass('disabled')){
                        _this.submitForm();
                }
            });
        },
        submitForm:function(){
            var _this = this;
                COM.sendXHR(function(){
                    if(_this.checkForm()){
                        if(!BTN.isLoading(_this.$reBtn) || BTN.isLoading(_this.$reBtn) == 'false'){
                            BTN.addLoading(_this.$reBtn,'注册中','loading');
                            $.ajax({
                                type:"post",
                                dataType:'json',
                                success:function(res){
                                    BTN.removeLoading(_this.$reBtn,'注册');
                                    if(res.code == 0){
                                        localStorage.username = _this.$username.val();
                                        $("input").not('.button').val('');
                                        alert('注册成功');
                                        $.ui.loadContent("#login", false, false, "up");
                                    }else{
                                        alert(res.msg);
                                    }
                                },
                                url:AJAXURL.$registerUrl,
                                data:_this.$form.serialize(),
                                error:function(e){
                                    BTN.removeLoading(_this.$reBtn,'注册');
                                    alert("请求失败，请检查网络连接！");
                                }
                            });
                        }
                    }
                });
        },
        checkForm:function(){
            if(this.$pass.val() != this.$repass.val()){
                this.$pass.addClass('input-error').val('');
                this.$repass.addClass('input-error').val('');
                this.showWarn('两次密码输入不一致，请重新输入');
                return false;
            }
            if(!this.validate.checkEmail(this.$email.val())){
                this.showWarn('请输入正确的邮箱地址！',this.$email);
                return false;
            }
            if(!this.validate.checkTel(this.$tel.val())){
                this.showWarn('请输入正确的手机号码！',this.$tel);
                return false;
            }
            return true;
        },
        showWarn:function(text,input){
            this.$warn.removeClass('hide');
            this.$warn.text(text);
            if(input){
                input.addClass('input-error');
            }
        }
    }
    login.init();
}

function unregisterLoad(){
    $('#registerBtn').unbind('click');
    $("input").unbind('keyup');
    $("input").not('.button').val('');
}

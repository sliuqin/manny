/**
 * SMTP 配置
 */

var SMTP = {
    host:'smtp.qq.com',
    // optional, defaults to 25 or 465
    port:25,
    // optional, false by default
    use_authentication:true,
    // used only when use_authentication is true
    user:'sliuqin@qq.com',
    // used only when use_authentication is true
    pass:'86786q62Eb'
};

exports.SMTP = SMTP;

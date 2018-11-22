/*  
    ajax封装函数：
    1.发送请求的url
    2.async : 异步请求，ture 为异步，false为同步
    3.data: 发送的参数，格式为对象类型
    4.success： 发送是否成功，接收成功并调用回调函数
*/

function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    var xmlHttp = null;
    if (XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();
    }else{
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for( var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if(opt.method.toUpperCase() === 'POST'){
       xmlHttp.open(opt.method, opt.url, opt.async);
       xmlHttp.setRequestHeader('Content-Type','application-x-www-form-urlencoded;charset=utf-8');
       xmlHttp.send(postData);
    }
    else if(opt.method.toUpperCase() === 'GET'){
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState === 4 && xmlHttp.status === 200 ){
            opt.success(xmlHttp.responseText);
        }
    }
}

window.onload = function(){
    var s = new Date();
    for (var i = 0; i < 10000; i++) {
        var div = document.createElement('div');
        div.innerHTML = i;
        document.body.appendChild(div);
    }
    var e = new Date();
    console.log(e.getTime() - s.getTime());
}

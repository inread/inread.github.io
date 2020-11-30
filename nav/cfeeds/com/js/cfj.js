
function gotoSPathURL(e,dl){
    var path = e.getAttribute('spath');
    var a=document.createElement('A');
    a.href = path;
    var dscriptUrl = dl?'feed://dscript/?url='+a.href : 'feed://olscript/?url='+a.href ;
    location.href=dscriptUrl;
}
function gotoDScriptURL(e){
    gotoSPathURL(e,true);
}
function gotoOLScriptURL(e){
    gotoSPathURL(e,false);
}
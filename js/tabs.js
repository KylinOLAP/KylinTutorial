function inputTab() {
    var tab = event.srcElement;
    var str = "(";
    //alert(tab.textContent);
    var index = tab.textContent.indexOf(str);
    //var input = "";
    //alert(index);
    if (index !== -1) {
        index--;
        input = tab.textContent.substring(0,index);
    } else {
        input = tab.textContent;
    }
    //alert(input);
    var queryarea = document.getElementById("queryarea");
    insertAtCursor(queryarea, input);
    //queryarea.value += input;
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
    }
    //MOZILLA/NETSCAPE support 
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        // save scrollTop before insert
        var restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
        if (restoreTop > 0) {
            myField.scrollTop = restoreTop;
        }
        myField.focus();
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
        myField.focus();
    }
} 
'use strict';

window.onload = function(){
    var storage = {};
    var stor = true;
    var timer;
    var lineNum = 0;
    var theList = document.getElementById('theList');
    
    //var clearBtn = document.getElementById('clear');
    //var jotBtn = document.getElementById('jBtn');
    
    //var appBtn = document.getElementById('appBtn');

    //used for testing 
    // storage = {
    //     '0': 'youtu.be/link',
    //     '1': '#hexcode'
    // };
    // localStorage.setItem('list', JSON.stringify(storage));
    
    

    // find storage or set to nothing in order to render
    if (localStorage && localStorage.getItem('list')) {
        storage = JSON.parse(localStorage.getItem('list'));
    }
    else {
        storage = {
            '0': ''
        };
        stor = false;
    }

    // remove original div in html
    // var arr = theList.getElementsByTagName('div');
    // arr[0].parentNode.removeChild(arr[0]);


    // helper that returns a left button element
    function createBtn() {
        var btn = document.createElement('i');
        btn.setAttribute('id', 'left');
        btn.setAttribute('class', 'left icon-right-open-big');

        return btn;
    }

    // helper that returns a editable text element
    function createTxt(line) {
        var txt = document.createElement('div');
        txt.setAttribute('id', line);
        txt.setAttribute('contentEditable', true);
        txt.setAttribute('class', 'txt');

        return txt;
    }


    // loop through storage and render each line approriately
    var length = Object.keys(storage).length;

    console.info('storage length: '+length);

    for(var i=0; i <= length; i++) {
        var div = document.createElement('div');
        div.setAttribute('id', lineNum);
        var btn = createBtn(lineNum);
        var txt = createTxt(lineNum);

        // create last line
        if (i === length) {
            if(stor) {
                div.setAttribute('class', 'last');
                div.addEventListener('click', function(){
                    div.setAttribute('class', '');
                    console.info('this is the function within the loop');
                });
                txt.appendChild(document.createTextNode(''));
            } else {
                break;
            }
        } else {
            txt.appendChild(document.createTextNode(storage[i]));
        }

        div.appendChild(btn);
        div.appendChild(txt);
        theList.appendChild(div);
        lineNum++;
    }



   
    

    // returns ALL divs in the 'input' div
    var divArray = theList.getElementsByTagName('div');

    // creates new array without btns and txt to loop through
    var containerArray = [];
    var len = divArray.length / 2;
    for(var j = 0; j < len; j++) {
        containerArray[j] = divArray[j * 2];
    }

    // functions for button and text box features
    function addBtnListener(btn, txt) {
        // hover listeners
        btn.addEventListener('mouseover', function() {
            txt.style.color = 'rgba(255, 255, 255, 0.3)';
            txt.style.textShadow = '0 0 0';

        });
        btn.addEventListener('mouseout', function() {
            txt.style.color = '#fff';
            txt.style.textShadow = '0px 1px 5px rgba(0,0,0,0.2)';
        });

        // click to select text listener
        btn.addEventListener('click', function() {
            //focusAtEnd(txt);
            selectText(txt);
        });
    }

    // creates a new line when enter is hit
    function addTxtListener(el) {
        el.addEventListener('keypress', function(e){
            var key = e.which || e.keyCode;
            // <enter> key code
            if (key === 13) {
                if (el.innerText !== '') {
                    var div = document.createElement('div');
                    div.setAttribute('id', lineNum);
                    var btn = createBtn();
                    var txt = createTxt(lineNum);
                    div.appendChild(btn);
                    div.appendChild(txt);

                    var newDiv = el.parentNode.appendChild(div);
                    var newTxt = newDiv.getElementsByClassName('txt')[0];
                    var newBtn = newDiv.getElementsByClassName('left icon-right-open-big')[0];
                    addBtnListener(newBtn, newTxt);
                    addTxtListener(newTxt);

                    newTxt.focus();
                    e.preventDefault();
                    lineNum++;
                } else {
                    e.preventDefault();
                }
            }

        });

        // setting functionality of the backspace key
        el.addEventListener('keydown', function(e){
            var key = e.which || e.keyCode;
            // <backspace> key code
            if (key === 8) {
                var div = el.parentNode;
                var txt = div.getElementsByClassName('txt')[0];
                // var btn = div.getElementsByClassName('left icon-right-open-big')[0];
                var text = txt.innerText;

                // if the current line is blank, delete it and put focus on 
                // previous element
                if(text === '' || text === null){
                    e.preventDefault();
                    var arr = div.parentNode.getElementsByTagName('div');
                    
                    // filter out only 'txt' div's
                    // can't use .filter on a nodeList
                    var txtArr = [];
                    var j = 0;
                    for(var i = 0; i <= arr.length - 1; i++) {
                        if (arr[i].className === 'txt') {
                            txtArr[j] = arr[i];
                            j++;
                        }
                    }

                    // find current row and focus on previous one
                    var lcv = 0;
                    while (txtArr[lcv].innerText !== text) {
                        lcv++;
                    }
                    
                    focusAtEnd(txtArr[lcv - 1]);

                    div.parentNode.removeChild(div);
                    lineNum--;
                }

            }
        });
    }


    // the following few functions are to set listeners for 
    // elements already in storage
    function setBtnListener (element) {
        var curr = element.getElementsByClassName('left icon-right-open-big')[0];
        var txt = element.getElementsByClassName('txt')[0];

        addBtnListener(curr, txt);
    }

    function setTxtListener (element) {
        var txt = element.getElementsByClassName('txt')[0];
        addTxtListener(txt);
    }

    containerArray.forEach(setBtnListener);
    containerArray.forEach(setTxtListener);


    // timer used so that storage isnt reset on every keystroke
    theList.addEventListener('keyup', function(){
        resetTimer();
    });

    // clear & reset storage set timer
    function resetTimer(){
        clearTimeout(timer);
        timer = setTimeout(setStorage, 250);
    }

    // loop through each line and add it to the storage
    function setStorage(){
        var newArray = [];
        var j = 0;

        // get an array of just the txt elements
        var array = theList.getElementsByTagName('div');
        for(var i = 0; i < array.length; i+=2) {
            newArray[j++] = array[i + 1];
        }

        // reset and refill storage
        console.log('storage is happening, new array length: '+newArray.length);
        storage = {};
        for(var x=0, y=0; x < newArray.length; x++) {
            var text = newArray[x].innerText;
            if (text !== '\n' && text !== '' && text !== ' '){
                storage[y] = text;
                y++;
            }
        }
        
        localStorage.setItem('list', JSON.stringify(storage));
    }

    // move cursor to end of the given element
    function focusAtEnd(el) {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
    }

    // select text in an element
    function selectText(el) {
        var range,
            selection;
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(el);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(el);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    // set background
    // var n = Math.floor((Math.random() * 45) + 1);
    // document.body.style.backgroundImage = 'url('bg/'+n+'.jpg')';

    // appBtn.addEventListener('click', function(){
    //     chrome.tabs.update({
    //         url:'chrome://apps'
    //     });
    // });

    
};
var IconView = (function() {
  'use strict';

  function IconView (options) {
    this.eventList  = [];
    this.selected = null;
    this.count = 0;
    this.container = options.container || 'iconView'; //object|objectId>
    this.containerWidth = options.containerWidth || 300; // in pixels
    this.containerHeight = options.containerHeight || 300; // in pixels
    this.itemWidth = options.itemWidth || 30; // outer size - in pixels
    this.itemHeight = options.itemHeight || 25; // outer size - in pixels
    this.items = options.items || [];
    this.events = {
      click_item: function(item) {
        if (this.isSelected(item)) {
          this.uncheckItems([item.id]);
        }else{
          this.checkItems([item.id]);
        }
        console.log(this.count);
      },
      click_btnDelete: function(e){
        this.removeItems(this.deleteList());
        console.log(this.count);
      },
      click_btnSelected: function(e){
        this.selectedOrClear();
        console.log(this.count);
      },
      scroll_iconView: function(e){
        var scrollTop     = e.target.scrollTop,
            height        = e.target.offsetHeight,
            scrollHeight  = e.target.scrollHeight;

         if ((scrollTop + height) >= scrollHeight)
          this.renderItems();
      }
    };
  };

  IconView.prototype.setChecked = function(){
    for (var i = this.items.length - 1; i >= 0; i--) {
      this.items[i].checked = !this.selected;
      var el = document.getElementById(this.items[i].id);
      if(!this.selected) {
        addClass(el, "selected");
      }else{
        removeClass(el, "selected");
      }
    };
    this.selected = false;
  };

  IconView.prototype.selectedOrClear = function(){
    for (var i = this.items.length - 1; i >= 0; i--) {
      if ( this.isSelected(this.items[i])){
        this.selected = true;
        break;
      };
    };
    this.setChecked();
  };

  IconView.prototype.deleteList = function() {
     var del =[];
      for (var i = this.items.length - 1; i >= 0; i--) {
        if ( this.isSelected(this.items[i]) ) 
          del.push(this.items[i].id);
      };
      return del;
  };

  IconView.prototype.removeItems = function (itemIds) {
    if (Object.prototype.toString.call(itemIds) === '[object Array]') {
      itemIds.forEach(function(id) {
        for (var i = 0; i < this.items.length; i++) {
          if(this.items[i].id == id){ 
            this.items.splice( i , 1); 
            i--;
            this.container.removeChild(document.getElementById(id));
            this.count--;
          }
        };
      }, this);
    }
  };

  IconView.prototype.checkItems = function (itemIds){
    var el;
    itemIds.forEach(function(i) {      
      el = document.getElementById(i);
      addClass(el, "selected");
      this.findItem(i).checked = true;
    }, this);
  };

  IconView.prototype.uncheckItems = function(itemIds){
    var el;
    itemIds.forEach(function(i) {
      el = document.getElementById(i);
      removeClass(el, "selected");
      this.findItem(i).checked = false;
    }, this);
  };

  IconView.prototype.isSelected = function(item){
    return item.checked;
  };

  IconView.prototype.addItems = function(items) {
    if (Object.prototype.toString.call(items) === '[object Array]') {
      items.forEach(function(i) {
        if (Object.prototype.toString.call(i) === '[object Object]'){
          this.items.push(i);
          this.renderItem(i);
        }
      }, this);
    };
  };

  IconView.prototype.render = function() {
    var div    = document.createElement('div'),
        btnDel = document.createElement('button'),
        btnSel = document.createElement('button');
    div.className = 'wrappIconView';
    btnDel.innerHTML = "Удалить";
    btnDel.id = 'btnDelete';
    btnSel.innerHTML = "Выделить/сбросить";
    btnSel.id = 'btnSelected';
    div.appendChild(btnDel);
    div.appendChild(btnSel);
    this.container = (typeof this.container == 'string') ? document.getElementById(this.container) : this.container;
    this.container.style.width = this.containerWidth + 12 + "px";
    this.container.style.height = this.containerHeight + "px";
    this.container.parentNode.insertBefore(div, this.container);
    div.style.width = this.container.offsetWidth + 'px';
    div.appendChild(this.container);
    this.bindEvents();
    this.renderItems();
  };

  IconView.prototype.renderItem = function(i){
    var div, img, span;
    div = document.createElement('div');
    div.id = i.id;
    div.className = 'item';
    div.className += (i.checked) ? " selected" : "";
    div.style.width = this.itemWidth + "px";
    div.style.height = this.itemHeight + "px";
    img = document.createElement('img');
    img.src = "images/" + i.img;
    img.alt = i.text;
    span = document.createElement('span');
    span.textContent = i.text;
    span.className = 'title';
    div.appendChild(img);
    div.appendChild(span);
    this.container.appendChild(div);
    this.count++;
  };

  IconView.prototype.renderItems = function() {
    var countX = Math.round(this.containerWidth / this.itemWidth),
        countY = Math.round(this.containerHeight / this.itemHeight),
        count = (this.count) ? Math.min((this.count + countY), this.items.length) : Math.min((countX * (countY + 1)), this.items.length);
    for (var i = this.count; i < count ; i++) {
      this.renderItem(this.items[i]);
    };
  };

  IconView.prototype.findItem = function(id) {
    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id == id ){
        return this.items[i];
      }
    };
  };

  IconView.prototype.addEvents = function(obj) {
    this.unBindEvents();
    if (isEmptyObject(obj)) return false;
    this.events = extend( true, this.events, obj );
    this.bindEvents();
  };

  IconView.prototype.bindEvents = function() {
    var self = this;
    for ( var prop in this.events ) {
      if ( prop.indexOf('item') != -1 ) {
        var property = prop.split('_');
          var ev = newEvent(property[0] + "_" + property[1]);
          var hendler = function(event) {
            var target = event.target;
             while (target != self.container) {
              if (hasClass(target,'item')) {
                target.dispatchEvent(ev);
                return;
              }
              target = target.parentNode;
            }
          };
          var hendlerItem = function(e){
            var f = bind(self.events[property[0] + "_" + property[1]], self);
            return f((self.findItem(e.target.id)));
          };
          self.addEvent( self.container, property[0], hendler);
          self.addEvent( self.container, property[0] + "_" + property[1], hendlerItem);
      }else{
        var prt = prop.split('_');
        self.addEvent( document.getElementById(prt[1]), prt[0], bind(self.events[prt[0] + "_" + prt[1]], self) );
      }
    }
  };

  IconView.prototype.unBindEvents = function(){
     for (var i = 0; i < this.eventList.length; i++) {
      this.removeEvent(this.eventList[i].element, this.eventList[i].type, this.eventList[i].handler);
    };
    this.eventList = [];
  };

  IconView.prototype.addEvent = function(element, type, handler) {
    this.eventList.push({element, type, handler});
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
  }
  IconView.prototype.removeEvent = function(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
    } else {
        element["on" + type] = null;
    }
  }

  var isEmptyObject = function (obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
  }

  var newEvent = function(name){
    var myEvent = document.createEvent("Event");
    myEvent.initEvent(name, true, true);
    return myEvent;
  }

  function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  }
   
  function addClass(ele,cls) {
    if (!hasClass(ele,cls)) ele.className += " "+cls;
  }
   
  function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  }

  var extend = function () {
      var extended = {};
      var deep = false;
      var i = 0;
      var length = arguments.length;
      if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
          deep = arguments[0];
          i++;
      }
      var merge = function (obj) {
          for ( var prop in obj ) {
              if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                  if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                      extended[prop] = extend( true, extended[prop], obj[prop] );
                  } else {
                      extended[prop] = obj[prop];
                  }
              }
          }
      };
      for ( ; i < length; i++ ) {
          var obj = arguments[i];
          merge(obj);
      }
      return extended;
  };

  function bind(func, context) {
    return function() {
      return func.apply(context, arguments);
    };
  }
  
  return IconView;

}());
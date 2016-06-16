var add1 = add(0);
var add2 = add(20);

var iv = new IconView({
    container: 'iconView', //object|objectId>
    containerWidth: 304, // in pixels
    containerHeight: 304, // in pixels
    itemWidth: 87, // outer size - in pixels
    itemHeight: 87, // outer size - in pixels
    items: add1
});
iv.render();
iv.addEvents(
  { 
    dblclick_iconView: function(e){
      console.log("Вы сделали двойной клик по элементу "+ e.target.tagName);
      console.log("Количество элементов = " + this.count);
    }
  }
);

setTimeout( function(a){
  return iv.addItems(a);
}, 8000, add2);


function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function add (count){
  var arr = [];
  var count = count;

  for (var i = count; i < getRandom(count+1, count + 40); i++) {
    var obj = {};
    obj.id = 'item_'+ i;
    obj.text = 'Item Name ' + i;
    obj.img = 'item' + Math.floor(getRandom(1, 3)) + '.png';
    obj.checked = (Math.round(getRandom(0, 1))) ? true : false;
    arr.push(obj);
  };

  return arr;
};
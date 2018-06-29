/*JavaScript 对大小写是敏感的。
 您可以在文本字符串中使用反斜杠对代码行进行换行

    变量必须以字母开头
    变量也能以 $ 和 _ 符号开头（不过我们不推荐这么做）
    变量名称对大小写敏感（y 和 Y 是不同的变量）

    当您向变量分配文本值时，应该用双引号或单引号包围这个值。
    var name="Gates", age=56, job="CEO"; 声明也可横跨多行：


*/

document.write("<h1>This is a heading</h1>");
document.write("<p>This is a paragraph.</p>");

function myFunction() {
    x = document.getElementById("demo");
    x.innerHTML = "Hello JavaScript!";
}

function changeImage() {  //此功能为切换开关灯
    element = document.getElementById('myimage');
 if (element.src.match("bulbon")) //match  判断字符串里有bulbon  
	{
		element.src = "/i/eg_bulboff.gif";
	}
}

// x.style.color="#ff0000";

// 布尔：
var x = true;
var y = false;

// 数组：
var cars = new Array(3);
cars[0] = "Audi";
cars[1] = "BMW";
cars[2] = "Volvo";
//cars.length
//arr.concat(arr2) 合并数组
var cars = new Array("Audi", "BMW", "Volvo");

var cars = ["Audi", "BMW", "Volvo"];

// 对象
var person = {
    firstname: "Bill",
	lastname: "Gates",
	id: 5566
};
// 对象寻址：
// name=person.lastname;
// name=person["lastname"];

// avaScript 只有一种数字类型。数字可以带小数点，也可以不带

// Undefined 这个值表示变量不含有值。

// 可以通过将变量的值设置为 null 来清空变量。

// 当您声明新变量时，可以使用关键词 "new" 来声明其类型：

var carname1 = new String;
var x1 = new Number;
var y1 = new Boolean;
var cars1 = new Array;
var person1 = new Object;

// JavaScript 变量均为对象。当您声明一个变量时，就创建了一个新的对象。
//代码折行：
document.write("Hello \
World!");



/*JavaScript 变量的生命期从它们被声明的时间开始。

局部变量会在函数运行以后被删除。

全局变量会在页面关闭后被删除。
如果您把值赋给尚未声明的变量，该变量将被自动作为全局变量声明。

如果把数字与字符串相加，结果将成为字符串。

=== 	全等（值和类型）*/


var x2 = document.getElementById("main"); //通过id查找元素
var y2 = document.getElementsByTagName("p"); //通过标签名查找元素
//document.getElementById("demo").tagName;  tagName 属性返回元素的标签名。

//在 HTML 中，tagName 属性的返回值始终是大写的。
// document.getElementById('p2').style.color = 'blue'; //改变css样式

function mOver(obj) {
	obj.innerHTML = "谢谢"
}

function mOut(obj) {
	obj.innerHTML = "把鼠标移到上面"
}


function myFunction2() {
	var x;
	var txt = "";
	var person = {
		fname: "Bill",
		lname: "Gates",
		age: 56
	};

	for (x in person) {
		txt = txt + person[x];
	}

}
	var y = 0377; //八进制
	var z = 0xFF; //十六进制


	function startTime() {
		var today = new Date()
		var h = today.getHours()
		var m = today.getMinutes()
		var s = today.getSeconds()
			// add a zero in front of numbers<10
		m = checkTime(m)
		s = checkTime(s)
		document.getElementById('txt').innerHTML = h + ":" + m + ":" + s
		t = setTimeout('startTime()', 500)
			// setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。
	}

	function checkTime(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

var myDate=new Date() 


var myDate=new Date();
myDate.setFullYear(2008,8,9);

var today = new Date();

if (myDate>today) //日期比较
{
alert("Today is before 9th August 2008");
}
else
{
alert("Today is after 9th August 2008");
}



// dateObject.setMonth(month,day)
// d.setMonth(0)

var myBoolean=new Boolean();//false
var b1=new Boolean( 0)  //false
var b2=new Boolean(1) //true
var b3=new Boolean("") // false
var b4=new Boolean(null) //false
var b5=new Boolean(NaN) //false
var b6=new Boolean("false") //true



document.write(Math.round(0.60) + "<br />")  //1 [0.0,1.0)  四舍五入
document.write(Math.round(0.50) + "<br />")  //1
document.write(Math.round(0.49) + "<br />")  //0
document.write(Math.round(-4.40) + "<br />")  //-4
document.write(Math.round(-4.60))  //-5



document.write(Math.random()) //0-1之间的随机数


// Math.min(a,b)
// Math.max(value1, value2)



   //  Math.E   常数
   //  Math.PI  圆周率
   //  Math.SQRT2              2 的平方根
   //  Math.SQRT1_2            1/2 的平方根
   //  Math.LN2                 2 的自然对数
   //  Math.LN10              10 的自然对数
   //  Math.LOG2E              以 2 为底的 e 的对数
   //  Math.LOG10E              以 10 为底的 e 的对数



// 正则表达式
var patt1=new RegExp("e");//当您使用该 RegExp 对象在一个字符串中检索时，将寻找的是字符 "e"。


// test() 方法检索字符串中的指定值。返回值是 true 或 false
var patt1=new RegExp("e");

document.write(patt1.test("The best things in life are free")); 

// exec() 方法检索字符串中的指定值。返回值是被找到的值。如果没有发现匹配，则返回 null。
var patt1=new RegExp("e");

document.write(patt1.exec("The best things in life are free")); 

// 则可以使用 "g" 参数 ("global")。

var patt1=new RegExp("e","g");
do
{
result=patt1.exec("The best things in life are free");
document.write(result);
}
while (result!=null) //输出 eeeeeenull


// compile() 方法用于改变 RegExp。

var patt1=new RegExp("e");

document.write(patt1.test("The best things in life are free"));

patt1.compile("d");

document.write(patt1.test("The best things in life are free"));//由于字符串中存在 "e"，而没有 "d"，以上代码的输出是：

// truefalse


// 浏览器窗口的宽高
var w=window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h=window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;


    // window.open() - 打开新窗口
    // window.close() - 关闭当前窗口
    // window.moveTo() - 移动当前窗口
    // window.resizeTo() - 调整当前窗口的尺寸

    // screen.availWidth - 可用的屏幕宽度
    // screen.availHeight - 可用的屏幕高度

document.write("可用宽度：" + screen.availWidth+ "<br />");//screen.availWidth 属性返回访问者屏幕的宽度，以像素计，减去界面特性，比如窗口任务栏。

document.write(location.href+ "<br />");//location.href 属性返回当前页面的 URL。

document.write(location.hostname+ "<br />");//返回 web 主机的域名

document.write(location.pathname+ "<br />");//返回当前页面的路径和文件名
document.write(location.port+ "<br />");//返回 web 主机的端口 （80 或 443）
document.write(location.protocol+ "<br />");//返回所使用的 web 协议（http:// 或 https://）



// navigator 对象包含有关访问者浏览器的信息。

    // navigator 数据可被浏览器使用者更改
    // 浏览器无法报告晚于浏览器发布的新操作系统


function show_confirm()
{
var r=confirm("Press a button!"); //确认框
if (r==true)
  {
  alert("You pressed OK!");//警告框
  }
else
  {
  alert("You pressed Cancel!");
  }
}


function disp_prompt()
  {
  var name=prompt("请输入您的名字","Bill Gates") //提示框
  if (name!=null && name!="")
    {
    document.write("你好！" + name + " 今天过得怎么样？")
    }
  }


// escape() 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。
// 已编码的 string 的副本。其中某些字符被替换成了十六进制的转义序列。 可以使用 unescape() 对 escape() 编码的字符串进行解码。

// 注释：ECMAScript v3 反对使用该方法，应用使用 decodeURI() 和 decodeURIComponent() 替代它。

// indexOf(searchvalue,fromindex)   	可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。如省略该参数，则将从字符串的首字符开始检索。

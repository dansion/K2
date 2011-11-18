(function(){
		var e = "abbr,article,aside,audio,canvas,datalist,details,dialog,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video".split(","),
				j=e.length;
		
		for(var i=0;i<j;i++){
				document.createElement(e[i]);
		}
})();
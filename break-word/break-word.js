/*!
 * @revision:
 */
/*
 * @author:sanqi
 * @version:1-0-0
 */

YUI.add('k2-break-word',function(Y){
/**
 * 在固定宽度的容器下，通过设置样式{word-wrap:break-word;}或
 * 每隔固定的字符数插入<wbr>来实现连续的字母或特殊字符的自动换行。  
 * 参考：<a href="http://dancewithnet.com/2008/12/04/word-break-all/">《连续字符自动换行的解决方案》</a>
 * @module break-word 
 */
  var CLASSNAME = 'k2-break-word',
      RE = '[a-zA-Z0-9]',
      WORD_LENGTH = 13,
      WORD_WRAP = 'wordWrap',
      BREAK_WORD = 'break-word',
      FALSE = false;
  /**
   * 下面的方法被添加到YUI实例中
   * @class YUI~breakWord
   */

  /**
   * 默认对类名包含k2-break-word的容器进行处理。
   * 建议在使用本方法之前在head中加入对应的CSS文件break-word-1-0-0.css,      
   * 增强页面在支持word-wrap的浏览器中有更好的体验。
   * 基于<a href="http://www.hedgerwow.com/360/dhtml/css-word-break.html">CSS Word Break</a>修改
   * @method breakWord
   * @param o {object} 
   */
  var breakWord = function(o){
    var a;
    o = o || {};
    Y.mix(o ,{
      className : [],
      re : RE,
      wordLength : WORD_LENGTH,
      redo : FALSE
    });
    a = o.className;
    a.push(CLASSNAME); 

    Y.Array.each(a,function(cn){
      var Node = Y.Node;
      Node.all('.' + cn).each(function(node){
        var doc =  Y.config.doc,
            el = node._node; //获取节点本身

        //Y.log(node.getComputedStyle(WORD_WRAP),'info','break-word');

        if(o.redo || node.getComputedStyle(WORD_WRAP) !== BREAK_WORD){

          node.setStyle(WORD_WRAP,BREAK_WORD);

          if(doc.createTreeWalker && node.getComputedStyle(WORD_WRAP) !== BREAK_WORD){//FF 3.0
            
            var walker = doc.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,FALSE),
                n,c=String.fromCharCode('8203'),        
                re = new RegExp('('+ o.re + '{0,' + o.wordLength + '})'),
                re8203 = new RegExp(c,'g');
                while(walker.nextNode()){
                  n = walker.currentNode;
                  n.nodeValue = Y.Lang.trim(n.nodeValue).split(re).join(c);  
                }
                //&8203;会导致用光标在文本上移动时因有大量的看不见的字符存在而移动缓慢，所以<wbr>更合适
                //但由于使用了innerHTML，会导致节点上的绑定的事件丢失
                //el.innerHTML = el.innerHTML.replace(re8203,'<wbr>');
          }
        }
      });
    });
    //Y.log(o,'info','break-word');
  }

  Y.breakWord = breakWord; 
},'1.0.0',{requires:['node-base','node-style']});

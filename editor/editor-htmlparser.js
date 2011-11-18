/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-10
 */
YUI.add('k2-editor-htmlparser', function(Y) {
		  var _aYesTag = [
    'div',
    'span',
    'font',
    'p',
    'h1',
    'a',
    'img',
    'td',
    'th',
    'li',
    'tr',
    'table',
    'ul',
    'ol',
    'strong',
    'em',
    'i',
    'b',
    'h2',
    'dt',
    'dd',
    'dl',
    'hr',
    'h3',
    'sub',
    'sup',
	'br'
  ];
  //
  var DATA_REALELE = '_data_realelement';
  // allowed attribute
  var _aYesAttr = ['style', 'src', 'href', 'title', 'align','border','cellpadding', 'cellspacing','colspan','rowspan','face','size','color'];

  // Regular Expressions for parsing tags and attributes
  var startTag = /^<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    endTag = /^<\/(\w+)[^>]*>/,
    attr =/(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
    
  // Empty Elements - HTML 4.01
  var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

  // Block Elements - HTML 4.01
  var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

  // Inline Elements - HTML 4.01
  var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

  // Attributes that have their values filled in disabled="disabled"
  var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected,_data_realelement");

  // Special Elements (can contain anything)
  var special = makeMap("script,style");   
 	
	function makeMap(str){
    var obj = {}, items = str.split(",");
    for ( var i = 0; i < items.length; i++ )
      obj[ items[i] ] = true;
    return obj;
  }
    var EditorHTMLParser = function() {
        EditorHTMLParser.superclass.constructor.apply(this, arguments);
    },HOST='host';
		
    Y.extend(EditorHTMLParser, Y.Base, {
				HTMLParser : function( html, handler ) {
					var index, chars, match, stack = [], last = html;
					stack.last = function(){
						return this[ this.length - 1 ];
					};

					while ( html ) {
						chars = true;

						// Make sure we're not in a script or style element
						if ( !stack.last() || !special[ stack.last() ] ) {

							// Comment
							if ( html.indexOf("<!--") == 0 ) {
								index = html.indexOf("-->");
				
								if ( index >= 0 ) {
									if ( handler.comment )
										handler.comment( html.substring( 4, index ) );
									html = html.substring( index + 3 );
									chars = false;
								}
				
							// end tag
							} else if ( html.indexOf("</") == 0 ) {
								match = html.match( endTag );
				
								if ( match ) {
									html = html.substring( match[0].length );
									match[0].replace( endTag, parseEndTag );
									chars = false;
								}
				
							// start tag
							} else if ( html.indexOf("<") == 0 ) {
								match = html.match( startTag );
				
								if ( match ) {
									html = html.substring( match[0].length );
									match[0].replace( startTag, parseStartTag );
									chars = false;
								}
							}

							if ( chars ) {
								index = html.indexOf("<");
								
								var text = index < 0 ? html : html.substring( 0, index );
								html = index < 0 ? "" : html.substring( index );
								
								if ( handler.chars )
									handler.chars( text );
							}

						} else {
							html = html.replace(new RegExp("(.*)<\/" + stack.last() + "[^>]*>"), function(all, text){
								text = text.replace(/<!--(.*?)-->/g, "$1")
									.replace(/<!\[CDATA\[(.*?)]]>/g, "$1");

								if ( handler.chars )
									handler.chars( text );

								return "";
							});

							parseEndTag( "", stack.last() );
						}

						if ( html == last )
							throw "Parse Error: " + html;
						last = html;
					}
					
					// Clean up any remaining tags
					parseEndTag();

					function parseStartTag( tag, tagName, rest, unary ) {
						if ( block[ tagName ] ) {
							while ( stack.last() && inline[ stack.last() ] ) {
								parseEndTag( "", stack.last() );
							}
						}

						if ( closeSelf[ tagName ] && stack.last() == tagName ) {
							parseEndTag( "", tagName );
						}

						unary = empty[ tagName ] || !!unary;

						if ( !unary )
							stack.push( tagName );
						
						if ( handler.start ) {
							var attrs = [];
				
							rest.replace(attr, function(match, name) {
								var value = arguments[2] ? arguments[2] :
									arguments[3] ? arguments[3] :
									arguments[4] ? arguments[4] :
									fillAttrs[name] ? name : "";
								attrs.push({
									name: name,
									value: value,
									escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
								});
							});
				
							if ( handler.start )
								handler.start( tagName, attrs, unary );
						}
					}

					function parseEndTag( tag, tagName ) {
						// If no tag name is provided, clean shop
						if ( !tagName )
							var pos = 0;
							
						// Find the closest opened tag of the same type
						else
							for ( var pos = stack.length - 1; pos >= 0; pos-- )
								if ( stack[ pos ] == tagName )
									break;
						
						if ( pos >= 0 ) {
							// Close all the open elements, up the stack
							for ( var i = stack.length - 1; i >= pos; i-- )
								if ( handler.end )
									handler.end( stack[ i ] );
							
							// Remove the open elements from the stack
							stack.length = pos;
						}
					}
				},
				HTMLtoXML : function( html ) {
					//html = html.toLowerCase();
					var results = "",
						_each = function(aAry, fn) {
							var i,j;
							if (aAry.length) {
								for(i=0,j=aAry.length;i<j;i++) {
									fn(aAry[i], i);
								}
							} else {
								for(i in aAry) {
									fn(aAry[i], i)
								}
							}
						},
						_inArray = function(obj, ary, strict) {
							var i, j;
							for (var i=0,j=ary.length;i<j;i++) {
								if(ary[i]===obj || (!strict && ary[i]==obj)) {
									return true;
									break;
								}
							}
							return false;
						};
					
					// <o:p></o:p> tags in html (possibly from MS Word copy&paste) breaks the HTMLParser
					html = html.replace(/<[\w]><[\/\w]>/gi,'');
					html = html.replace(/\r\n/gi,"");
					//删除word中的属性 mso-
					html = html.replace(/mso[\-\w\s]+:[\.\:\s\w\d\-\u4E00-\u9FA5;]+;|mso[\-\w\s]+:[\.\:\s\w\d\-\u4E00-\u9FA5;]+/gi,"z-index:auto;");
					//html = html.replace(/<br><br>/gi,'<br>');
					html = html.replace(/([\w]+=[\w]+)\&amp\;/gi,"$1&");
					html = html.replace(/<p><span><span.*?>&nbsp;<\/span><\/span><\/p>/i,'');
					html = html.replace(/<[^ >]+:[^>]+>/g, '');

					html = html.replace(/\n/g, ' ');

					// replace the <!-- xx --> comments
					html = html.replace(/<!--.+-->/g, '');

					//<meta>
					html = html.replace(/<meta[^>]*>/ig, '');

					//x:num
					html = html.replace(/(<[^>]+ )\w+:\w+\b/ig, '$1');
					
					this.HTMLParser(html, {
						start: function( tag, attrs, unary ) {
							if (_inArray(tag.toLowerCase(), _aYesTag)) {
								var newEl =  "<" + tag;
						
								for ( var i = 0; i < attrs.length; i++ ) {
									var attrName = attrs[i].name.toLowerCase();
									if(attrName == DATA_REALELE){
										results += decodeURI(attrs[i].escaped);
										return;
									}
									if (_inArray(attrName, _aYesAttr)) {
										newEl += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
									}
								}
						
								newEl += (unary ? "/" : "") + ">";

								results += newEl;
							}
						},
						end: function( tag ) {
							if (_inArray(tag.toLowerCase(), _aYesTag)) {
								results += "</" + tag + ">";
							}
						},
						chars: function( text ) {
							results += text;
						},
						comment: function( text ) {
							results += "<!--" + text + "-->";
						}
					});
			
					
					
					return results;
				},
				getContentTextLength : function(html){
						html = html.replace(/<.*?>/gi,'');
						html = html.replace(/&nbsp;/gi,'');
						return html.length
				},
				getImageLength : function(html){
						var patten = /(<img.*?>)/gi;
						results = html.match(patten) || 0;
						return results.length  || 0;
				},
				filterTag : function(html,tag,num){
				},
        initializer: function() {
        }
    }, {
        NAME: 'editorHtmlParser',
        NS: 'htmlparser',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.EditorHTMLParser = EditorHTMLParser;	

}, '1.0.6' ,{skinnable:false, requires:['editor-base']});

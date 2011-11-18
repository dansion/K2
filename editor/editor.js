/*
 * @revision:
 */
/*
 * @author:wulong@taobao.com
 * @version:1-0-7
 */
YUI.add('k2-editor-wrap', function(Y) {
		var EditorWrap ={}
		Y.mix(EditorWrap, {
				render : function(id){
					if(Y.UA.ipad == 0 && Y.UA.ipod == 0 && Y.UA.iphone == 0){
						var node = id,
								wrap,editor,
								orgTextarea = Y.one('#'+node),
								value = orgTextarea.get('value'),
								height = orgTextarea.getStyle('height');  
								width = orgTextarea.getStyle('width'); 
								name = orgTextarea.get('name'),
								toolbarhtml = Y.Node.create("<div class='k2-editor-toolbar'></div>"),
								statushtml = Y.Node.create("<div class='k2-editor-status'></div>"),
								//textareahtml = Y.Node.create("<textarea id='"+orgTextarea.get('id')+"' class='" + node + "-textarea' name='" + name + "' style='display:none'>"+value+"</textarea>");
								textareahtml = orgTextarea.cloneNode();
								textareahtml.set('className',node+"-textarea");
								textareahtml.set('name',name);
								textareahtml.setStyle('display',"none");
								textareahtml.setStyle('resize',"none");
								textareahtml.setAttribute('value',value);

						wrap = Y.Node.create('<div class="k2-editor-wrap" style="width:'+width+'"></div>');
						orgTextarea.insert(wrap,'before');
						wrap.insert('<div id="k2-editor-'+node+'" style="height:'+height+'"></div>','0');
						orgTextarea.remove();
					
						editor = new Y.EditorBase({
								content: value,
								extracss :'p{margin:2px;}'
						});
						editor.plug(Y.Plugin.EditorHTMLParser);
						editor.plug(Y.Plugin.EditorPara);
						editor.plug(Y.Plugin.EditorBidi);
			
						editor.render("#k2-editor-"+node);
						wrap.insert(toolbarhtml,0);
						wrap.insert(statushtml,2);
						wrap.one('#k2-editor-'+node).insert(textareahtml,1);
						editor.set('toolBarDiv',toolbarhtml); 
						editor.set('textArea',textareahtml); 
						editor.set('statusBar',statushtml); 
						editor.set('editorId',node);
						editor.set('wrap',wrap);
						return editor;
					}else{
						return {}

					}
			},
			destroy : function(editor){
				var cloneTa = editor.get('textArea').cloneNode(),
				wrap = editor.get('wrap');
				Y.log(cloneTa.get('value'));
				editor.get('textArea').remove();
				editor.destroy(); 
				cloneTa.setStyle('display','block');
				wrap.insert(cloneTa,'after');
				wrap.remove();
			},
			disablePlugin : function(editor,plugin){
				editor.on("sourcemode", plugin.disable, plugin);
				editor.on("richmode", plugin.enable, plugin);
			}

    })
		
		Y.EditorWrap = EditorWrap;


}, '1.0.5' ,{skinnable:false, requires:['editor-base','editor-para','editor-bidi','k2-editor-htmlparser','k2-editor-style']});

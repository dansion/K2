/*
 * @version:1-0-0
 */

YUI.add('k2-cdselector-popup',function(Y){

    C = function(){//Y.Cdselector_Popup���캯��
        C.superclass.constructor.apply(this, arguments);
    };

    C.NAME = 'k2-cdselector-popup';

	C.ATTRS = {
		//������
		field: {
			setter: Y.one
		},
		//����������
		container: {
			setter: function(id){
				return Y.one(id).setStyle('display', 'none');//����Ĭ������
			}
		},
		//״̬Ϊչ��
		isExpanded: {
			value: false
		},
		level: {//��ͻ��������������
			value: 0	
		},
		textQueue: {
			value: []
		},
		separator: {
			value: '>   '
		},
		/*currentLevel: {
			value: 0
		},*/
		ulNodes: {
			value: []	
		}
		/*,
		placeHolder: {
			value: {
				text: '��ѡ��...',
				color: '#999'
			},
			setter: function(o){
				if(!o.text){
					
				}
				return o;
			}
		}
		*/
	};

    Y.extend(C, Y.Cdselector_Option, {

		/*
		 * ��д
		 * param: '783-887-890'
		 */
		select: function(str){
			C.superclass.select.call(this, str);
			var a = str.split("-"),
				queue = this.get('textQueue'),
				dataSource = this.get('dataSource');
			
			queue.length = 0;//���
			for(var i = 0, len = a.length; i < len; i++){
				queue.push(dataSource.data[a[i]]);
			}
			this._setText(this._arrayToText(queue));
			this._setScrollable(a.length);
			for(var i = 0; i < a.length; i++){
				this.get('ulNodes')[i].setStyle('overflowY', 'hidden');
			}
        },

		/*
		 * ��д
		 * ������κη���liʱ����
		 */
		_selectChange: function(e, lv, childOrigin, value){
			C.superclass._selectChange.call(this, e, lv, childOrigin, value);
			var text = e.target._node.innerHTML,
				maxLevel = this.get('level'),
				queue = this.get('textQueue');
			queue[lv] = text;
			queue.length = lv + 1;
			this._setText(this._arrayToText(queue));
		
			if(maxLevel === lv){
				this._collapse();
			}
			//this.set('currentLevel', lv);

			this._setScrollable(lv + 1);
        },
		
		/*
		 * ��д
		 */
		initializer: function(cfg){
			var ulNodes = [];
			this.set('field', "#" + cfg.fieldId);
			this.set('container', "#" + cfg.containerId);
			this.set('level', cfg.config.levelNum - 1);
			//this.set('placeHolder', cfg.config.placeHolder);
			
			//��ul���Ӽ���class
			for(var i = 0, len = this.get('originDoms').length; i < len; i++){
				
				var ulDom = this.get('originDoms')[i],
					ulNone = new Y.Node(ulDom);
				if((i%2) === 0){
					ulNone.addClass('even');//ż��
				}else{
					ulNone.addClass('odd');//����
				}
				ulNodes.push(ulNone);
			}	
			this.set('ulNodes', ulNodes);//���ulNodes
			this._initEvent();
			this._setScrollable(0);

			//div��λ
			var fieldY = this.get('field').getY(),
				fieldHeight = this.get('field').getComputedStyle('height');
			this.get('container').setY(fieldY + fieldHeight);
			
		},
		_initEvent: function(){
			this.get('field').on('click', this._onFieldClick, null, this);
			this.get('container').on('click', this._onContainerClick, this);
			Y.one(document).on('click', this._onBodyClick, this);
		},
		_expand: function(){
			this.get('container').setStyle('display', 'block');
			this.set('isExpanded', true);
		},
		_collapse: function(){
			this.get('container').setStyle('display', 'none');
			this.set('isExpanded', false);
		},
		_onFieldClick: function(e, me){
			e.stopPropagation();
			this.blur();
			if(me.get('isExpanded')){
				me._collapse();
			}else{
				me._expand();
			}
		},
		_onBodyClick: function(){
			if(this.get('isExpanded')){
				this._collapse();
			}
		},
		_onContainerClick: function(e){
			e.stopPropagation();
		},
		
		/*
		 * ���ı���������ֵ
		 */
		_setText: function(v){
			this.get('field').setAttribute('value', v);
		},
		
		/*
		 * ���ַ�����ƴ���ַ����������ַ�ͨ��config.separator����
		 * param: ['������', '������', '��']
		 * return: '������> ����> ��'
		 */
		_arrayToText: function(array){
			var text = '';
			for(var i = 0, len = array.length; i < len; i++){
				text += array[i] + this.get('separator');
			}
			return text;
		},

		/*
		 * �������е�ul�Ƿ���ֹ�����
		 */
		_setScrollable: function(level){
			var maxlevel = this.get('level');

			function mouseOver(){
				this.setStyle('overflowY', 'scroll');
			}
			function mouseOut(){
				this.setStyle('overflowY', 'hidden');
			}

			for(var i = 0; i <= maxlevel; i++){
				var ulNode = this.get('ulNodes')[i];
				if(i < level){
					ulNode.on('mouseover', mouseOver);//����
					ulNode.on('mouseout', mouseOut);
				}else if(i === level){
					ulNode.detachAll('mouseover');
					ulNode.detachAll('mouseout');
					ulNode.setStyle('overflowY', 'scroll');
					
				}else if(i > level){
					ulNode.detachAll('mouseover');
					ulNode.detachAll('mouseout');
					ulNode.setStyle('overflowY', 'hidden');
				}
			}
		}
    });

    Y.Cdselector_Popup = C;
    

},'1.0.0',{requires:['k2-cdselector-option']});

/*!
 * @revision:
 */
/*
 * @author:zhanyan@taobao.com
 * @version:1-0-8
 */
YUI.add('k2-calendar',function(Y){

  //Y.log('done','info','k2-calenar');
  /**
   * calendar.js | cubee 日历控件
   * autohr:zhanyan@taobao.com lijing00333@163.com 拔赤
   * @class Y.Calendar
   * @param { string } 容器或者触点id 
   * @param { object } 配置项
   * @return { object } 生成一个calendar实例
   * @requires { 'node' }
   * @requires { calendar-skin-default } 皮肤
   * 
   * Y.Calenar：
   *  说明：日历构造器，通过new Y.Calendar来render一个日历
   *  使用：new Y.Calendar(id,options);
   *  参数：id:{string}容器id
   *  配置：selected {date} 选中的日期
   *      mindate:{date} 最小可选日期
   *      maxdate:{date} 最大可选日期
   *      popup:{boolean} 是否弹出，默认false
   *      closeable:{boolean} 是否单选关闭（弹出状态下起作用），默认为false
   *      range_select:{boolean} 是否选择范围，默认为false
   *      range:{start:date,end:date} 默认选择范围
   *      multi_select:{number} 日历页数，默认为1
   *      date:{date} 默认显示该日期所在的月份，默认为当天
   *      navigator:{boolean} 是否可以选择跳转的月份，默认为true
   *      inputname:{string} 隐藏域的name属性设置，默认为o.date
   *    Y.Calendar的实例的方法：
   *      init:初始化，参数为options
   *      render:渲染，init在new的时候调用，render可以在运行时任意时刻调用，参数为options，其成员可覆盖原参数
   *      hide:隐藏，不会删除窗口
   *      show:显示窗口
   */
  
  var _N = Y.Node,_D = Y.DOM,_L = Y.Lang;

  /**
   * Calendar组件定义的构造类(未继承Base)
   * @method Calendar
   * @param Object config pop组件构造的配置项
   * @private
   */
  Y.Calendar = function(){
    this.init.apply(this,arguments);
  };
  //通过mix方法将自定义的方法附加到Y.Calendar上，模式为4，即附加到prototype上
  Y.mix(Y.Calendar,{
    /**
     * 在创建Calendar时调用的初始化方法
     * @method init
     * @param {string} 呈现的容器ID
     * @param {obj} 配置对象
     * @private
     */
    init:function(id,config){
      var that = this;
      that.id = that.C_Id = id;
      //创建参数列表
      that.buildParam(config);
      //形成con
      /*
        that.con，日历的容器
        that.id   传进来的id
        that.C_Id 永远代表日历容器的ID
        that.popup 是否用浮层
      */
      if(!that.popup){
        //指定容器的模式
        that.con = Y.one('#'+id);
      }else {
        //指定按钮的模式 -> input 模式
        //var trigger = Y.one('#'+id);
        //that.trigger = trigger;
        that.C_Id = 'C_' + Y.guid();
        that.con = Y.Node.create('<div id="'+that.C_Id+'"></div>');
        Y.one('body').appendChild(that.con);
        /*
        var _x = trigger.getXY()[0];
        var _y = trigger.getXY()[1]+trigger.get('region').height;
        that.con.setStyle('left',_x.toString()+'px');
        that.con.setStyle('top',_y.toString()+'px');
        */
        that.con.setStyle('top','0px');
        that.con.setStyle('position','absolute');
        that.con.setStyle('background','white');
        that.con.setStyle('visibility','hidden');

        that.createExCon();
      }
      that.buildEventCenter();
      that.render();
      that.buildEvent();
      return this;
    },
    /**
     * 日历的事件中心
     * @method buildEventCenter
     * @private
     */
    buildEventCenter:function(){
      var that = this;
      //事件工厂
      var EventFactory = function(){
        this.publish("select");
        this.publish("switch");
        this.publish("rangeselect");
        this.publish("timeselect");
        this.publish("selectcomplete");
        this.publish("hide");//later
        this.publish("show");//later
      };
      //是的EventFactory具有Y.Event.Target方法（发布、注册、触发事件）
      Y.augment(EventFactory, Y.Event.Target);
      that.EventCenter = new EventFactory();
      return this;
    },
    /**
     * 注册事件
     * @method on
     * @param {string} type 事件类型
     * @param {Function} foo 响应函数
     * @public
     */
    on:function(type,foo){
      var that = this;
      that.EventCenter.on(type,foo);
      return this;
    },
    /**
     * 在pop模式下创建隐藏域
     * @method on
     * @param {string} type 事件类型
     * @param {Function} foo 响应函数
     * @public
     */
    createExCon:function(){
      var that = this;
      //处理初始时的time
      var times = [];
      if(that.timeSTR != ''){
        times = that.timeSTR.split(':');
      }else{
        if(that.level > 5){
          times = ['00','00','00'];
          that.timeSTR = '00:00:00';
        }
        if(that.level > 4){
          times = ['00','00'];
          that.timeSTR = '00:00';
        }
        if(that.level > 3){
          times = ['00'];
          that.timeSTR = '00';
        }
      }
      
      if(that.minMode != 0 && that.level > 4){
        if(times[1] > 0){
          times[1] = Math.round(times[1]*that.minMode/60)*(60/that.minMode);
          if(times[1] == 60){
            times[1] = 0;
            times[0] = times[0] - 0 + 1;
          }
          times[1] = times[1] < 10 ? '0'+ times[1] : times[1];
          if(that.level > 5){
            that.timeSTR = times[0] + ':' + times[1] + ':' + times[2];
          }else{
            that.timeSTR = times[0] + ':' + times[1];
          }
          that.selected.setMinutes(times[1]);
        }
      }

      //创建扩展容器与隐藏域
      var temp = '';
      if(that.dateSTR != ''){
        temp = that.dateSTR;
      }
      if(temp != '' && that.timeSTR != ''){
        temp = temp + ' ' + that.timeSTR;
      }
      var excon = _N.create('<div style="' + ((that.level > 3)?'height:20px;':'height:20px;display:none;') + ';" class="k2-inline-block yk-inline-block k2-calendar-contain"><input type="hidden" class="k2-cal-post" name="' + that.inputname + '" value="' + temp + '" id="' + 'id-' + that.inputname + '"></div>');

      //小时
      if(that.level > 3){
        var selectH = _N.create('<select class="k2-cal-hour" style="margin: 0pt 5px 0pt 4px; vertical-align: middle;"></select>');
        for(var i = 23;i > -1;i--){
          var o = i;
          o = o < 10 ? '0'+ o : o;
          selectH.prepend('<option value="' + o + '">' + o + '</option>');
        }
        times[0] != undefined?selectH.getElementsByTagName('OPTION').item(times[0]-0).set('selected','selected'):'';
        excon.append(selectH);
      }
      //分钟
      if(that.level > 4){
        var selectM = _N.create('<select class="k2-cal-minute" style="margin:0 5px;; vertical-align: middle;"></select>');
        if(that.minMode != 0){
          for(var i = that.minMode - 1;i > -1;i--){
            var o = i * (60/that.minMode);
            o = o < 10 ? '0'+ o : o;
            selectM.prepend('<option value="' + o + '">' + o + '</option>');
          }
          times[1] != undefined?selectM.getElementsByTagName('OPTION').item(times[1]/(60/that.minMode)).set('selected','selected'):'';
        }else{
          for(var i = 59;i > -1;i--){
            var o = i;
            o = o < 10 ? '0'+ o : o;
            selectM.prepend('<option value="' + o + '">' + o + '</option>');
          }
          times[1] != undefined?selectM.getElementsByTagName('OPTION').item(times[1]-0).set('selected','selected'):'';
        }
        excon.append('<span>:</span>');
        excon.append(selectM);
      }
      //秒
      if(that.level > 5){
        var selectS = _N.create('<select class="k2-cal-second" style="margin:0 0 0 5px;vertical-align: middle;"></select>');
        for(var i = 59;i > -1;i--){
          var o = i;
          o = o < 10 ? '0'+ o : o;
          selectS.prepend('<option value="' + o + '">' + o + '</option>');
        }
        times[2] != undefined?selectS.getElementsByTagName('OPTION').item(times[2]-0).set('selected','selected'):'';
        excon.append('<span>:</span>');
        excon.append(selectS);
      }
      //插入扩展容器
      that.couplingIpt.addClass('k2_c_input');
      if(that.couplingIpt.next() == null){
        that.couplingIpt.ancestor().append(excon);
      }else{
        that.couplingIpt.insert(excon,that.couplingIpt.next());
      }
      that.excon = excon;
    },
    /**
     * calendar对象呈现方法，init在new的时候调用，render可以在运行时任意时刻调用，参数为options，其成员可覆盖原参数
     * @method render
     * @private
     */
    render:function(o){
      var that = this;
      var o = o || {};
      that.parseParam(o);
      that.ca = [];
      //展示多少个日历
      that.con.addClass('c-call clearfix multi-'+that.multi_page);
      that.con.set('innerHTML','');

      //当前展示的年月
      for(var i = 0,_oym = [that.year,that.month]; i<that.multi_page;i++){
        //只有第一个需要左箭头
        if(i == 0){
          var _prev = true;
        }else{
          var _prev = false;
          //非第一个日历，对应的年、月
          _oym = that.computeNextMonth(_oym);
        }
        //只有最后一个需要右箭头
        if(i == (that.multi_page - 1)){
          var _next = true;
        }else {
          var _next = false;
        }
        //
        that.ca.push(new that.Call({
          year:_oym[0],
          month:_oym[1],
          prev_arrow:_prev,
          next_arrow:_next
        },that));
        //调用Call中定义的render方法
        that.ca[i].render();
        /*
        that.ca[i].renderUI();
        that.con.appendChild(that.ca[i].node);
        that.ca[i].buildEvent();
        */
      }
      return this;
    },
    /**
     * 计算d天的前几天或者后几天，返回date
     * @method showdate
     * @param {number} n 前后的天数
     * @param {number} d 标准的日期
     * @private
     */
    showdate:function(n,d){
      var uom = new Date(d-0+n*86400000);
      uom = uom.getFullYear() + "/" + (uom.getMonth()+1) + "/" + uom.getDate();
      return new Date(uom);
    },
    /**
     * 创建日历外框的事件
     */
    buildEvent:function(){
      var that = this;
      if(!that.popup)return this;
      //点击空白
      //flush event
      for(var i = 0;i<that.EV.length;i++){
        if(typeof that.EV[i] != 'undefined'){
          that.EV[i].detach();
        }
      }
      //注册事件-外部元素获得焦点时隐藏
      /*
      that.EV[0] = Y.Node.get('document').on('click',function(e){
        if(e.target.get('id') == that.C_Id)return;
        var f = e.target.ancestor(function(node){
          if(node.get('id') == that.C_Id)return true;
          else return false;
        });
        if(typeof f == 'undefined' || f == null){
          that.hide();
        }
      });
      */
      //在指定按钮的模式下，点击触发日历的显示或者隐藏
      /*
        Y.one('#'+that.id) = that.trigger
      */
      if(that.couplingIpt){
        that.EV[1] = that.couplingIpt.on('focus',function(e){
          that.show();
        });
      }
      //time select时触发事件
      if(that.excon){
        that.EV[2] = that.excon.all('select').on('change',function(ev){
          var selectArray = that.excon.all('select');
          that.selected.setHours((selectArray.item(0) == null)?'':(selectArray.item(0).get('value')-0),(selectArray.item(1) == null)?'':(selectArray.item(1).get('value')-0),(selectArray.item(2) == null)?'':(selectArray.item(2).get('value')-0));
          that._selectFun();
        });
      }
      return this;
    },
    //用来统一处理select回填事件
    _selectFun:function(){
      var that = this;
      var timeSTR = '';
      that.excon.all('select').each(function(node){
        timeSTR = timeSTR + node.get('value') + ':';
      },that);
      that.timeSTR = timeSTR.slice(0,-1);

      if(that.timeSTR == '' && that.dateSTR == ''){
        
      }else{
        if(that.timeSTR == ''){
          that.excon.one('.k2-cal-post').set('value',that.dateSTR);
        }else{
          that.excon.one('.k2-cal-post').set('value',that.dateSTR + ' ' + that.timeSTR);
        }
        that.EventCenter.fire('select',that.selected);
      }
    },
    /**
     * 显示 
     */
    show:function(){
      var that = this;
      that.con.setStyle('visibility','');
      if(that.couplingIpt){
        var _x = that.couplingIpt.getXY()[0];
        var _y = that.couplingIpt.getXY()[1] + that.couplingIpt.get('region').height;
        that.con.setStyle('left',_x.toString()+'px');
        that.con.setStyle('top',_y.toString()+'px');
      }else{
        //该方法原来定义在util中
        _setCenter = function(el) {
          var wXY = [_D.winWidth(), _D.winHeight()],
            sXY = [_D.docScrollX(), _D.docScrollY()],
            w = el.get('offsetWidth') || el.get('clientWidth') || parseInt(el.get('width'));
            h = el.get('offsetHeight') || el.get('clientHeight') || parseInt(el.get('height'));
          
          h = isNaN(h)?0:h;
          w = isNaN(w)?0:w;
          el.setStyle('position','absolute');
          el.setStyle('left',(wXY[0] - w) / 2 + sXY[0] + 'px');
          var top  = (wXY[1] - h) / 2 + sXY[1];
          el.setStyle('top',(top < 50 ? 50 : top) + 'px');
        }

        _setCenter(that.con);
      }
      that.EventCenter.fire('show',that);
      that._hideTurbo();
      return this;
    },
    /**
     * body上注册隐藏事件
     */
    _hideTurbo:function(){
      var that = this;
      Y.on('click',function(ev){
        var aDom = ev.target;
        if(!that.con.contains(aDom) && that.couplingIpt.get('id')!= aDom.get('id')){
          that.hide();
        }
      },'body');
    },
    /**
     * 隐藏 
     */
    hide:function(){
      var that = this;
      that.con.setStyle('visibility','hidden');
      return this;
    },
    /**
     * 创建参数列表
     * @method buildParam
     * @param {obj} 配置对象
     * @private
     */
    buildParam:function(o){
      var that = this;
      if(typeof o == 'undefined' || o == null){
        var o = {};
      }
      //将配置项赋值给calendar对象
      that.date = (typeof o.date == 'undefined' || o.date == null)?new Date():o.date;
      that.selected = (typeof o.selected == 'undefined' || o.selected == null)?that.date:o.selected;
      that.multi_page = (typeof o.multi_page == 'undefined' || o.multi_page == null)?1:o.multi_page;
      that.closeable = (typeof o.closeable == 'undefined' || o.closeable == null)?true:o.closeable;
      that.range_select = (typeof o.range_select == 'undefined' || o.range_select == null)?false:o.range_select;
      that.mindate = (typeof o.mindate == 'undefined' || o.mindate == null)?false:o.mindate;
      that.maxdate = (typeof o.maxdate == 'undefined' || o.maxdate == null)?false:o.maxdate;
      that.multi_select = (typeof o.multi_select== 'undefined' || o.multi_select == null)?false:o.multi_select;
      that.navigator = (typeof o.navigator == 'undefined' || o.navigator == null)?true:o.navigator;
      that.arrow_left = (typeof o.arrow_left == 'undefined' || o.arrow_left == null)?false:o.arrow_left;
      that.arrow_right = (typeof o.arrow_right == 'undefined' || o.arrow_right == null)?false:o.arrow_right;
      that.popup = (typeof o.popup == 'undefined' || o.popup== null)?true:o.popup;
      that.withtime = (typeof o.withtime == 'undefined' || o.withtime == null)?false:o.withtime;
      that.action = (typeof o.action == 'undefined' || o.action == null)?['click']:o.action;

      that.inputname = (typeof o.inputname == 'undefined' || o.inputname == null)?'o.date':o.inputname;

      that.level = (typeof o.level == 'undefined' || o.level == null)?3:o.level;
      that.minMode = (typeof o.minMode == 'undefined' || o.minMode == null)?0:o.minMode;
      if(60%that.minMode != 0){
        that.minMode = 0;
      }
      that.helpMode = (typeof o.helpMode == 'undefined' || o.helpMode == null)?false:o.helpMode;

      if(that.popup){
        if(_L.isString(that.id)){
          that.couplingIpt = Y.one('#' + that.id)||undefined;
        }else{
          that.couplingIpt = that.id;
        }
      }

      if(o.ykNowDate){
        if(o.ykNowDate instanceof Date){
          that.ykNowDate = o.ykNowDate;
        }else{
          var configDate = o.ykNowDate.split('-');
          that.ykNowDate = new Date(configDate[0],configDate[1]-1,configDate[2],configDate[3]?configDate[3]:0,configDate[4]?configDate[4]:0,configDate[5]?configDate[5]:0);
        }
      }else{
        that.ykNowDate = new Date();
      }
      
      //解析日期初始值
      if(that.couplingIpt){
        if(that.couplingIpt.get('value') !== ''){
          var selectedSTR = that.couplingIpt.get('value').replace(/^\s+|\s+$/g,'');
          that.selectSTR = selectedSTR;
          var strArray = selectedSTR.split(' ');
          //时间处理
          var timeSTR = (strArray[1] == undefined?'':strArray[1]);
          that.timeSTR = timeSTR;
          timeSTR = timeSTR.split(':');
          //日期处理
          that.dateSTR = strArray[0];
          that.couplingIpt.set('value',strArray[0]);
          selectedSTR = strArray[0].split('-');
          //处理显示值
          that.selected = new Date(selectedSTR[0],(selectedSTR[1]-1),selectedSTR[2],(timeSTR[0]==undefined)?'':timeSTR[0],(timeSTR[1]==undefined)?'':timeSTR[1],(timeSTR[2]==undefined)?'':timeSTR[2]);
          that.date = that.selected;
        }else{
          that.dateSTR = '';
          that.timeSTR = '';
        }
      }else{
          that.dateSTR = '';
          that.timeSTR = '';
      }

      //选择一个日期范围（不是可选范围）
      if(typeof o.range != 'undefined' && o.range != null){
        var s = that.showdate(1,new Date(o.range.start.getFullYear()+'/'+(o.range.start.getMonth()+1)+'/'+(o.range.start.getDate())));
        var e = that.showdate(1,new Date(o.range.end.getFullYear()+'/'+(o.range.end.getMonth()+1)+'/'+(o.range.end.getDate())));
        that.range = {
          start:s,
          end:e
        };
        //alert(Y.dump(that.range));
      }else {
        that.range = {
          start:null,
          end:null
        };
      }
      that.EV = [];
      return this;
    },
    /**
     * 过滤参数列表
     */
    parseParam:function(o){
      var that = this;
      if(typeof o == 'undefined' || o == null){
        var o = {};
      }
      for(var i in o){
        that[i] = o[i];
      }
      that.handleDate();
      return this;
    },
    /**
     * 得到某月有多少天,需要给定年来判断闰年
     */
    getNumOfDays:function(year,month){
      return 32-new Date(year,month-1,32).getDate();
    },
    /**
     * 模板函数，应当在base中 
     */
    templetShow : function(templet, data){
      var that = this;
      if(data instanceof Array){
        var str_in = '';
        for(var i = 0;i<data.length;i++){
          str_in += that.templetShow(templet,data[i]);
        }
        templet = str_in;
      }else{
        var value_s = templet.match(/{\$(.*?)}/g);
        if(data !== undefined && value_s != null){
          for(var i=0, m=value_s.length; i<m; i++){
            var par = value_s[i].replace(/({\$)|}/g, '');
            value = (data[par] !== undefined) ? data[par] : '';
            templet = templet.replace(value_s[i], value);
          }
        }
      }
      return templet;
    },
    /**
     * 处理日期，将weekday、day、month、year属性赋值给对象
     * @method handleDate
     * @private
     */
    handleDate:function(){
      /*
      that.month
      that.year
      that.selected
      that.mindate
      that.maxdate
      */
      var that = this;
      var date = that.date;
      that.weekday= date.getDay() + 1;//星期几 //指定日期是星期几
      that.day = date.getDate();//几号
      that.month = date.getMonth();//月份
      that.year = date.getFullYear();//年份
      return this;
    },
    //get标题
    getHeadStr:function(year,month){
      return year.toString() + '年' + (Number(month)+1).toString() + '月';
    },
    //月加
    monthAdd:function(){
      var that = this;
      if(that.month == 11){
        that.year++;
        that.month = 0;
      }else{
        that.month++;
      }
      that.date = new Date(that.year.toString()+'/'+(that.month+1).toString()+'/'+'1');
      return this;
    },
    //月减
    monthMinus:function(){
      var that = this;
      if(that.month == 0){
        that.year-- ;
        that.month = 11;
      }else{
        that.month--;
      }
      that.date = new Date(that.year.toString()+'/'+(that.month+1).toString()+'/'+ '1');
      return this;
    },
    /**
     * 裸算下一个月的年月,[2009,11],年:fullYear，月:从0开始计数
     * @method computeNextMonth
     * @param {Array} a 数组年、月[2009,11]
     * @public
     */
    computeNextMonth:function(a){
      var that = this;
      var _year = a[0];
      var _month = a[1];
      if(_month == 11){
        _year++;
        _month = 0;
      }else{
        _month++;
      }
      return [_year,_month];
    },
    //处理箭头
    handleArrow:function(){

    },
    //得到范围
    getRange:function(){

    },
    //得到当前选中
    getSelect:function(){

    },
    //处理起始日期,d:Date类型
    handleRange : function(d){
      var that = this;
      if((that.range.start == null && that.range.end == null )||(that.range.start != null && that.range.end != null)){
        that.range.start = d;
        that.range.end = null;
        that.render();
      }else if(that.range.start != null && that.range.end == null){
        that.range.end = d;
        if(that.range.start.getTime() > that.range.end.getTime()){
          var __t = that.range.start;
          that.range.start = that.range.end;
          that.range.end = __t;
        }
        that.EventCenter.fire('rangeselect',that.range);
        that.render();
      }
      return this;

    },
    //constructor
    /**
     * 子日历构造器
     * @constructor Y.Calendar.prototype.Call
     * @param {object} config ,参数列表，需要指定子日历所需的年月
     * @param {object} fathor,指向Y.Calendar实例的指针，需要共享父框的参数
     * @return 子日历的实例
     */
    Call:function(config,fathor){
      //属性
      this.fathor = fathor;
      this.month = Number(config.month);
      this.year = Number(config.year);
      this.prev_arrow = config.prev_arrow;
      this.next_arrow = config.next_arrow;
      this.node = null;
      this.id = '';
      this.EV = [];
      //日历模板
      this.html = [
        '<div class="c-box" id="{$id}">',
          '<div class="c-hd">', 
            '<a href="javascript:void(0);" class="prev {$prev}"><</a>',
            '<a href="javascript:void(0);" class="title">{$title}</a>',
            '<a href="javascript:void(0);" class="next {$next}">></a>',
          '</div>',
          '<div class="c-bd">',
            '<div class="whd">',
              '<span>日</span>',
              '<span>一</span>',
              '<span>二</span>',
              '<span>三</span>',
              '<span>四</span>',
              '<span>五</span>',
              '<span>六</span>',
            '</div>',
            '<div class="dbd clearfix">',
              '{$ds}',
              /*
              <a href="" class="null">1</a>
              <a href="" class="disabled">3</a>
              <a href="" class="selected">1</a>
              <a href="" class="today">1</a>
              <a href="">1</a>
            */
            '</div>',
          '</div>',
          '<div class="setime hidden">',
          '</div>',
          '<div class="c-ft {$showtime}">',
            '<div class="c-time">',
              '时间：00:00 	&hearts;',
            '</div>',
          '</div>',
        '</div><!--#c-box-->'
      ].join("");
      //年月选择器
      this.nav_html = [
          '<p>',
          '月',
            '<select value="{$the_month}">',
              '<option class="m1" value="1">01</option>',
              '<option class="m2" value="2">02</option>',
              '<option class="m3" value="3">03</option>',
              '<option class="m4" value="4">04</option>',
              '<option class="m5" value="5">05</option>',
              '<option class="m6" value="6">06</option>',
              '<option class="m7" value="7">07</option>',
              '<option class="m8" value="8">08</option>',
              '<option class="m9" value="9">09</option>',
              '<option class="m10" value="10">10</option>',
              '<option class="m11" value="11">11</option>',
              '<option class="m12" value="12">12</option>',
            '</select>',
          '</p>',
          '<p>',
          '年',
            '<input type="text" value="{$the_year}" onfocus="this.select()"></input>',
          '</p>',
          '<p>',
            '<button class="ok">确定</button><button class="cancel">取消</button>',
          '</p>'
      ].join("");


      //方法
      /**
       * 渲染子日历的UI
       */
      this.renderUI = function(){
        var cc = this;
        cc.HTML = '';
        var _o = {};
        _o.prev = '';
        _o.next = '';
        _o.title = '';
        _o.ds = '';
        if(!cc.prev_arrow){
          _o.prev = 'hidden';
        }
        if(!cc.next_arrow){
          _o.next = 'hidden';
        }
        if(!cc.fathor.showtime){
          _o.showtime = 'hidden';
        }
        _o.id = cc.id = 'cc-' + Y.guid();
        _o.title = cc.fathor.getHeadStr(cc.year,cc.month);
        //生成日期的html
        cc.createDS();
        _o.ds = cc.ds;
        //cc.node = Y.Node.create(cc.fathor.templetShow(cc.html,_o));
        //给cc.html赋值
        cc.fathor.con.appendChild(Y.Node.create(cc.fathor.templetShow(cc.html,_o)));
        cc.node = Y.one('#'+cc.id);
        return this;
      };
      /**
       * 创建子日历的事件
       */
      this.buildEvent = function(){
        var cc = this;
        var con = Y.one('#'+cc.id);
        //flush event
        for(var i = 0;i<cc.EV.length;i++){
          if(typeof cc.EV[i] != 'undefined'){
            cc.EV[i].detach();
          }
        }
        cc.EV[0] = con.one('div.dbd').on('click',function(e){
          e.halt();
          if(e.target.hasClass('null'))return;
          if(e.target.hasClass('disabled'))return;
          var selectedd = Number(e.target.get('innerHTML'));

          var d = new Date(cc.year,cc.month,selectedd);

          //that.callback(d);
          if(cc.fathor.popup && cc.fathor.closeable){
            cc.fathor.hide();
          }
          
          //回填到couplingIpt中
          if(fathor.couplingIpt){
            //设置select值
            var dstr = [d.getFullYear(), d.getMonth()+1, d.getDate()].join('-');
            fathor.dateSTR = dstr;
            fathor.selected.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
            //调用统一的回填接口
            fathor.couplingIpt.set('value',dstr);
            fathor.excon.one('.k2-cal-post').set('value',dstr + ((fathor.timeSTR == '')?'':(' ' + fathor.timeSTR)));
            //调用统一的回填方法
            fathor._selectFun();
          }
          if(cc.fathor.range_select){
            cc.fathor.handleRange(fathor.selected);
          }
          cc.fathor.render({selected:fathor.selected});
        });
        //向前
        cc.EV[1] = con.one('a.prev').on('click',function(e){
          e.halt();
          cc.fathor.monthMinus().render();
          cc.fathor.EventCenter.fire('switch',new Date(cc.fathor.year+'/'+(cc.fathor.month+1)+'/01'));
        });
        //向后
        cc.EV[2] = con.one('a.next').on('click',function(e){
          e.halt();
          cc.fathor.monthAdd().render();
          cc.fathor.EventCenter.fire('switch',new Date(cc.fathor.year+'/'+(cc.fathor.month+1)+'/01'));
        });
        if(cc.fathor.navigator){
          cc.EV[3] = con.one('a.title').on('click',function(e){
            e.halt();	
            var setime_node = con.one('.setime');
            setime_node.set('innerHTML','');
            var in_str = cc.fathor.templetShow(cc.nav_html,{
              the_month:cc.month+1,
              the_year:cc.year
            });
            setime_node.set('innerHTML',in_str);
            setime_node.removeClass('hidden');
            //注册input回车事件
            con.one('input').on('keydown',function(e){
              if(e.keyCode == 38){//up
                e.target.set('value',Number(e.target.get('value'))+1);
                e.target.select();
              }
              if(e.keyCode == 40){//down
                e.target.set('value',Number(e.target.get('value'))-1);
                e.target.select();
              }
              if(e.keyCode == 13){//enter
                var _month = con.one('.setime').one('select').get('value');
                var _year  = con.one('.setime').one('input').get('value');
                //选择年月的异常处理
                if(isNaN(_year) || _year == ''){
                  var old = cc.fathor.selected.getYear();
                  old = old>1900?old:(old + 1900);
                  con.one('.setime').one('input').set('value',old);
                }else{
                  cc.fathor.render({
                    date:new Date(_year+'/'+_month+'/01')
                  })
                  cc.fathor.EventCenter.fire('switch',new Date(_year+'/'+_month+'/01'));
                  con.one('.setime').addClass('hidden');
                }
              }
            });
          });
          cc.EV[4] = con.one('.setime').on('click',function(e){
            e.halt();
            //注册确定按钮事件
            if(e.target.hasClass('ok')){
              var _month = con.one('.setime').one('select').get('value');
              var _year  = con.one('.setime').one('input').get('value');
              //选择年月的异常处理
              if(isNaN(_year) || _year == ''){
                var old = cc.fathor.selected.getYear();
                old = old>1900?old:(old + 1900);
                con.one('.setime').one('input').set('value',old);
              }else{
                cc.fathor.render({
                  date:new Date(_year+'/'+_month+'/01')
                });
                cc.fathor.EventCenter.fire('switch',new Date(_year+'/'+_month+'/01'));
                con.one('.setime').addClass('hidden');
              }
            }else if(e.target.hasClass('cancel')){
              con.one('.setime').addClass('hidden');
            }
          });
        }
        return this;

      };


      /**
       * 得到当前子日历的node引用
       */
      this.getNode = function(){
        var cc = this;
        return cc.node;
      };
      /**
       * 生成日历中日期的html
       */
      this.createDS = function(){
        var cc = this;

        var s = '';
        var startweekday = new Date(cc.year+'/'+(cc.month+1)+'/01').getDay();//当月第一天是星期几
        var k = cc.fathor.getNumOfDays(cc.year,cc.month + 1) + startweekday;//从空格到当月最后一天的总格数量
        
        for(var i = 0;i< k;i++){
          //prepare data {{
          if(/532/.test(Y.UA.webkit)){//hack for chrome
            var _td_s = new Date(cc.year+'/'+Number(cc.month+1)+'/'+(i+1-startweekday).toString());
          }else {
            var _td_s = new Date(cc.year+'/'+Number(cc.month+1)+'/'+(i+2-startweekday).toString());
          }
          var _td_e = new Date(cc.year+'/'+Number(cc.month+1)+'/'+(i+1-startweekday).toString());
          //prepare data }}
          if(i < startweekday){//null
            s += '<a href="javascript:void(0);" class="null">0</a>';
          }else if( cc.fathor.mindate instanceof Date
                && new Date(cc.year+'/'+(cc.month+1)+'/'+(i+1-startweekday)).getTime() <= cc.fathor.mindate.getTime()  ){//disabled
            s+= '<a href="javascript:void(0);" class="disabled">'+(i - startweekday + 1)+'</a>';
            
          }else if(cc.fathor.maxdate instanceof Date
                && new Date(cc.year+'/'+(cc.month+1)+'/'+(i+1-startweekday)).getTime() > cc.fathor.maxdate.getTime()  ){//disabled
            s+= '<a href="javascript:void(0);" class="disabled">'+(i - startweekday + 1)+'</a>';


          }else if((cc.fathor.range.start != null && cc.fathor.range.end != null) //日期选择范围
                && (
                  _td_s.getTime()>=cc.fathor.range.start.getTime() && _td_e.getTime() < cc.fathor.range.end.getTime()) ){
                
                //alert(Y.dump(_td_s.getDate()));
                
              if(i == (startweekday + (new Date()).getDate() - 1) 
                && (new Date()).getFullYear() == cc.year 
                && (new Date()).getMonth() == cc.month){//今天并被选择
                s+='<a href="javascript:void(0);" class="range today">'+(i - startweekday + 1)+'</a>';
              }else{
                s+= '<a href="javascript:void(0);" class="range">'+(i - startweekday + 1)+'</a>';
              }

          }else if(i == (startweekday + (new Date()).getDate() - 1) 
                && (new Date()).getFullYear() == cc.year 
                && (new Date()).getMonth() == cc.month){//today
            s += '<a href="javascript:void(0);" class="today">'+(i - startweekday + 1)+'</a>';

          }else if(i == (startweekday + cc.fathor.selected.getDate() - 1) 
                && cc.month == cc.fathor.selected.getMonth() 
                && cc.year == cc.fathor.selected.getFullYear()){//selected
            s += '<a href="javascript:void(0);" class="selected">'+(i - startweekday + 1)+'</a>';
          }else{//other
            s += '<a href="javascript:void(0);">'+(i - startweekday + 1)+'</a>';
          }
        }
        //在月尾最后一天后面补上空格
        if(k%7 != 0){
          for(var i = 0;i<(7-k%7);i++){
            s += '<a href="javascript:void(0);" class="null">0</a>';
          }
        }
        cc.ds = s;
        return this;
      };
      /**
       * 渲染 
       */
      this.render = function(){
        var cc = this;
        cc.renderUI();
        cc.buildEvent();
        return this;
      };


    }
    //Call constructor over
  },0,null,4);



},'1.0.0',{requires:['node-base','node-style','event-base']});

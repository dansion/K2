/*!
 * @revision:
 */
/*
 * @author:zhanyan@taobao.com
 * @version:1-0-0
 */
 /**
 * The module-name module creates the blah blah
 * @module module-name
 */
YUI.add('k2-local-store',function(Y){
    // handy constants and shortcuts used in the module
    var Lang    = Y.Lang,
        JSON    = Y.JSON,
        w       = Y.config.win,
        d       = Y.config.doc;

    //静态变量
    var MODE_NOOP         = 0,//
        MODE_HTML5        = 1,//OK
        MODE_GECKO        = 2,//?
        MODE_DB           = 3,//?
        MODE_USERDATA     = 4,//OK
        MODE_SWF          = 5,//?
        NAME              = 'k2-local-store';
    
    var EVT_READY         = 'ready',
        EVT_FAIL          = 'fail',
        EVT_SET           = 'set',
        EVT_GET           = 'get';
    
    //为webDB模式的参数
    var DB_NAME           = 'k2_storage_lite',
        DB_DISPLAYNAME    = 'K2 StorageLite data',
        DB_MAXSIZE        = 1048576,
        DB_VERSION        = '1.0';
    
    //为userdata模式的参数
    var USERDATA_PATH     = 'k2_storage_lite',
        USERDATA_NAME     = 'data';

    Y.StorageFullError = function (message) {
        Y.StorageFullError.superclass.constructor.call(message);
        this.name    = 'StorageFullError';
        this.message = message || 'Maximum storage capacity reached';
        if (Y.UA.ie) {
            this.description = this.message;
        }
    };
    Y.extend(Y.StorageFullError, Error);

    function LocalStore(config) {
      if(LocalStore.singleobj){
        return LocalStore.singleobj;
      }else{
        LocalStore.superclass.constructor.apply(this,arguments);
      }
    }
    
    LocalStore.NAME = NAME;

    LocalStore.ATTRS = {
      'storageMode':{
        value:0
      },
      'storageDriver':{
        value:null
      },
      '_events':{
        value:{}
      },
      '_data':{
        value:{}
      }
    };

    Y.extend(LocalStore, Y.Base,{
      //初始化函数
      initializer:function(cfg){
        //检测存储模式
        this.set('storageMode',this.getMode());
        
        //创建自定义事件
        this._creatEvent();

        //创建存储引擎
        this._create();

        LocalStore.singleobj = this;
      },
      //创建自定义方法
      _creatEvent:function(){
        var eventArray = this.get('_events');
        //创建了自定义事件
        eventArray[EVT_READY] = this.publish(EVT_READY,{fireOnce: true,emitFacade:true});
        eventArray[EVT_FAIL] = this.publish(EVT_FAIL,{fireOnce: true,emitFacade:true});
        eventArray[EVT_GET] = this.publish(EVT_GET,{fireOnce: true,emitFacade:true});
        eventArray[EVT_SET] = this.publish(EVT_GET,{fireOnce: true,emitFacade:true});
      },
      //获取所支持的存储模式
      getMode:function(){
        var mod = 0;
        var temp = d.createElement('span');

        //模式确定
        if (w.localStorage){
          //HTML5 模式
          mod = MODE_HTML5;
        } else if (w.globalStorage) {
          //Firefox 2 and 3.0.
          mod = MODE_GECKO;
        } else if (w.openDatabase && navigator.userAgent.indexOf('Chrome') === -1) {
          //Safari 3.1 and 3.2.。不推荐使用这种模式
          this.set('storageMode',MODE_DB);
        } else if (Y.UA.ie >= 5) {
          //ie6-7下使用
          mod = MODE_USERDATA;
        }else if(Y.UA.flashMajor > 7){
          //无法使用本地存储
          mod = MODE_SWF;
        } else{
          mod = MODE_NOOP;
        }
         return mod;
      },
      //创建本地存储引擎
      _create:function(){
        var that = this;
        switch(this.get('storageMode')){
          case MODE_HTML5:
            this.set('storageDriver',new HTML5Driver());
            this.get('_events')[EVT_READY].fire();
            break;

          case MODE_GECKO:
            this.set('storageDriver',new GECKODriver());
            this.get('_events')[EVT_READY].fire();
            break;

          case MODE_DB:
            this.set('storageDriver',new DBDriver());
            this.get('_events')[EVT_READY].fire();
            break;

          case MODE_USERDATA:
            var that = this;
            //辅助
            Y.on('domready', function () {
              try{
                that.set('storageDriver',new USERDATADriver());
              }catch(e){
                that.set('storageDriver',new SWFDriver());
                that.set('storageMode',MODE_SWF);
              }
              that.get('_events')[EVT_READY].fire();
            });
            break;

          case MODE_SWF:
			var driver = new SWFDriver();
            this.set('storageDriver', driver);

			driver.driver.on('contentReady', function(){
				this.get('_events')[EVT_READY].fire();
				driver._isReady = true;
			 }, this);
			
            break;
          
          default:
            break;
        }

        if(this.get('storageDriver') == null){
          this.get('_events')[EVT_FAIL].fire();
        }
      },
      clear:function(){
        this.get('storageDriver').clear();
      },
      getItem:function(key){
        return this.get('storageDriver').getItem(key);
      },
      setItem:function(key,value){
        this.get('storageDriver').setItem(key,value);
      },
      removeItem:function(key){
        this.get('storageDriver').removeItem(key);
      },
      _save:function(){
        this.get('storageDriver')._save();
      }
    });
    
    //Driver的基类
    function BaseDriver(){};
    BaseDriver.prototype = {
      clear:function(){},
      getItem:function(key){},
      setItem:function(key,value){},
      removeItem:function(key){},
      _save:function(){},
      constructor:BaseDriver
    }

    //Driver的HTML5子类
    function HTML5Driver(config) {
      this.driver = w.localStorage;
    }
    Y.extend(HTML5Driver,BaseDriver,{
      clear:function(){
        this.driver.clear();
      },
      getItem:function(key){
        return this.driver.getItem(key);
      },
      setItem:function(key,value){
        this.driver.setItem(key,value);
      },
      removeItem:function(key){
        this.driver.removeItem(key);
      }
    });

    //Driver的GECKO子类
    function GECKODriver(config) {
      this.driver = w.globalStorage[w.location.hostname];
    }
    Y.extend(GECKODriver,BaseDriver,{
      clear:function(){
        for (var key in this.driver) {
          if (this.driver.hasOwnProperty(key)) {
              this.driver.removeItem(key);
              delete this.driver[key];
          }
        }
      },
      getItem:function(key){
        return this.driver[key].value;
      },
      setItem:function(key,value){
        this.driver.setItem(key,value);
      },
      removeItem:function(key){
        this.driver.removeItem(key);
      }
    });

    //Driver的DB子类
    function DBDriver(config) {
      this.localdata = {};
      var that = this;
      this.driver = w.openDatabase(DB_NAME,DB_VERSION,DB_DISPLAYNAME,DB_MAXSIZE);
      //辅助
      this.driver.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS " + DB_NAME + "(name TEXT PRIMARY KEY, value TEXT NOT NULL)");
        t.executeSql("SELECT value FROM " + DB_NAME + " WHERE name = 'data'", [], function (t, results) {
          if (results.rows.length) {
            try {
              that.localdata = JSON.parse(results.rows.item(0).value);
            } catch (ex) {
              that.localdata = {};
            }
          }
        });
      });
    }
    Y.extend(DBDriver,BaseDriver,{
      clear:function(){
        this.localdata = {};
        this._save();
      },
      getItem:function(key){
        var temp = this.localdata;
        return temp.hasOwnProperty(key) ? temp[key] : null;
      },
      setItem:function(key,value){
        this.localdata[key] = value;
        this._save();
      },
      removeItem:function(key){
        delete this.localdata[key];
        this._save();
      },
      _save:function(){
        this.driver.transaction(function (t) {
            t.executeSql("REPLACE INTO " + DB_NAME + " (name, value) VALUES ('data', ?)", [JSON.stringify(this.localdata)]);
        });
      }
    });

    //Driver的USERDATA子类
    function USERDATADriver(config){
      this.localdata = {};
      var dom = d.createElement('span');
      var that = this;
      dom.addBehavior('#default#userData');
      d.body.appendChild(dom);
      that.driver = dom;
      //辅助
      d.body.appendChild(dom);
      that.driver.load(USERDATA_PATH);
      that.localdata = JSON.parse(that.driver.getAttribute(USERDATA_NAME) || '{}');
    }
    Y.extend(USERDATADriver,BaseDriver,{
      clear:function(){
        this.localdata = {};
        this._save();
      },
      getItem:function(key){
        var temp = this.localdata;
        return temp.hasOwnProperty(key) ? temp[key] : null;
      },
      setItem:function(key,value){
        this.localdata[key] = value;
        this._save();
      },
      removeItem:function(key){
        delete this.localdata[key];
        this._save();
      },
      _save:function(){
        var _data = JSON.stringify(this.localdata);
        try {
            this.driver.setAttribute(USERDATA_NAME, _data);
            this.driver.save(USERDATA_PATH);
        } catch (ex) {
            throw new Y.StorageFullError();
        }
      }
    });

    //Driver的SWF子类
    function SWFDriver(config) {
		var container =  Y.Node.create('<div style="position:absolute;z-index:9999;visibility:visible;width:18px;height:18px;left:0;top:0;"></div>'),
		  params = {version: "9.0.125",
				fixedAttributes: {
					allowScriptAccess:"always", 
					scale: "noscale",
					quality: "high",
					menu: "false",
					wmode: "transparent"
				}  
		  };
		  Y.one('body').insertBefore(container, document.body.firstChild);
		  this.driver = new Y.SWF(container,'http://k.kbcdn.com/k2/localstore/SWFStore.swf?t='+new Date(), params);
    }
    Y.extend(SWFDriver,BaseDriver,{
      clear:function(){
        this.driver.callSWF('clear', []);
      },
      getItem:function(key){
        return this.driver.callSWF('getValueOf',[key]);
      },
      setItem:function(key,value){
		this.driver.callSWF('setItem',[key, value]);
      },
      removeItem:function(key){
        this.driver.callSWF('removeItem', [key]);
      }
    });

    Y.k2LocalStore = LocalStore;

},'1.0.0',{
  requires: ['node-base','base-base','base-build','k2-swf','swfdetect','json-parse','json-stringify']
});
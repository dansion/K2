/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global YUI*/
/**
 * The module-name module creates the blah blah
 * @module data-lazyload-textaerea
 */
/*
 * @author:butian
 * @version:2-0-0
 */

YUI.add('k2-data-lazyload-textarea', function (Y) {

    "use strict";
    // handy constants and shortcuts used in the module
    var Lang = Y.Lang,
      OBJECT = Y.Object,
      NAME = 'k2-datalazyload-textarea',
      TEXTAREA = "<textarea class='lazy-load-textarea'></textarea>",
      DEFAULT_CONFIG = {
        containers : ".lazy-load"
      },
      DOMREADY = "domready",
      SCROLL = 'scroll',
      RESIZE = "window:resize",
      IO_COMPLETE = "io:complete",
      IFRAME_URL = "?noscript=true";

    /**
     * The datalazyload class does ….
     * @class datalazyload
     * @extends Base
     * @uses null
     * @constructor
     * @cfg {object} configuration attributes
     */

    Y.Datalazyload = Y.Base.create(
        NAME,
        Y.Base,
        [],
        {
          //use to handle events
          _eventHandles: null,
          _len : null,
          _eventName : null,
          _htmlCode : null,
          _containers : null,
          _cont:null ,

          //event container
          _eventContainer : {
            INIT_EVENT_BIND : {
              name: "bindEvent",
              defFn: function(){

                var that= this,
                  et = this._eventContainer;
                this._eventHandles.push( Y.on(SCROLL, function(){

                  that.fire( et.CHECK["name"] );

                }) );

                this._eventHandles.push( Y.on(RESIZE, function(){

                  that.fire( et.CHECK["name"] );

                }) );
              }
            },
            CHECK : {
              name: "begincheck",
              defFn: function(){

                var ev,
                  i= 0,
                  that = this,
                  innerHtml,
                  et = this._eventContainer;

                //this.fire( et.GETCONTAINERS["name"] );
                this._containers = Y.all( this._cont );
                this._len = this._containers.size();
                this._containers.each( function( ){

                  if( that._aboveViewPort(this) && this.get("tagName").toLowerCase() === "textarea" ){

                    innerHtml = this.get("value");
                    //innerHtml = innerHtml.replace(/&lt;(.+?)&gt;/g,"<$1>");
                    //innerHtml = Y.Node.create(innerHtml);
                    Y.log(this);
                    this.replace(innerHtml);
                    ev = "lazyloadReady:" + this.get("className").replace(/\D+(\d+)/g, "$1");
                    Y.fire(ev);
                  }

                });

              }
            },
            GETCONTAINERS : {

              name: "getcontainers",
              defFn: function(){

                this._containers = Y.all( this._cont );

                this._containers.each(function( item, i  ){

                  this.addClass( "order-" + (i + 1) );

                })

              }

            },
            MERGECONF : {

              name: "mergeConfig",
              defFn: function( opt ){
                this._config = Y.merge( this.defaultConfigs, opt );
                this._cont = this._config.containers;
              }

            }

          },

          //default configration

          defaultConfigs : {

            containers : ".lazy-load"

          },

          //extent functions

          initializer : function( option ){

            var that = this,
              et = this._eventContainer;

            this._eventHandles = [];

            OBJECT.each(this._eventContainer, function( value, key, o){

              that.publish( o[key]['name'], { defaultFn: o[key]["defFn"] } )

            }, this._eventContainer);

            this.fire( et.MERGECONF["name"], option );
            this.fire( et.GETCONTAINERS["name"] );

            Y.on(DOMREADY, this._init, this);

          },
          _init : function(){

            var et = this._eventContainer;

            this.fire( et.INIT_EVENT_BIND["name"] );
            this.fire( et.CHECK['name'] );

          },
          _aboveViewPort : function( node ){

            var dscroll, dtop;

            dscroll = node.get("winHeight") + node.get("docScrollY");
            dtop = node.get("offsetTop");
            dtop = dtop === 2 ? node.get("offsetTop") : dtop;
            Y.log(dscroll + "|" + dtop);

            if( ( dscroll ) > dtop){
              return true;
            }
            return false;

          },
          destructor : function(){

            Y.each(this._eventHandles, function (handle) {
                handle.detach();
            });

          }
        },
        {
            // Static members here, specially:
            ATTRS: {



            }
        }
    );

}, '1.1.0', {requires: ['event-base','node-base','node-screen','io-base','event-custom-base','event-resize']});
package{
	import com.koubei.util.K2Bridge;
	
	import flash.display.Sprite;
	import flash.display.Graphics;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.Timer;
	import flash.utils.setTimeout;
	import flash.events.TimerEvent;
	import flash.events.MouseEvent;
	
	[SWF(width="400", height="240")]
	public class SWF extends Sprite{
		
		protected var timerField:TextField;
		protected var textField:TextField;
		protected var timer:Timer;
		protected var button:Sprite;
		protected var bridge:K2Bridge;
		private var tid:int = 0;
		public function SWF(){
			init();
		}
		
		protected function init():void{
			createChildren();
			button.addEventListener(MouseEvent.CLICK, onButtonClicked);
			timer.addEventListener(TimerEvent.TIMER, onTimer);
			timer.start();
			bridge = new K2Bridge(stage);
			var self:* = this;
			setTimeout(function(){
				self.initBridge();
			}, 50);
		}
		
		private function initBridge():void{
			bridge.addCallbacks({
				callAS: callAS
			});
		}

		protected function createChildren():void{
			timerField = new TextField;
			timerField.x = 20;
			timerField.y=20;
			timerField.width=300;
			timerField.height=30;
			timerField.background = true;
			timerField.backgroundColor = 0xEEEEEE;
			addChild(timerField);
			
			textField = new TextField;
			textField.x = 20;
			textField.y = 100;
			textField.width = 300;
			textField.height=60;
			textField.background = true;
			textField.backgroundColor = 0xEEEEEE;
			addChild(textField);
			
			button = createButton("call JS");
			button.x = 20;
			button.y = 180;
			addChild(button);
			
			timer = new Timer(1000);
		}
		
		public function callAS(event:*):void{
			textField.text = event.message;
		}
		public function callJS(message:String):void{
			bridge.sendEvent({type:"message", message:message});
		}
		private function onTimer(event:TimerEvent):void{
			timerField.text = ""+tid++;
		}
		
		private function onButtonClicked(event:MouseEvent):void{
			callJS("User clicked the SWF");
		}
		private function createButton(label:String):Sprite{
			var s:Sprite = new Sprite();
			var g:Graphics = s.graphics;
			g.beginFill(0x333333);
			g.drawRect(0, 0, 100, 25);
			var txt:TextField = new TextField;
			txt.y =2;
			var tf:TextFormat = txt.getTextFormat();
			tf.color = 0xffffff;
			tf.size = 14;
			tf.align ="center";
			txt.text = label;
			txt.setTextFormat(tf);
			s.buttonMode=true;
			s.addChild(txt);
			s.mouseChildren = false;
			return s;
		}
	}
}
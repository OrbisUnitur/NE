/*:
 * @plugindesc Version: 1.04 | Gain extra stats when you level up!
 * @author William Ramsey (TheUnproPro)
 *
 * @param ---Boost Settings---
 *
 * @param HP Boost Value
 * @desc How much HP is gained per boost point?
 * @default 10
 *
 * @param MP Boost Value
 * @desc How much MP is gained per boost point?
 * @default 5
 *
 * @param Other Boost Value
 * @desc How much stats are gained per boost point?
 * @default 1
 *
 * @param ---Color Settings---
 *
 * @param Block Color
 * @desc Color of the block being drawn around text and other objects.
 * @default 0, 0, 0, 0.5
 *
 * @param EXP Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 150, 150, 0, 1
 *
 * @param EXP Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 255, 255, 0, 1
 *
 * @param ---
 * @param Atk Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 150, 0, 0, 1
 *
 * @param Atk Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 255, 150, 0, 1
 *
 * @param ---
 * @param Def Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 0, 150, 0, 1
 *
 * @param Def Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 0, 255, 0, 1
 *
 * @param ---
 * @param Mat Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 0, 150, 150, 1
 *
 * @param Mat Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 0, 255, 255, 1
 *
 * @param ---
 * @param Mdf Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 0, 150, 0, 1
 *
 * @param Mdf Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 0, 255, 150, 1
 *
 * @param ---
 * @param Agi Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 150, 150, 150, 1
 *
 * @param Agi Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 255, 255, 255, 1
 *
 * @param ---
 * @param Luk Gauge Color 1
 * @desc Gauge Color on left end.
 * @default 150, 150, 0, 1
 *
 * @param Luk Gauge Color 2
 * @desc Gauge Color on right end.
 * @default 255, 255, 0, 1
 *
 * @param ---Image Settings---
 *
 * @param Draw Background
 * @desc Draws a background behind the characters stats.
 * @default true
 *
 * @param Background Location
 * @desc Determines what folder the background is held in.
 * @default title1
 *
 * @param Background Image
 * @desc Name of the image.
 * @default CrossedSwords
 *
 * @param ---Other Settings---
 *
 * @param UBP Multiplier
 * @desc How many BP is gained per level up?
 * @default 5
 *
 * @help
 *
 * This is prettymuch plug&play, however there are a couple
 * of plugin commands. You can add or subtract BP manually
 * using upp_BpAdd actor_id value, where actor_id is the id
 * of the actor, and value is how much you want to give.
 * You can also take away using upp_BpSub instead.
 *
 * Free for commercial and non-commercial projects,
 * just credit William Ramsey
 *
 * Config BG Location Names:
 * animations, battlebacks1, battlebacks2,
 * characters, enemies, faces, parallaxes,
 * pictures, sv_actors, sv_enemies, system, 
 * tilesets, title1, title2
*/

(function(){
	var cmds = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		cmds.apply(this, arguments);
	
		if(command == "upp_BpAdd"){
			var id = Number(args[0])-1;
			var actor = $gameParty.members()[id];
			
			actor._uppBonusBp += Number(args[1]);
		}
		
		if(command == "upp_BpSub"){
			var id = Number(args[0])-1;
			var actor = $gameParty.members()[id];
			
			actor._uppBonusBp -= Number(args[1]);
		}
	}
	
//{ Params
	var params = PluginManager.parameters("upp_boostPro");
	var blockColor = params['Block Color'];
	var ubpMultiplier = Number(params['UBP Multiplier']);
	var ubpDrawBg = eval(params['Draw Background']);
	var ubpBgLoc = params['Background Location'];
	var ubpBgImg = params['Background Image'];
	
	var HPBoostValue = Number(params['HP Boost Value']);
	var MPBoostValue = Number(params['MP Boost Value']);
	var StatBoostValue = Number(params['Other Boost Value']);
		//{ Color Object
	var barColors = {
		exp1: params['EXP Gauge Color 1'],
		exp2: params['EXP Gauge Color 2'],
		
		atk1: params['Atk Gauge Color 1'],
		atk2: params['Atk Gauge Color 2'],
		
		def1: params['Def Gauge Color 1'],
		def2: params['Def Gauge Color 2'],
		
		mat1: params['Mat Gauge Color 1'],
		mat2: params['Mat Gauge Color 2'],
		
		mdf1: params['Mdf Gauge Color 1'],
		mdf2: params['Mdf Gauge Color 2'],
		
		agi1: params['Agi Gauge Color 1'],
		agi2: params['Agi Gauge Color 2'],
		
		luk1: params['Luk Gauge Color 1'],
		luk2: params['Luk Gauge Color 2'],
	}
		//}
	
	//}
	
//{ Add the needed stat to actors
	var gasAl = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId) {
		gasAl.call(this, actorId);
		this._uppBoostPoints = 0;
		this._uppBoostPointsSpent = 0;
		this._uppBonusBp = 0;
		
		this._uppGainedBpPoints = [];
		
		this.setUppGbp();
	}
	Game_Actor.prototype.actorUbp = function() {
		this._uppBoostPoints = this.level*ubpMultiplier - this._uppBoostPointsSpent + this._uppBonusBp;
		return this._uppBoostPoints;
	}
	
	Game_Actor.prototype.actorSpentUbp = function() {
		return this._uppBoostPointsSpent;
	}
	
	Game_Actor.prototype.uppGainedBpPoints = function(id) {
		return this._uppGainedBpPoints[id];
	}
	
	Game_Actor.prototype.setUppGbp = function() {
		for(i=0;i<8;i++)
		{
			this._uppGainedBpPoints[i] = 0;
		}
	}
	
	//}

//{Windows
		
		//{ Window_MenuCommand Alias
	var winMenuCommand = Window_MenuCommand.prototype.addOriginalCommands
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		winMenuCommand.call(this);
		this.addCommand("Enchantments", 'upp_boost');
	}
	//}
		//{ Empty Window
	function Window_UppBoostDummy() {
		this.initialize.apply(this, arguments);
	}

	Window_UppBoostDummy.prototype = Object.create(Window_Base.prototype);
	Window_UppBoostDummy.prototype.constructor = Window_UppBoostDummy;

	Window_UppBoostDummy.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, width, height);
	}
	//}
	
		//{ Boost display
	function Window_UppBoostDisplay() {
		this.initialize.apply(this, arguments);
	}

	Window_UppBoostDisplay.prototype = Object.create(Window_Base.prototype);
	Window_UppBoostDisplay.prototype.constructor = Window_UppBoostDisplay;

	Window_UppBoostDisplay.prototype.initialize = function() {
		Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
		this.refresh();
	}
	
	Window_UppBoostDisplay.prototype.getColor = function(color) {
		return "rgba("+color+")";
	}
	
	Window_UppBoostDisplay.prototype.updateHeight = function() { 
		this.height = this.lineHeight()*13;
		this.y=(Graphics.boxHeight)-this.height;
	}
	
	Window_UppBoostDisplay.prototype.refresh = function() {
		this.updateHeight();
		this.contents.clear();
		this.defaultFontSize = this.contents.fontSize;
		
		var pad=this.padding;
		var fullScaleSize = this.contents.width-(this.padding*2);
		
		var actor = $gameParty.menuActor();
		//var bpValue = actor.level * ubpMultiplier - (actor.actorUbp() - actor.actorSpentUbp());
		
		this.contents.clear();
		
		this.contents.fillRect(0, 0, this.contents.width, this.lineHeight(), this.getColor(blockColor));
		this.contents.drawText(actor.name(), pad, 0, fullScaleSize, this.lineHeight(), 'right');
		this.contents.drawText("Boost Points", pad, 0, fullScaleSize, this.lineHeight(), 'left');
		this.contents.drawText("BP: " + actor.actorUbp(), pad, 0, fullScaleSize, this.lineHeight(), 'center');
		
		this.contents.fillRect(0, this.lineHeight()*3, this.contents.width, this.lineHeight()*8, this.getColor(blockColor));
		
		this.drawStatList();
		
		this.changeTextColor(this.systemColor());
		this.contents.drawText(TextManager.levelA, pad, this.lineHeight()*2, fullScaleSize-96, this.lineHeight(), 'right');
		this.changeTextColor(this.normalColor());
		this.contents.drawText(actor.level, pad, this.lineHeight()*2, fullScaleSize, this.lineHeight(), 'right');
		
		this.drawActorFace(actor, pad, this.lineHeight(), 144, this.lineHeight()*2);
		this.drawCharacter(actor.characterName(), actor.characterIndex(), pad, this.lineHeight()*3);
		
		this.contents.drawText("Spent: " + actor.actorSpentUbp(), pad, this.lineHeight()*2, fullScaleSize, this.lineHeight(), 'center'); 
		
		this.contents.drawText("Finish", pad, this.lineHeight()*11, fullScaleSize, this.lineHeight());
	}
	
	Window_UppBoostDisplay.prototype.drawStatList = function() {
		var pad=this.padding;
		var fullScaleSize = this.contents.width-(this.padding*2);
		var actor = $gameParty.menuActor();
		
		var hpRate = (actor.param(0) / actor.paramMax(0));
		var mpRate = (actor.param(1) / actor.paramMax(1));
		var atkRate = (actor.param(2) / actor.paramMax(2));
		var defRate = (actor.param(3) / actor.paramMax(3));
		var matRate = (actor.param(4) / actor.paramMax(4));
		var mdfRate = (actor.param(5) / actor.paramMax(5));
		var agiRate = (actor.param(6) / actor.paramMax(6));
		var lukRate = (actor.param(7) / actor.paramMax(7));
		
		var hpColor1 = this.hpGaugeColor1();
		var hpColor2 = this.hpGaugeColor2();
		
		var mpColor1 = this.mpGaugeColor1();
		var mpColor2 = this.mpGaugeColor2();
		
		this.drawGauge(pad, this.lineHeight()*3, fullScaleSize, hpRate, hpColor1, hpColor2);
		this.drawGauge(pad, this.lineHeight()*4, fullScaleSize, mpRate, mpColor1, mpColor2);
		this.drawGauge(pad, this.lineHeight()*5, fullScaleSize, atkRate, this.getColor(barColors.atk1), this.getColor(barColors.atk2));
		this.drawGauge(pad, this.lineHeight()*6, fullScaleSize, defRate, this.getColor(barColors.def1), this.getColor(barColors.def2));
		this.drawGauge(pad, this.lineHeight()*7, fullScaleSize, matRate, this.getColor(barColors.mat1), this.getColor(barColors.mat2));
		this.drawGauge(pad, this.lineHeight()*8, fullScaleSize, mdfRate, this.getColor(barColors.mdf1), this.getColor(barColors.mdf2));
		this.drawGauge(pad, this.lineHeight()*9, fullScaleSize, agiRate, this.getColor(barColors.agi1), this.getColor(barColors.agi2));
		this.drawGauge(pad, this.lineHeight()*10, fullScaleSize, lukRate, this.getColor(barColors.luk1), this.getColor(barColors.luk2));
		for(i=0;i<8;i++)
		{
			var y=this.lineHeight()*(3+i)
			var type=TextManager.param(i);
			var amount = actor.param(i);
			var spent = actor.uppGainedBpPoints(i) + "+";
			this.contents.drawText(amount, pad, y, fullScaleSize, this.lineHeight());
			this.contents.drawText(type, pad, y, fullScaleSize, this.lineHeight(), 'center');
			this.contents.drawText(spent, pad, y, fullScaleSize, this.lineHeight(), 'right');
		}
	}
		//}
	
		//{ Boost display choice
		function Window_BoostDisplayChoice() {
			this.initialize.apply(this, arguments);
		}

		Window_BoostDisplayChoice.prototype = Object.create(Window_Command.prototype);
		Window_BoostDisplayChoice.prototype.constructor = Window_BoostDisplayChoice;

		Window_BoostDisplayChoice.prototype.initialize = function(x, y) {
			Window_Command.prototype.initialize.call(this, x, y);
			this.opacity=0;
		}
		
		Window_BoostDisplayChoice.prototype.windowWidth = function() {
			return Graphics.boxWidth;
		}
		
		Window_BoostDisplayChoice.prototype.makeCommandList = function() {
			this.addCommand(" ", 'mhpb');
			this.addCommand(" ", 'mmpb');
			this.addCommand(" ", 'atkb');
			this.addCommand(" ", 'defb');
			this.addCommand(" ", 'matb');
			this.addCommand(" ", 'mdfb');
			this.addCommand(" ", 'agib');
			this.addCommand(" ", 'lukb');
			this.addCommand(" ", 'finish');
		}
		//}
		
		//{ Actor Window
	function Window_UppBpActor() {
		this.initialize.apply(this, arguments);
	}

	Window_UppBpActor.prototype = Object.create(Window_Base.prototype);
	Window_UppBpActor.prototype.constructor = Window_UppBpActor;

	Window_UppBpActor.prototype.initialize = function(actor, x, y) {
		Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth/4, 156);
		this.actor = $gameParty.members()[actor];
		this.refresh();
	}
	
	Window_UppBpActor.prototype.standardPadding = function() {
		return Window_Base.prototype.standardPadding()/2;
	}
	
	Window_UppBpActor.prototype.refresh = function(){
		this.contents.clear();
		this.drawActorFace(this.actor, this.padding*2, 0, 144, 156);
		this.drawCharacter(this.actor.characterName(), this.actor.characterIndex(), this.padding*3, this.lineHeight()*2);
		this.contents.drawText(this.actor.name(), 0, 0, this.contents.width, this.lineHeight());
		this.contents.fillRect(0, this.lineHeight()*3-this.padding/2, this.contents.width, this.lineHeight(), "rgba("+blockColor+")");
		this.contents.drawText(this.actor.actorUbp() + " BP", 0, this.lineHeight()*3-this.padding/2, this.contents.width, this.lineHeight(), 'right');
	}
		//}
	//}

//{Scenes
	//{ Boost Display
	function Scene_UppBoostDisplay() {
		this.initialize.apply(this, arguments);
	}

	Scene_UppBoostDisplay.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_UppBoostDisplay.prototype.constructor = Scene_UppBoostDisplay;

	Scene_UppBoostDisplay.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	}
	
	Scene_UppBoostDisplay.prototype.start = function(){
		Scene_MenuBase.prototype.create.call(this);
		this.createWindows();
		this.actor = $gameParty.menuActor();
	}
	
	Scene_UppBoostDisplay.prototype.createBackground = function() {
		if(ubpDrawBg!=true)
		{
			this._backgroundSprite = new Sprite();
			this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
			this.addChild(this._backgroundSprite);
		}
		else {
			this.addBg();
		}
	}
	
	Scene_UppBoostDisplay.prototype.createWindows = function(){
		this.Window_UppBoostDisplay = new Window_UppBoostDisplay();
		this.addChild(this.Window_UppBoostDisplay);
		
		this.Window_BoostDisplayChoice = new Window_BoostDisplayChoice();
		this.Window_BoostDisplayChoice.y = this.Window_UppBoostDisplay.y+this.Window_UppBoostDisplay.lineHeight()*3;
		this.Window_BoostDisplayChoice.height = this.Window_UppBoostDisplay.height;
		
		this.Window_BoostDisplayChoice.setHandler('finish',      this.popScene.bind(this));
		this.Window_BoostDisplayChoice.setHandler('cancel',      this.popScene.bind(this));
		this.Window_BoostDisplayChoice.setHandler('pagedown', this.nextActor2.bind(this));
		this.Window_BoostDisplayChoice.setHandler('pageup',   this.previousActor2.bind(this));
		this.addChild(this.Window_BoostDisplayChoice);
		
		if($gameParty.members().length>=1)
		{
			this.MemberWindow1 = new Window_UppBpActor(0, 0, 0);
			this.addChild(this.MemberWindow1);
		}
		if($gameParty.members().length>=2)
		{
			this.MemberWindow2 = new Window_UppBpActor(1, 204, 0);
			this.addChild(this.MemberWindow2);
		}
		if($gameParty.members().length>=3)
		{
			this.MemberWindow3 = new Window_UppBpActor(2, 408, 0);
			this.addChild(this.MemberWindow3);
		}
		if($gameParty.members().length>=4)
		{
			this.MemberWindow4 = new Window_UppBpActor(3, 612, 0);
			this.addChild(this.MemberWindow4);
		}
	}
	
	Scene_UppBoostDisplay.prototype.nextActor2 = function() {
		this.nextActor();
		this.Window_UppBoostDisplay.refresh();
		this.Window_BoostDisplayChoice.activate();
	}
	
	Scene_UppBoostDisplay.prototype.previousActor2 = function() {
		this.previousActor();
		this.Window_UppBoostDisplay.refresh();
		this.Window_BoostDisplayChoice.activate();
	}
	
	Scene_UppBoostDisplay.prototype.update = function() {
		this.actor = $gameParty.menuActor();
		if(Input.isRepeated("right")) {
			if(this.Window_BoostDisplayChoice._index<8) { 
				if(this.actor.actorUbp()>0)
				{
 					this.actor._uppGainedBpPoints[this.Window_BoostDisplayChoice._index]+=1;
					this.actor._uppBoostPointsSpent+=1;
					SoundManager.playCursor();
					switch(this.Window_BoostDisplayChoice._index) {
						case 0:
							this.actor.addParam(0, HPBoostValue);
						break;
						
						case 1:
							this.actor.addParam(1, MPBoostValue);
						break;
					}
					
					if(this.Window_BoostDisplayChoice._index>1)
					{
						this.actor.addParam(this.Window_BoostDisplayChoice._index, StatBoostValue);
					}
					this.Window_UppBoostDisplay.refresh();
					if(this.MemberWindow1) { this.MemberWindow1.refresh(); }
					if(this.MemberWindow2) { this.MemberWindow2.refresh(); }
					if(this.MemberWindow3) { this.MemberWindow3.refresh(); }
					if(this.MemberWindow4) { this.MemberWindow4.refresh(); }
				}
			}
		}
		
		if(Input.isRepeated("left")) {
			if(this.Window_BoostDisplayChoice._index<8) {
				if(this.actor._uppGainedBpPoints[this.Window_BoostDisplayChoice._index]>0) {
					this.actor._uppGainedBpPoints[this.Window_BoostDisplayChoice._index]-=1;
					this.actor._uppBoostPointsSpent-=1;
					SoundManager.playCursor();
					switch(this.Window_BoostDisplayChoice._index) {
						case 0:
							this.actor.subParam(0, HPBoostValue);
						break;
						
						case 1:
							this.actor.subParam(1, MPBoostValue);
						break;
					}
					
					if(this.Window_BoostDisplayChoice._index>1)
					{
						this.actor.subParam(this.Window_BoostDisplayChoice._index, StatBoostValue);
					}
					this.Window_UppBoostDisplay.refresh();
					if(this.MemberWindow1) { this.MemberWindow1.refresh(); }
					if(this.MemberWindow2) { this.MemberWindow2.refresh(); }
					if(this.MemberWindow3) { this.MemberWindow3.refresh(); }
					if(this.MemberWindow4) { this.MemberWindow4.refresh(); }
				}
			}
		}
		Scene_Base.prototype.update.call(this);
	}
	
	Scene_UppBoostDisplay.prototype.addBg = function() {
		this.graphic = new Sprite();
		var img;
		switch(ubpBgLoc)
		{
			case "animations":
				img = ImageManager.loadAnimation(ubpBgImg);
			break;
			
			case "battlebacks1":
				img = ImageManager.loadBattleback1(ubpBgImg);
			break;
			
			case "battlebacks2":
				img = ImageManager.loadBattleback2(ubpBgImg);
			break;
			
			case "enemies":
				img = ImageManager.loadEnemy(ubpBgImg);
			break;
			
			case "characters":
				img = ImageManager.loadCharacter(ubpBgImg);
			break;
			
			case "faces":
				img = ImageManager.loadFace(ubpBgImg);
			break;
			
			case "parallaxes":
				img = ImageManager.loadParallax(ubpBgImg);
			break;
			
			case "pictures":
				img = ImageManager.loadPicture(ubpBgImg);
			break;
			
			case "sv_actors":
				img = ImageManager.loadSvActor(ubpBgImg);
			break;
			
			case "sv_enemies":
				img = ImageManager.loadSvEnemy(ubpBgImg);
			break;
			
			case "system":
				img = ImageManager.loadSystem(ubpBgImg);
			break;
			
			case "tileset":
				img = ImageManager.loadTileset(ubpBgImg);
			break;
			
			case "title1":
				img = ImageManager.loadTitle1(ubpBgImg);
			break;
			
			case "title2":
				img = ImageManager.loadTitle2(ubpBgImg);
			break;
		}
		this.graphic.bitmap = img;
		this.addChild(this.graphic);
	}
	//}
	
	//{ Scene Menu Alias
	var ScMenuCmds = Scene_Menu.prototype.createCommandWindow
	Scene_Menu.prototype.createCommandWindow = function() {
		ScMenuCmds.call(this);
		this._commandWindow.setHandler('upp_boost',      this.commandPersonal.bind(this));
	}
	
	var smPok = Scene_Menu.prototype.onPersonalOk
	Scene_Menu.prototype.onPersonalOk = function() {
		smPok.call(this);
		switch(this._commandWindow.currentSymbol()) {
			case 'upp_boost':
			SceneManager.push(Scene_UppBoostDisplay);
			break;
		}
	}
	//}
	
	//{ Subtract values
		Game_BattlerBase.prototype.subParam = function(paramId, value) {
			this._paramPlus[paramId] -= value;
			this.refresh();
		}
	//}
//}
})();
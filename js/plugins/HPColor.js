//----------------------------------------------------------------------------------------------------
// HP Color Controller
// Developed by AceOfAces
//----------------------------------------------------------------------------------------------------
/*:
* @plugindesc R1.01 || Allows developers to customise the HP bar and text Color depending on the remaining HP.
* @author AceOfAces
* 
* @param Compatibility Mode
* @desc Turn this on (set to true) if you customise the normal HP bar and text color on a different plugin.
* @default false
*
* @param Low HP
* @desc Set the point where the HP is considered low. The number must be float!
* @default 0.25
*
* @param Critical HP
* @desc Set the point where the HP is considered critical. The number must be float!
* @default 0.15
*
* @param Normal HP Color 1
* @desc Changes the color when the HP is considered normal (it's ignored if the compatibility mode is set). Interger variable.
* @default 11
* 
* @param Normal HP Color 2
* @desc Same with the previous parameter.
* @default 3
* 
* @param Low HP Text Color
* @desc Set the color of the text on low HP. Interger variable.
* @default 2
*
* @param Low HP Bar Color 1
* @desc Sets the color for the HP bar on low HP. Interger variable.
* @default 20
*
* @param Low HP Bar Color 2
* @desc Same with the previous parameter.
* @default 21
*
* @param Critical HP Text
* @desc Set the color of the text when the HP is in critical. Interger variable.
* @default 18
*
* @param Critical HP Bar Color 1
* @desc Set the color of the HP Bar when the HP is in critical. Interger variable.
* @default 18
* 
* @param Critical HP Bar Color 2
* @desc Same with the previous parameter.
* @default 2
* @help
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* HP Color Controller (MV Port) - Version R1.00
* Developed by AceOfAces
* Licensed under GPLv3 license. Can be used for both Non-commercial and
* commercial games.
* Please credit me as AceOfAces when you use this plugin.
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* This script provides additional hp gauge and text colors similar to the
* Pokemon series.
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* Installation and setup:
* 1. Place this plugin below any plugin that changes HP Bars as well
* (such as Yanfly's Core Engine). If you don't have any of these on your project,
* you can place it anywhere.
* 2. After turning it on, save and playtest. If the game didn't crash after
* opening the menu and you can see the bars green, the plugin is installed
* properly.
* If you wish to use the HP bar colors set by the other script, turn on the
* compatibility mode by setting it's value to true. Compatibility mode
* will simply ignore Normal HP Color 1 and Normal HP Color 2 and will use
* the preset color (or the other plugin's color, if it rerouted the selection).
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* Set up the colors:
* This plugin uses the colors found on the Window.png file (which you can find
* on img/System ). To use the color you want, enter a number of 0 to 31. Here's
* a quick reference guide:
*  0  1  2  3  4  5  6  7 
*  8  9 10 11 12 13 14 15
* 16 17 18 19 20 21 22 23
* 24 25 26 27 28 29 30 31
* The HP bar consists of two colors making a gradient. HP Color 1 is the color
* on the leftmost side of the HP bar and HP Color 2 is the color on the
* rightmost side of the bar.
* The HP Text is simply the color you specify.
* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* 
*/
// Reference the Plugin Manager's parameters.
var paramdeck = PluginManager.parameters('HPColor');
//Load variables set in the Plugin Manager.
var CompatMode = String(paramdeck['Compatibility Mode']).trim().toLowerCase() === 'true';
var LowHPLimit = parseFloat(paramdeck['Low HP']);
var CriticalHPLimit = parseFloat(paramdeck['Critical HP']);
var HPNormalBar1 =  parseInt(paramdeck['Normal HP Color 1']);
var HPNormalBar2 = parseInt(paramdeck['Normal HP Color 2']);
var HPLowText = parseInt(paramdeck['Low HP Text Color']);
var HPBarLow1 = parseInt(paramdeck['Low HP Bar Color 1']);
var HPBarLow2 = parseInt (paramdeck['Low HP Bar Color 2']);
var CriticalHPText = parseInt(paramdeck['Critical HP Text']);
var CriticalHPBar1 = parseInt(paramdeck['Critical HP Bar Color 1']);
var CriticalHPBar2 = parseInt(paramdeck['Critical HP Bar Color 2']);

Window_Base.prototype.hpTextColorPicker = function(actor) {
 if (actor.hp < actor.mhp * CriticalHPLimit) return this.textColor(CriticalHPText);
 else if (actor.hp > actor.mhp * CriticalHPLimit && actor.hp < actor.mhp * LowHPLimit) return this.textColor(HPLowText);
 else return this.systemColor();
};

Window_Base.prototype.hpbarColorPicker1 = function(actor) {
    if (actor.hp < actor.mhp * CriticalHPLimit) return this.textColor(CriticalHPBar1);
    else if (actor.hp > actor.mhp * CriticalHPLimit && actor.hp < actor.mhp * LowHPLimit) return this.textColor(HPBarLow1);
    else if (CompatMode == true) this.hpGaugeColor1();
    else return this.textColor(HPNormalBar1);
};

Window_Base.prototype.hpbarColorPicker2 = function(actor) {
    if (actor.hp < actor.mhp * CriticalHPLimit) return this.textColor(CriticalHPBar2);
    else if (actor.hp > actor.mhp * CriticalHPLimit && actor.hp < actor.mhp * LowHPLimit) return this.textColor(HPBarLow2);
    else if (CompatMode == true) this.hpGaugeColor2();
    else return this.textColor(HPNormalBar2);
};

this.Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpbarColorPicker1(actor);
    var color2 = this.hpbarColorPicker2(actor);
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.hpTextColorPicker(actor));
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

Window_Base.prototype.hpColor = function(actor) {
    if (actor.isDead()) {
        return this.deathColor();
    } else if (actor.hp < actor.mhp * CriticalHPLimit)
    return this.textColor(CriticalHPText);
     else if (actor.hp > actor.mhp * CriticalHPLimit && actor.hp < actor.mhp * LowHPLimit)
     return this.textColor(HPLowText);   
 else {
        return this.normalColor();
    }
};
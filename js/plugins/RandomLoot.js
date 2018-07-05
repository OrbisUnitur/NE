/**
 *  MV Random Loot Awarder v1.1
 *  Author: Thomas McSherry
 *  http://rpgmakermv.co/members/run.1488/
 */

/*:
*@param item_range_minimum
*@desc The lowest id to use in the range of items from the Items database
*@default 1
*
*@param item_range_maximum
*@desc The highest id to use in the range of items from the Items database
*@default 1
*
*@param weapon_range_minimum
*@desc The lowest id to use in the range of items from the Weapons database
*@default 1
*
*@param weapon_range_maximum
*@desc The highest id to use in the range of items from the Weapons database
*@default 1
*
*@param armor_range_minimum
*@desc The lowest id to use in the range of items from the Armors database
*@default 1
*
*@param armor_range_maximum
*@desc The highest id to use in the range of items from the Armors database
*@default 1
*
*/

var params = PluginManager.parameters("RandomLoot");
var picture_name = String(params["BookParticle"] || "BookParticle");

var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
var itemMin = Number(params["item_range_minimum"]);
var itemMax = Number(params["item_range_maximum"]);
var weaponMin =  Number(params["weapon_range_minimum"]);
var weaponMax =  Number(params["weapon_range_maximum"]);
var armorMin = Number(params["armor_range_minimum"]);
var armorMax = Number(params["armor_range_maximum"]);

Game_Interpreter.prototype.pluginCommand = function(command, args){
	aliasPluginCommand.call(this,command, args);
	
	if(command == "tm_loot"){
	
		
	
		var type = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
		
		if(args != null && args.length > 0){
			if(args[0] == "item"){
				type = 1;
			}else if(args[0] == "weapon"){
				type = 2;
			}else if(args[0] == "armor"){
				type = 3;
			}else{
				type = 0;
			}
			
		}
		if(type == 0){
			randomCategoryItem(args[0]);
		}else if(type == 1){
			randomItem($dataItems,itemMin,itemMax,1,1);
		}else if(type == 2){
			randomItem($dataWeapons,weaponMin,weaponMax,1,1);
		}else if(type == 3){
			randomItem($dataArmors,armorMin,armorMax,1,1);
		}
	}
	
}

function randomItem($lootDataSet, itemIdMin, itemIdMax, amountMin, amountMax){

	var itemNumber = Math.floor(Math.random() * (itemIdMax - itemIdMin + 1)) + itemIdMin;
	while($lootDataSet[itemNumber].note.contains("tm_loot_exclude")){
		itemNumber = Math.floor(Math.random() * (itemIdMax - itemIdMin + 1)) + itemIdMin;
	}

	if(typeof $lootDataSet[itemNumber] != "undefined"){
	
		var amount = getNotesAmount($lootDataSet[itemNumber].note, amountMin,amountMax);
		
		$gameMessage.setBackground(1);
		$gameMessage.setPositionType(1);
		$gameParty.gainItem($lootDataSet[itemNumber], amount);
		
		$gameMessage.add("You obtained " + amount + " " + $lootDataSet[itemNumber].name + ".");
	}
}

function randomCategoryItem(category){

	var allItems = [];
	for(var i = 0; i < $dataItems.length; i++){
		if(typeof $dataItems[i] != "undefined" && $dataItems[i] != null){
			if($dataItems[i].note.contains("tm_loot_exclude")){
				continue;
			}
			if(!$dataItems[i].note.contains("tm_lootc_" + category)){
				continue;
			}
			allItems.push($dataItems[i]);
		}
	}
	for(var i = 0; i < $dataArmors.length; i++){
		if(typeof $dataArmors[i] != "undefined" && $dataArmors[i] != null){
			if($dataArmors[i].note.contains("tm_loot_exclude")){
				continue;
			}
			if(!$dataArmors[i].note.contains("tm_lootc_" + category)){
				continue;
			}
			allItems.push($dataArmors[i]);
		}
	}
	for(var i = 0; i < $dataWeapons.length; i++){
		if(typeof $dataWeapons[i] != "undefined" && $dataWeapons[i] != null){
			if($dataWeapons[i].note.contains("tm_loot_exclude")){
				continue;
			}
			if(!$dataWeapons[i].note.contains("tm_lootc_" + category)){
				continue;
			}
			allItems.push($dataWeapons[i]);
		}
	}
	if(allItems.length == 0){
		return;
	}
	var itemNumber = Math.floor(Math.random() * (allItems.length));
	
	var amount = getNotesAmount(allItems[itemNumber].note, 1,1);
	
	$gameMessage.setBackground(1);
	$gameMessage.setPositionType(1);
	$gameParty.gainItem(allItems[itemNumber], amount);
	$gameMessage.add("You obtained " + amount + " " + allItems[itemNumber].name + ".");
	
}

function getNotesAmount(itemNote, amountMin,amountMax){

		var amount = amountMin;
		
		if(itemNote.contains("tm_loot_min")){
			
			var indexOfMinValue = Number(itemNote.indexOf("tm_loot_min")) + "tm_loot_min".length + 1;
			
			
			var newAmountMin = amount;
			
			var minFinder = itemNote.substring(indexOfMinValue, itemNote.length);
			
			var nextNum = getNextNumber(minFinder);
				
			if(nextNum != ""){
				newAmountMin = Number(nextNum);
			}
			
			if(itemNote.contains("tm_loot_max")){
				var indexOfMaxValue = Number(itemNote.indexOf("tm_loot_max")) + "tm_loot_max".length + 1;
				
				var newAmountMax = amount;
				
				var maxFinder = itemNote.substring(indexOfMaxValue, itemNote.length);
				
				var nextNum = getNextNumber(maxFinder);
				
				if(nextNum != ""){
					newAmountMax = Number(nextNum);
				}
				
				amount = Math.floor(Math.random() * (newAmountMax - newAmountMin + 1)) + newAmountMin;
			}else{
				amount = Math.floor(Math.random() * (amountMax - newAmountMin + 1)) + newAmountMin;
			}
		}else{
			amount = Math.floor(Math.random() * (amountMax - amountMin + 1)) + amountMin;
		}
		
		return amount;

}

function getNextNumber(finderString){

	var foundNumber = "";
	
	for(var i = 0; i < finderString.length; i++){
					
		var character = finderString[i];
					
		if(character == '0' || character == '1' || character == '3' || character == '4' || character == '5'
			|| character == '6'|| character == '7'|| character == '8' || character == '9'){
			//Found number, get the ones that follow it.		
			foundNumber += character;
			character = finderString[++i];
			while(character == '0' || character == '1' || character == '3' || character == '4' || character == '5'
					|| character == '6'|| character == '7'|| character == '8' || character == '9'){
				foundNumber += finderString[i];
				character = finderString[++i];
			}
						
			newAmountMax = Number(foundNumber);
			break;
		}
	}
	
	return foundNumber;
}
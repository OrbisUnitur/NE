// Change this value to move the character sprites.
// Larger values move the character up and vice-versa.
// This variable is initialized to the default offset.

/* var defaultOffsetY = 6; // The default offset value. */

var charOffsetY = 2;

// -- Game_CharacterBase Alias -- : Needed to ensure compatability.

var _GameCharacterBase_shiftY_ = Game_CharacterBase.prototype.shiftY;

// Redefinition of Game_CharacterBase.shiftY function.

Game_CharacterBase.prototype.shiftY = function() {
var v = _GameCharacterBase_shiftY_.call(this);
return v > 0 ? charOffsetY : 0;
};

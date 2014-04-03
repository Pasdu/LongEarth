/*blockAssigner
	The block assigner initially assigned
	a value to a textmesh to indicate which
	type each block was but will likely be used
	to develop tiles further after they've been
	instantiated and coloured
*/

#pragma strict
public var ui : uiClass;
var type : int;
function Awake () {
	ui = GameObject.FindGameObjectWithTag("MainCamera").GetComponent(uiClass);
}

function Update () {

}

public function assignBlock(val : int){
	type = val;
}

function OnMouseDown( ){
	//sDebug.Log("Got a click");
	var target : String;
	switch(type)
	{
		case 0 :
			target = "Water";
			break;
		case 1 :
			target = "Plains";
			break;
		case 2 :
			target = "Forest";
			break;
		case 3 :
			target = "Quarry";
			break;
		case 4 :
			target = "Settlement";
			break;

	}
	ui.setElement(2, target);
}

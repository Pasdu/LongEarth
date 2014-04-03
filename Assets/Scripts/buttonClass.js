#pragma strict
/*
ButtonType ID reference
0 = Random Seed Generation
1 = Generate Toggle Button
2 = Adjustable Text Element
*/

public var uiElement : uiClass;
public var buttonType : int;
public var val : int = 0;

function Start () {

}

function Update () {
}

function OnMouseDown() {
	switch (buttonType)
	{
		//randomseed button
		case 0:
			uiElement.randomSeed();
			if(uiElement.GetStatus()){
				GameObject.Find("GenButton").GetComponent(TextMesh).text = "Generate";
				uiElement.DestroyWorld();
			
			}
		break;
		//Loadworld Button
		case 1:
			if( !uiElement.GetStatus() ){
				if( uiElement.LoadWorld("",0,Vector2(10,10)) ){
					GetComponent(TextMesh).text = "Unload";
				}else{
					Debug.Log("Seed Being Edited, try again");
				}
				}else{
					uiElement.DestroyWorld();
					GetComponent(TextMesh).text = "Generate";
				}
			break;
		//TextInput
		case 2:
			uiElement.BeginInput(val);
			break;
		//World Increment 1
		case 3:
			uiElement.ShiftWorld(true);
			break;
		//World Decrease 1
		case 4:
			uiElement.ShiftWorld(false);
			break;
		case 5:
			uiElement.JumpWorld("field");
			break;
	}
}
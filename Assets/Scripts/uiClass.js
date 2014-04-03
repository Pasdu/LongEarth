#pragma strict
var builder : worldMake;
var currentMode : int = 0;
var currentTarget : GameObject;

public var textOutputs : TextMesh[];
/*
0 - Seed Field
1 - worldID Field
2 - Target Field
3 - seedText - for writing seeds
*/
function Start () {
	builder = GetComponent(worldMake);
}

function Update () {
	if(currentMode == 1){
		var textfield : TextMesh = currentTarget.GetComponent(TextMesh);
		for(var c : char in Input.inputString){
			if (c == "\b"[0]){
				if(textfield.text.Length != 1){
					textfield.text = textfield.text.Substring(0, textfield.text.Length - 2);
					textfield.text += "|";
				}

			}else if(c == "\n"[0] || c == "\r"[0]){
				textfield.text = textfield.text.Substring(0, textfield.text.Length - 1);
				currentMode = 0;
			}
			
			if(char.IsDigit(Input.inputString[0]) && textfield.text.Length < 8){
				textfield.text = textfield.text.Substring(0, textfield.text.Length - 1);
				textfield.text += Input.inputString[0];
				textfield.text += "|";
			}

		}

	}
}

function setElement (name : int, message : String){
	textOutputs[name].text = message;
}

function randomSeed (){
	var seedString : String;
	for ( var i : int = 0 ; i < 7 ; i++ ){
		var randoVal = Mathf.Round(Random.value * 9);
		seedString += randoVal.ToString();
	}
	if(currentMode == 1){
		currentMode = 0;
	}
	builder.seedNum = seedString;
	setElement(3, seedString);
}  

function LoadWorld ( source : String, worldID : int, size : Vector2 ) {
if(currentMode == 1){
	if(currentTarget.GetComponent(TextMesh).text.Length == 8){
		currentTarget.GetComponent(TextMesh).text = currentTarget.GetComponent(TextMesh).text.Substring(0, currentTarget.GetComponent(TextMesh).text.Length - 1);
		currentMode = 0;
	}
	}
	if (source == ""){
		source = textOutputs[3].text;
	}
	if( builder.makeWorld( source, worldID, size) ){
		builder.state = 1;
		setElement(0,source);
		setElement(1, worldID.ToString());
		return true;
	}
}

function ShiftWorld( direction : boolean ){
	if(builder.state == 5){
			builder.unload();
		if(direction == true){
			if( LoadWorld( "", builder.worldNum +1, Vector2(10,10)) ){
				builder.state = 1;
				return;
			}
		}else{
			if( LoadWorld( "", builder.worldNum -1, Vector2(10,10)) ){
				builder.state = 1;
				return;
			}
		}
		
	}
}

function JumpWorld ( id : String )
{
	if(currentMode == 1){
		currentTarget.GetComponent(TextMesh).text = currentTarget.GetComponent(TextMesh).text.Substring(0, currentTarget.GetComponent(TextMesh).text.Length - 1);	
		currentMode = 0;
	}
	if(builder.state == 5){
		builder.unload();
		if (id == "field"){
			if(LoadWorld( "", int.Parse(textOutputs[1].text), Vector2(10,10)))
			{
				builder.state = 1;
				return;
			}
		}else{
			if(LoadWorld( "", int.Parse(id), Vector2(10,10)))
			{
				builder.state = 1;
			}
		}
	}
}

function DestroyWorld ( ){
	builder.unload();
	setElement(2, "None");
	setElement(1, "0");
}

function GetStatus( ){
	if(builder.state != 5){
		return false;
	}
		return true;
}

function BeginInput(field : int) {
	if(currentMode == 0){
		currentMode = 1;
		textOutputs[field].text += "|";
		currentTarget = textOutputs[field].gameObject;
	}

}
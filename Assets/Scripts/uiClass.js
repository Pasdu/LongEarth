#pragma strict
var builder : worldMake;
var currentMode : int = 0;
var maketime : int;
var currentTime : int;
var flag : boolean = false;
/* currentMode values
currentMode is used to keep track of what the
user is currently doing, mostly used to make sure
they can't press buttons they should not be able to.

0 - idle
1 - Editing a field
*/
var currentTarget : GameObject;

public var textOutputs : TextMesh[];
/* textOutputs Array Indexes
0 - Seed Field
1 - worldID Field
2 - Target Field
3 - seedText - for writing seeds
4 - timerText - for displaying the time
*/
function Start () {
	builder = GetComponent(worldMake);
}

function Update () {
	if(flag == true){
		textOutputs[4].text = Mathf.Round((Time.time - maketime)/10).ToString();
	}
	
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
	builder.seedNum = int.Parse(seedString);
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
		if(flag == false){
			maketime = Time.time;
			flag = true;
		}
		setElement(0,source);
		setElement(1, worldID.ToString());
	}
	
	return true;
}

function ShiftWorld( direction : boolean ){
	if(currentMode == 1){
		currentTarget.GetComponent(TextMesh).text = currentTarget.GetComponent(TextMesh).text.Substring(0, currentTarget.GetComponent(TextMesh).text.Length - 1);	
		currentMode = 0;
	}
	if(builder.state == 5){
			builder.unload();
			flag = true;
		if(direction == true){
			if( LoadWorld( "", builder.worldNum +1, Vector2(10,10)) ){
				builder.state = 1;
			}
		}else{
			if( LoadWorld( "", builder.worldNum -1, Vector2(10,10)) ){
				builder.state = 1;
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
		flag = true;
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
	flag = false;
	maketime = 0;
	textOutputs[4].text = "";
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
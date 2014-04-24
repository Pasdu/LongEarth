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
var spawned : boolean = false;
var oride : int;
var coords : Vector2;

public var village01 : GameObject[];
public var forest01 : GameObject[];
public var quarry01 : GameObject[];
public var plains01 : GameObject;
function Awake () {
	ui = GameObject.FindGameObjectWithTag("MainCamera").GetComponent(uiClass);
}

function Update () {
	if(ui.builder.state == 5 && spawned == false){
		var x = 0;
		var sobject : GameObject;
		if(type == 1){
			if(oride == 0){
				sobject = GameObject.Instantiate(plains01, transform.position, transform.rotation);
			}else{
				sobject = GameObject.Instantiate(plains01, transform.position, transform.rotation);
			}
			sobject.transform.parent = transform;
			spawned = true; 
		}else if(type == 2){
			if(oride == 0){
				sobject = GameObject.Instantiate(forest01[Mathf.Round(Random.value * (forest01.Length -1)) ], transform.position, transform.rotation);
			}else{
				sobject = GameObject.Instantiate(forest01[oride-1], transform.position, transform.rotation);
			}
			sobject.transform.parent = transform;
			spawned = true; 
		}else if(type == 3){	
			if(oride == 0){			
				sobject = GameObject.Instantiate(quarry01[Mathf.Round(Random.value * (quarry01.Length -1))], transform.position, transform.rotation);
			}else{
				sobject = GameObject.Instantiate(quarry01[oride-1], transform.position, transform.rotation);
			}
			sobject.transform.parent = transform;
			spawned = true;
		}else if(type == 4 ){
			if(oride == 0){
				sobject = GameObject.Instantiate(village01[Mathf.Round(Random.value * (village01.Length -1))], transform.position, transform.rotation);
			}else{
				sobject = GameObject.Instantiate(village01[oride-1], transform.position, transform.rotation);
			}
			sobject.transform.parent = transform;
			spawned = true;
		}
		oride = 0;
	}
}

public function assignBlock(val : int, setcoords : Vector2){
	type = val;
	coords = setcoords;
}

function SetBlock(val : Vector2){
	for ( var t : Transform in transform ) {
		if( t != transform){
			Destroy( t.gameObject );
		}
	}
	type = val.x;
	oride = val.y;
	spawned = false;
}

function OnMouseDown( ){
	//sDebug.Log("Got a click");
	var name : String;
	switch(type)
	{
		case 0 :
			name = "Water";
			break;
		case 1 :
			name = "Plains";
			break;
		case 2 :
			name = "Forest";
			break;
		case 3 :
			name = "Quarry";
			break;
		case 4 :
			name = "Settlement";
			break;

	}
	ui.SetTarget( this.gameObject,name);
}

function AdjacentTo(coords : Vector2, type : int){

}
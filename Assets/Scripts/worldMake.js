/* worldMake
The purpose of world make is to generate a world
given a seed value or saved world data.
The tiles are created and given a basic shape and
from there their own individual properties take over
*/

#pragma strict
public var template : Transform;
public var draftMats : Material[];

	var blockTypes : int[,] = new int [10, 10];
	var blocks : GameObject[,] = new GameObject[10,10];
	var seedNum : String;
	var worldNum : int;
	var state : int = 0;	
	
function Start () {


}

function Update () {
	if(state == 1){
		if(GenerateLand())
		{
			state = 2;
		}
	}
	if(state == 2){
		if(GenerateForests())
		{
			state = 3;
		}
	}
	if(state == 3){
		if(GenerateQuarries())
		{
			state = 4;
		}
	}if(state == 4){
		if(GenerateVillage())
		{
			state = 5;
		}
	}
}

function makeWorld ( seed : String, worldID : int, size : Vector2) {
	//Creates the array and sets it length
	var offset : Vector2 = Vector2( (size.x * 10) / -2, (size.y * 10) / -2 );
	worldNum = worldID;
	if(seed != "seed"){
		Random.seed = int.Parse(seed);
	}
	for( var x : int = 0 ; x < size.x; x++) {
		for( var y : int = 0 ; y < size.y; y++){
					
			blockTypes[x,y] = 0;
			//Debug.Log(offset.x);
			if(y == 0){
				offset.x = (size.x * 10) / -2;
				offset.y += 10;
			}
			var spawnBlock : Transform;
			spawnBlock = Instantiate(template, Vector3(offset.x, offset.y, 0), template.rotation);
			
			blocks[x,y] = spawnBlock.gameObject;
			
			var assigner : BlockAssigner = spawnBlock.GetComponent(BlockAssigner);
			assigner.assignBlock(0);
			spawnBlock.renderer.material = draftMats[0];
			offset.x += 10;
		}
	}
	return true;
	
}
	
function GenerateLand(){
	var threshhold : float;
	var variance : float = (worldNum / 2) * 0.009 * (Random.value/2);
	for( var x : int = 0 ; x < 10; x++ ){
		for( var y : int = 0 ; y < 10; y++){
			//If it's on the edge
			if(x == 0 || x == 9 || y == 9 || y == 0){
				threshhold = 1;
			}else if(x == 1 || x == 8 && y == 1 || y == 8){
				threshhold = 0.35 + (variance);
			}else if (x > 1 && x < 9 && y > 1 && y < 9){
				threshhold = 0.2 + (variance);
			}
			
			if(worldNum%3 == 0 && x%2 == 1){
				threshhold -= 0.1;
			}else if(worldNum%3 == 1 && y%2 == 0){
				threshhold -= 0.1;
			}else if(worldNum%3 == 2 && y%2 == 0){
				threshhold -= 0.1;
			}
			
			if( x > 3 && x < 7){
				threshhold -= 0.1;
			}
			if( y > 3 && y < 7){
				threshhold -= 0.1;
			}
			
			//threshhold += 0.03 * worldNum * (Random.value - .5);
			
			//Debug.Log(threshhold + " " + a + " " + b);
			
			if( Random.value > threshhold ){
				AssignBlock(1,x,y);
			}
				
		}
	}
	return true;
}

function GenerateQuarries(){
	for( var x : int = 0 ; x < 10; x++ ){
		for( var y : int = 0 ; y < 10; y++){
			if(blockTypes[x,y] == 1){
				var rnd = Random.value;
				if(rnd > 0.85){
					AssignBlock(3, x, y);
				}
			}
		}
	}
	return true;
}

function GenerateForests(){
	var skip : int = 0;
	var skipRan : float = Random.value;
	for( var x : int = 0 ; x < 10; x++ ){
		for( var y : int = 0 ; y < 10; y++){
			if(blockTypes[x,y] == 1 && skip == 0){
				AssignBlock(2, x, y);
				skipRan = Random.value;
				if (skipRan > 0.8){
					skip = 8;
				}else if(skipRan >= 0.3 && skipRan <= 0.8){
					skip = 0;
				}else if(skipRan < 0.3){
					skip = 4;
				}
			}else if(skip != 0 || blockTypes[x,y] !=0){
				skip--;
			}
			
		}
	}
	
	return true;
}

function GenerateVillage(){
	if (worldNum%25 == 0 || worldNum%2 == 0){
	var threshhold : float;
	var rand : float;
		for( var x : int = 0 ; x < 10; x++ ){
			for( var y : int = 0 ; y < 10; y++){
				if(blockTypes[x,y] == 1)
				{
					rand = Random.value;
					if(worldNum%25 == 0){
						threshhold = 0.8;
					}else if(worldNum%2 == 0 && rand < 0.7){
						return true;
					}else if(worldNum%2 == 0 && rand >= 0.7){
						threshhold = 0.9;
					}
					if (Random.value > threshhold){
							AssignBlock(4,x,y);
						return true;
					}
				}
			}
		}
	}else{
		return true;
	}
}

function AssignBlock (blockType : int, x : int , y : int){
		var assigner : BlockAssigner = blocks[x,y].GetComponent(BlockAssigner);
		assigner.assignBlock(blockType);
		blocks[x,y].renderer.material = draftMats[blockType];
		blockTypes[x,y] = blockType;

}

function SpreadBlock (pattern : int, x : int, y : int){
	switch(pattern)
	{
		//trees
		case 0:
		if(x < 9 && y < 9 && blockTypes[x+1,y+1] == 1){
			AssignBlock(2, x+1,y+1);
		}
		if(x > 1 && y > 1 && blockTypes[x-1,y-1] == 1){
			AssignBlock(2, x-1,y-1);
		}
		

	}

}

function unload( ){
	for( var x : int = 0 ; x < 10; x++ ){
		for( var y : int = 0 ; y < 10; y++){
			Destroy(blocks[x,y]);
		
		}
	}
	state = 0;
}
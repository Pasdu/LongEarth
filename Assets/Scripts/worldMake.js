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
	var plainsBlocks : Array;
	var blocks : GameObject[,] = new GameObject[10,10];
	var seedNum : int;
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
	seedNum = int.Parse(seed);
	if(seed != "seed"){
		Random.seed = seedNum;
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
	/* Threshhold to compare against the RNG
	plainsBlocks is the landblocks that will be used for the next steps	
	variance is just a little idea I'm playing with in order to change
	the basic land mass as you move stepwise */
	var threshhold : float;
	Random.seed += worldNum;
	plainsBlocks = new Array (Vector2(0,0));
	var i : int = 0;
	/* These loops are supposed to run an RNG against the threshhold
	and place blocks of land based on some simple rules, for the most
	part is it effective but there are serious issues here Especially
	with the variance */ 
	for( var x : int = 0 ; x < 10; x++ ){
		for( var y : int = 0 ; y < 10; y++){
			//This coverse the edge pieces, making it
			//very difficult to spawn there.
			if(x == 0 || x == 9 || y == 9 || y == 0){
				threshhold = 1.3;
			}else{
				threshhold = 0.6;
			}
			
			if( x > 1 && x < 8){
				threshhold -= 0.25;
			}
			if( y > 1 && y < 8){
				threshhold -= 0.25;
			}
			if( Random.value > threshhold ){
				AssignBlock(1,Vector2(x,y));
				plainsBlocks[i] = Vector2(x,y);
				i++;	
			}
				
		}
	}
	Random.seed = seedNum;
	return true;
}

function GenerateQuarries(){
	for( var i : int = 0 ; i < plainsBlocks.length; i++ ){
				if(Random.value > 0.85){
					AssignBlock(3, plainsBlocks[i]);
					plainsBlocks.RemoveAt(i);
			}
	}
	return true;
}

function GenerateForests(){
	var skip : int = Mathf.Round(Random.value * 3);
	var skipRan : float = Random.value;
	for( var i : int = 0 ; i < plainsBlocks.length; i++ ){
			if(skip == 0){
				AssignBlock(2, plainsBlocks[i]);
				plainsBlocks.RemoveAt(i);
				skipRan = Random.value;
				if (skipRan > 0.8){
					skip = 6;
				}else if(skipRan >= 0.3 && skipRan <= 0.8){
					skip = 0;
				}else if(skipRan < 0.3){
					skip = 2;
				}
			}else if(skip != 0){
				skip--;
			}
			
		}	
	return true;
}

function GenerateVillage(){
	if (worldNum%25 == 0 || worldNum%2 == 0){
	var threshhold : float;
	Random.seed += worldNum;
	var rand : float;
	var skip : int =  Mathf.Round((Random.value*3) + 2);
	for( var i : int = 0 ; i < plainsBlocks.length; i++ ){
					if(worldNum%25 == 0){
						threshhold = 0.8;
					}else if(worldNum%skip == 0){
						threshhold = 0.99;
					}else{
						threshhold = 1;
					}
					if (Random.value > threshhold){
							AssignBlock(4,plainsBlocks[i]);
					}
		}
	}
	Random.seed = seedNum;
	return true;
}

function AssignBlock (blockType : int, coords: Vector2){
		var assigner : BlockAssigner = blocks[coords.x,coords.y].GetComponent(BlockAssigner);
		assigner.assignBlock(blockType);
		blocks[coords.x,coords.y].renderer.material = draftMats[blockType];
		blockTypes[coords.x,coords.y] = blockType;

}

function SpreadBlock (pattern : int, x : int, y : int){
	switch(pattern)
	{
		//trees
		case 0:
		if(x < 9 && y < 9 && blockTypes[x+1,y+1] == 1){
			AssignBlock(2, Vector2(x+1,y+1));
		}
		if(x > 1 && y > 1 && blockTypes[x-1,y-1] == 1){
			AssignBlock(2, Vector2(x+1,y+1));
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
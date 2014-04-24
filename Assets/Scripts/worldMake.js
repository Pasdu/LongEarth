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
			assigner.assignBlock(0, Vector2(x,y));
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
	//Random.seed += worldNum;
	plainsBlocks = new Array (Vector2(0,0));
	plainsBlocks.pop();
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
			
			if( x > 1 && x < 9){
				threshhold -= .25;
			}
			if( y > 1 && y < 8){
				threshhold -= .25;
			}
			if( Random.value > threshhold ){
				AssignBlock(1,Vector2(x,y));
				plainsBlocks.Push(Vector2(x,y));
				i++;	
			}
				
		}
	}
	//Random.seed = seedNum;
	return true;
}

function OffsetLand ( ){

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
	var skip : int = 0;
	var skipRan : int ;
	Random.seed = Random.seed + worldNum;
	var ioffset : int = 0;
	var blockCount = plainsBlocks.length;
	for( var i : int = 0 ; i < blockCount; i++ ){
			if(skip == 0){
				AssignBlock(2, plainsBlocks[0]);
				plainsBlocks.Shift();
				skipRan = Mathf.Round(Random.value* 10);
				
				if(skipRan < 5){
					skip = 0;
				}else if(skipRan >=5 && skipRan <= 7){
					skip = Mathf.Round((Random.value * 4 )+3);
				}else{
					skip = 2;
				}
						
			}else if(skip != 0){
				skip--;
				plainsBlocks.Push(plainsBlocks[0]);
				plainsBlocks.Shift();
			}
			
		}	
	Random.seed = seedNum;
	return true;
}

function GenerateVillage(){
	var threshhold : float;
	Random.seed += worldNum;
	var rand : float;
	var skip : int =  Mathf.Round((Random.value*5) + 2);

	for( var i : int = 0 ; i < plainsBlocks.length; i++ ){
					if(worldNum%25 == 0){
						threshhold = 0.89;
					}else if(worldNum%skip == 0){
						threshhold = 0.92;
					}else{
						threshhold = 1;
					}
					if (Random.value > threshhold){
							AssignBlock(4,plainsBlocks[i]);
					}
		}
	Random.seed = seedNum;
	return true;
}

function AssignBlock (blockType : int, coords: Vector2){
		var assigner : BlockAssigner = blocks[coords.x,coords.y].GetComponent(BlockAssigner);
		assigner.assignBlock(blockType, coords);
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
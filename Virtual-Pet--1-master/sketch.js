var dog,Happydog,database,foodS,foodStock,dog1,dog2;
var feed, addFood,bg;
var fedTime, lastFed;
var foodObj;
var gameState,readState;
var bedroom,garden,washroom;

function preload()
{
	 dog1=loadImage("images/Dog.png");
   dog2=loadImage("images/happydog.png");
   bg = loadImage("images/bg.png");
   bedroom=loadImage("pics/Bed Room.png");
   garden=loadImage("pics/Garden.png");
   washroom=loadImage("pics/Wash Room.png");
}

function setup() {
	createCanvas(900,900);
  database=firebase.database();
  dog = createSprite(450, 600, 20, 80);
  dog.addImage(dog1);
  dog.scale = 0.6;


  foodObj = new Milk();

  feed = createButton("Feed the Dog");
  feed.position(750, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(850, 95);
  addFood.mousePressed(addFoods);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();


  });
  feedTime=database.ref('FeedTime');
  feedTime.on("value",function(data)
  {
    lastFed=data.val();
  })

  foodStock=database.ref('Food');
  foodStock.on("value",function(data)
  {
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  })

  /*textSize(25);
  stroke(10);
  strokeWeight(5);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + "PM", 390, 30);
  }else if(lastFed==0){
    text("Last Fed : 12 AM", 390, 30);
  }else{
    text("Last Fed : "+lastFed, 390, 30);
  }
}*/
}


function draw() {  

  currentTime = hour();
  if (currentTime === (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  } else if(currentTime === (lastFed + 2)){
      update("Sleeping");
      foodObj.bedroom();
  } else if (currentTime > (lastFed +2) && currentTime <= (lastFed + 4)){
      update("Bathing");
      foodObj.washroom();
  } else {
      update("Hungry");
      foodObj.display();
  }

  if (gameState !== "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(dog1);
  }

/*  fill(255, 255, 254);
  textSize(25);
  stroke(10);
  strokeWeight(5);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%10 + "AM", 390, 30);
  }else if(lastFed==0){
    text("Last Fed : 12 AM", 390, 30);
  }else{
    text("Last Fed : "+lastFed, 390, 30);
  }*/

  drawSprites();


}



function feedDog(){

  dog.addImage(dog2);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}

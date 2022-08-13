function preload() {
    //img = loadImage('assets/truck.png');
}

let slider1;
let slider2;

function setup() {
    createCanvas(800, 600);
    angleMode(DEGREES);

    slider1 = createSlider(50, 250, 150);
}

let CAR_HEIGHT = 100;
let CAR_WIDTH = 50;
let WHEEL_HEIGHT = 20;
let WHEEL_WIDTH = 10;
let CAR_WHEEL_BASE = CAR_HEIGHT - 2*WHEEL_HEIGHT;

let ENGINE_POWER = 200;

let HITCH_LENGTH = 30;
let TRAILER_HEIGHT = 150;
let TRAILER_WIDTH = 50;
let TRAILER_WHEEL_BASE = TRAILER_HEIGHT + 10;


let wheelAngle = 0;
let carDir = Victor(Math.random()*2-1, Math.random()*2-1).norm();
let carPos = Victor(200,250);
let carVel = 0;
let carAccel = 0;

let hitchPos = carPos.clone().add(carDir.clone().multiplyScalar(-HITCH_LENGTH));

let trailerDir = carDir.clone(); /*Victor(0,1).norm();*/ 
let trailerPos = hitchPos.clone().add(trailerDir.clone().multiplyScalar(-TRAILER_WHEEL_BASE));


function draw() {
    frameRate(30);

    TRAILER_HEIGHT = slider1.value();
    TRAILER_WHEEL_BASE = TRAILER_HEIGHT + 10;

    // handle turning
    if (keyIsDown(LEFT_ARROW)) {
        wheelAngle = -25;
    } else if (keyIsDown(RIGHT_ARROW)) {
        wheelAngle = 25;
    } else {
        wheelAngle = 0;
    }

    // handle speed
    if (keyIsDown(UP_ARROW)) {
        carAccel = 1;
    }
    else if (keyIsDown(DOWN_ARROW)) {
        carAccel = -1;
    }
    else {
        carAccel = 0;
    }

    // update physics
    calcSteering(deltaTime);

    fill(0);
    textSize(32);
    text(''+carVel, 10, 30);

    drawParkingLot();
    drawCar();
    drawTrailer();

    fill(255,0,0);
    textSize(32);
    if (abs(acos(carDir.dot(trailerDir))) > 100) {
        text('JACKKNIFE', 10, 300);
    }

}

function calcSteering(dt) {

    // let frictionForce = carVel * 1.1;
    // let dragForce = carVel * carVel * 0.0004;

    // let totalAccel = (carAccel * ENGINE_POWER - frictionForce - dragForce);
    // carVel += totalAccel * dt/1000;

    // if (abs(carVel) < 5) {
    //     carVel = 0;
    // }

    carVel = carAccel * 100;


    // trailer movements (see diagram)
    temp = carDir.cross(trailerDir) * (carVel * dt/1000);
    deltaPhi = atan(temp/TRAILER_WHEEL_BASE);
    trailerDir.rotateDeg(-deltaPhi);

    // car movements
    // get the wheel positions
    let frontWheel = carPos.clone().add(carDir.clone().multiplyScalar(CAR_WHEEL_BASE));
    let rearWheel = carPos.clone();

    // move the wheels
    frontWheel.add(carDir.clone().rotateDeg(wheelAngle).multiplyScalar(carVel * dt/1000));
    rearWheel.add(carDir.clone().multiplyScalar(carVel * dt/1000));

    // assign new positions
    carPos = rearWheel;
    hitchPos = carPos.clone().add(carDir.clone().multiplyScalar(-HITCH_LENGTH));
    trailerPos = hitchPos.clone().add(trailerDir.clone().multiplyScalar(-TRAILER_WHEEL_BASE));

    // calculate new direction for the car
    carDir = frontWheel.clone().subtract(rearWheel).norm();
}

function drawParkingLot() {
    background(204);
    fill(255);

    for (let x=0; x<800; x+=100) {
        rect(x,0, 10, 200);
        rect(x,400, 10, 200);
    }
}

function drawCar() {
    
    // draw relative to back of car (to make rotating car easy)
    push();
    translate(carPos.x, carPos.y);
    rotate(carDir.angleDeg() - 90);
    
    // draw headlights
    push();
    translate(0, CAR_HEIGHT-WHEEL_HEIGHT);
    fill(255,255,0);
    circle(-CAR_WIDTH/4,0,10);
    circle(CAR_WIDTH/4,0,10);
    pop();
    
    // draw car body
    fill(0,120,255);
    rect(-CAR_WIDTH/2,-WHEEL_HEIGHT,CAR_WIDTH, CAR_HEIGHT);

    // draw rear wheels
    fill(20);
    translate(CAR_WIDTH/2, 0);
    rect(-WHEEL_WIDTH/2, -WHEEL_HEIGHT/2, WHEEL_WIDTH, WHEEL_HEIGHT);

    translate(-CAR_WIDTH, 0);
    rect(-WHEEL_WIDTH/2, -WHEEL_HEIGHT/2, WHEEL_WIDTH, WHEEL_HEIGHT);

    // draw front wheels
    translate(0, CAR_WHEEL_BASE);
    rotate(wheelAngle);
    rect(-WHEEL_WIDTH/2, -WHEEL_HEIGHT/2, WHEEL_WIDTH, WHEEL_HEIGHT);
    rotate(-wheelAngle);

    translate(CAR_WIDTH, 0);
    rotate(wheelAngle);
    rect(-WHEEL_WIDTH/2, -WHEEL_HEIGHT/2, WHEEL_WIDTH, WHEEL_HEIGHT);
    rotate(-wheelAngle);

    pop();
}

function drawTrailer() {   
    
    // draw hitch
    fill(100);
    strokeWeight(4);
    line(carPos.x, carPos.y, hitchPos.x, hitchPos.y);
    line(hitchPos.x, hitchPos.y, trailerPos.x, trailerPos.y);
    strokeWeight(1);

    // draw trailer
    push();
    translate(trailerPos.x, trailerPos.y);
    rotate(trailerDir.angleDeg() - 90);

    // trailer body
    fill(0,255,255);
    rect(-TRAILER_WIDTH/2, -WHEEL_HEIGHT, TRAILER_WIDTH, TRAILER_HEIGHT);

    // trailer wheels
    fill(20);
    rect(-TRAILER_WIDTH/2-WHEEL_WIDTH/2, -WHEEL_HEIGHT/2, WHEEL_WIDTH, WHEEL_HEIGHT);
    rect(TRAILER_WIDTH/2-WHEEL_WIDTH/2, -WHEEL_HEIGHT/2, WHEEL_WIDTH, WHEEL_HEIGHT);

    pop();


    // draw reference points
    fill(0,255,0);
    circle(carPos.x,carPos.y,10);

    fill(0,0,255);
    circle(hitchPos.x, hitchPos.y,10);

    fill(255,0,255);
    circle(trailerPos.x, trailerPos.y,10);
}
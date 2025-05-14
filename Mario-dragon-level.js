// =============================================================================
// === GLOBAL CONFIG & VARS ==================================================
// =============================================================================

// --- Game Configuration ---
const PIXEL_SCALE = 4;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const DOUBLE_JUMP_FORCE = -8;
const MOVE_SPEED = 3;
const SCROLL_THRESHOLD_RIGHT = 300;
const SCROLL_THRESHOLD_LEFT = 100;
const MARIO_WALK_ANIM_SPEED = 8;
const FINAL_BOSS_HEALTH = 3; // NEW: Final Boss HP

// --- Colors --- (Added Black/Grey)
const MARIO_RED=[216,40,0]; const MARIO_BLUE=[0,120,216]; const MARIO_SKIN=[252,188,176]; const MARIO_BROWN=[136,68,0];
const GROUND_BROWN=[160,82,45]; const PLATFORM_BRICK=[188,84,0];
const ENEMY_BROWN=[148,80,0]; const BIG_MONSTER_COLOR=[180,0,0]; const DRAGON_GREEN=[0,150,0]; const DRAGON_WING=[100,180,100];
const FINAL_BOSS_BLACK = [30, 30, 30]; // NEW
const FINAL_BOSS_GREY = [100, 100, 100]; // NEW
const SKY_BLUE=[92,148,252]; const HILL_GREEN=[34,139,34]; const CLOUD_WHITE=[255,255,255];

// --- Game State Variables ---
let mario; let platforms=[]; let enemies=[]; let clouds=[]; let hills=[];
let scrollOffset=0; let score=0; let gameOver=false; let levelComplete=false; let groundY;
const LEVEL_END_X = 5000; // End coordinate
const FINAL_BOSS_SPAWN_X = LEVEL_END_X - 150; // NEW: Where the boss appears

// --- Spawning Flags ---
let spawnedBigMonster=false; const BIG_MONSTER_SCORE_THRESHOLD=500;
let spawnedDragon=false; const DRAGON_SCORE_THRESHOLD=1000;
let spawnedFinalBoss = false; // NEW: Flag for final boss

// =============================================================================
// === P5.JS SETUP FUNCTION ====================================================
// =============================================================================
function setup() {
  console.log("setup() started");
  try {
    createCanvas(600, 400); groundY = height - 40; noSmooth();
    // --- Reset State ---
    mario = new Mario(50, groundY - 16 * PIXEL_SCALE);
    platforms = []; enemies = []; clouds = []; hills = [];
    scrollOffset = 0; score = 0; gameOver = false; levelComplete = false;
    spawnedBigMonster = false; spawnedDragon = false; spawnedFinalBoss = false; // Reset boss flag

    // --- Populate Level --- (Platforms, Initial Enemies, Background - same as before)
    // Platforms...
    platforms.push(new Platform(200, groundY - 60, 80, 20)); platforms.push(new Platform(350, groundY - 100, 100, 20)); platforms.push(new Platform(550, groundY - 80, 60, 20)); platforms.push(new Platform(700, groundY - 140, 80, 20)); platforms.push(new Platform(900, groundY - 50, 120, 20)); platforms.push(new Platform(1100, groundY - 100, 50, 20)); platforms.push(new Platform(1180, groundY - 150, 50, 20)); platforms.push(new Platform(1260, groundY - 200, 50, 20)); platforms.push(new Platform(1400, groundY - 120, 150, 20)); platforms.push(new Platform(1600, groundY - 80, 80, 20)); platforms.push(new Platform(1750, groundY - 80, 80, 20)); platforms.push(new Platform(1900, groundY - 160, 100, 20)); platforms.push(new Platform(2100, groundY - 60, 90, 20)); platforms.push(new Platform(2250, groundY - 100, 90, 20)); platforms.push(new Platform(2400, groundY - 140, 90, 20)); platforms.push(new Platform(2600, groundY - 100, 40, 20)); platforms.push(new Platform(2680, groundY - 90, 40, 20)); platforms.push(new Platform(2760, groundY - 80, 40, 20)); platforms.push(new Platform(2900, groundY - 180, 120, 20)); platforms.push(new Platform(3100, groundY - 70, 100, 20)); platforms.push(new Platform(3300, groundY - 110, 150, 20)); platforms.push(new Platform(3500, groundY - 150, 50, 20)); platforms.push(new Platform(3600, groundY - 70, 100, 20)); platforms.push(new Platform(3800, groundY - 90, 60, 20)); platforms.push(new Platform(3900, groundY - 130, 60, 20)); platforms.push(new Platform(4000, groundY - 170, 60, 20)); platforms.push(new Platform(4200, groundY - 100, 100, 20)); platforms.push(new Platform(4400, groundY - 100, 100, 20)); platforms.push(new Platform(4650, groundY - 150, 80, 20)); platforms.push(new Platform(4850, groundY - 80, 100, 20));
    platforms.push(new Platform(LEVEL_END_X + 10, groundY - 150, 10, 150)); platforms.push(new Platform(LEVEL_END_X, groundY - 160, 30, 10));
    // Initial Enemies...
    enemies.push(new Enemy(400, groundY)); enemies.push(new Enemy(600, groundY)); enemies.push(new Enemy(750, groundY - 140)); enemies.push(new Enemy(950, groundY)); enemies.push(new Enemy(1150, groundY)); enemies.push(new Enemy(1450, groundY - 120)); enemies.push(new Enemy(1630, groundY - 80)); enemies.push(new Enemy(1800, groundY)); enemies.push(new Enemy(2150, groundY - 60)); enemies.push(new Enemy(2450, groundY - 140)); enemies.push(new Enemy(2800, groundY)); enemies.push(new Enemy(2950, groundY - 180)); enemies.push(new Enemy(3150, groundY - 70)); enemies.push(new Enemy(3350, groundY - 110)); enemies.push(new Enemy(3700, groundY)); enemies.push(new Enemy(4050, groundY - 170)); enemies.push(new Enemy(4250, groundY - 100)); enemies.push(new Enemy(4500, groundY)); enemies.push(new Enemy(4700, groundY - 150)); enemies.push(new Enemy(4900, groundY - 80));
    // Background...
    for(let i=0;i<25;i++)clouds.push({x:random(-width,LEVEL_END_X+width),y:random(30,height/2-30),w:random(40,80),h:random(20,40)}); hills.push({x:100,y:groundY,w:300,h:100}); hills.push({x:600,y:groundY,w:400,h:150}); hills.push({x:1200,y:groundY,w:250,h:80}); hills.push({x:1800,y:groundY,w:350,h:120}); hills.push({x:2500,y:groundY,w:300,h:90}); hills.push({x:3100,y:groundY,w:450,h:160}); hills.push({x:3800,y:groundY,w:280,h:110}); hills.push({x:4500,y:groundY,w:400,h:130});

  } catch (error) { console.error("Error during setup():", error); background(0);fill(255,0,0);textSize(16);textAlign(CENTER,CENTER);text("Setup Error. Check console (F12).",width/2,height/2); noLoop(); }
  console.log("setup() finished");
}

// =============================================================================
// === P5.JS DRAW FUNCTION =====================================================
// =============================================================================
function draw() {
  try {
    handleInput();
    if (!gameOver && !levelComplete) {
      mario.update();
      updateEnemies();
      updateScroll();
      checkScoreSpawns();
      checkBossSpawn(); // NEW: Check if boss should appear
      checkLevelComplete();
    }
    background(SKY_BLUE);
    drawBackgroundElements(); drawGround(); drawPlatforms(); drawEnemies();
    if (mario) mario.show();
    drawUI();
    if (gameOver) { displayGameOver(); noLoop(); }
    else if (levelComplete) { displayLevelComplete(); noLoop(); }
  } catch (error) { console.error("Error during draw():", error); fill(255,0,0);textSize(16);textAlign(CENTER,CENTER);text("Draw Error. Check console (F12).",width/2,height/2); noLoop(); }
}

// =============================================================================
// === CORE GAME LOGIC FUNCTIONS ===============================================
// =============================================================================

function handleInput() { /* Unchanged */ if(gameOver||levelComplete)return; let mv=false; if(keyIsDown(RIGHT_ARROW)){mario.move(1);mv=true;}else if(keyIsDown(LEFT_ARROW)){mario.move(-1);mv=true;} mario.isTryingToWalk=mv; mario.isCrouching=keyIsDown(DOWN_ARROW); }
function keyPressed() { /* Unchanged */ if((gameOver||levelComplete)&&(key==='r'||key==='R')){restartGame();return;} if(gameOver||levelComplete)return; if(keyCode===UP_ARROW){if(mario.isOnGround)mario.jump();else if(mario.canDoubleJump)mario.doubleJump();} }
function updateScroll() { /* Unchanged */ let mX=mario.x-scrollOffset; if(mX>SCROLL_THRESHOLD_RIGHT){let pS=mX-SCROLL_THRESHOLD_RIGHT; scrollOffset=min(scrollOffset+pS,LEVEL_END_X+150-width);}else if(mX<SCROLL_THRESHOLD_LEFT){let d=SCROLL_THRESHOLD_LEFT-mX; scrollOffset=max(0,scrollOffset-d);} mario.x=constrain(mario.x,mario.w/2,LEVEL_END_X+100); }
function checkScoreSpawns() { /* Unchanged */ let sM=width*0.6; if(!spawnedBigMonster&&score>=BIG_MONSTER_SCORE_THRESHOLD){enemies.push(new BigMonster(mario.x+sM+random(0,100),groundY));spawnedBigMonster=true;} if(!spawnedDragon&&score>=DRAGON_SCORE_THRESHOLD){enemies.push(new Dragon(mario.x+sM+random(50,150),groundY-100));spawnedDragon=true;} }
function checkLevelComplete() { /* Unchanged */ if(!levelComplete&&mario.x>LEVEL_END_X){levelComplete=true;score+=1000;} }

// NEW: Function to check and spawn the final boss
function checkBossSpawn() {
    // Spawn boss when Mario gets close to the boss spawn point, only once
    let triggerDist = width * 0.8; // How far before the boss position Mario needs to be
    if (!spawnedFinalBoss && mario.x > FINAL_BOSS_SPAWN_X - triggerDist) {
        // Spawn the boss slightly above ground level at its fixed position
        enemies.push(new FinalBoss(FINAL_BOSS_SPAWN_X, groundY - 50));
        spawnedFinalBoss = true;
        console.log("Final Boss Spawned!"); // Debugging
    }
}

// MODIFIED: updateEnemies (Handles stomp_multi again)
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (!enemies[i]) continue;

    let enemy = enemies[i];
    let enemyScreenX = enemy.x - scrollOffset;

    if (enemyScreenX < width + 200 && enemyScreenX + enemy.w > -200) { // Near screen?
        enemy.update(platforms);

        if (abs(mario.x - enemy.x) < width * 0.7) { // Horizontally close?
             let collisionType = mario.checkEnemyCollision(enemy);

             if (collisionType === 'stomp') {
                score += enemy.stompScore || 100;
                enemies.splice(i, 1);
                mario.vy = JUMP_FORCE * 0.7;
                continue;
             }
             else if (collisionType === 'stomp_multi') { // Stomped boss/multi-hit enemy
                mario.vy = JUMP_FORCE * 0.7; // Bounce
                // Check if the enemy is now dead after taking damage
                if (enemy.isDead === true) {
                    score += enemy.stompScore || 500; // Use boss score maybe?
                    enemies.splice(i, 1);
                    continue;
                }
             }
             else if (collisionType === 'hit') {
                gameOver = true;
                return;
             }
        }
    } else if (enemyScreenX < -width * 2) { // Cull far left
        enemies.splice(i, 1);
        continue;
    }
  }
}

// =============================================================================
// === DRAWING HELPER FUNCTIONS ================================================
// =============================================================================
function drawGround() { /* Unchanged */ fill(GROUND_BROWN);noStroke();rect(0,groundY,width,height-groundY); }
function drawPlatforms() { /* Unchanged */ for(let p of platforms)p.show(scrollOffset); }
function drawEnemies() { /* Unchanged */ for(let e of enemies)e.show(scrollOffset); }
function drawBackgroundElements() { /* Unchanged */ fill(CLOUD_WHITE);noStroke();for(let c of clouds){let sX=c.x-scrollOffset*0.3;if(sX+c.w>0&&sX<width){ellipse(sX+c.w/2,c.y,c.w,c.h);ellipse(sX+c.w*0.2,c.y+c.h*0.1,c.w*0.7,c.h*0.8);ellipse(sX+c.w*0.8,c.y+c.h*0.2,c.w*0.6,c.h*0.7);}} fill(HILL_GREEN);for(let h of hills){let sX=h.x-scrollOffset*0.6;if(sX+h.w>0&&sX<width)arc(sX+h.w/2,h.y,h.w,h.h*2,PI,0);} fill(22,88,22);for(let h of hills){let sX=h.x-scrollOffset*0.6;if(sX+h.w>0&&sX<width)arc(sX+h.w/2+10,h.y,h.w*0.8,h.h*1.6,PI,0);} }
function drawUI() { /* Unchanged */ fill(255);stroke(0);strokeWeight(2);textSize(18);textAlign(LEFT,TOP);text(`SCORE:${score}`,10,10);textAlign(CENTER,TOP);text(`L/R:Move|UP:Jump/Dbl Jump|DOWN:Crouch/Drop`,width/2,10); }
function displayGameOver() { /* Unchanged */ fill(0,0,0,180);rect(0,0,width,height);fill(255,0,0);stroke(0);strokeWeight(3);textSize(40);textAlign(CENTER,CENTER);text("GAME OVER",width/2,height/2-40);fill(255);textSize(20);text(`Final Score:${score}`,width/2,height/2);text("Press 'R' to Restart",width/2,height/2+40); }
function displayLevelComplete() { /* Unchanged */ fill(0,150,0,180);rect(0,0,width,height);fill(255,255,0);stroke(0);strokeWeight(3);textSize(40);textAlign(CENTER,CENTER);text("LEVEL COMPLETE!",width/2,height/2-40);fill(255);textSize(20);text(`Final Score:${score}`,width/2,height/2);text("Press 'R' to Play Again",width/2,height/2+40); }

// --- Restart Game ---
function restartGame() { console.log("Restarting..."); setup(); loop(); }

// --- Helper: Draw Pixel Rect ---
function pixelRect(x, y, w, h) { rect(floor(x*PIXEL_SCALE),floor(y*PIXEL_SCALE),w*PIXEL_SCALE,h*PIXEL_SCALE); }


// =============================================================================
// === CLASSES (Mario, Platform, Enemy, BigMonster, Dragon, FinalBoss) ========
// =============================================================================

// --- Mario Class --- (MODIFIED checkEnemyCollision)
class Mario {
  constructor(x, y) { /* Unchanged */ this.x=x;this.y=y;this.w=12*PIXEL_SCALE;this.h=16*PIXEL_SCALE;this.vx=0;this.vy=0;this.isOnGround=false;this.facing=1;this.isTryingToWalk=false;this.isCrouching=false;this.canDoubleJump=false;this.walkFrame=0;this.walkTimer=0; }
  move(dir) { /* Unchanged */ if(!this.isCrouching||!this.isOnGround)this.vx=dir*MOVE_SPEED;else this.vx=0; if(dir!==0)this.facing=dir; }
  jump() { /* Unchanged */ if(this.isOnGround&&!this.isCrouching){this.vy=JUMP_FORCE;this.isOnGround=false;this.canDoubleJump=true;} }
  doubleJump() { /* Unchanged */ if(!this.isOnGround&&this.canDoubleJump){this.vy=DOUBLE_JUMP_FORCE;this.canDoubleJump=false;} }
  applyGravity() { /* Unchanged */ this.vy+=GRAVITY;this.y+=this.vy; }
  handleCollisions(platforms) { /* Unchanged */ this.isOnGround=false;let landed=false;if(this.y+this.h>=groundY){this.y=groundY-this.h;this.vy=0;this.isOnGround=true;landed=true;} for(let p of platforms){if(this.x+this.w>p.x&&this.x<p.x+p.w){let mB=this.y+this.h,mPB=mB-this.vy,pT=p.y;if(this.vy>=0&&mB>=pT&&mPB<=pT+1){if(!(this.isCrouching&&this.isOnGround)){this.y=pT-this.h;this.vy=0;this.isOnGround=true;landed=true;}else{continue;}} let mT=this.y,mPT=mT-this.vy,pB=p.y+p.h;if(this.vy<0&&mT<=pB&&mPT>=pB-1){this.y=pB;this.vy=0;}}} if(landed)this.canDoubleJump=false; let nX=this.x+this.vx;let eH=this.isCrouching?this.h*0.7:this.h,cY=this.y+this.h-eH; for(let p of platforms){if(cY+eH>p.y&&cY<p.y+p.h){if(this.vx>0&&nX+this.w>=p.x&&this.x+this.w<=p.x+1){nX=p.x-this.w;this.vx=0;break;}else if(this.vx<0&&nX<=p.x+p.w&&this.x>=p.x+p.w-1){nX=p.x+p.w;this.vx=0;break;}}} this.x=nX;this.vx=0; }

  // MODIFIED: Handles stomp, multi-stomp, hit
  checkEnemyCollision(enemy) {
    let mR={x:this.x,y:this.y,w:this.w,h:this.h}; let eR={x:enemy.x,y:enemy.y,w:enemy.w,h:enemy.h};
    if (mR.x<eR.x+eR.w && mR.x+mR.w>eR.x && mR.y<eR.y+eR.h && mR.y+mR.h>eR.y) { // Overlap?
        let mPB=(this.y+this.h)-this.vy; let eSZ=eR.y+eR.h*0.5;
        // Check stomp trajectory
        if (this.vy>0.1 && mPB<=eSZ && (this.y+this.h)>eR.y-5) {
            if (enemy.isStompable === true) return 'stomp'; // Instant kill
            else if (typeof enemy.takeDamage === 'function') { enemy.takeDamage(); return 'stomp_multi'; } // Multi-hit
            else return 'hit'; // Landed on unstompable
        } else return 'hit'; // Side/bottom hit
    } return 'none'; // No collision
  }

  update() { /* Unchanged */ this.applyGravity();this.handleCollisions(platforms);if(this.isTryingToWalk&&this.isOnGround&&!this.isCrouching){this.walkTimer=(this.walkTimer+1)%MARIO_WALK_ANIM_SPEED;if(this.walkTimer===0)this.walkFrame=(this.walkFrame+1)%3;}else if(!this.isOnGround){this.walkFrame=1;}else{this.walkFrame=0;this.walkTimer=0;} this.isTryingToWalk=false; }
  show() { /* Unchanged */ let sX=this.x-scrollOffset,sY=this.y;if(sX+this.w<0||sX>width||sY+this.h<0||sY>height)return;push();translate(sX,sY);if(this.facing===-1){scale(-1,1);translate(-this.w,0);}noStroke();if(this.isCrouching&&this.isOnGround)this.drawCrouching();else if(!this.isOnGround)this.drawJumping();else this.drawWalkingOrStanding();pop(); }
  drawCrouching(){/*Identical*/const nH=16,cH=11,yOff=(nH-cH);push();translate(0,yOff*PIXEL_SCALE);fill(MARIO_RED);pixelRect(3,0,6,1);pixelRect(2,1,9,1);fill(MARIO_BROWN);pixelRect(2,2,3,1);pixelRect(9,2,1,1);fill(MARIO_SKIN);pixelRect(5,2,4,1);pixelRect(4,2,1,1);fill(MARIO_BLUE);pixelRect(3,3,6,3);pixelRect(2,4,1,3);pixelRect(9,4,1,3);fill(MARIO_RED);pixelRect(1,3,2,3);pixelRect(9,3,2,3);fill(MARIO_SKIN);pixelRect(0,4,1,2);pixelRect(11,4,1,2);fill(MARIO_BLUE);pixelRect(1,6,3,3);pixelRect(8,6,3,3);fill(MARIO_BROWN);pixelRect(0,9,4,2);pixelRect(8,9,4,2);pop();}
  drawJumping(){/*Identical*/fill(MARIO_RED);pixelRect(3,0,6,1);pixelRect(2,1,9,1);fill(MARIO_BROWN);pixelRect(2,2,3,2);pixelRect(9,2,1,1);fill(MARIO_SKIN);pixelRect(5,2,4,2);pixelRect(4,3,1,2);fill(MARIO_BLUE);pixelRect(3,4,6,3);pixelRect(2,5,1,3);pixelRect(9,5,1,3);fill(MARIO_RED);pixelRect(1,4,2,3);pixelRect(9,4,2,3);fill(MARIO_SKIN);pixelRect(0,5,1,2);pixelRect(11,5,1,2);fill(MARIO_BLUE);pixelRect(2,7,3,3);pixelRect(7,7,3,3);fill(MARIO_BROWN);pixelRect(1,10,4,2);pixelRect(7,10,4,2);}
  drawWalkingOrStanding(){/*Identical*/fill(MARIO_RED);pixelRect(3,0,6,1);pixelRect(2,1,9,1);fill(MARIO_BROWN);pixelRect(2,2,3,2);pixelRect(9,2,1,1);fill(MARIO_SKIN);pixelRect(5,2,4,2);pixelRect(4,3,1,2);fill(MARIO_BLUE);pixelRect(3,4,6,3);pixelRect(2,5,1,3);pixelRect(9,5,1,3);fill(MARIO_RED);pixelRect(1,4,2,3);pixelRect(9,4,2,3);fill(MARIO_SKIN);pixelRect(0,5,1,2);pixelRect(11,5,1,2);fill(MARIO_BLUE);fill(MARIO_BROWN);if(this.walkFrame===0){fill(MARIO_BLUE);pixelRect(1,7,3,4);pixelRect(8,7,3,4);fill(MARIO_BROWN);pixelRect(0,11,4,2);pixelRect(8,11,4,2);}else if(this.walkFrame===1){fill(MARIO_BLUE);pixelRect(1,7,3,4);pixelRect(7,7,3,4);fill(MARIO_BROWN);pixelRect(0,11,4,2);pixelRect(7,11,4,2);}else{fill(MARIO_BLUE);pixelRect(2,7,3,4);pixelRect(8,7,3,4);fill(MARIO_BROWN);pixelRect(2,11,4,2);pixelRect(8,11,4,2);}}
} // End Mario Class

// --- Platform Class ---
class Platform { /* Unchanged */ constructor(x,y,w,h){this.x=x;this.y=y;this.w=w;this.h=h;} show(offset){let sx=this.x-offset;if(sx+this.w<0||sx>width)return;fill(PLATFORM_BRICK);stroke(50);strokeWeight(1);rect(sx,this.y,this.w,this.h);} }

// --- Enemy Class (Base) ---
class Enemy { /* Unchanged */ constructor(x,dFeetY,wP=8,hP=8){this.w=wP*PIXEL_SCALE;this.h=hP*PIXEL_SCALE;this.x=x;this.y=dFeetY-this.h;this.vx=-0.5;this.isOnGround=false;this.stompScore=100;this.isStompable=true;} update(plats){this.isOnGround=false;let chkY=this.y+this.h+1,onSurf=false;if(chkY>=groundY){onSurf=true;this.y=groundY-this.h;}else{for(let p of plats){if(this.x+this.w>p.x&&this.x<p.x+p.w&&chkY>=p.y&&this.y<p.y){onSurf=true;this.y=p.y-this.h;break;}}} this.isOnGround=onSurf;if(this.isOnGround){this.x+=this.vx;let edgeX=this.vx<0?this.x:this.x+this.w,ground=false;if(this.y+this.h>=groundY-1)ground=true;else{for(let p of plats){if(edgeX>p.x&&edgeX<p.x+p.w&&this.y+this.h>=p.y-5){ground=true;break;}}} if(!ground)this.vx*=-1; for(let p of plats){if(this.y+this.h>p.y&&this.y<p.y+p.h){if(this.vx<0&&this.x<=p.x+p.w&&this.x>p.x+p.w-5){this.x=p.x+p.w+1;this.vx*=-1;break;}else if(this.vx>0&&this.x+this.w>=p.x&&this.x+this.w<p.x+5){this.x=p.x-this.w-1;this.vx*=-1;break;}}}}} show(offset){let sx=this.x-offset;if(sx+this.w<0||sx>width)return;push();translate(sx,this.y);noStroke();fill(ENEMY_BROWN);pixelRect(1,0,6,1);pixelRect(0,1,8,5);pixelRect(1,6,6,1);fill(255);pixelRect(2,2,1,2);pixelRect(5,2,1,2);fill(0);pixelRect(2,3,1,1);pixelRect(5,3,1,1);pixelRect(1,7,2,1);pixelRect(5,7,2,1);pop();} }

// --- BigMonster Class ---
class BigMonster extends Enemy { /* Unchanged */ constructor(x,dFeetY){super(x,dFeetY,16,16);this.vx=-0.3;this.stompScore=300;} show(offset){let sx=this.x-offset;if(sx+this.w<0||sx>width)return;push();translate(sx,this.y);noStroke();fill(BIG_MONSTER_COLOR);pixelRect(0,0,16,16);fill(255);pixelRect(4,4,3,3);pixelRect(9,4,3,3);fill(0);pixelRect(5,5,1,1);pixelRect(10,5,1,1);fill(0);pixelRect(4,10,8,2);fill(100,0,0);pixelRect(2,15,4,1);pixelRect(10,15,4,1);pop();} }

// --- Dragon Class --- (Stompable)
class Dragon extends Enemy { /* Unchanged (stompable version) */ constructor(x,spawnY){const W=20,H=18;super(x,spawnY+H*PIXEL_SCALE,W,H);this.vx=-0.8;this.stompScore=500;this.isStompable=true;this.initialY=this.y;this.bobSpeed=0.05;this.bobRange=10;} update(plats){this.y=this.initialY+sin(frameCount*this.bobSpeed)*this.bobRange;this.x+=this.vx;if((this.x<0&&this.vx<0)||(this.x>LEVEL_END_X+100&&this.vx>0))this.vx*=-1;} show(offset){let sx=this.x-offset;if(sx+this.w<0||sx>width)return;push();translate(sx,this.y);let facing=this.vx>=0?1:-1;if(facing===-1){scale(-1,1);translate(-this.w,0);}noStroke();fill(DRAGON_GREEN);pixelRect(5,5,12,10);pixelRect(14,3,6,6);pixelRect(17,1,3,2);pixelRect(0,10,5,3);pixelRect(2,13,3,2);pixelRect(6,15,3,3);pixelRect(11,15,3,3);fill(DRAGON_WING);let wingY=sin(frameCount*0.2)*2;pixelRect(8,2+wingY,7,5);pixelRect(5,4+wingY,3,3);fill(255,255,0);pixelRect(16,5,2,2);fill(0);pixelRect(17,6,1,1);pop();} }

// --- FinalBoss Class --- (NEW)
class FinalBoss extends Enemy {
  constructor(x, spawnY) {
    const W = 24, H = 22; // Make it bigger
    super(x, spawnY + H * PIXEL_SCALE, W, H); // Use Enemy constructor, pass calculated feet Y
    this.vx = 0; // Doesn't move horizontally
    this.stompScore = 1000; // High score reward
    this.isStompable = false; // Requires multiple hits
    this.health = FINAL_BOSS_HEALTH;
    this.isDead = false;
    this.hitFlashTimer = 0;
    this.hitFlashDuration = 10;
    this.initialY = this.y; // Store calculated initial Y for potential bobbing
    this.bobSpeed = 0.03; // Slower bob?
    this.bobRange = 5;
  }

  takeDamage() {
    if (this.isDead) return;
    this.health--;
    this.hitFlashTimer = this.hitFlashDuration;
    // console.log("Boss Health:", this.health); // Debugging
    if (this.health <= 0) {
      this.isDead = true;
      // console.log("Boss Defeated!"); // Debugging
      // Could trigger a death animation state here later
    }
  }

  update(platforms) {
      if (this.isDead) return; // Don't update if dead

      // Minimal update: Slight bobbing, no horizontal movement
      this.y = this.initialY + sin(frameCount * this.bobSpeed) * this.bobRange;

      // Decrement flash timer
      if (this.hitFlashTimer > 0) {
          this.hitFlashTimer--;
      }
  }

  show(offset) {
      if (this.isDead && this.hitFlashTimer <= 0) return; // Don't draw if truly dead (after flash)

      let sx = this.x - offset; if(sx+this.w<0||sx>width) return; // Culling

      push();
      translate(sx, this.y);
      noStroke();
      
      // Apply flash effect (same as multi-hit dragon)
      let flashing = this.hitFlashTimer > 0 && frameCount % 4 < 2;
      if (flashing) { fill(255, 255, 255, 150); rect(0, 0, this.w, this.h); }

      // Draw Big Black Dragon
      fill(FINAL_BOSS_BLACK);
      // Body
      pixelRect(6, 6, 15, 12); // Main body
      // Head
      pixelRect(17, 4, 7, 7); // Head shape
      pixelRect(21, 2, 3, 2); // Snout/horns?
      // Tail
      pixelRect(0, 12, 6, 4); pixelRect(2, 16, 4, 3); // Thicker tail
      // Legs
      pixelRect(7, 18, 4, 4); pixelRect(14, 18, 4, 4); // Sturdy legs

      // Wings (Darker Grey)
      fill(FINAL_BOSS_GREY);
      let wingY = sin(frameCount * 0.15) * 3; // Slower, maybe larger flap?
      pixelRect(10, 1 + wingY, 8, 7); // Wing 1
      pixelRect(7, 4 + wingY, 3, 5); // Wing 1 inner/detail

      // Eye (Red)
      fill(255, 0, 0); // Red eye
      pixelRect(19, 6, 3, 3);
      fill(0); // Pupil
      pixelRect(20, 7, 1, 1);

      pop();
  }
} // End FinalBoss Class

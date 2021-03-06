/*=====================================================================
 ð¸ã®è±ã³ããèãæ£ãJavaScript
 https://actyway.com/8351 ãåã«ä½æ
=====================================================================*/

(
() => {
  // =========================================================================
  // å®æ°å®£è¨ç­
  // =========================================================================
  const NUMBER_OF_HANABIRAS = 50; // è±ã³ãã®ææ°
  const FPS                 = 24; // ä¸ç§éã«24å åãã
  const HANABIRA_HEIGHT     = 30; // è±ã³ãã®é«ã åè»¢ããã®ã§æå¤§å¤ã¯ 30px
  const HANABIRA_WIDTH      = 30; // è±ã³ãã®å¹ åè»¢ããã®ã§æå¤§å¤ã¯ 30px
  const HANABIRA_Z_BASE     = 10000; // è±ã³ãã® z-index ã®åºæºå¤

  // ã¦ã£ã³ãã¦ã®é«ã
  const windowHeight = window.innerHeight;
  // ã¦ã£ã³ãã¦ã®å¹(ã¹ã¯ã­ã¼ã«ãã¼é¤ã)
  const windowWidth  = document.documentElement.clientWidth
  // ã¹ã¯ã­ã¼ã«ä½ç½®
  let scroll         = document.documentElement.scrollTop || document.body.scrollTop;
  // ã¹ã¯ã­ã¼ã«æã®ã¤ãã³ãç»é² (ã¹ã¯ã­ã¼ã«æã«è±ã³ããã¦ã£ã³ãã¦åã«ç´ã¾ãçºã«)
  document.addEventListener('scroll', () => {
    scroll = document.documentElement.scrollTop || document.body.scrollTop;
  }, false);

  // =========================================================================
  // ä¹±æ°é¢æ°
  // min ä»¥ä¸ max ä»¥ä¸ã®ä¹±æ°ãè¿ã (integer)
  // min ä»¥ä¸ max æªæºã®ä¹±æ°ãè¿ã (float)
  // =========================================================================
  let rand = (min, max, type = "integer") => {
    if(type === "integer"){
      return Math.floor(Math.random() * (max-min+1)) + min;
    } else {
      return Math.random() * (max-min) + min;
    }
  };

  // =========================================================================
  // è±ã³ãã¯ã©ã¹ã®å®£è¨
  // =========================================================================
  class Hanabira {
    // ã³ã³ã¹ãã©ã¯ã¿(æ§ç¯å­)
    constructor(id, x, y, z, tremorMax, fallingSpeed, className) {
      this.id           = id;
      this.x            = x;
      this.y            = y;
      this.z            = z;
      this.tremorMax    = tremorMax;
      this.fallingSpeed = fallingSpeed;
      this.className    = className;

      this.direction    = "right";
      this.tremorCount  = 0;
    }

    // éå¤§æºããåæ°ã«éãã¦ãããï¼
    isTremorMax() {
      return (this.tremorCount === this.tremorMax)
    }

    // æºããæ¹åè»¢æ
    directionSwitch() {
      if (this.direction === "right") {
        this.direction = "left";
      } else {
        this.direction = "right";
      }
    }

    // è±ã³ãã®ä½ç½®ã«é¢ãã¦
    // ç©ºä¸­ã«ãããï¼(ã¦ã£ã³ãã¦åãï¼)
    isInTheAir() {
      return (this.y < scroll + windowHeight - HANABIRA_HEIGHT);
    }

    // å°é¢ã«çãããï¼
    isOnTheGround() {
      return !this.isInTheAir();
    }

    // å³ç«¯ã«ãããï¼
    isOnTheRightEdge() {
      return (this.x + HANABIRA_WIDTH >= windowWidth);
    }

    // å·¦ç«¯ã«ãããï¼
    isOnTheLeftEdge() {
      // è±ã³ãå¹ã®ååã®ä½ç½®ãªããå·¦ç«¯ã¨è¦åãã
      return (this.x <= HANABIRA_WIDTH / 2);
    }

    // è±ã³ãã® x, y åº§æ¨ãæ´æ°ãã
    move() {
      // è±ã³ãã®ä½ç½®ãã¦ã£ã³ãã¦åãªã
      if (this.isInTheAir()) {
        // åä¸æ¹åã¸tremorMaxåç§»åãããªããç§»åæ¹åãåè»¢ããã
        if (this.isTremorMax()) {
          this.directionSwitch();
          this.tremorCount = 0;
        }

        // å·¦å³ã«ç§»åãã
        let deltaX   = rand(0.3, 0.6, "float");
        let signFlag = (this.direction === "right" ? +1 : -1);
        this.x      += signFlag * deltaX;

        // ããå³ç«¯ã«ãããªããå·¦ç«¯ã«ç§»åãã
        if (this.isOnTheRightEdge()) {
          this.x = HANABIRA_WIDTH / 2;
        }

        // ããå·¦ç«¯ã«ãããªããå³ç«¯ã«ç§»åãã
        if (this.isOnTheLeftEdge()) {
          this.x = windowWidth - HANABIRA_WIDTH;
        }

        // ç§»ååæ°ãå¢ãã
        this.tremorCount++;

        // è½ä¸éåº¦åãå ãã
        this.y += this.fallingSpeed;

      // ããå°é¢ã«çãã¦ãããªããä¸ã«æ»ã
      } else if (this.isOnTheGround()) {
        this.y = scroll;
        this.x = rand(0, windowWidth - HANABIRA_WIDTH);
      }
    }

    // ä½ç½®æå ±ã DOM ã«åæ ããã
    applyPositionInformation(domHanabira) {
      domHanabira.setAttribute('style', `top: ${this.y}px; left: ${this.x}px; z-index: ${this.z};`);
    }
  }

  // =========================================================================
  // åæåå¦ç
  // ð¸ã®è±ã³ãã®ããã®æ°ãã div è¦ç´ ãä½æããbody ã®æ«å°¾ã«è¿½å 
  // ä½æ¥­ç¨ã® è±ã³ãã¤ã³ã¹ã¿ã³ã¹ãçæãã
  // =========================================================================
  const divSakura = document.createElement("div");
  document.body.after(divSakura);

  let domHanabiras = []; // è±ã³ãè¦ç´ ã®éå
  let jsHanabiras  = []; // è±ã³ãjsãªãã¸ã§ã¯ãã®éå
  // ããããã®è±ã³ãã«ã¤ãã¦ãä½ç½®ç­ã®åæè¨­å®ãè¡ã
  for(let i = 0; i < NUMBER_OF_HANABIRAS; i++){
    let id           = i;
    let x            = rand(HANABIRA_WIDTH / 2, windowWidth - HANABIRA_WIDTH);
    let y            = rand(-500, 0) + scroll;
    let z            = HANABIRA_Z_BASE + i;
    let tremorMax    = rand(15, 50);
    let fallingSpeed = rand(1, 3);
    let className    = `hana t${rand(1, 5)} a${rand(1, 5)}`;
    let jsHanabira   = new Hanabira(id, x, y, z, tremorMax, fallingSpeed, className);
    jsHanabiras[i]   = jsHanabira;

    // è±ã³ãã® div ãä½ã
    let domHanabira = document.createElement('div');
    // åæè¡¨ç¤ºä½ç½®ãè¨­å®ãã
    jsHanabira.applyPositionInformation(domHanabira);
    // ID ä»ä¸
    domHanabira.id = i;
    // ã©ã³ãã ã«çæããè±ã³ãã®è²ã¨ã¢ãã¡ã¼ã·ã§ã³ã®ããã® css class ãè¨­å®ãã
    domHanabira.setAttribute('class', jsHanabira.className);
    // ä½æããè±ã³ããDOMã«è¿½å ãç»é¢ã«è¡¨ç¤ºãããããã«ãã
    divSakura.appendChild(domHanabira);
    // æ±ããããããããã«ãè±ã³ãè¦ç´ éãéåã«æ ¼ç´
    domHanabiras[i] = domHanabira;
  }

  // =========================================================================
  // ã¡ã¤ã³å¦ç
  // çæããããããã®è±ã³ãã®ä½ç½®æå ±ãæ´æ°ããç»é¢ã«åæ ããã
  // =========================================================================
  setInterval(() => {
    for(let jsHanabira of jsHanabiras) {
      // åè±ã³ãã«å¯¾ããä½ç½®æå ±ã®æ´æ°å¦çãè¡ã
      jsHanabira.move();

      // js ãªãã¸ã§ã¯ãã®ä½ç½®æå ±ããdomãªãã¸ã§ã¯ãã¢ãã«ã®ä½ç½®ã«åæ ããã
      let id          = jsHanabira.id;
      let domHanabira = domHanabiras[id];
      jsHanabira.applyPositionInformation(domHanabira);
    }
  }, 1000 / FPS);
}
)();

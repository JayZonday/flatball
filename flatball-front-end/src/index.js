document.addEventListener('DOMContentLoaded', function(){

  // Play Ball button click functionality [renders a new game JS object and clears the page] //
  newGameButton.addEventListener('click', playBallHandler)
  function playBallHandler () {
    new Game().render()
    appBody.innerHTML = ""
    alert('GAME ON')
    appBody.append(fieldName, field, gamelogDiv)
  }

  //batter's controller events
  bPower.addEventListener('click', powerHandler)
  bHit.addEventListener('click', contactHandler)
  //pitcher's controller events
  pSpecial.addEventListener('click', spHandler)
  pFastball.addEventListener('click', fbHandler)
  //Array for the current play in action//
  let currentPlay = []
  //THE HANFLERS FOR THE PITCHER & BATTER CONTROLLERS//
  //Handler for the Batter's Contact Hit//
  function contactHandler() {
    if (currentPlay.length > 0 &&  Object.keys(currentPlay[0]).includes('bat')){
      alert(`You can't hit until the Pitcher selects their pitch`)
    }else{
      currentPlay.push({bat: "contact"})
    }if (currentPlay.length === 2){
      executePlay()
      currentPlay = []
    }
  }
  //Handler for the Batter's Power Hit
  function powerHandler() {
    if (currentPlay.length > 0 &&  Object.keys(currentPlay[0]).includes('bat')){
      alert(`You can't hit until the Pitcher selects their pitch`)
    }else{
      currentPlay.push({bat: "power"})
    }if (currentPlay.length === 2){
      executePlay()
      currentPlay = []
    }
  }
  //Handler for the Pitcher's FastBall Pitch
  function fbHandler() {
    if (currentPlay.length > 0 &&  Object.keys(currentPlay[0]).includes('pitch')){
      alert('You already have your pitch selected, waiting for the Batter to swing')
    }else{
      currentPlay.push({pitch: "fastball"})
    }if (currentPlay.length === 2){
      executePlay()
      currentPlay = []
    }
  }
  //Handler for the Pitcher's Special Pitch
  function spHandler() {
    if (currentPlay.length > 0 &&  Object.keys(currentPlay[0]).includes('pitch')){
      alert('You already have your pitch selected, waiting for the Batter to swing')
    }else{
      currentPlay.push({pitch: "sp"})
    }if (currentPlay.length === 2){
      executePlay()
      currentPlay = []
    }
  }

//------------------------- Above should be seperated ----------------------------------


  const emptyBases = [0,0,0,0]

  var walk = function(){
   var baseStatus = store.live_game.bases

      for (var i = 0; i < baseStatus.length; i++){
        if (baseStatus[i] === 1){
          continue
        }else{
          baseStatus[i] = 1
          break
        }
      }
      cleanScore()
  }

  var baseRunning = function(outerNum){
   var baseStatus = store.live_game.bases
   var score = 0
   var outNum = outerNum - 1
   // var baseStatus = [1,1,1,0]

    return function looper(innerNum){
      var inNum = innerNum
      for (var i = baseStatus.length -1; i >= 0; i--){
        if (baseStatus[i] === 1){
          score += 1
          baseStatus[i] = baseStatus[i - 1]
          baseStatus[i - 1] = 0
        }else if(i === 0) {
          break
        }else{
          baseStatus[i] = baseStatus[i - 1]
          baseStatus[i - 1] = 0
        }
        // teamScore(score)
      }

      console.log(baseStatus)
      console.log(score)

      outNum
      inNum -= 1
      if (inNum > 0){
        // baseRunning(inNum)
        looper(inNum)
      }else{
        store.live_game.bases = baseStatus
        console.log(`bases = ${baseStatus} and Score = ${score}`);
        teamScore(score)
        cleanScore(outNum)
      }
    }

  }

  function cleanScore(num) {
    store.live_game.bases.splice(num, 1, 1)
    var lastInd = store.live_game.bases[3]

    if (lastInd === 1) {
      teamScore(lastInd)
      store.live_game.bases.splice(3, 1, 0)
    }
  }
  //helper function used to add score and update our scoreboard live to the correct team//
  function teamScore(num){
    if(store.live_game.home){
      store.game_stats.home_score += num
      playCall("Run Scored!")
      document.querySelector('#home-score').innerText = store.game_stats.home_score
    }else{
      store.game_stats.away_score += num
      playCall("Run Scored!")
      document.querySelector('#away-score').innerText = store.game_stats.away_score
    }
    console.log(store.game_stats);
  }


  function playCall(call) {
    let outfieldText = document.querySelector('#outfield-text')
    outfieldText.innerText = `${call}`
    setTimeout(function(){ outfieldText.innerText = ""}, 2000)
  }


  function executePlay (){
    randPlay = Math.floor(Math.random()*15) + 1
    // randPlay = 8
    // b = ball s = strike f = foul ball o = out //
    const s = document.getElementById('strikes')
    const b = document.getElementById('balls')
    const o = document.getElementById('outs')
    const gamelogScroll = document.getElementById('gamelog-scroll')

    switch (randPlay) {
      case 1:
      case 2:
        store.live_game.strikes += 1
        if (store.live_game.strikes === 3) {
          playCall('Strike Out!')
          store.live_game.outs += 1
          out(s,b,o)
        }else{
          playCall('Strike')
          s.innerText =`Strikes: ${store.live_game.strikes}`
        }
      break;
      case 3:
        store.live_game.balls += 1
        if (store.live_game.balls === 4){
          playCall('Ball Four!')
          walk()
          out(s,b,o)
        }else {
          playCall('Ball')
          displayStats(s,b,o)
        }
      break;
      case 4:
      case 5:
        store.live_game.foul_balls += 1
          playCall("Foul Ball")
        if (store.live_game.strikes < 2){
          store.live_game.strikes += 1
          displayStats(s,b,o)
        }else{
          displayStats(s,b,o)
        }
      break;
      case 6:
      case 7:
        store.live_game.outs += 1
        store.game_stats.out_count +=1
        playCall("Out")
        out(s,b,o)
      break;
      case 8:
      case 9:
      case 10:
        baseRunning(1)(1)
        playCall("Hit a Single")
        playByplay("Single one-hopper, to short right field!")
        out(s,b,o)
      break;
      case 11:
      case 12:
        baseRunning(2)(2)
        playCall("Hit a Double")
        playByplay("Double, into the gap of Right-Center Field!!")
        out(s,b,o)
      break;
      case 13:
      case 14:
        baseRunning(3)(3)
        playCall("Hit a Triple")
        playByplay("Triple, down the line into the left corner!")
        out(s,b,o)
      break;
      case 15:
        baseRunning(4)(4)
        playCall("HOMERUN!!!")
        playByplay("Homerun, touch them all!!")
        out(s,b,o)
      break;
    }
    console.log(store.live_game)
  }
  function playByplay(hit) {
    let gamelogScroll = document.getElementById('gamelog-scroll')
    pByp = document.createElement('i')
    pByp.innerHTML = `It's a clutch ${hit}; - New Batter Up<br><br><hr>`
    gamelogScroll.append(pByp)
  }


//foul ball
  // pByp = document.createElement('i')
  // pByp.innerHTML = "Tipped off behind to the backstop, Foul Ball!<br><br>"
  // gamelogScroll.append(pByp)

//out
  // pByp = document.createElement('i')
  // pByp.innerHTML = "A dribbling groundball to SS, runner out at first - 1 out recorded; New Batter up<hr><br>"
  // gamelogScroll.append(pByp)




//------------balls/strikes/change of inning/controls------//
  function out(s,b,o) {
    let gamelogScroll = document.getElementById('gamelog-scroll')
    if (store.live_game.outs === 3) {
      // pByp = document.createElement('i')
      // pByp.innerHTML = "<hr>Final Out of The Inning Recorded - Switch Controls<hr><br><br>"
      // gamelogScroll.append(pByp)
      // alert('3 Outs SWITCH Controllers')
      document.getElementById("inning").innerText = `${inningCount()}`
      store.live_game.bases = emptyBases

      if (store.live_game.home){
        store.live_game.home = false
      }else{
        store.live_game.home = true
      }


      store.live_game.strikes = 0
      store.live_game.foul_balls = 0
      store.live_game.balls = 0
      store.live_game.outs = 0

      displayStats(s,b,o)
    }else{
      store.live_game.strikes = 0
      store.live_game.foul_balls = 0
      store.live_game.balls = 0

      displayStats(s,b,o)
    }
  }

  function displayStats(s,b,o){
    s.innerText = `Strikes: ${store.live_game.strikes}`
    b.innerText = `Balls: ${store.live_game.balls}`
    o.innerText =`Outs: ${store.live_game.outs}`
  }
  // end --- display and reseting balls/strikes/change of inning/controls---//



//---Inning function to track and count what inning it is using cases---//
  function inningCount() {
    let outCount = store.game_stats.out_count
    // let outCount = 9
    let inning = ""

    switch (outCount) {
      case 0:
      case 1:
      case 2:
          inning = "Top 1st";
          break;
      case 3:
      case 4:
      case 5:
          inning = "Bottom 1st";
          break;
      case 6:
      case 7:
      case 8:
          inning = "Top 2nd";
          break;
      case 9:
      case 10:
      case 11:
          inning = "Bottom 2nd";
          break;
      case 12:
      case 13:
      case 14:
          inning = "Top 3rd";
          break;
      case 15:
      case 16:
      case 17:
          inning = "Bottom 3rd";
          break;
  }
    return inning
  }

})

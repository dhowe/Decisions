// auto-mouse-mover: http://jsfiddle.net/jaakkytt/9uczV/

var solver = new Solver();

setInterval(function () {
  solver.step();
}, 10);


function State(action) {
//  this.create = function () {
  this.ticks = ticks;
  this.action = action;
  this.clips = clips;
  this.funds = funds;
  this.unsoldClips = unsoldClips;
  this.margin = margin;
  this.demand = Math.round(demand * 10);
  this.wire = wire;
  this.wireCost = wireCost;
  this.clipperCost = clipperCost;
  this.values = [];
  this.hash = function() {
    return JSON.stringify({
      action: this.action, clips: this.clips, funds: this.funds, unsoldClips: this.unsoldClips,
      margin: this.margin, demand: Math.round(this.demand*10), wire: this.wire, wireCost: this.wireCost,
      clipperCost: this.clipperCost
    });
  }
}

function Solver() {

  this.state = 0;
  this.turns = 0;
  this.maxTurns = 200;
  this.stateMap = {};
  this.actionMap = {

    buyWire: { action: buyWire, button: 'btnBuyWire' },
    buyAds: { action: buyAds, button: 'btnExpandMarketing' },
    makeClip: { action: makeClip, button: 'btnMakePaperclip' },
    lowerPrice: { action: lowerPrice, button: 'btnLowerPrice' },
    raisePrice: { action: raisePrice, button: 'btnRaisePrice' },
    makeClipper: { action: makeClipper, button: 'btnMakeClipper' }
  };

  this.fitness = function () {
    return clipRate;
    //return Math.ceil(clips) / this.turns;
  }

  this.out = function (action) {
    0 && console.log(Math.ceil(clips) + ' / '+turns +' = ' + fitness());
    0 && console.log(action, '->', clips, funds, unsoldClips, margin,
      percent(demand), wire, wireCost, clipperCost);
  }

  // data: clips, funds, unsoldClips, margin, demand, wire, wireCost, clipperCost;
  // random-vars: wireCost, clipperCost, demand(margin)
  this.step = function () {
    if (this.turns > this.maxTurns) {
      updateFitness();
      return;
    }
    
    if (this.turns === this.maxTurns) {
      var i = 0, map = this.stateMap;
      Object.keys(this.stateMap).forEach(function(s) {
        console.log(i++, s, map[s]);
      });
    }

    if (this.state) {
      var key = this.state.hash();
      this.stateMap[key] = this.stateMap[key] || [];
      this.stateMap[key].push(this.fitness());
    }

    var action, button, bid, keys = Object.keys(this.actionMap)
    while (!button || button.disabled) {
      action = keys[Math.floor(Math.random() * keys.length)];
      bid = this.actionMap[action].button;
      button = document.getElementById(bid);
    }
    this.state = new State(action);
    button.click();
    this.turns++;
    //this.out(action);
    updateFitness();
  };

}

function stateKey(s) {
  return ;
}

function makeClip() {
  clipClick(1);
}

function updateFitness() {
  document.getElementById("fitness").innerHTML = solver.fitness()
    .toLocaleString(0, {minimumFractionDigits: 3, maximumFractionDigits: 3});
}

function percent(x) {
  return (x * 10).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) + '%';
}

//   action: action, clips: clips, funds: funds, unsoldClips: unsoldClips,
//   margin: margin, demand: Math.round(demand*10), wire: wire, wireCost: wireCost,
//   clipperCost: clipperCost
// };

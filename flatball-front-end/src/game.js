store = {
  live_game: [],
  game_stats: []
}


class Game {
  constructor(home_score = 0, away_score = 0, out_count = 0){
    this.home_score = home_score
    this.away_score = away_score
    this.out_count = out_count

    store.game_stats.push(this)
  }

  render(){
    console.log(this);
  }
}
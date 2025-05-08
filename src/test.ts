import _ from 'lodash'

interface BasketballPlayer {
    name: string
    team: string
    salary: number
}

const players: BasketballPlayer[] = [
    { name: 'LeBron James', team: 'Lakers', salary: 37_000_000 },
    { name: 'Kevin Durant', team: 'Nets', salary: 42_000_000 },
    { name: 'Stephen Curry', team: 'Warriors', salary: 45_780_966 },
    { name: 'James Harden', team: '76ers', salary: 44_310_840 },
    { name: 'Kawhi Leonard', team: 'Clippers', salary: 39_344_900 },
    { name: 'Giannis Antetokounmpo', team: 'Bucks', salary: 45_640_084 },
    { name: 'Luka Dončić', team: 'Mavericks', salary: 37_096_500 },
    { name: 'Nikola Jokić', team: 'Nuggets', salary: 33_000_000 },
    { name: 'Joel Embiid', team: '76ers', salary: 33_600_000 },
    { name: 'Damian Lillard', team: 'Trail Blazers', salary: 39_344_900 },
]

const bestPaid = _(players)
    .groupBy((player) => player.team)
    .mapValues((players) => _.maxBy(players, (p) => p.salary)!)
    .values()
    .sortBy((p) => -p?.salary)
    .value()

console.log(bestPaid.slice(0, 10))

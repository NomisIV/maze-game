export class Minotaur {
  constructor() {
    this.posX = 0;
    this.posY = 0;
  }

  stepTowardsPlayer(player, maze) {
    const [x, y] = this._bfs(maze, player.posX, player.posY, this.posX, this.posY);
    this.posX = x;
    this.posY = y;
  }

  _bfs(maze, targetPosX, targetPosY, posX, posY) {
    let key = (x, y) => [x, y].join(" ");

    let previous = new Map();
    let seen = new Set();
    seen.add(key(targetPosX, targetPosY));

    let queue = [[targetPosX, targetPosY]];
    let queueIdx = 0;

    let dirs = [
      [1, 0, 1, 0, 1, 1],
      [0, 1, 0, 1, 1, 1],
      [-1, 0, 0, 0, 0, 1],
      [0, -1, 0, 0, 1, 0],
    ];

    while (queueIdx < queue.length) {
      if (queueIdx >= 10000) break;
      let [x, y] = queue[queueIdx++];

      if (x === posX && y === posY) {
        return previous.get(key(x, y)) || [posX, posY];
      }

      for (let [pdx, pdy, w1dx, w1dy, w2dx, w2dy] of dirs) {
        if (!maze.hasWall(x + w1dx, y + w1dy, x + w2dx, y + w2dy)) {
          let [x2, y2] = [x + pdx, y + pdy];
          if (!seen.has(key(x2, y2))) {
            seen.add(key(x2, y2));
            previous.set(key(x2, y2), [x, y]);
            queue.push([x2, y2]);
          }
        }
      }      
    }
    return [posX, posY];
  }
}



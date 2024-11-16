const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20; // Ukuran setiap blok ular
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let score = 0;
let snake;
let food;

(function setup() {
    snake = new Snake();
    food = new Food();
    window.setInterval(gameLoop, 125); // 100 ms per frame
})();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus frame sebelumnya

    snake.update();
    snake.draw();
    
    food.draw();
    
    if (snake.eat(food)) {
        food.randomizePosition();
        score++;
        document.getElementById('score').textContent = `Skor: ${score}`;
    }

    if (snake.collidesWithWalls() || snake.collidesWithSelf()) {
        alert('Game Over!');
        score = 0;
        document.getElementById('score').textContent = `Skor: ${score}`;
        snake = new Snake(); // Reset ular
    }
}

document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 37: // Arrow Left
            snake.changeDirection('LEFT');
            break;
        case 38: // Arrow Up
            snake.changeDirection('UP');
            break;
        case 39: // Arrow Right
            snake.changeDirection('RIGHT');
            break;
        case 40: // Arrow Down
            snake.changeDirection('DOWN');
            break;
    }
});

// Ular
function Snake() {
    this.body = [{ x: 5, y: 5 }];
    this.direction = 'RIGHT';
    this.newDirection = 'RIGHT';

    this.update = function() {
        this.direction = this.newDirection;
        const head = { ...this.body[0] };
        
        if (this.direction === 'UP') head.y -= 1;
        if (this.direction === 'DOWN') head.y += 1;
        if (this.direction === 'LEFT') head.x -= 1;
        if (this.direction === 'RIGHT') head.x += 1;
        
        this.body.unshift(head); // Tambahkan kepala baru di depan
        this.body.pop(); // Hapus bagian tubuh belakang
    };

    this.changeDirection = function(newDirection) {
        if (newDirection === 'UP' && this.direction !== 'DOWN') {
            this.newDirection = 'UP';
        }
        if (newDirection === 'DOWN' && this.direction !== 'UP') {
            this.newDirection = 'DOWN';
        }
        if (newDirection === 'LEFT' && this.direction !== 'RIGHT') {
            this.newDirection = 'LEFT';
        }
        if (newDirection === 'RIGHT' && this.direction !== 'LEFT') {
            this.newDirection = 'RIGHT';
        }
    };

    this.draw = function() {
        ctx.fillStyle = 'green';
        this.body.forEach(segment => {
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale); // Gambar tubuh ular
        });
    };

    this.eat = function(food) {
        if (this.body[0].x === food.x && this.body[0].y === food.y) {
            this.body.push({}); // Tambahkan tubuh ular
            return true;
        }
        return false;
    };

    this.collidesWithWalls = function() {
        const head = this.body[0];
        return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
    };

    this.collidesWithSelf = function() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    };
}

// Makanan
function Food() {
    this.randomizePosition = function() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    };
    this.randomizePosition();

    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale); // Gambar makanan
    };
}

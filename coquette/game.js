
    var createWorld = function(game) {
        game.c.entities.create(Goal, { center: { x: 0, y: canvas.height / 2 }, color: '#900' });

        game.c.entities.create(Scoreboard, {});
    };

    var populateWorld = function(game, canvas, numToCreate) {
        game.c.targets = [];

        var i = game.c.entities.all(Circle).length;
        var n = numToCreate + i;

        for (; i < n; ++i) {
            game.c.targets.push(game.c.entities.create(Circle, {
                center: {
                    x: Math.random() * canvas.width - 5,
                    y: Math.random() * canvas.height - 5
                },

                velocity: {
                    x: Math.random() * 1.3,
                    y: Math.random() * 1.3
                },

                color: "#099",

                id: i,

                update: function() {
                    this.center.y += this.velocity.y;
                    this.center.x += this.velocity.x;

                    console.log(this.center.x);

                    if (this.center.x <= 0 || this.center.x >= canvas.width + 1) {
                        debugger;
                        this.velocity.x = -(this.velocity.x);
                    }

                    if (this.center.y <= 0 || this.center.y >= canvas.height + 1) {
                        this.velocity.y = -(this.velocity.y);
                    }
                }
            }));
        }
    };

    var Game = function() {
        var canvas = document.getElementById("canvas")
          , ctx = canvas.getContext("2d");

        this.c = new Coquette(this, "canvas", 800, 600, "#000");

        // Create entities

        createWorld(this);
        populateWorld(this, canvas, 5);

        this.c.entities.create(Circle, {
            center: {
                x: canvas.width / 2,
                y: canvas.height / 2
            },

            color: "#990",

            speed: 2,

            update: function() {
                if (this.c.inputter.isDown(this.c.inputter.UP_ARROW) && this.center.y - this.radius > 0) {
                    this.center.y -= this.speed;
                }

                if (this.c.inputter.isDown(this.c.inputter.DOWN_ARROW) && this.center.y + this.radius < canvas.height) {
                    this.center.y += this.speed;
                }

                if (this.c.inputter.isDown(this.c.inputter.LEFT_ARROW) && this.center.x - this.radius > 0) {
                    this.center.x -= this.speed;
                }

                if (this.c.inputter.isDown(this.c.inputter.RIGHT_ARROW) && this.center.x + this.radius < canvas.width) {
                    this.center.x += this.speed;
                }
            },

            collision: function(other) {
                if (other instanceof Circle && (!this.isCarrying || this.isCarrying === other)) {
                    if (other.radius <= this.radius) {
                        other.center.x = this.center.x;
                        other.center.y = this.center.y;

                        this.isCarrying = other;
                    }
                }

                if (other instanceof Goal && this.isCarrying instanceof Circle) {
                    this.c.entities.destroy(this.c.targets[this.isCarrying.id]);

                    this.c.entities.all(Scoreboard)[0].increment();

                    this.isCarrying = false;
                }
            }

        });
    };

    var Circle = function(game, settings) {
        this.c = game.c;
        this.size = { x: 9 };
        this.radius = this.size.y = this.size.x; // default radius
        this.boundingBox = this.c.collider.CIRCLE;

        for (var i in settings) {
            this[i] = settings[i];
        }

        this.draw = function(ctx) {
            ctx.fillStyle = this.color;

            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };
    };

    var Goal = function(game, settings) {
        this.c = game.c;

        for (var i in settings) {
            this[i] = settings[i];
        }

        this.size = { x: 30, y: this.center.y };

        this.draw = function(ctx) {
            ctx.fillStyle = this.color;

            ctx.fillRect(
                this.center.x - this.size.x / 2,
                this.center.y - this.size.y / 2,
                this.size.x,
                this.size.y
            );
        }
    };

    var Scoreboard = function(game, settings) {
        this.c = game.c;
        this.score = 0;

        for (var i in settings) {
            this[i] = settings[i];
        }

        this.draw = function(ctx) {
            ctx.fillStyle = 'white';
            ctx.font = "20px Helvetica";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            ctx.fillText(this.score, 32, 32);
        }

        this.increment = function() {
            this.score++;
        }
    }

    window.addEventListener('load', function() {
        setTimeout(function() {
            new Game();
        }, 500);
    });


class Platform{
    constructor(ctx){
        this.position={
            x:150,
            y:500
        }
        this.size ={
            w:200,
            h:20,
        };

        this.ctx= ctx;
    }

    draw() {
        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h
        )
    }

    checkCollision(player){
        //const topPlayer = player.position.y + (player.altura + 110);
        const topPlayer = player.position.y; // topo do jogador
        const bottomPlayer = player.position.y + (player.altura - 110);

        const topPlatform = this.position.y+28;
        const bottomPlatform = this.position.y + this.size.h; // parte inferior da plataforma

        const playerRight = player.position.x + (player.largura - 180);
        const playerLeft = player.position.x;
        const platformRight = this.position.x + this.size.w;
        const platformLeft = this.position.x;
        const isWithinX = playerRight > platformLeft && playerLeft < platformRight;
        //verifica toque
        if (isWithinX) {
            this.ctx.strokeStyle = "red";
            this.ctx.strokeRect(this.position.x, this.position.y, this.size.w, this.size.h);
            
            this.ctx.strokeStyle = "green";
            this.ctx.strokeRect(player.position.x, player.position.y, player.largura-100, player.altura-100);

            const isTouchingYUp = topPlayer >= bottomPlatform && topPlayer + player.velocity.y <= bottomPlatform;
            const isTouchingY = bottomPlayer <= topPlatform && bottomPlayer + player.velocity.y >= topPlatform;
            // olisão por baixo
            if (isWithinX && isTouchingYUp) {
                player.position.y = bottomPlatform;
                player.velocity.y = 0;
                return true;
            }


            //topo da plataforma
            if (isWithinX && isTouchingY) {
                player.position.y = topPlatform - (player.altura - 110);
                player.velocity.y = 0;
                player.noChao = true;
                return true;
            }
        }

        return false;
    }
}
    
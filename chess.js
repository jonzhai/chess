chess = {
    //当前棋盘绘图环境
    ctx: null,

    //控制黑白,默认为黑棋先行
    isBlack: true,

    //存放棋子点位的二维数组
    chessBoard: [],

    //绘制棋盘
    _drawChessBoard: function () {
        var ctx = this.ctx;
        var logo = new Image();
        logo.src = "0.png";
        logo.onload = function () {
            ctx.drawImage(logo, 0, 0, 450, 450);//先绘制棋盘背景
            for (var i = 0; i < 15; i++) {//绘制棋盘方格，15*15
                ctx.moveTo(15 + i * 30, 15);
                ctx.lineTo(15 + i * 30, 435);
                ctx.stroke();
                ctx.moveTo(15, 15 + i * 30);
                ctx.lineTo(435, 15 + i * 30);
                ctx.stroke();
            }
        }
    },
   //初始化棋盘
    init: function (ctx) {
        this.ctx = ctx;
        this._drawChessBoard();
        for (var i = 0; i < 15; i++) {
            this.chessBoard[i] = [];
            for (var j = 0; j < 15; j++) {
                this.chessBoard[i][j] = 0;//默认棋子位置为0，白子为1，黑子为2
            }
        }

    },
    //绘制棋子
    drawPiece: function (i, j, isBlack) {
        if (typeof isBlack == 'boolean') {
            this.isBlack = isBlack;
        }
        if(this.chessBoard[i][j] !== 0){
            return;
        }
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(15 + i * 30, 15 + j * 30, 10, 0, Math.PI * 2);
        ctx.closePath();
        var gradient = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
        if (this.isBlack) {
            gradient.addColorStop(0, "#0A0A0A");//黑棋
            gradient.addColorStop(1, "#636766");
            this.chessBoard[i][j] = 1

        } else {
            gradient.addColorStop(0, "#D1D1D1");//白棋
            gradient.addColorStop(1, "#F9F9F9");
            this.chessBoard[i][j] = 2

        }
        ctx.fillStyle = gradient;
        ctx.fill();
        this.isBlack = !this.isBlack;
    }

}




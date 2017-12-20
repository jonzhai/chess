chess = {
    //当前棋盘
    canvas: null,

    //控制黑白,默认为黑棋先行
    isBlack: true,

    //存放棋子点位的二维数组
    chessBoard: [],

    //绘制棋盘
    _drawChessBoard: function () {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        canvas.width = this.canvas.getAttribute('width');
        canvas.height = this.canvas.getAttribute('height');
        // var background = new Image();
        // background.setAttribute('crossOrigin', 'anonymous');
        // background.src = "background.png";
        // var me = this;
        // background.onload = function () {
        //     ctx.drawImage(background, 0, 0, 450, 450);//先绘制棋盘背景
        //     for (var i = 0; i < 15; i++) {//绘制棋盘方格，15*15
        //         ctx.moveTo(15 + i * 30, 15);
        //         ctx.lineTo(15 + i * 30, 435);
        //         ctx.stroke();
        //         ctx.moveTo(15, 15 + i * 30);
        //         ctx.lineTo(435, 15 + i * 30);
        //         ctx.stroke();
        //     }
        //       me.canvas.style.backgroundImage = 'url('+canvas.toDataURL()+')'
            
        // }
        ctx.fillStyle = "#FF5809";
        ctx.fillRect(0,0,canvas.width,canvas.height)
       for (var i = 0; i < 15; i++) {//绘制棋盘方格，15*15
            ctx.moveTo(15 + i * 30, 15);
            ctx.lineTo(15 + i * 30, 435);
            ctx.stroke();
            ctx.moveTo(15, 15 + i * 30);
            ctx.lineTo(435, 15 + i * 30);
            ctx.stroke();
        }
        this.canvas.style.backgroundImage = 'url('+canvas.toDataURL()+')'


    },
   //初始化棋盘
    init: function (canvas) {
        this.canvas = canvas;
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
        var ctx = this.canvas.getContext('2d');
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




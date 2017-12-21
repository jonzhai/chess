chess = {
    //当前棋盘
    canvas: null,

    //控制黑白,默认为黑棋先行
    isBlack: true,
    //判断是否为开局第一次落子
    isFirstTime:true,

    //存放棋子点位的二维数组
    chessBoard: [],

    //存放已落棋子的数组
    chessPieces:[],

    _reset:function(){
        for (var i = 0; i < 15; i++) {
            this.chessBoard[i] = [];
            for (var j = 0; j < 15; j++) {
                this.chessBoard[i][j] = 0;//默认棋子位置为0，白子为1，黑子为2
            }
        }
    
    },
   //初始化棋盘
    init: function (canvas) {
        this.canvas = canvas;
        this._drawChessBoard();
        this._reset();


    },
    //下棋动作
    playChess: function (e) {//传入点击event对象
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        if (this.isFirstTime) {
            if (confirm("黑棋先行？")) {
                this.isBlack = true;
            } else {
                this.isBlack = false;
            }
            this.isFirstTime = false;
        }
        this._drawPiece(i, j)
      
        this.chessPieces.push([i, j])

    },
    //悔棋
    undo:function(){
        var ctx = this.canvas.getContext('2d');
        if (this.chessPieces.length > 1) {
            var lastPiece = this.chessPieces.pop(),
                i = lastPiece[0],
                j = lastPiece[1];
            ctx.clearRect(5 + i * 30, 5 + j * 30, 20, 20)//清除像素
            this.chessBoard[i][j] = 0;//原棋子落位置于空
            this.isBlack = !this.isBlack;
        }
    },
    //重新开始游戏
    restart:function(){
        if (this.chessPieces.length == 0) {
            return;
        }
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._reset();
        this.chessPieces.length = 0;
        this.isFirstTime = true;
        this.isBlack = true;

    },
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
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (var i = 0; i < 15; i++) {//绘制棋盘方格，15*15
            ctx.moveTo(15 + i * 30, 15);
            ctx.lineTo(15 + i * 30, 435);
            ctx.stroke();
            ctx.moveTo(15, 15 + i * 30);
            ctx.lineTo(435, 15 + i * 30);
            ctx.stroke();
        }
        this.canvas.style.backgroundImage = 'url(' + canvas.toDataURL() + ')'


    },
    //绘制棋子
    _drawPiece: function (i, j) {
        if(this.chessBoard[i][j] != 0){
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
    },

}




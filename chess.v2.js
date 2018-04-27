(function(doc,window){
    function Chess(selector){
        if(typeof selector !== 'string'){
            return;
        }
        var canvas = doc.querySelector(selector);
        if(canvas === null || !canvas.getContext('2d')){
            return;
        }
        //当前棋盘
        this.canvas = canvas;
        //控制黑白,默认为黑棋先行
        this.isBlack = true;
        //判断是否为开局第一次落子
        this.isFirstTime = true;

         //存放棋子点位的二维数组
        this.chessBoard = [];
        //存放已落棋子的数组
        this.chessPieces = [];
        //绘制棋盘
        this._drawChessBoard();
        //重置棋盘数据
        this._reset();
    }
    Chess.prototype = {
        _reset:function(){
            for (var i = 0; i < 15; i++) {
                this.chessBoard[i] = [];
                for (var j = 0; j < 15; j++) {
                    this.chessBoard[i][j] = 0;//默认棋子位置为0，白子为1，黑子为2
                }
            }
        },
        //绘制棋盘
        _drawChessBoard: function(){
            var ctx = this.canvas.getContext('2d'),
                width = this.canvas.getAttribute('width'),
                height = this.canvas.getAttribute('height');
            ctx.fillStyle = "#f6e7be";
            ctx.fillRect(0, 0, width, height);
            //绘制棋盘方格，15*15
            for (var i = 0; i < 15; i++) {
                ctx.moveTo(15 + i * 30, 15);
                ctx.lineTo(15 + i * 30, 435);
                ctx.stroke();
                ctx.moveTo(15, 15 + i * 30);
                ctx.lineTo(435, 15 + i * 30);
                ctx.stroke();
            }
            this.canvas.style.backgroundImage = 'url(' + this.canvas.toDataURL() + ')';
        },
          //下棋动作
        playChess: function (e) {//传入点击event对象
            var x = e.offsetX,
                y = e.offsetY,
                i = Math.floor(x / 30),
                j = Math.floor(y / 30);
            if (this.isFirstTime) {
                if (confirm("黑棋先行？")) {
                    this.isBlack = true;
                } else {
                    this.isBlack = false;
                }
                this.isFirstTime = false;
            }
            this._drawPiece(i, j);
        
            this.chessPieces.push([i, j]);

        },
          //悔棋
        undo:function(){
            var ctx = this.canvas.getContext('2d');
            if (this.chessPieces.length > 1) {
                var lastPiece = this.chessPieces.pop(),
                    i = lastPiece[0],
                    j = lastPiece[1];
                //清除像素  
                ctx.clearRect(5 + i * 30, 5 + j * 30, 20, 20);

                //原棋子落位置于空
                this.chessBoard[i][j] = 0;
                this.isBlack = !this.isBlack;
            }
        },
         //重新开始游戏
        restart:function(){
            if (this.chessPieces.length === 0) {
                return;
            }
            var ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._reset();
            this.chessPieces.length = 0;
            this.isFirstTime = true;
            this.isBlack = true;

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
                this.chessBoard[i][j] = 1;
            } else {
                gradient.addColorStop(0, "#D1D1D1");//白棋
                gradient.addColorStop(0.5, "#F9F9F9");
                this.chessBoard[i][j] = 2;
            }
            ctx.fillStyle = gradient;
            ctx.fill();
            this.isBlack = !this.isBlack;
        }


    }
    Chess.prototype.constructor = Chess;
    window.Chess = Chess;


 })(document,window)
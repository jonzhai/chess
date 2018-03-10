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

    //重置棋盘数组
    _reset:function(){
    	var me = this;
        for (var i = 0; i < 15; i++) {
            me.chessBoard[i] = [];
            for (var j = 0; j < 15; j++) {
                me.chessBoard[i][j] = 0;//默认棋子位置为0，白子为1，黑子为2
            }
        }
    
    },
   //初始化棋盘
    init: function (canvas) {
    	var me = this;
    	if(canvas.getContext('2d')){
  			me.canvas = canvas;
	        me._drawChessBoard();
	        me._reset();
    	}
    },
    //下棋动作
    playChess: function (e) {//传入点击event对象
        var me = this,
       	 	x = e.offsetX,
        	y = e.offsetY,
       		i = Math.floor(x / 30),
       		j = Math.floor(y / 30);
        if (me.isFirstTime) {
            if (confirm("黑棋先行？")) {
                me.isBlack = true;
            } else {
                me.isBlack = false;
            }
            me.isFirstTime = false;
        }
        me._drawPiece(i, j);
      
        me.chessPieces.push([i, j]);

    },
    //悔棋
    undo:function(){
		var me = this,
        	ctx = me.canvas.getContext('2d');
        if (me.chessPieces.length > 1) {
            var lastPiece = me.chessPieces.pop(),
                i = lastPiece[0],
                j = lastPiece[1];
            //清除像素  
            ctx.clearRect(5 + i * 30, 5 + j * 30, 20, 20);

            //原棋子落位置于空
            me.chessBoard[i][j] = 0;
            me.isBlack = !me.isBlack;
        }
    },
    //重新开始游戏
    restart:function(){
    	var me = this;
        if (me.chessPieces.length == 0) {
            return;
        }
        var ctx = me.canvas.getContext('2d');
        ctx.clearRect(0, 0, me.canvas.width, me.canvas.height);
        me._reset();
        me.chessPieces.length = 0;
        me.isFirstTime = true;
        me.isBlack = true;

    },
    //绘制棋盘
    _drawChessBoard: function () {
    	var me = this,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        canvas.width = me.canvas.getAttribute('width');
        canvas.height = me.canvas.getAttribute('height');
        ctx.fillStyle = "#f6e7be";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //绘制棋盘方格，15*15
        for (var i = 0; i < 15; i++) {
            ctx.moveTo(15 + i * 30, 15);
            ctx.lineTo(15 + i * 30, 435);
            ctx.stroke();
            ctx.moveTo(15, 15 + i * 30);
            ctx.lineTo(435, 15 + i * 30);
            ctx.stroke();
        }
        me.canvas.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    },
    //绘制棋子
    _drawPiece: function (i, j) {
    	var me = this;
        if(me.chessBoard[i][j] != 0){
            return;
        }
        var ctx = me.canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(15 + i * 30, 15 + j * 30, 10, 0, Math.PI * 2);
        ctx.closePath();
        var gradient = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
        if (me.isBlack) {
            gradient.addColorStop(0, "#0A0A0A");//黑棋
            gradient.addColorStop(1, "#636766");
            me.chessBoard[i][j] = 1;
        } else {
            gradient.addColorStop(0, "#D1D1D1");//白棋
            gradient.addColorStop(0.5, "#F9F9F9");
            me.chessBoard[i][j] = 2;
        }
        ctx.fillStyle = gradient;
        ctx.fill();
        me.isBlack = !me.isBlack;
    }

}




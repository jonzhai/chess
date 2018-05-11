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
                this.chessBoard[i] = new Array(15);
                for (var j = 0; j < 15; j++) {
                    this.chessBoard[i][j] = 0;//默认棋子位置为0，白子为1，黑子为2
                }
            }
            // this.chessBoard[14].fill(1);
            // console.log(this.chessBoard)
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
            // console.log(this.chessBoard)
            var me = this;
            this._checkEnd(i,j).then(function(tag){
                var str = (tag == 1) ? "黑棋获胜！":"白棋获胜！";
                if(confirm(str)){
                    me.restart();
                }
            }).catch(function(){
                
            })
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
                this.chessBoard[j][i] = 0;
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
            if(this.chessBoard[j][i] != 0){
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
                this.chessBoard[j][i] = 1;
            } else {
                gradient.addColorStop(0, "#D1D1D1");//白棋
                gradient.addColorStop(0.5, "#F9F9F9");
                this.chessBoard[j][i] = 2;
            }
            ctx.fillStyle = gradient;
            ctx.fill();
            this.isBlack = !this.isBlack;
        },
        //检查是否结束
        _checkEnd: function(m,n){
            //  console.log(m,n,this.chessBoard);
             

            var me = this,
                tag = me.chessBoard[n][m],//当前位置标记
                errorArr = [];
            // console.log(tag)
           return new Promise(function(resolve,reject){
               //从中间向左右统计
                function checkLR(){
                    var a = m+1 ,b = m-1 ,sum = 1;
                    function _checkR(a){
                        if(me.chessBoard[n][a] !== tag || a >= m+5 || a>=15){
                            return
                        }
                        sum++;
                        a++;
                        _checkR(a);
                    }
                    _checkR(a);
                    function _checkL(b){
                        if(me.chessBoard[n][b] !== tag || b <= m-5 || b <= 0){
                            return
                        }
                        sum++;
                        b--;
                        _checkL(b);
                    }
                    _checkL(b);
                    // console.log(sum)
                    if(sum>=5){
                        // console.log('true');
                        resolve(tag);
                        // return true;
                    }else{
                        // console.log('false')
                        errorArr.push(false)
                        // return false;
                    }
                }
                //从中间向上下统计
                function checkUD(){
                    var a = n+1 ,b = n-1 ,sum = 1;
                    function _checkR(a){
                        if(me.chessBoard[a][m] !== tag || a >= n+5 || a>=14){
                            return
                        }
                        sum++;
                        a++;
                        _checkR(a);
                    }
                    _checkR(a);
                    function _checkL(b){
                        if(me.chessBoard[b][m] !== tag || b <= n-5 || b <= 0){
                            return
                        }
                        sum++;
                        b--;
                        _checkL(b);
                    }
                    _checkL(b);
                    // console.log(sum)
                    if(sum>=5){
                        // console.log('true');
                        resolve(tag);
                        // return true;
                    }else{
                        // console.log('false')
                        errorArr.push(false)
                        // return false;
                    }
                }
                 //从西北向东南统计
                function checkWNTES(){
                    var a = n+1, b = n-1 ,
                        c = m+1, d = m-1, 
                        sum = 1;
                    function _checkES(a,c){
                        if(me.chessBoard[a][c] !== tag || a >= n+5 || a>=14|| c >= m+5 || c>=14){
                            return
                        }
                        sum++;
                        a++;
                        c++;
                        _checkES(a,c);
                    }
                    _checkES(a,c);
                    function _checkWN(b,d){
                        if(me.chessBoard[b][d] !== tag || b <= n-5 || b <= 0|| d <= m-5 || d <= 0){
                            return
                        }
                        sum++;
                        b--;
                        d--;
                        _checkWN(b,d);
                    }
                    _checkWN(b,d);
                    // console.log(sum)
                    if(sum>=5){
                        // console.log('true');
                        resolve(tag);
                        // return true;
                    }else{
                        // console.log('false')
                        errorArr.push(false)
                        // return false;
                    }
                }
                //从东北向西南统计
                function checkENTWS(){
                    var a = n+1, b = n-1 ,
                        c = m+1, d = m-1, 
                        sum = 1;
                    function _checkES(a,c){
                        if(me.chessBoard[a][d] !== tag || a >= n+5 || a>=14|| b <= n-5 || b <= 0){
                            return
                        }
                        sum++;
                        a++;
                        d--;
                        _checkES(a,d);
                    }
                    _checkES(a,d);
                    function _checkWN(b,c){
                        if(me.chessBoard[b][c] !== tag || b <= n-5 || b <= 0|| c >=15 || c >= m+5){
                            return
                        }
                        sum++;
                        b--;
                        c++;
                        _checkWN(b,c);
                    }
                    _checkWN(b,c);
                    // console.log(sum)
                    if(sum>=5){
                        // console.log('true');
                        resolve(tag);
                        // return true;
                    }else{
                        // console.log('false')
                        errorArr.push(false)
                        // return false;
                    }
                }
                checkLR();
                checkUD();
                checkWNTES();
                checkENTWS();
                if(errorArr.length == 4){
                    reject()
                }
               

            })   
           
          

        }


    }
    Chess.prototype.constructor = Chess;
    window.Chess = Chess;


 })(document,window)
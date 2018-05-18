(function(doc,window){
    function Chess(ele,option){
        var canvasContainer = null;
        //传入一个dom选择符或者dom元素
        if(typeof ele === 'string'){
            canvasContainer = doc.querySelector(ele);
            if(canvasContainer === null){
                return;
            }
        }else if(ele instanceof HTMLElement && ele.nodeType === 1){
            canvasContainer = ele;
        }else{
            return;
        }
        this.chessSet = option || { num: 15,size: 30} ;
            
        //当前棋盘
        this.canvas = document.createElement('canvas');
        this.width = this.chessSet.num *  this.chessSet.size;
        this.canvas.setAttribute('width',this.width);
        this.canvas.setAttribute('height',this.width);
        canvasContainer.appendChild(this.canvas);
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
        //初始化棋盘数组
        this._reset();
        //给棋盘添加点击下棋事件
        var me = this;
        this.canvas.addEventListener('click',function(e){
            me.playChess(e);
        })
    }
    Chess.prototype = {
        _reset:function(){
            for (var i = 0; i < this.chessSet.num; i++) {
                this.chessBoard[i] = new Array(this.chessSet.num);
                for (var j = 0; j < this.chessSet.num; j++) {
                    this.chessBoard[i][j] = 0;//默认棋子位置为0，白子为1，黑子为2
                }
            }
            // this.chessBoard[14].fill(1);
            // console.log(this.chessBoard)
        },
        //绘制棋盘
        _drawChessBoard: function(){
            var ctx = this.canvas.getContext('2d'),
                perW =  this.chessSet.size,//每个方格大小
                n =  this.chessSet.num;//每行的方格个数 = 列

            //绘制背景填充    
            ctx.fillStyle = "#f6e7be";
            ctx.fillRect(0, 0, this.width, this.width);

            var halfW = perW/2;
            //绘制棋盘方格，15*15
            for (var i = 0; i < n; i++) {
                //先绘横线
                ctx.moveTo(halfW + i * perW, halfW);
                ctx.lineTo(halfW + i * perW, perW*n-halfW);
                ctx.stroke();
                //再绘纵线
                ctx.moveTo(halfW, halfW + i * perW);
                ctx.lineTo(perW*n-halfW, halfW + i * perW);
                ctx.stroke();
            }
            //当做背景
            this.canvas.style.backgroundImage = 'url(' + this.canvas.toDataURL() + ')';
        },
          //下棋动作
        playChess: function (e) {//传入点击event对象
            var x = e.offsetX,
                y = e.offsetY,
                i = Math.floor(x / this.chessSet.size),
                j = Math.floor(y / this.chessSet.size);
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

            //此处延迟判断输赢，确保最后一颗棋子绘制完成后触发
            setTimeout(function(){
                me.checkEnd(i,j).then(function(tag){
                    var str = (tag == 1) ? "黑棋获胜！重新开始游戏？":"白棋获胜！重新开始游戏？";
                    if(confirm(str)){
                        me.restart();
                    }else{
                        me.undo();
                    }
                }).catch(function(e){
                    console.log(e)
                })
                
            },20)
        },
          //悔棋
        undo:function(){
            var ctx = this.canvas.getContext('2d');
            if (this.chessPieces.length > 1) {
                var lastPiece = this.chessPieces.pop(),
                    i = lastPiece[0],
                    j = lastPiece[1];
                //清除像素  
                ctx.clearRect(5 + i * this.chessSet.size, 5 + j * this.chessSet.size, 20, 20);

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
            ctx.clearRect(0, 0, this.width, this.width);
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
            var perW =  this.chessSet.size,//每个方格大小
                n =  this.chessSet.num,//每行的方格个数 = 列
                halfW = perW/2;
            var ctx = this.canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(halfW + i * perW , halfW + j * perW , 10, 0, Math.PI * 2);
            ctx.closePath();
            var gradient = ctx.createRadialGradient(halfW + i * perW  + 2, halfW + j * perW  - 2, 13, halfW + i * perW  + 2, halfW + j * perW  - 2, 0);
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
        checkEnd: function(m,n){
            var me = this,

            //当前位置标记,m,n与棋盘数组有转换关系，这里调整
                tag = me.chessBoard[n][m],
                errorArr = [],
                num = this.chessSet.num;

            //从四个方向分别递归统计，如果有一个方向达到5颗棋子，则判定为胜，否则未胜，游戏可继续
           return new Promise(function(resolve,reject){
               //从中间向左右统计
                function checkLTR(){
                    var a = m+1 ,b = m-1 ,sum = 1;
                    function _checkR(a){
                        if( a >= m+5 || a>=num ||me.chessBoard[n][a] !== tag){
                            return
                        }
                        sum++;
                        a++;
                        _checkR(a);
                    }
                    _checkR(a);
                    function _checkL(b){
                        if( b <= m-5 || b < 0 ||me.chessBoard[n][b] !== tag){
                            return
                        }
                        sum++;
                        b--;
                        _checkL(b);
                    }
                    _checkL(b);
                    
                    //如果达到5个，则直接resolve，并传入当前获胜的棋子类型
                    if(sum>=5){
                        resolve(tag);
                    }else{
                        errorArr.push(false)
                    }
                }
                //从中间向上下统计
                function checkUTD(){
                    var a = n+1 ,b = n-1 ,sum = 1;
                    function _checkR(a){
                        if( a >= n+5 || a>=num ||me.chessBoard[a][m] !== tag ){
                            return
                        }
                        sum++;
                        a++;
                        _checkR(a);
                    }
                    _checkR(a);
                    function _checkL(b){
                        if( b <= n-5 || b < 0||me.chessBoard[b][m] !== tag){
                            return
                        }
                        sum++;
                        b--;
                        _checkL(b);
                    }
                    _checkL(b);
                    console.log(sum)
                    
                    if(sum>=5){
                        resolve(tag);
                    }else{
                        errorArr.push(false)
                    }
                }
                 //从中间向西北，东南统计
                function checkWNTES(){
                    var a = n+1, b = n-1 ,
                        c = m+1, d = m-1, 
                        sum = 1;
                    function _checkES(a,c){
                        if( a >= n+5 || a>=num|| c >= m+5 || c>14 ||me.chessBoard[a][c] !== tag ){
                            return
                        }
                        sum++;
                        a++;
                        c++;
                        _checkES(a,c);
                    }
                    _checkES(a,c);
                    function _checkWN(b,d){
                        if(b <= n-5 || b < 0|| d <= m-5 || d < 0 ||me.chessBoard[b][d] !== tag ){
                            return
                        }
                        sum++;
                        b--;
                        d--;
                        _checkWN(b,d);
                    }
                    _checkWN(b,d);
                    console.log(sum)
                    
                    if(sum>=5){
                        resolve(tag);
                    }else{
                        errorArr.push(false)
                    }
                }
                //从中间向东北，西南统计
                function checkENTWS(){
                    var a = n+1, b = n-1 ,
                        c = m+1, d = m-1, 
                        sum = 1;
                    function _checkEN(a,c){
                        if(a >= n+5 || a>=num|| b <= n-5 || b < 0 ||me.chessBoard[a][d] !== tag){
                            return
                        }
                        sum++;
                        a++;
                        d--;
                        _checkEN(a,d);
                    }
                    _checkEN(a,d);
                    function _checkWS(b,c){
                        if( b <= n-5 || b < 0|| c >=num || c >= m+5||me.chessBoard[b][c] !== tag){
                            return
                        }
                        sum++;
                        b--;
                        c++;
                        _checkWS(b,c);
                    }
                    _checkWS(b,c);
                    console.log(sum)
                    
                    if(sum>=5){
                        resolve(tag);
                    }else{
                        errorArr.push(false)
                    }
                }
                checkLTR();
                checkUTD();
                checkWNTES();
                checkENTWS();
                //如果四个方向均达不到个数，则reject
                if(errorArr.length == 4){
                    reject()
                }
            })   
        },
       


    }
    Chess.prototype.constructor = Chess;
    window.Chess = Chess;


 })(document,window)
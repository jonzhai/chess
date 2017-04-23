var me=true;
var chessBoard=[];
for(var i=0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
    }
}
var c=document.getElementById("chess");
var ctx=c.getContext("2d");
var logo=new Image();
logo.src="0.png";
logo.onload=function () {
    ctx.drawImage(logo,0,0,450,450);
    drawChessBoard ();
    

}
//绘制棋盘
var drawChessBoard=function () {
    for(var i=0;i<15;i++){
        ctx.moveTo(15+i*30,15);
        ctx.lineTo(15+i*30,435);
        ctx.stroke();
        ctx.moveTo(15,15+i*30);
        ctx.lineTo(435,15+i*30);
        ctx.stroke();
    }
}
//定义每步
var oneStep=function (i,j,me) {
    ctx.beginPath();
    ctx.arc(15+i*30,15+j*30,13,0,Math.PI*2);
    ctx.closePath();
    var gradient=ctx.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
    if(me){
        gradient.addColorStop(0,"#0A0A0A");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#D1D1D1");
        gradient.addColorStop(1,"#F9F9F9");
    }
    ctx.fillStyle=gradient;
    ctx.fill();
}


chess.onclick=function (e) {
    var x=e.offsetX;
    var y=e.offsetY;
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
    if(chessBoard[i][j]==0){
        oneStep(i,j,me);
        if(me){
            chessBoard[i][j]=1;
        }else{
            chessBoard[i][j]=2;
        }
    }
    me=!me;
}


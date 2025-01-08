/*Some Note About Game

<program flow>:
a->b means state is b after a
init->state 1
verify first or second ->2 or 3
while not IsWin()
{
if(2) player choose piece, AI place piece, AI choose piece ->3
if(3) player place piece ->2
}

<piece state>:
use 4-bit integer as features.
leftmost bit: circle(1) or square(0)
full(1) or hollow(0)
vertical strip(1) or horizonal strip(0)
rightmost bit: dark(1) or light(0)

<winning state>:
0-3 as top to bottom horizonal row
4-7 as left to right vertical column
8 as top-left to bottom-right diagonal
9 as top-right to left-bottom diagonal
10 as 16 pieces of placed, draw
*/
const gridsize = 4;
let state = 0;
let board;
let piece_state;
let current_piece;
let win_state = -1;
let counter = 0;
let p;

function IsWin() //verify if the placement win the game
{
	for(let i=0;i<4;++i)
	{
		if(board[i][0]==-1)continue;
		let flg = 1;
		row = [ board[i][0], board[i][0] ];
		for(let j=1;j<gridsize;++j)
		{
			if(board[i][j]==-1)flg = 0;
			row[0] = row[0] & board[i][j];
			row[1] = row[1] | board[i][j];
		}
		if( flg && (row[0] || ( (~row[1])&15) ) )return i;
	}
	for(let i=0;i<4;++i)
	{
		if(board[0][i]==-1)continue;
		let flg = 1;
		col = [ board[0][i], board[0][i] ];
		for(let j=1;j<gridsize;++j)
		{
			if(board[j][i]==-1)flg = 0;
			col[0] = col[0] & board[j][i];
			col[1] = col[1] | board[j][i];
		}
		if( flg && (col[0] || ( (~col[1])&15) ) )return i+4;
	}
	if(board[0][0]!=-1)
	{
		let flg = 1;
		dia1 = [ board[0][0], board[0][0] ];
		for(let i=1;i<gridsize;++i)
		{
			if(board[i][i]==-1)flg = 0;
			dia1[0] = dia1[0] & board[i][i];
			dia1[1] = dia1[1] | board[i][i];
		}
		if( flg && (dia1[0] || ( (~dia1[1])&15) ) )return 8;
	}
	if(board[0][gridsize-1]!=-1)
	{
		let flg = 1;
		dia2 = [ board[0][gridsize-1], board[0][gridsize-1] ];
		for(let i=1;i<gridsize;++i)
		{
			if(board[i][gridsize-1-i]==-1)flg = 0;
			dia2[0] = dia2[0] & board[i][gridsize-1-i];
			dia2[1] = dia2[1] | board[i][gridsize-1-i];
		}
		if( flg && (dia2[0] || ( (~dia2[1])&15) ) )return 9;
	}
	if(counter==16)return 10;
	else return -1;
}
function SelectPiece(index)//resolve piece choosing
{
	console.log(index)
	console.log("Selecting Piece")
	piece_state[index] = 1;
	current_piece = index;
	let selector = "[alt = " + index + "]";
	$("#hold").append( $(selector).detach() );
}
function SelectPlace(index)//resolve placement of piece
{
	console.log(index);
	console.log("Selecting Place")
	if(current_piece==-1)alert("error!");
	else
	{
		counter+=1;
		$('td').removeClass('selected');
		board[(index-index%gridsize)/gridsize][index%gridsize]=current_piece;
		current_piece = -1;
		let tar = $('td').eq(index);
		tar.addClass("selected");
		tar.append($('#hold').html());
		$("#hold").empty();
	}
}
function EndGame(is_player) //output endgame message
{
	state = 4;
	if(win_state!=10)
	{
		if(is_player) $('#winning').html("Congratulations! You won!");
		else $('#winning').html("AI won the game!");
	}
	else $('#winning').html("It's a tie!")
	$('#winning').show();

	//show which line trigger the winning state
	if(0<=win_state && win_state<4)
	{
		for(let i=0;i<gridsize;++i)$('td').eq(gridsize*win_state+i).addClass('goodstate');
	}
	else if(4<=win_state && win_state<8)
	{
		for(let i=0;i<gridsize;++i)$('td').eq(gridsize*i+win_state-4).addClass('goodstate');		
	}
	else if(win_state==8)
	{
		for(let i=0;i<gridsize;++i)$('td').eq(gridsize*i+i).addClass('goodstate');
	}
	else if(win_state==9)
	{
		for(let i=0;i<gridsize;++i)$('td').eq(gridsize*i+3-i).addClass('goodstate');
	}
}

$( document ).ready(function() {
	$('#war2').hide();//waring resoolve
	$('#start').hide();
	$('#winning').hide();
	$('#help').click( function(){ $('#statement').toggle(); });
	$('button').click( function(){
		//initalize
		board = [ //-1 as empty
				  [-1, -1, -1, -1],
				  [-1, -1, -1, -1],
				  [-1, -1, -1, -1],
				  [-1, -1, -1, -1]
				];
		piece_state = [0, 0, 0, 0,
					0, 0, 0, 0,
					0, 0, 0, 0,
					 0, 0, 0, 0];
		current_piece = -1;
		win_state = -1;
		counter = 0;
		$('#war1').hide();
		$('#winning').hide();
		$('td').removeClass("selected");
		$('td').removeClass("goodstate");
		$('img').removeClass("selected");
		$('#pool').html(
			'<img src="https://imgur.com/UquZOd2.png" alt="0">'+
			'<img src="https://imgur.com/EctXpar.png" alt="1">'+
			'<img src="https://imgur.com/VS8Fchn.png" alt="2">'+
			'<img src="https://imgur.com/HUXXz0Y.png" alt="3">'+
			'<img src="https://imgur.com/Wfa0H6i.png" alt="4">'+
			'<img src="https://imgur.com/pdcHXUc.png" alt="5">'+
			'<img src="https://imgur.com/kq2bl8Q.png" alt="6">'+
			'<img src="https://imgur.com/DyWB5RY.png" alt="7">'+
			'<img src="https://imgur.com/lqdTY6C.png" alt="8">'+
			'<img src="https://imgur.com/3up75nr.png" alt="9">'+
			'<img src="https://imgur.com/temAvbW.png" alt="10">'+
			'<img src="https://imgur.com/8uC1hZW.png" alt="11">'+
			'<img src="https://imgur.com/iyqHANn.png" alt="12">'+
			'<img src="https://imgur.com/YcSdexU.png" alt="13">'+
			'<img src="https://imgur.com/zWwc9fd.png" alt="14">'+
			'<img src="https://imgur.com/pp2vWwp.png" alt="15">');
		$('td').empty();
		$('#hold').empty();
		$('#start').show();
		state = 1;
		//select first or second to play
		$('#first_player').click( function(){
			if(state==1)
			{
				$('#start').hide();
				state = 2;
			}
		});
		$('#second_player').click( function(){
			if(state==1)
			{
				$('#start').hide();
				AIChoosePiece().then( ()=>{
					SelectPiece(p);
					state = 3;
				});
			}
		});
		//handling click event
		$('td').click( function(event){
			if(state == 3)
			{
				//input habdle	
				let index = $("td").index(this);
				if(board[(index-index%gridsize)/gridsize][index%gridsize]==-1)
				{
					state = 2;
					SelectPlace(index);
					win_state = IsWin();
					if( win_state!=-1 )EndGame(1);
				}
			}
		});
		$('img').click( function(event){
			if(state == 2)
			{
				//input handle
				let index = $(event.target).attr("alt");
				if(piece_state[index]==0)
				{
					state = 3;
					SelectPiece(index);
					AIChoosePlace().then( ()=>{
						SelectPlace(p);
						win_state = IsWin();
						if( win_state!=-1 ) EndGame(0);
						else
						{
							state = 3;
							AIChoosePiece().then( ()=>{SelectPiece(p)});
						}
					});
				}
			}
		});

	});
});

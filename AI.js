$( document ).ready(function() {
	$('#war3').hide();//waring resoolve
});

const max_depth = 12;


function NotSafe(index,type)
{
	for(let i=0;i<16;++i)
	{
		if(board[(i-i%gridsize)/gridsize][i%gridsize]!=-1)continue;
		board[(i-i%gridsize)/gridsize][i%gridsize] = index;
		let k = IsWin();
		if(k!=-1 && k!=10)
		{
			board[(i-i%gridsize)/gridsize][i%gridsize] = -1;
			if(type==1)return 1;
			else return i;
		}
		board[(i-i%gridsize)/gridsize][i%gridsize] = -1;
	}
	if(type==1)return 0;
	else return -1;
}
function debug()
{

	for(let i=0;i<gridsize;++i)console.log(board[i]);
	console.log(piece_state);
	console.log(p);
	console.log("------------------");
}
//piece has choosen by opponent, AI choose max place
function MaxPlace(piece,alpha,beta,d) 
{ 
	if(d>max_depth) return 0;
	piece_state[piece] = 1;
	current_piece = piece;
	//console.log("MaxPlace");

	let v = -3;
	for(let i=0;i<16;++i)
	{
		if(board[(i-i%gridsize)/gridsize][i%gridsize]!=-1)continue;
		v = Math.max(v,MaxPiece(i,alpha,beta,d+1));
		if(v>=beta) break;
		alpha = Math.max(alpha,v);
	}

	piece_state[piece] = 0;
	current_piece = -1;
	return v;
}
//place has choosen by AI, AI choose min piece
function MaxPiece(place,alpha,beta,d)
{
	board[(place-place%gridsize)/gridsize][place%gridsize] = current_piece;
	counter += 1;
	//console.log("MaxPiece");
	
	let k = IsWin();
	if(k==10 || d>max_depth)
	{
		board[(place-place%gridsize)/gridsize][place%gridsize] = -1;
		counter -= 1;
		return 0;
	}
	else if(k!=-1)
	{
		board[(place-place%gridsize)/gridsize][place%gridsize] = -1;
		counter -= 1;
		return 1;
	}

	let v = -3;
	for(let i=0;i<16;++i)
	{
		if(piece_state[i]==1)continue;
		v = Math.max(v,MinPlace(i,alpha,beta,d+1));
		if(v>=beta) break;
		alpha = Math.max(alpha,v);
	}

	board[(place-place%gridsize)/gridsize][place%gridsize] = -1;
	counter -= 1;
	return v;
}
//piece has choosen by AI, opponent choose min place
function MinPlace(piece,alpha,beta,d)
{
	if(d>max_depth) return 0;
	piece_state[piece] = 1;
	current_piece = piece;
	//console.log("MinPlace");
	

	let v = 3;
	for(let i=0;i<16;++i)
	{
		if(board[(i-i%gridsize)/gridsize][i%gridsize]!=-1)continue;
		v = Math.min(v,MinPiece(i,alpha,beta,d+1));
		if(v<=alpha) break;
		beta = Math.min(beta,v);
	}

	piece_state[piece] = 0;
	current_piece = -1;
	return v;
}
//place has choosen by opponent, opponent choose max piece
function MinPiece(place,alpha,beta,d)
{
	board[(place-place%gridsize)/gridsize][place%gridsize] = current_piece;
	counter+=1;
	//console.log("MinPiece");
	
	let k = IsWin();
	if(k==10 || d>max_depth)
	{
		board[(place-place%gridsize)/gridsize][place%gridsize] = -1;
		counter-=1;
		return 0;
	}
	else if(k!=-1)
	{
		board[(place-place%gridsize)/gridsize][place%gridsize] = -1;
		counter-=1;
		return -1;
	}

	let v = 3;
	for(let i=0;i<16;++i)
	{
		if(piece_state[i]==1)continue;
		v = Math.min(v,MaxPlace(i,alpha,beta,d+1));
		if(v<=alpha) break;
		beta = Math.min(beta,v);
	}

	board[(place-place%gridsize)/gridsize][place%gridsize] = -1;
	counter -= 1;
	return v;
}

async function AIChoosePiece()
{
	console.log("start computing piece");
	await $('#decision').show().promise();
	if(counter==0) p = Math.floor(Math.random() * 16); //first round
	else if(counter<=8)
	{
		p = Math.floor(Math.random() * 16);
		while(piece_state[p]==1)p = Math.floor(Math.random() * 16);
	}
	else
	{
		let max_value = -1;
		let fg = 1;
		for(let i=0;i<16;++i)
		{
			if(piece_state[i]==1)continue;
			if(fg)
			{
				p = i;
				fg = 0;
			}
			if(NotSafe(i,1)==1)continue;
			let t = MinPlace(i,-2,2,0);
			if(t>max_value)
			{
				max_value = t;
				p = i;
			}
		}
	}
	//debug();
	await $('#decision').hide().promise();
}
async function AIChoosePlace()
{
	console.log("start computing place");
	await $('#decision').show().promise();
	if(counter<=4)
	{
		p = Math.floor(Math.random() * 16);
		while(board[(p-p%gridsize)/gridsize][p%gridsize]!=-1)p = Math.floor(Math.random() * 16);
	}
	else
	{
		let tmp_piece = current_piece;
		let max_value = -1;
		let fg = 1;
		for(let i=0;i<16;++i)
		{
			if(board[(i-i%gridsize)/gridsize][i%gridsize]!=-1)continue;
			if(fg)
			{
				p=i;
				fg = 0;
			}
			let win_test = NotSafe(current_piece,0)
			if(win_test!=-1)
			{
				p = win_test;
				break;
			}
			let t = MaxPiece(i,-2,2,0);
			if(t>max_value)
			{
				max_value = t;
				p = i;
			}
		}
		current_piece = tmp_piece;
	}
	//debug();
	await $('#decision').hide().promise();	
}
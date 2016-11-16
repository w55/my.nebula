/*
my.nebula.js
*/
// A demonstration of a Canvas nebula effect
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software if
// using significant parts of it		

$(function(){	

	// The canvas element we are drawing into.      
	var	$can_puff = $('#can_puff');
	var	ctx = $can_puff[0].getContext('2d');	
	
	var	$can_output = $('#can_output');
	var	ctx_output = $can_output[0].getContext('2d');	
	
	var	$can_input = $('#can_input');			
	var	ctx_input = $can_input[0].getContext('2d');

	var w = $can_puff[0].width, h = $can_puff[0].height;		
	// var	img = new Image();		
	var intervalID  = 0, is_stooped = false, cur_image = '', velocity = 0.3;
	var output_width = 1000, output_height = 800;

	//
	//--------------------      initial options   --------------------------
	//
	$('#sel_01').children(":nth-child(2)").prop('selected', 'selected');
	// $('#but_anim').css('display', 'none');
	
	$('#sel_velocity').children(":nth-child(4)").prop('selected', 'selected');	
	var val_04 = $('#sel_velocity').val();
	velocity = Number(val_04) / 200.0;	  
	// applyChanges();	
	
//
//---------------------------   window handlers   ---------------------->>
//	
	$(window).resize(function() {
	  var wid = parseInt($('#can_output').css('width'));
	  if (!isNaN(wid)) {
		  var hei = Math.floor(wid * 4 / 5);
		  
		  // $('#debug_info').text('wid = ' + wid + 'px, hei = ' + hei + 'px');
		  
		//   <span class="blue">    </span>     <span class="red">
		$('#debug_info').html('Canvas: wid = <span class="red">' + wid + '</span>, hei = <span class="red">' + hei + '</span>');		  
		  
		  //++  for IE set here window.height
		  $('#can_output').css('height', hei);
	  }
	  else {
		  // $('#debug_info').text('wid == NaN');
		  $('#debug_info').html('Canvas: wid = <span class="red">NaN</span>');	
	  }
		  
	});
	
	
	
//
//---------------------------   button handlers   ---------------------->>
//	
	// start amination
	$('#but_anim').click(function(e){
        e.preventDefault();
		
		// // set output canvas height
		// $(window).trigger( "resize" );				
	  
	    var src = $('#sel_01').val();
		if (src.length > 0) {
			cur_image = $('#sel_01  option:selected').text();
			// alert(src);
			loadImage(src);			
		}
    }); 
	
	// stop amination
	$('#but_stop').click(function(e){
        e.preventDefault();
	  
		if (intervalID >= 0) {
			 window.clearInterval(intervalID);
			 is_stooped = true;
			 //   <span class="blue">    </span>     <span class="red">
			 $('#cur_state').html('Status = <span class="red">stopped</span> (<span class="blue">' + intervalID + '</span>)');
		}
    }); 

	// hide div_info
	$('#div_info').click(function(e){
        e.preventDefault();
	  
		$(this).hide('fast');
		$('#div_show_info').show('fast');
    }); 
	
	// div_show_info
	// show div_info
	$('#div_show_info').click(function(e){
        e.preventDefault();
	  
		$(this).hide('fast');
		$('#div_info').show('fast');
    }); 
		
	
//
//---------------------------   can_output handlers   ---------------------->>
//		
	// #can_output click() handler
	$('#can_output').click(function(e){
        e.preventDefault();
	  
		if (is_stooped) {
			// start amination
			$( "#but_anim" ).trigger( "click" );				
		}
		else {
			// stop amination
			$( "#but_stop" ).trigger( "click" );				
		}			
    }); 
	
//
//---------------------------   select  handlers   ---------------------->>
//	
	$('#sel_01').change(function(){
      var src = $(this).val();
	  if (src.length > 0) {
			cur_image = $('#sel_01  option:selected').text();
			// alert(src);
			loadImage(src);			
		}
    });
	
	$('#sel_velocity').change(function(){
		var val_04 = $(this).val();
		velocity = Number(val_04) / 200.0;
		
		// cur_image + velocity
		//   <span class="blue">    </span>     <span class="red">
		$('#cur_image').html('<span class="red">' + cur_image + '</span>, <span class="blue">' + val_04 + ' %</span>');
	});	
	
	

	

	// A puff.
	var	Puff = function(p) {				
		var	opacity,			
			sx = Math.random()*(output_width / 2),
			sy = Math.random()*(output_height / 2);
		
		this.p = p;
				
		this.move = function(timeFac) {		
				
			p = this.p + velocity * timeFac;			
			
			// opacity = (Math.sin(p*0.05)*0.5);						
			opacity = (Math.sin(p*0.034)*0.5);						
			
			if(opacity <0) {
				p = opacity = 0;
				sx = Math.random()*(output_width / 2);			
				sy = Math.random()*(output_height / 2);			
			}												
			this.p = p;																			
			ctx.globalAlpha = opacity;									
						
			ctx.drawImage($can_input[0], sx+p, sy+p, (output_width / 2)-(2*p),(output_height / 2)-(2*p), 0,0, w, h);								
		};
	};
	
	var	puffs = [];			
	var	sortPuff = function(p1,p2) { return p1.p-p2.p; };	
	puffs.push( new Puff(0) );
	puffs.push( new Puff(20) );
	puffs.push( new Puff(40) );
	
	var	newTime, oldTime = 0, timeFac;
			
	var	draw = function()
	{								
		newTime = new Date().getTime();				
		if(oldTime === 0 ) {
			oldTime=newTime;
		}
		
		// timeFac = (newTime-oldTime) * 0.1;
		timeFac = (newTime-oldTime) * 0.2;
		
		if(timeFac>3) {timeFac=3;}
		oldTime = newTime;						
		puffs.sort(sortPuff);							
		
		for(var i=0;i<puffs.length;i++)
		{
			puffs[i].move(timeFac);	
		}									
		ctx_output.drawImage( $can_puff[0] ,0,0,output_width,output_height);					
	};
	
	function loadImage(x) {	
		
		// cur_image + velocity
		var cur_velocity = Math.floor(200.0 * velocity);		
		
		//   <span class="blue">    </span>     <span class="red">
		$('#cur_image').html('<span class="red">' + cur_image + '</span>, <span class="blue">' + cur_velocity + ' %</span>');		
		
		var	img = new Image();
		img.src = x.toString(); //'images/my.nebula-1.jpg';
		
		var ini_wid = ini_hei = k_x = k_y = cur_wid = cur_hei = sx = sw = sy = sh = 0;
		$(img).bind('load',null, 
			function() {  
				// ini sizes of loaded  image - show at status bar
				ini_wid = img.width;
				ini_hei = img.height;
				
				// alert('img.width = ' + ini_wid + ', heght = '+ ini_hei);
				$('#cur_ini_sizes').html('Initial: wid = <span class="blue">' + ini_wid + '</span>, hei = <span class="blue">' + ini_hei + '</span>');   //   <span class="blue">    </span>  
				
				if (ini_wid == 0 || ini_hei == 0) {
					$('#cur_cur_sizes').html('Resized: k_x = <span class="blue">' + k_x + '</span>, k_y = <span class="blue">' + k_y + '</span>');  //   <span class="blue">    </span>  
					return;
				}
				
				// current coeffs
				k_x = ini_wid / output_width;
				k_y = ini_hei / output_height;
				
				if (k_x > k_y) {
					cur_wid = Math.floor(ini_wid / k_y);
					cur_hei = Math.floor(ini_hei / k_y);
					
					sx = Math.floor((cur_wid * k_x - ini_wid) / 2);
					sw = Math.floor(ini_wid - 2 * sx);
					sy = 0;
					sh = ini_hei;					
				}
				else {
					cur_wid = Math.floor(ini_wid / k_x);
					cur_hei = Math.floor(ini_hei / k_x);
					
					sx = 0; //Math.floor((ini_wid - cur_wid * k_y) / 2);
					sw = ini_wid; // Math.floor(ini_wid - 2 * sx);
					sy = Math.floor((cur_hei * k_y - ini_hei) / 2);
					sh = Math.floor(ini_hei - 2 * sy);			
				}
				 //   <span class="blue">    </span>  
				$('#cur_cur_sizes').html('Resized: wid = <span class="blue">' + cur_wid + '</span>, hei = <span class="blue">' + cur_hei + '</span>');
				$('#cur_offsets').html('sx/sy = <span class="blue">' + sx + '</span>/<span class="blue">' + sy + '</span>, sw/sh = <span class="blue">' + 
				sw + '</span>/<span class="blue">' + sh + '</span>');
				
				
				
				// draw image to input canvas				
				//++ drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
				ctx_input.drawImage(img, sx, sy, sw, sh, 0,0, output_width, output_height);	
				
				if (intervalID >= 0) {
					 window.clearInterval(intervalID);
					 is_stooped = true;
					 
					 //   <span class="blue">    </span>     <span class="red">
					 $('#cur_state').html('Status = <span class="red">stopped</span> (<span class="blue">' + intervalID + '</span>)');					 
				}
				
				// intervalID = window.setInterval(draw, 10 );
				intervalID = window.setInterval(draw, 22);
				is_stooped = false;
					 
				 //   <span class="blue">    </span>     <span class="red">
				 $('#cur_state').html('Status = <span class="red">started</span> (<span class="blue">' + intervalID + '</span>)');					
			});

	};
	
	// set output canvas height
	$(window).trigger( "resize" );		
		
	// start amination
	$('#but_anim').click();
});


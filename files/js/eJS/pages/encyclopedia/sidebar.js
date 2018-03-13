"use strict";

$(document).ready(function()
{
	$('#tree li').hover(
		function ()
		{
			$(this).css('background-color' , 'rgb(237,237,237)');
		},
		function ()
		{
			var pbc = $(this).parent().css('background-color');
			$(this).css('background-color' , pbc);
		}
	);
	$('#tree li[data-n="parent"]').click(
		function ()
		{
			collapse($(this));
		}
	);
});

function collapse(item)
{
	let clicked_item = item;
	if( clicked_item.prop('tagName') == 'SPAN' )
	{
		clicked_item = clicked_item.parent();
	}	
	let next_item = clicked_item.next();
	if( next_item.prop('tagName') == 'UL' )
	{
		if(clicked_item.data("inbranch") != true)
		{
			clicked_item.toggleClass('beautiful_blue_1');			
			clicked_item.children('a').toggleClass('beautiful_blue_1');
			clicked_item.toggleClass('bgeeeeee');
		}
		clicked_item.children('span').toggleClass('fa-chevron-left');
		clicked_item.children('span').toggleClass('fa-chevron-down');
		next_item.toggleClass('bgeeeeee');
		next_item.animate({height:'toggle'} , 500);
	}
}

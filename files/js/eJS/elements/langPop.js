$(document).ready(function()
{	
	$.get("<%=consV.pages.helper.userRegion%>", function response(country)
	{		
		var ti = '<span id="remSign" class="fa fa-times pull-right cursorPointer" onclick="hideLanPop()"></span>';
		var dontShowAgainEn = "<div class='ltrDir'><a id='dontShowLanPop' href='#' onclick='dontShowLanPopAgain()'>Dont show this again</a></div>";
		var dontShowAgainFa = "<div class='rtlDir'><a id='dontShowLanPop' href='#' onclick='dontShowLanPopAgain()'>این پیام رو دیگه نیار</a></div>";
		if(lang != 'en' && (country == null || country != 'IR'))
		{
			$('#lanPop').attr('data-original-title', ti + "Looking for page in English?&nbsp&nbsp&nbsp&nbsp");
			$('#lanPop').attr('data-content', `<p><a href=${EnLaUrl}>Change to English</a></p>` + dontShowAgainFa);
			$('#lanPop').popover('show');
		}
		else if(lang != 'fa' && (country == null || country == 'IR'))
		{
			$('#lanPop').attr('data-original-title', ti + "&nbsp&nbspبه دنبال صفحه ی فارسی هستید؟");
			$('#lanPop').attr('data-content', `<p><a href=${FaLaUrl}>زبان رو به فارسی تغییر بده</a></p>` + dontShowAgainEn);
			$('#lanPop').popover('show');
		}
	}, 'json');
});
function hideLanPop()
{
	$('#lanPop').popover('hide');
}
function dontShowLanPopAgain()
{
	$.ajax
	({
		url: '<%=consV.links.lanPopShow%>',
		type: 'POST',
		success: function (res)
		{
			if( res == true )
			{
				$('#remSign').click();
			}
			else
			{
				console.log("#Ajax. Error in LanPopShow response");
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in LanPopShow post request. message: %s" , err);
		}
	});	
}
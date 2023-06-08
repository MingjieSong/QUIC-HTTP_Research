nyu$( document ).ready(function() {
	handleAlert();
});


function handleAlert() {
	var url = [];
	
	var alertLocation = nyu$('#alertContainer').data("alertlocation");
	if(!alertLocation){
		alertLocation = 'nyc';
	}
	
	
	url.push('/nyuapi/digicomm/v70a/alerts/current.json?l='+alertLocation);
	nyu$.ajax({
		url: url.join(''),
		dataType: 'json',
		success: function(data) {
			
			if(! (data.length > 0)){
				return;
			}
			
			/*
			<a href="#" class="alert_active alert">
				<div class="alertwrapper">
					<h3 class="alertText">SUBWAY and BUS ON STRIKE. CLASSES CANCELLED.</h3>
					<div class="alertButton caret-button" ><span class="alertButtonText">MORE </span></div>
					<span class="alertDate">November 4, 2014 </span>
					<span class="alertLocation"> New York City2</span>
				</div>
			</a>
			 */
			nyu$.each( data, function( index, value ) {
				var alert = value;
				nyu$('#alertContainer')
					.append(
							nyu$('<a />',{'href':alert.alertLocationPath+'.html','class': getAlertClass(alert.alertType) + ' alert'})
								.append(
										nyu$('<div />',{'class':'alertwrapper'})
											.append(nyu$('<div />',{'class':'alertTextHolder'})
													.append(nyu$('<h3 />',{'class':'alertText'}).text(alert.headlineMessage))
													.append(nyu$('<span />',{'class':'alertLocation'}).text( getAlertLocations(alert.locations)  ) )
												)
											.append(nyu$('<div />',{'class':'alertButton caret-button'})
													.append($('<span />',{'class':'alertButtonText'}).text('MORE') )
												)
								)
					);

				nyu$('<span />',{'class':'icon', 'aria-hidden':'true', 'tabindex':'-1'}).prependTo('.alertLocation');
				nyu$('<span />',{'class':'icon', 'aria-hidden':'true', 'tabindex':'-1'}).appendTo('.alertButtonText');
			});
			
			
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}

function getAlertClass(alertType){
	if(alertType == 'active'){
		return 'alert_active';
	}else if (alertType == 'warning'){
		return 'alert_info';
	}else if (alertType == 'allClear'){
		return 'alert_allclear';
	}
}


function getAlertLocations(locations) {
	var locs = [];
	if (typeof nyu !== 'undefined') {
		$.each(locations, function (index, value) {
			if (typeof nyu.locationMap[value] !== 'undefined') {
				locs.push(nyu.locationMap[value]);
			}
		});
	}
	return locs.join(", ");

}

nyu$( document ).ready(function() {
	if (nyu$('.shoppingcategory-template').length >0 || nyu$('.shoppingcart-template').length >0 ){


		nyu$('#cat-add a').on('click', function() {
			addRentalCategory(this);
		});

		nyu$('.cat-up a').on('click', function() {
			moveRentalCategory(this, 'up');
		});

		nyu$('.cat-down a').on('click', function() {
			moveRentalCategory(this, 'down');
		});

		nyu$('.cat-edit a').on('click', function() {
			updateRentalCategory(this);
		});

		nyu$('.cat-delete a').on('click', function() {
			deleteRentalCategory(this);
		});

		//nyu$('.item-add select').on( "selectmenuchange", function( event, ui ) {
		nyu$('.item-add select').on( "change", function( event, ui ) {
			updateCart(this);
		});

		nyu$('#mobile-shopping-sub-cart a').on('click', function() {
	        gotoRentals(this);
	    });

		nyu$('.clear-cart').on('click', function() {
			clearCart(this);
	    });

		nyu$('.borrower-submit').on('click', function() {
			submitCart(this);
	    });

		updateShortCart();

		if (nyu$('.shoppingcart-template').length >0 ){
			redrawCart();
		}



	}


});


function addRentalCategory(btn){
	var addCat = nyu$(btn).closest('#cat-add');
	if (addCat.length == 0){
		return;
	}
	var rentalLocation = nyu$(addCat).data("rl");
	var categoryName = window.prompt("Enter a Tab Name", "");

	if(!categoryName){
		return;
	}

	var url = [];
    url.push('/nyuapi/digicomm/v70a/rentals/addcategory?c='+encodeURI(categoryName)+'&rl='+encodeURI(rentalLocation));

    nyu$.ajax({
        url: url.join(''),
        dataType: 'json',
        success: function(data) {
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert(jqXHR.responseJSON.error);
        }
    });



}

function moveRentalCategory(btn, direction){
	var catTab = btn.closest('.shopping-category-table');

	if (catTab.length == 0){
		return;
	}
	var rentalLocation = nyu$(catTab).data("rl");
	var categoryNodeName = catTab.id.substring(catTab.id.indexOf("-")+1);

	var url = [];
    url.push('/nyuapi/digicomm/v70a/rentals/movecategory?cn='+encodeURI(categoryNodeName)+'&rl='+encodeURI(rentalLocation)+"&d="+direction);

    nyu$.ajax({
        url: url.join(''),
        dataType: 'json',
        success: function(data) {
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert(jqXHR.responseJSON.error);
        }
    });

}

function updateRentalCategory(btn){
	var catTab = btn.closest('.shopping-category-table');

	if (catTab.length == 0){
		return;
	}
	var rentalLocation = nyu$(catTab).data("rl");
	var categoryNodeName = catTab.id.substring(catTab.id.indexOf("-")+1);

	var categoryName = window.prompt("Enter a New Tab Name", "");

	if(!categoryName){
		return;
	}


	var url = [];
    url.push('/nyuapi/digicomm/v70a/rentals/editcategory?cn='+encodeURI(categoryNodeName)+'&c='+encodeURI(categoryName)+'&rl='+encodeURI(rentalLocation));

    nyu$.ajax({
        url: url.join(''),
        dataType: 'json',
        success: function(data) {
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert(jqXHR.responseJSON.error);
        }
    });



}

function deleteRentalCategory(btn){
	var catTab = btn.closest('.shopping-category-table');

	if (catTab.length == 0){
		return;
	}
	var rentalLocation = nyu$(catTab).data("rl");
	var categoryNodeName = catTab.id.substring(catTab.id.indexOf("-")+1);

	var url = [];
    url.push('/nyuapi/digicomm/v70a/rentals/deletecategory?cn='+encodeURI(categoryNodeName)+'&rl='+encodeURI(rentalLocation));

    nyu$.ajax({
        url: url.join(''),
        dataType: 'json',
        success: function(data) {
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert(jqXHR.responseJSON.error);
        }
    });



}

function updateCart(slct){
	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}
	var cart = getCart(rentalAppCode);
	var cartItem = getCartItem(slct);
	addToCart(cart,cartItem);

}

function getCart(rentalApp){
	var cart = Cookies.getJSON(rentalApp+'-rentalcart');
	if (!cart){
		cart = [];
	}
	return cart;
}


function getCartItem(slct){
	var catTab = nyu$(slct).closest('.shopping-category-table');
	var catId = nyu$(nyu$(catTab).find('.tabbed-title')[0]).text()
	var itemShowcase = nyu$(slct).closest('.item-showcase')[0];

	var cost = parseInt(nyu$(nyu$(itemShowcase).find('.item-info')[0]).data('cost'));
	var quantity = parseInt(nyu$(nyu$(itemShowcase).find('.item-info')[0]).data('quantity'));
	var size = nyu$(nyu$(nyu$(slct).closest('.size-group')[0]).find('.item-size')).text();
	var itemName = nyu$(nyu$(itemShowcase).find('.item-name')[0]).text();
	var itemCount = parseInt(slct.value);
	var imgUrl = nyu$(nyu$(itemShowcase).find('.item-image img')[0])[0].srcset;

	var cartItem = {
			'cat':catId,
			'name':itemName,
			'cost':cost,
			'size':size,
			'count':itemCount,
			'url':imgUrl,
			'quantity':quantity
	};
	return cartItem;

}

function addToCart(cart, cartItem){
	var itemUpdated = false;
	for(var i=0; i< cart.length; i++){
		if(cart[i].cat == cartItem.cat && cart[i].name == cartItem.name && cart[i].size == cartItem.size){
			cart[i] = cartItem;
			itemUpdated = true;
			break;
		}
	}

	if(!itemUpdated){
		cart.push(cartItem);
	}

	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}

	Cookies.set(rentalAppCode+ '-rentalcart', cart);

	updateShortCart();


}

function updateShortCart(){
	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}
	var cart = getCart(rentalAppCode);
	var totalCount = 0;
	var totalCost = 0
	if(cart.length > 0){
		nyu$.each(cart, function(index,value){
			var cost = 0;
			var count = 0;
			try {
				count = parseInt(value.count);
				cost = parseInt(value.cost);
				totalCount = totalCount + count;
				totalCost = totalCost + (count * cost);
			} catch (err){}
		});
	}
	nyu$(nyu$('.shoppingcategory-template .cartbox-nbr-count')[0]).text(totalCount);
	nyu$(nyu$('.shoppingcart-template .cartbox-nbr-count')[0]).text(totalCount);
	nyu$(nyu$('.shoppingcart-template .cartbox-total-items')[0]).text(totalCost);


}

function gotoRentals(btn){
	var navDiv = nyu$(btn).closest('#mobile-shopping-sub-cart')[0];
	if(!navDiv){
		return;
	}
	var rentalLink = nyu$(navDiv).data('rentallink');
	window.location = rentalLink + $(btn).attr('rel');
}

function clearCart(btn){
	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}
	Cookies.remove(rentalAppCode+'-rentalcart');
	updateShortCart();
	redrawCart();
}

function redrawCart(){
	var cartContainer = nyu$('.cart-row-container')[0];

	if(!cartContainer){
		return;
	}
	nyu$(cartContainer).html('');

	var rentalAppCode = getRentalAppCode();
	if (!rentalAppCode){
		return;
	}

	var cart = getCart(rentalAppCode);
	if(cart.length <= 0){
		return;
	}
	var totalCost = 0;
	var totalCount = 0;
	nyu$.each(cart, function(index,value){
		var rowCost = 0;
		var rowItemCost = 0;
		var rowCount = 0;
		var rowQuantity = 0;
		try{
			rowCount = parseInt(value.count);
			rowItemCost = parseInt(value.cost);
			rowCost =  rowItemCost * rowCount;
			rowQuantity = parseInt(value.quantity);
		}catch(err){
			// do nothing
		}

		totalCost = totalCost + rowCost;
		totalCount = totalCount + rowCount;

		var s = nyu$('<select />');
		var o = nyu$('<option />',{'value':'','disabled':'true'}).text("1");
		if(rowCount==1){
			o.attr('selected','true');
		}
		s.append(o)
		for(var i=1; i<=rowQuantity; i++){
			o = nyu$('<option />',{'value':''+i}).text(''+i);
			if(i==rowCount){
				o.attr('selected','true');
			}
			s.append(o);
		}

		var cr = nyu$('<div />',{'class':'cart-row','data-catId':value.cat})
					.append(
							nyu$('<div />',{'class':'cart-item item-showcase'})
								.append(
									nyu$('<div />',{'class':'item-image'})
										.append(nyu$('<img />',{'src':value.url}))
								)
								.append(
									nyu$('<div />',{'class':'item-info'})
										.append(nyu$('<div />',{'class':'item-name'}).text(value.name))
										.append(nyu$('<div />',{'class':'item-type'}).text(value.cat))
										.append(nyu$('<div />',{'class':'item-size'}).text(value.size))
										.append(nyu$('<div />',{'class':'item-remove'}).text('Remove'))
								)
							)
					.append(
							nyu$('<div />',{'class':'nline'})
								.append(
									nyu$('<div />',{'class':'cart-price'}).text('$'+rowItemCost)
								)
								.append(
									nyu$('<div />',{'class':'cart-quantity'})
										.append(s)
								)
								.append(
									nyu$('<div />',{'class':'cart-total'}).text('$'+rowCost)
								)
							);
		nyu$(cartContainer).append(cr);
	});

	var tr = nyu$('<div />',{'class':'cart-totalline'})
			.append(
				nyu$('<div />',{'class':'cart-label'}).text('Rental Total:')
			)
			.append(
				nyu$('<div />',{'class':'cart-value'})
					.append(
						nyu$('<div />',{'class':'cart-quantity'}).html('<b>(' + totalCount + ')</b> Items')
					)
					.append(
						nyu$('<div />',{'class':'cart-total'}).text('$'+totalCost)
					)
			);

	nyu$(cartContainer).append(tr);


	nyu$('.cart-quantity select').selectmenu();

	// need to bind here, as items are created at runtime.. so after items are
	// created the event binding occurs
	nyu$('.shoppingcart-template .cart-quantity select').on('selectmenuchange', function() {
		updateCartQuantity(this);
	});
	nyu$('.shoppingcart-template .item-remove').on('click', function() {
		removeFromCart(this);
	});

}


function getRentalAppCode(){
	var rl = nyu$('.cart-content-table, .shopping-category-table');
	var rentalApp = '';
	if(rl.length>0){
		rentalApp = nyu$(nyu$(rl)[0]).data('rl');
		if(!rentalApp){
			rentalApp = nyu$(nyu$(rl)[0]).data('rentalpage');
		}
	}
	if(!rentalApp){
		console.error("RentalApp location not set. Cannot process cart.");
		return;
	}
	if(rentalApp.indexOf('.html') > 0){
		rentalApp = rentalApp.replace('.html','');
	}

	return Math.abs(rentalApp.hashCode());
}

function updateCartQuantity(btn){



	var cartRow = nyu$(btn).closest('.cart-row')[0];
	var cat = nyu$(cartRow).data('catid');
	var name = nyu$(nyu$(cartRow).find('.item-name')[0]).text();
	var size = nyu$(nyu$(cartRow).find('.item-size')[0]).text();

	var itemUpdated = false;
	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}
	var cart = getCart(rentalAppCode);
	for(var i=0; i< cart.length; i++){
		if(cart[i].cat == cat && cart[i].name == name && cart[i].size == size){

			cart[i].count = parseInt(btn.value);
			itemUpdated = true;
			break;
		}
	}

	Cookies.set(rentalAppCode+'-rentalcart', cart);

	redrawCart();
	updateShortCart();


}

function removeFromCart(btn){
	var cartRow = nyu$(btn).closest('.cart-row')[0];
	var cat = nyu$(cartRow).data('catid');
	var name = nyu$(nyu$(cartRow).find('.item-name')[0]).text();
	var size = nyu$(nyu$(cartRow).find('.item-size')[0]).text();

	var itemUpdated = false;

	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}

	var cart = getCart(rentalAppCode);
	for(var i=0; i< cart.length; i++){
		if(cart[i].cat == cat && cart[i].name == name && cart[i].size == size){

			cart.splice(i, 1);
			itemUpdated = true;
			break;
		}
	}

	Cookies.set(rentalAppCode + '-rentalcart', cart);

	redrawCart();
	updateShortCart();
}

function submitCart(btn){
	nyu$('.cart-errors').hide();

	if(nyu$(btn).hasClass('disabled')){
		alert('already disabled.');
	}

	nyu$(btn).addClass('disabled');

	var rentalAppCode = getRentalAppCode();
	if(!rentalAppCode){
		return;
	}

	var cart = getCart(rentalAppCode);
	var errors = [];
	if(! (cart.length > 0) ){
		errors.push('No items in Cart. Cannot submit.');
		writeCartErrors(errors);
		return;
	}

	if(! nyu$('.cart-borrower-name input').val().trim()){
		errors.push('Borrower Name is required.');
	}

	if(! nyu$('.cart-borrower-department input').val().trim()){
		errors.push('Borrower Department is required.');
	}

	if(! nyu$('.cart-borrower-telephone input').val().trim()){
		errors.push('Borrower Phone is required.');
	}

	if(! nyu$('.cart-borrower-email input').val().trim()){
		errors.push('Borrower Email is required.');
	}else{
		if (!validateEmail(nyu$('.cart-borrower-email input').val())){
			errors.push('Borrower Email is invalid.')
		}
	}

	if(! nyu$('.cart-info-fund input').val().trim()){
		errors.push('Borrower Fund is required.');
	}

  if(! nyu$('.cart-info-account input').val().trim()){
		errors.push('Borrower Account is required.');
	}

  if(! nyu$('.cart-info-org input').val().trim()){
		errors.push('Borrower Org is required.');
	}

	if(! nyu$('input[name="acknowledgement"]').prop("checked") === true){
		errors.push('Agreement Acknowledgement is required.');
	}

	if(errors.length > 0){
		writeCartErrors(errors);
		nyu$(btn).removeClass('disabled');
		return;
	}

	// all ok.. now go and submit
	var formData = {
		'cart':cart,
		'borrower':{
			'name':nyu$('.cart-borrower-name input').val(),
			'department':nyu$('.cart-borrower-department input').val(),
			'telephone':nyu$('.cart-borrower-telephone input').val(),
			'email':nyu$('.cart-borrower-email input').val()
		},
		'info':{
			'datepickup':nyu$('.cart-info-datepickup input').val(),
			'datedueback':nyu$('.cart-info-datedueback input').val(),
			'account':nyu$('.cart-info-account input').val(),
			'fund':nyu$('.cart-info-fund input').val(),
			'org':nyu$('.cart-info-org input').val(),
			'comments':nyu$('.cart-info-comments textarea').val()

		},
		'submitPage':nyu$(nyu$('.cart-submit-form')[0]).data('submitpage')
	};

	nyu$('body').addClass('waitCursor');

	var url = [];
    url.push('/nyuapi/digicomm/v70a/rentals/submitcart');

    nyu$.ajax({
        url: url.join(''),
        dataType: 'json',
        method: 'post',
        data : JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            handleCartSuccess();
            nyu$('body').removeClass('waitCursor');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            nyu$(btn).removeClass('disabled');
            nyu$('body').removeClass('waitCursor');
            alert(jqXHR.responseJSON.error);
        }
    });

}


function writeCartErrors(msgs){
	var errorContainer = nyu$('.cart-errors')[0];
	if(! errorContainer){
		return;
	}
	nyu$(errorContainer).text('');

	nyu$.each(msgs, function(index,value){
		nyu$(errorContainer)
			.append(nyu$('<div />').text(value))
	});

	nyu$(errorContainer).show();

	var offset = $(errorContainer).offset();
	offset.top -= 200;
	$('html, body').animate({
	    scrollTop: offset.top,
	    scrollLeft: offset.left
	});

}

function handleCartSuccess(){

	var thankyoupage = nyu$(nyu$('.cart-submit-form')[0]).data('thankyoupage');
	clearCart();
	if(thankyoupage){
		window.location=thankyoupage;
	}else {
		nyu$('.cart-submit-form').html('');
		nyu$('.cart-submit-form').append(
					nyu$('<div />').html('Your request has been submitted. Thank You.')
				);
		var offset = nyu$('.cart-submit-form').offset();
		offset.top -= 200;
		$('html, body').animate({
		    scrollTop: offset.top,
		    scrollLeft: offset.left
		});
	}

}

nyu$( document ).ready(function() {
	if (nyu$('.news.search').length > 0){

		$(".news.search form.search-form").submit(function(e){
			e.preventDefault();

			submitNewsSearch(e);
		});

		nyu$('.news.search .search-toggle .nav-list-item').on('click', function() {
			submitNewsSearchWithType(this);
		});

		setFormValues();

		setPaginationValues();
	}

	if (nyu$('.search-box').length > 0){
		$(".search-box form").submit(function(e){
			e.preventDefault();

			submitBoxNewsSearch(e);
		});
	}

	if (nyu$('.news.in-content-form').length > 0){

		nyu$('.news.in-content-form .main-nav-submit-container').height(nyu$('.news.in-content-form .main-nav-input-container').height());

		nyu$('.news.in-content-form .main-nav-submit-container').on('click', function() {
			submitInlineNewsSearch(this);
		});

		nyu$('.news.in-content-form').on("keydown", function(e) {
			if (e.which == 13) {
				submitInlineNewsSearch(this);
			}
		});
	}	
});



function submitNewsSearch(btn){
	var href = window.location.pathname;
	href += getSearchQueryString();
	window.location = href;	
}


function submitBoxNewsSearch(elm){
	var form = nyu$('.search-box');

	var href = nyu$(form).data('searchpage') + '.html';
	href += getBoxSearchQueryString();
	window.location = href;
}



function submitInlineNewsSearch(btn){
	var form = nyu$('.news.in-content-form');

	var href = nyu$(form).data('searchpage') + '.html';
	href += getInlineSearchQueryString();
	window.location = href;
}



function submitNewsSearchWithType(btn){
	var at = $(btn).data('at');
	var href = window.location.pathname;
	var qStr = getSearchQueryString();

	if(at == "total"){
		href += qStr;
	} else {
		href += qStr + (qStr?"&":"?") + "at=" + (at=="totalstory"?"st":(at=="totalrelease"?"re":"se"));
	}

	window.location=href;
}



function getSearchQueryString(){
	var form = nyu$('.search-form');
	
	var kw = nyu$(form).find('.search-field input').val();

	var td = nyu$(form).find('#search-news-to').val();
	var fd = nyu$(form).find('#search-news-from').val();
	var sct = nyu$(form).find('#search-news-schools').val();
	var ct = nyu$(form).find('#search-news-categories').val();
	var nt = nyu$(form).find('#search-news-topics').val();
	var st = nyu$(form).find('#search-news-series').val();
	
	var qstr = "";
	var qIsUsed = false;
	if(kw){qstr += (qIsUsed?'&':'?')+'kw='+escape(kw); qIsUsed = true;}
	if(td){qstr += (qIsUsed?'&':'?')+'td='+td; qIsUsed = true;}
	if(fd){qstr += (qIsUsed?'&':'?')+'fd='+fd; qIsUsed = true;}
	if(sct){qstr += (qIsUsed?'&':'?')+'sct='+escape(sct); qIsUsed = true;}
	if(ct){qstr += (qIsUsed?'&':'?')+'ct='+escape(ct); qIsUsed = true;}
	if(nt){qstr += (qIsUsed?'&':'?')+'nt='+escape(nt); qIsUsed = true;}
	if(st){qstr += (qIsUsed?'&':'?')+'st='+escape(st); qIsUsed = true;}
	
	return qstr;	
}



function getBoxSearchQueryString(){
	var form = nyu$('.search-box');

	var kw = nyu$(form).find('input[name="Keyword"]').val();
	var td = nyu$(form).find('.range input[name="To"]').val();
	var fd = nyu$(form).find('.range input[name="From"]').val();
	
	var qstr = "";
	var qIsUsed = false;
	
	if(kw){qstr += (qIsUsed?'&':'?')+'kw='+escape(kw); qIsUsed = true;}
	if(td){qstr += (qIsUsed?'&':'?')+'td='+td; qIsUsed = true;}
	if(fd){qstr += (qIsUsed?'&':'?')+'fd='+fd; qIsUsed = true;}
	
	return qstr;
}



function getInlineSearchQueryString(){
	var form = nyu$('.news.in-content-form');

	var kw = nyu$(form).find('.main-navigation-search-form-text-field').val();
	var qstr = "";
	var qIsUsed = false;

	if(kw){qstr += (qIsUsed?'&':'?')+'kw='+escape(kw); qIsUsed = true;}
	
	return qstr;
}



function setFormValues(){
	var form = nyu$('.search-form');
	var searchtoggle = nyu$('.search-toggle');
	
	var kw = getSearchParameterByName("kw");
	if(kw){
		nyu$(form).find('.search-field input').val(kw);
		nyu$(form).find('.search-item-count .keyword').text(kw);
	}
	
	var td = getSearchParameterByName("td");
	if(td){ nyu$(form).find('#search-news-to').val(td); }

	var fd = getSearchParameterByName("fd");
	if(fd){ nyu$(form).find('#search-news-from').val(fd); }

	var sct = getSearchParameterByName("sct");
	if(sct){ nyu$(form).find('#search-news-schools').val(sct); }

	var ct = getSearchParameterByName("ct");
	if(ct){ nyu$(form).find('#search-news-categories').val(ct); }

	var nt = getSearchParameterByName("nt");
	if(nt){ nyu$(form).find('#search-news-topics').val(nt); }

	var st = getSearchParameterByName("st");
	if(st){ nyu$(form).find('#search-news-series').val(st); }

	var at = getSearchParameterByName("at");
	if(at){
		nyu$(searchtoggle).find(' .nav-list-item a').removeClass('current');

		if(at == 're'){
			nyu$(searchtoggle).find('.nav-list-item[data-at="totalrelease"] a').addClass('current');
		} else if(at == 'st'){
			nyu$(searchtoggle).find('.nav-list-item[data-at="totalstory"] a').addClass('current');
		} else if(at == 'se'){
			nyu$(searchtoggle).find('.nav-list-item[data-at="totalseries"] a').addClass('current');
		}
	}
}

function getSearchParameterByName(name, url) {
	if (!url) url = window.location.href;

	name = name.replace(/[\[\]]/g, "\\$&");

	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
		results = regex.exec(url);

	if (!results) return null;

	if (!results[2]) return '';

	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setPaginationValues(){
	var buildQueryStr = "";

	var kw  = getSearchParameterByName("kw");
	var td  = getSearchParameterByName("td");
	var fd  = getSearchParameterByName("fd");
	var sct = getSearchParameterByName("sct");
	var ct  = getSearchParameterByName("ct");
	var nt  = getSearchParameterByName("nt");
	var st  = getSearchParameterByName("st");
	var at  = getSearchParameterByName("at");

	if(kw) {buildQueryStr += '&kw=' + kw }
	if(td) {buildQueryStr += '&td=' + fd }
	if(fd) {buildQueryStr += '&fd=' + fd }
	if(sct){buildQueryStr += '&sct=' + sct }
	if(ct) {buildQueryStr += '&ct=' + ct }
	if(nt) {buildQueryStr += '&nt=' + nt }
	if(st) {buildQueryStr += '&st=' + st }
	if(at) {buildQueryStr += '&at=' + at }
 

	$('.pagination-controls a').each(function(){ 
		var oldUrl = $(this).attr("href");
		var newUrl = oldUrl + buildQueryStr;
		$(this).attr("href", newUrl);
	});
}
nyu$( document ).ready(function() {
	if(nyu$('.nyu-home').length >0){
		handleSocialFeed();
	}
});

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

function escapeHtml (string) {
	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}

function handleSocialFeed() {
	var socialcontainers = nyu$('.socialstream');

	nyu$(socialcontainers).each(function(index, element) {
		var type = nyu$(element).data('sociallocation');

		if(type=='facebook'){
			handleFacebook(element);
		} else if(type == 'twitter'){
			handleTwitter(element);
		} else if(type == 'instagram'){
			handleInstagram(element);
		}
	});
}

function handleFacebook(socialContainer){
	var url = [];
	url.push('/content/nyu/aggregatedfeed/facebook.html?wcmmode=disabled');
	nyu$.ajax({
		url: url.join(''),
		dataType: 'json',
		success: function(data) {
			if(data.posts && data.posts.data) {
				var post = getValidFacebookPost(data.posts.data);
				if (post !== null) {
					var d = {
						'message' : post.message
					};
					processFacebook(socialContainer, d);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}

function getValidFacebookPost(arr) {
	for(var i = 0; i < arr.length; i++) {
		if (typeof arr[i].message !== "undefined") {
			return arr[i];
		}
	}

	return null;
}

function handleInstagram(socialContainer){
	var url = [];
	url.push('/content/nyu/aggregatedfeed/instagram.html?wcmmode=disabled');
	nyu$.ajax({
		url: url.join(''),
		dataType: 'json',
		success: function(data) {
			var post = getValidInstagramPost(data.data);
			if(post !== null) {
				var d = {
					'link': post.link,
					'url': post.images.standard_resolution.url
				};
				processInstagram(socialContainer, d);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}

function getValidInstagramPost(arr) {
	for(var i = 0; i < arr.length; i++) {
		if (typeof arr[i].link !== "undefined") {
			if (typeof arr[i].images !== "undefined") {
				if (typeof arr[i].images.standard_resolution !== "undefined") {
					if (typeof arr[i].images.standard_resolution.url !== "undefined") {
						return arr[i];
					}
				}
			}
		}
	}
	return null;
}

function handleTwitter(socialContainer){
	var url = [];
	url.push('/content/nyu/aggregatedfeed/twitter.html?wcmmode=disabled');
	nyu$.ajax({
		url: url.join(''),
		dataType: 'json',
		success: function(data) {
			if( (!data )){
				return;
			}
			var posts = data;
			if(posts.length > 0){
				var p = posts[0];
				var d = {
					'text': p.text
				};
				processTwitter(socialContainer, d);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}
function getShortMesage(msg, len){
	if(!msg || !len){
		return msg;
	}
	if(msg.length > len){
		return msg.substring(0,len-1)+" ...";
	}else {
		return msg;
	}
}

function processTwitter(socialContainer, post){
	var url = nyu$(socialContainer).data('locationurl');
	nyu$(socialContainer).addClass('twitter');

	var msg = escapeHtml(getShortMesage(post.text,120));
	var innerMsg = '<a aria-label="NYU Twitter: ' + msg + '" href="'+ url + '" data-title="' + msg + '" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M452.06 126.6a151.59 151.59 0 01-45.38 13.12c16.31-10.32 28.84-26.66 34.74-46.12a153.29 153.29 0 01-50.18 20.23c-14.41-16.2-34.95-26.33-57.67-26.33-43.64 0-79.02 37.33-79.02 83.36 0 6.54.7 12.9 2.04 19-65.67-3.47-123.9-36.66-162.87-87.1a86.48 86.48 0 00-10.7 41.91c0 28.92 13.95 54.44 35.16 69.39a75.6 75.6 0 01-35.8-10.43v1.05c0 40.39 27.23 74.08 63.38 81.74a75.24 75.24 0 01-35.68 1.43c10.05 33.12 39.23 57.22 73.81 57.9-27.04 22.35-61.11 35.68-98.13 35.68-6.38 0-12.67-.4-18.85-1.17 34.97 23.66 76.5 37.46 121.13 37.46 145.34 0 224.82-127.03 224.82-237.2 0-3.6-.07-7.2-.23-10.78a165.71 165.71 0 0039.43-43.15z"/></svg><div>' + msg + '</div></a>';
	nyu$(socialContainer).append(innerMsg);
}

function processInstagram(socialContainer, post){
	nyu$(socialContainer).addClass('instagram');
	var i=0; 
	var innerMsg = escapeHtml('@nyuniversity');
	var innerImgUrl = post.url;
	var url = post.link;
	
	var link =  '<a aria-label="NYU Instagram: '+ innerMsg + '" href="'+ url + '" data-title="'+ innerMsg + '" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M360.6 120H151.4c-17.3 0-31.4 14-31.4 31.4v209.2c0 17.3 14 31.4 31.4 31.4h209.2c17.3 0 31.4-14.1 31.4-31.4V151.4c0-17.3-14.1-31.4-31.4-31.4zM256 203.7c28.9 0 52.3 23.4 52.3 52.3s-23.4 52.3-52.3 52.3-52.3-23.4-52.3-52.3 23.4-52.3 52.3-52.3zm104.6 146.4c0 5.8-4.7 10.4-10.5 10.4H161.9c-5.8 0-10.5-4.7-10.5-10.4v-115h23.7a84.9 84.9 0 00-2.7 20.9c0 46.2 37.5 83.7 83.7 83.7s83.7-37.5 83.7-83.7c0-7.2-1-14.2-2.7-20.9h23.7v115zm0-156.9c0 5.8-4.7 10.5-10.5 10.5h-31.4c-5.8 0-10.5-4.7-10.5-10.5v-31.4c0-5.8 4.7-10.5 10.5-10.5h31.4c5.8 0 10.5 4.7 10.5 10.5v31.4z"/></svg><div>' + innerMsg + '</div></a>';
	nyu$(socialContainer).append(link);
	// nyu$(socialContainer).css('background-image','url('+ innerImgUrl +')');
}

function processFacebook(socialContainer, post){
	var url = nyu$(socialContainer).data('locationurl');
	nyu$(socialContainer).addClass('facebook');

	var msg = escapeHtml(getShortMesage(post.message,120));
	var innerMsg = '<a aria-label="NYU Facebook: ' + msg + '" href="'+ url + '" data-title="' + msg + '" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266.9 266.9"><path d="M248.1 4.6H18.8C11 4.6 4.6 11 4.6 18.8v229.3c0 7.9 6.4 14.2 14.2 14.2h123.4v-99.8h-33.6v-38.9h33.6V94.9c0-33.3 20.3-51.4 50-51.4 14.2 0 26.5 1.1 30 1.5v34.8h-20.6c-16.1 0-19.3 7.7-19.3 18.9v24.8h38.5l-5 38.9h-33.5v99.8H248c7.9 0 14.2-6.4 14.2-14.2V18.8c.1-7.8-6.3-14.2-14.1-14.2z"/></svg><div>' + msg + '</div></a>';
	nyu$(socialContainer).append(innerMsg);
}


var eventCal = function() {
    var that = {};
    
    that.list = function(o) {
        nyu$.ajax({
            url: updateProtocol(formatUrl(o.url, o.timespan)),
            success: function(data) {
                var arr = [];
                for(var i = 0; i < data.length; i++) {
                    if (i < o.max || o.max === 0) {
                        var date = new Date(data[i].date_ts*1000);
                        arr.push('<li>');
                        arr.push('<div class="upcoming-date">');
                        arr.push('<span class="upcoming-month">'+getMonth(date)+'</span>');
                        arr.push('<span class="upcoming-day">'+getDay(date)+'</span>');
                        arr.push('<span class="upcoming-year">'+getYear(date)+'</span>');
                        arr.push('</div>');
                        arr.push('<div class="event-data">');
                        arr.push('<a href="'+data[i].url+'" class="event-name">'+data[i].title+'</a>');
                        arr.push('<span class="event-text event-time-location">'+(data[i].is_all_day == 1 ? 'All Day' : data[i].date_time) + (data[i].location !== null ? ' at ' + data[i].location : '') + '</span>');
                        arr.push('<span class="event-text event-summary	">' + (data[i].description !== null ? (data[i].description.replace(/(<([^>]+)>)/ig,"").substr(0, 140) + '..') : '') + '</span>');
                        arr.push('</div>');
                        arr.push('</li>');
                    }
                    else if (i > o.max) {
                        break;
                    }
                }
                if(arr.length == 0){
                	arr.push('<li>');
                    arr.push('<div>');
                    arr.push('<p>No events scheduled</p>');
                    arr.push('</div>');
                    arr.push('</li>');
                }
                nyu$(o.container).html(arr.join(''));
            }
        });
    };
    
    that.promo = function(o) {
        nyu$.ajax({
            url: updateProtocol(o.url),
            success: function(data) {
                var arr = [];
                var d;
                if(Array.isArray(data)){
                	d = data[0];
                }else{
                	d = data;
                }
                if ((typeof d).toLowerCase() === 'object' && d.url) {
                    arr.push('<a href="'+d.url+'" class="promo"'+(o.openInNewWindow ? ' target="_blank"' : '')+'>');
                    arr.push('<img class="promo-image" src="'+ (d.thumb ? d.thumb : d.thumbnail) +'" />');
                    arr.push('<h6 class="promo-title">'+d.title+'</h6>');
                    arr.push('</a>');
                }
                else {
                    arr.push('No event was matched for your configuration.');
                }
                nyu$(o.container).replaceWith(arr.join(''));
            }
        });
    };
    
    function formatUrl(url, timeSpan) {
        if(timeSpan){
            var now = new Date(),
                today = moment.unix(now.getTime()/1000),
                startdateString = today.format("MMDDYYYY"),
                enddateString = "";
            
            if(timeSpan === "1:6") {
                enddateString = today.add('days', 1).format("MMDDYYYY");
            }
            else if(timeSpan === "3:6") {
                enddateString = today.add('days', 2).format("MMDDYYYY");
            }
            else if(timeSpan === "1:3") {
                enddateString = today.add('weeks', 1).format("MMDDYYYY");
            }
            else if(timeSpan === "2:3") {
                enddateString = today.add('weeks', 2).format("MMDDYYYY");
            }
            else if(timeSpan === "1:2") {
                enddateString = today.add('months', 1).format("MMDDYYYY");
            }
            else if(timeSpan === "4:2") {
                enddateString = today.add('months', 4).format("MMDDYYYY");
            }
            else if(timeSpan === "6:2") {
                enddateString = today.add('months', 6).format("MMDDYYYY");
            }
            else if(timeSpan === "12:1") {
                enddateString = today.add('years', 1).format("MMDDYYYY");
            }
            if(startdateString !== "" && enddateString !== ""){
                var timeSpanPath = "/start_date/" + startdateString + "/end_date/" + enddateString;
                url = url + timeSpanPath;
            }
        }
        return url;
    }
    
    function updateProtocol(url){
    	
    	if (!url){
    		return url;
    	}
    	
    	if (url.indexOf("://") == -1) {
            url = "http://" + url;
        }
       
        return ('https:' == document.location.protocol ? 'https://' : 'http://') + url.substr((url.indexOf("://")+3));
    	
    }
    
    function getMonth(d) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()];
    }
    
    function getDay(d) {
        return d.getDate();
    }
    
    function getYear(d) {
        return d.getFullYear();
    }
    
    return that;
}();
var eventCacheCal = function() {
    var that = {};
    
    that.list = function(o) {
        nyu$.ajax({
            url: updateProtocol(o.url),
            dataType:"json",
            success: function(data) {
            	
            	//console.log(data);
            	
                var arr = [];
                if(data) {
	                for(var i = 0; i < data.length; i++) {
	                    var cvent = data[i];
	                    var lastModified = new Date(cvent.lastModified); 
	                	arr.push('<li id="CAL'+cvent.name+'">');
	                    arr.push('<div class="cvent-source">');
	                    arr.push('<span class="source"><span class="label">Source:</span>'+cvent.events.calendarSource+'</span>');
	                    arr.push('</div>');
	                    arr.push('<div class="cvent-info">');
	                    arr.push('<span class="info"><span class="label">Last Updated:</span>'+formatDate(lastModified)+'</span>');
	                    arr.push('<span class="info"><span class="label">Calendar Type:</span>'+cvent.events.calendarType+'</span>');
				        arr.push('<span class="info"><span class="label timespan">TimeSpan:</span>'+formatTimeSpan(cvent.events.timespan)+'</span>');
				        arr.push('<span class="info"><span class="label">No of Events to Display:</span>'+cvent.events.numberOfEventsToDisplay+'</span>');
	                    arr.push('</div>');
	                    arr.push('<div class="cvent-action adminbutton">');
	                    arr.push('<span class="clear-cache" data-cachenode="'+cvent.name+'">Clear Cache</span>');
	                    arr.push('</div>');
	                    arr.push('</li>');
	                   
	                }
                }
                if(arr.length == 0){
                	arr.push('<li>');
                    arr.push('<div>');
                    arr.push('<p>No Calendar events Cached. Please check again.</p>');
                    arr.push('</div>');
                    arr.push('</li>');
                }
                nyu$(o.container).html(arr.join(''));
                
                nyu$('.cvent-action .clear-cache').on('click', function() {
            		eventCacheCal.clearCache($(this).data("cachenode")); 
            	});
                
                
            },
            error: function (d) {
               console.log('error-readyState:' + d.readyState);
             }
        });
    };
    
    that.clearCache = function(o){
    	//alert(o);
    	
    	nyu$.ajax({
            url: updateProtocol('/nyuapi/digicomm/cvent/clearcache?cnn='+o),
            dataType:"json",
            method:'POST',
            success: function(data) {
            	nyu$('#CAL'+o).remove();
            },
            error: function (d) {
               console.log('error-readyState:' + d.readyState);
               alert("An error occured while clearing cache node.");
             }
        });
    };
    
    function formatDate(date){
        
        var datetime = date.getDate() + "-"
                + (date.getMonth()+1)  + "-" 
                + date.getFullYear() + " "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
        return datetime;
    }
    
    function formatTimeSpan(ts){
    	t = "undefined";
    	
    	if (ts == '1:6') {
    		t = "1 Day";
    	}else if(ts =='3:6'){
    		t = "3 Days";
    	}else if(ts == "1:3"){
    		t = "1 Week";
    	}else if(ts == "2:3"){
    		t = "2 Weeks";
    	}else if (ts == "1:2"){
    		t = "1 Month";
    	}else if (ts == "4:2"){
    		t = "4 Months";
    	}else if (ts == "6:2"){
    		t = "6 Months";
    	}else if (ts == "12:1"){
    		t = "1 Year";
    	}
    	
    	return t;
    }
    
    
    function updateProtocol(url){
    	
    	if (!url){
    		return url;
    	}
    	
    	if (url.indexOf("://") == -1) {
            url = "http://" + document.location.host + url;
        }
       
        return ('https:' == document.location.protocol ? 'https://' : 'http://') +  url.substr((url.indexOf("://")+3));
    	
    }
    
    
    
    return that;
}();


var cventEventCal = function() {
    var that = {};
    
    that.list = function(o) {
        nyu$.ajax({
            url: updateProtocol(o.url),
            success: function(data) {
            	
            	console.log(data);
            	
                var arr = [];
                if(data.events) {
	                for(var i = 0; i < data.events.length; i++) {
	                    var cvent = data.events[i];
                        var date = moment(cvent.startDateUTCFormatted);
	                    var endDate = moment(cvent.endDateUTCFormatted);

                        if(!  (date || endDate)){
                            continue;
                        }
                        //var dateTz = moment.tz(date,moment.tz.guess());
                        //var endDateTz = moment.tz(endDate,moment.tz.guess());

	                	arr.push('<li>');
	                    arr.push('<div class="upcoming-date">');
	                    arr.push('<span class="upcoming-month">'+date.format("MMM")+'</span>');
	                    arr.push('<span class="upcoming-day">'+date.format("D")+'</span>');
	                    arr.push('<span class="upcoming-year">'+date.format("YYYY")+'</span>');
	                    arr.push('</div>');
	                    arr.push('<div class="event-data">');
	                    arr.push('<a href="'+cvent.urlPath+'" class="event-name">'+cvent.eventTitle+'</a>');
	                    arr.push('<span class="event-text event-time-location">'+ (cvent.isMultiDay ? 'All Day' : date.format("h:mm A") +' to ' + endDate.format("h:mm A") )  + (cvent.location !== null ? ' at ' + cvent.location : '') + '</span>');
	                    //arr.push('<span class="event-text event-summary	">'+(cvent.description !== null ? cvent.description : '')+'</span>');
	                    arr.push('</div>');
	                    arr.push('</li>');
	                   
	                }
                }
                if(arr.length == 0){
                	arr.push('<li>');
                    arr.push('<div>');
                    arr.push('<p>No events scheduled. Please check again.</p>');
                    arr.push('</div>');
                    arr.push('</li>');
                }
                nyu$(o.container).html(arr.join(''));
                
                
            }
        });
    };
    
    
    function formatUrl(url, timeSpan) {
        if(timeSpan){
            var now = new Date(),
                today = moment.unix(now.getTime()/1000),
                startdateString = today.format("MMDDYYYY"),
                enddateString = "";
            
            if(timeSpan === "1:6") {
                enddateString = today.add('days', 1).format("MMDDYYYY");
            }
            else if(timeSpan === "3:6") {
                enddateString = today.add('days', 2).format("MMDDYYYY");
            }
            else if(timeSpan === "1:3") {
                enddateString = today.add('weeks', 1).format("MMDDYYYY");
            }
            else if(timeSpan === "2:3") {
                enddateString = today.add('weeks', 2).format("MMDDYYYY");
            }
            else if(timeSpan === "1:2") {
                enddateString = today.add('months', 1).format("MMDDYYYY");
            }
            else if(timeSpan === "4:2") {
                enddateString = today.add('months', 4).format("MMDDYYYY");
            }
            else if(timeSpan === "6:2") {
                enddateString = today.add('months', 6).format("MMDDYYYY");
            }
            else if(timeSpan === "12:1") {
                enddateString = today.add('years', 1).format("MMDDYYYY");
            }
            if(startdateString !== "" && enddateString !== ""){
                var timeSpanPath = "/start_date/" + startdateString + "/end_date/" + enddateString;
                url = url + timeSpanPath;
            }
        }
        return url;
    }
    
    function updateProtocol(url){
    	
    	if (!url){
    		return url;
    	}
    	
    	if (url.indexOf("://") == -1) {
            url = "http://" + document.location.host + url;
        }
       
        return ('https:' == document.location.protocol ? 'https://' : 'http://') +  url.substr((url.indexOf("://")+3));
    	
    }
    
    
    
    return that;
}();
nyu$( document ).ready(function() {
	if (nyu$('.policy-search-form').length >0  ){

		$(".policy-search-form form").submit(function(e){
			e.preventDefault();

			submitPolicySearch(e);
		});

		nyu$('.policy.search #sortselect').on('selectmenuchange',function(){
			sortPolicySearch(this);
		});

		setPolicySearchFormValues();
	}
});



function submitPolicySearch(elm){
	var form = nyu$('.policy-search-form');

	var href = nyu$(form).data('searchform');
	href += getPolicySearchQueryString();
	window.location = href;	
}



function sortPolicySearch(slct){
	var form = nyu$('.policy-search-form');
	var href = nyu$(form).data('searchform');

	qstr = getPolicySearchQueryString();

	if(slct.value){
		if(qstr){
			qstr = qstr + '&sort='+ slct.value;
		}else{
			qstr = "?sort="+ slct.value;
		}
	}

	href += qstr;
	window.location = href;
}



function getPolicySearchQueryString(){
	var form = nyu$('.policy-search-form');

	var kw = nyu$(form).find('input[name="keyword"]').val();
	var td = nyu$(form).find('.range input[name="to"]').val();
	var fd = nyu$(form).find('.range input[name="from"]').val();

	var ct = nyu$(form).find('select[name="category"]').val();

	var qstr = "";
	var qIsUsed = false;
	if(kw){qstr += (qIsUsed?'&':'?')+'kw='+escape(kw); qIsUsed = true;}
	if(td){qstr += (qIsUsed?'&':'?')+'td='+td; qIsUsed = true;}
	if(fd){qstr += (qIsUsed?'&':'?')+'fd='+fd; qIsUsed = true;}
	if(ct){qstr += (qIsUsed?'&':'?')+'ct='+escape(ct); qIsUsed = true;}

	return qstr;
}



function setPolicySearchFormValues(){
	var form = nyu$('.policy-search-form');
	var searchtoggle = nyu$('.search-toggle');
	
	var kw = getPolicySearchParameterByName("kw");
	if (kw){ nyu$(form).find('input[name="keyword"]').val(kw); }

	var td = getPolicySearchParameterByName("td");
	if (td){nyu$(form).find('.range input[name="to"]').val(td); }

	var fd = getPolicySearchParameterByName("fd");
	if (fd){nyu$(form).find('.range input[name="from"]').val(fd); }

	var ct = getPolicySearchParameterByName("ct");
	if (ct){ nyu$(form).find('select[name="category"]').val(ct); }

	var sort = getPolicySearchParameterByName("sort");
	if (sort){ nyu$('.policy.search #sortselect').val(sort); }
}



function getPolicySearchParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");

	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
		results = regex.exec(url);

	if (!results) return null;
	if (!results[2]) return '';

	return decodeURIComponent(results[2].replace(/\+/g, " "));
}







nyu$( document ).ready(function() {
	if (nyu$('.search-component.nyusearch').length >0  ){
		
		nyu$('.search-component.nyusearch .search-form-submit').on('click', function() {
			submitSiteSearch(this);
		});
		
		nyu$('.search-component.nyusearch .input-container').on("keypress", function(e) {
		     if (e.which == 13) {
		    	 submitSiteSearch(this);
		     }
		});
		
		
		
		nyu$('.search-component.nyusearch .search-toggle .nav-list-item').on('click', function() {
			submitSiteSearchWithType(this);
		});
		
		
		setSiteSearchFormValues();
		

	}
	
	
	
	
});


function submitSiteSearch(btn){
	
	
	var href = window.location.pathname;
	var qs = getSiteSearchQueryString();
	var st = getSearchParameterByName('st');
	
	if(st){
		href += qs + (qs?"&":"?") + "st=" + st;
	} else {
		href += qs;
	}
	
	window.location = href;
	
	
}

function submitSiteSearchWithType(btn){
	var st = $(btn).data('st');
	var href = window.location.pathname
	var qStr = getSiteSearchQueryString();
	
	href += qStr + (qStr?"&":"?") + "st=" + st;
	
	window.location=href;
}

function getSiteSearchQueryString(){
	var form = nyu$('.search-component.nyusearch .search-form');
	
	var search = nyu$(form).find('.search-field').val();
	
	var qstr = "";
	var qIsUsed = false;
	if(search){qstr += (qIsUsed?'&':'?')+'search='+escape(search); qIsUsed = true;}
	
	return qstr;
	
}


function setSiteSearchFormValues(){
	var form = nyu$('.search-component.nyusearch .search-form');
	var searchtoggle = nyu$('.search-component.nyusearch .search-toggle');
	
	var search = getSearchParameterByName("search");
	if (search){
		nyu$(form).find('.search-field').val(search);
	}
	
	
	nyu$(searchtoggle).find('.nav-list-item a').removeClass('current');
	var st = getSearchParameterByName("st");
	if (st){
		if(st == 'web'){
			nyu$(searchtoggle).find('.nav-list-item[data-st="web"] a').addClass('current');
		}else if(st == 'people'){
			nyu$(searchtoggle).find('.nav-list-item[data-st="people"] a').addClass('current');
		}else if(st == 'event'){
			nyu$(searchtoggle).find('.nav-list-item[data-st="event"] a').addClass('current');
		}else if(st == 'office'){
			nyu$(searchtoggle).find('.nav-list-item[data-st="office"] a').addClass('current');
		}
	}else{
		nyu$(searchtoggle).find('.nav-list-item[data-st="web"] a').addClass('current');
	}
	
}




function getSearchParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}







var nyu = window.nyu || {};
nyu = function() {
    var that = {};
    that.locationMap = {
        'nyc': 'New York City',
        'abudhabi': 'Abu Dhabi',
        'shanghai': 'Shanghai',
        'accra': 'Accra',
        'berlin': 'Berlin',
        'buenosaries': 'Buenos Aries',
        'florence': 'Florence',
        'london': 'London',
        'losangeles': 'Los Angeles',
        'madrid': 'Madrid',
        'paris': 'Paris',
        'prague': 'Prague',
        'sydney': 'Sydney',
        'telaviv': 'Tel Aviv',
        'washingtondc': 'Washington DC'
    };
    that.locationMapCityCountry = {
        'nyc': {'name':'New York, NY','tz':'America/New_York'},
        'abudhabi': {'name':'Abu Dhabi, UAE','tz':'Asia/Dubai'},
        'shanghai': {'name':'Shanghai, China','tz':'Asia/Shanghai'},
        'accra': {'name':'Accra, Ghana','tz':'Africa/Accra'},
        'berlin': {'name':'Berlin, Germany','tz':'Europe/Berlin'},
        'buenosaries': {'name':'Buenos Aries, Argentina','tz':'America/Argentina/Buenos_Aires'},
        'florence': {'name':'Florence, Italy','tz':'Europe/Rome'},
        'london': {'name':'London, UK','tz':'Europe/London'},
        'losangeles': {'name':'Los Angeles, CA','tz':'America/New_York'},
        'madrid': {'name':'Madrid, Spain','tz':'Europe/Madrid'},
        'paris': {'name':'Paris, France','tz':'Europe/Paris'},
        'prague': {'name':'Prague, Czech Republic','tz':'Europe/Prague'},
        'sydney': {'name':'Sydney, Australia','tz':'Australia/Sydney'},
        'telaviv': {'name':'Tel Aviv, Israel','tz':'Asia/Tel_Aviv'},
        'washingtondc': {'name':'Washington DC, USA','tz':'America/New_York'}
    };
    
    return that;
}();

var breakPhone = 32;
var breakTablet = 46;
var breakHomeTablet = 51.333333333333336;
var breakDesktop = 62;
var breakDesklg = 80;

// this function will always return the initial font-size of the html element 
var rem = function rem() {
    var html = document.getElementsByTagName('html')[0];

    return function () {
        return parseInt(window.getComputedStyle(html)['fontSize']);
    }
}();

// This function will convert pixel to rem
function toRem(length) {
    return (parseInt(length) / rem());
}


( function() {

	//"use strict";
	$ = nyu$;

	function init_LayoutCtrl() {

		//initiate as false
		window.isMobile = false;

		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) window.isMobile = true;

		window.isChrome = navigator.userAgent.indexOf( "Chrome" ) > -1;
		window.isExplorer = navigator.userAgent.indexOf( "MSIE" ) > -1;
		window.isFirefox = navigator.userAgent.indexOf( "Firefox" ) > -1;
		window.isSafari = navigator.userAgent.indexOf( "Safari" ) > -1;
		window.isOpera = navigator.userAgent.toLowerCase().indexOf( "op" ) > -1;

		if( ( window.isChrome ) && ( window.isSafari ) ) {
			window.isSafari = false;
		}
		if( ( window.isChrome ) && ( window.isOpera ) ) {
			window.isChrome = false;
		}

		window.layouts = {
			"DESKTOP:ALL": 9999999,
			"DESKTOP:NARROW": 1200,
			"TABLET:PORTRAIT": 930,
			"MOBILE:LANDSCAPE": 690,
			"MOBILE:PORTRAIT": 480
		};

		window.layout = {
			label: false,
			device: false,
			orientation: false,
			width: false,
			above:function( label ) { return ( window.layouts[ window.layout.label ] > window.layouts[label] ); },
			below:function( label ) { return ( window.layouts[ window.layout.label ] < window.layouts[label] ); },
			in:function( label ) { return ( window.layout.label == label ); },
			inOrBelow:function( label ) { return window.layout.in( label ) || window.layout.below( label ); },
			inOrAbove:function( label ) { return window.layout.in( label ) || window.layout.above( label ); }
		};

		$( window ).on( "resize", function() {
			var win = $( window ),
				w = win.width(),
				k, l;

			window.layout.width = w;

			for ( k in window.layouts ) {
				if ( window.matchMedia( "(max-width: "+window.layouts[k]+"px)" ).matches ) {
					l = k;
				}
			}

			if( l != window.layout.label ) {
				var b = l.split( ":" );
				window.layout.label = l;
				window.layout.device = b[0];
				window.layout.orientation = b[1];
				win.trigger( "breakpoint", window.layout );
			}

		} ).trigger( "resize" );
	}
	// END init_LayoutCtrl





	function init_pwidths() {
		$( window ).on( "resize", function() {
			$( ".primary-link-promo-container" ).each( function() {
				var me = $( this ),
					single = me.find( " > div" );

				single.width( "" );

				if ( window.isMobile ) {
					var csswidth = single.width(),
						newwidth = csswidth - 5;

					me.css( "display", "block" );
					single.css( "display", "inline-block" );
					single.css( "float", "none" );

					single.width( newwidth );
				} else {
					me.css( "display", "" );
					single.css( "display", "" );
					single.css( "float", "" );
					single.css( "width", "" );

					single.width( "" );
				}
			} );
		} ).resize();
	}
	//END init_pwidths



	function groupByOffset( selector, callback ) {
		// get items
		var $items = $( selector );

		if( $items.length === 0 ) {
			return;
		}

		var itemOffsets = [];
		$items.each( function() {
			var $item = $( this );

			itemOffsets.push( [$item.index(), $item.offset().top] );
		} );

		// group items by offset
		var lastOffset = 0;
		var rows = [];

		for ( var i = 0; i < itemOffsets.length; i++ ) {

			if ( lastOffset != itemOffsets[i][1] ) {
				rows[itemOffsets[i][1]] = [];
			}

			rows[itemOffsets[i][1]].push( itemOffsets[i][0] );
			lastOffset = itemOffsets[i][1];
		}

		callback( rows, selector );
	}
	//END groupByOffset



	function init_Primaryheights() {
		$( window ).on( "resize", function() {
			setTimeout( function() {
				var tabletBp = window.matchMedia( "(min-width:690px)" );

				if ( tabletBp.matches ) {
					groupByOffset( ".primary-link-promo-container > div", function( rows, selector ) {
						var row = Object.keys( rows );

						for ( var i = 0; i < row.length; i++ ) {

							// get max height for each group
							var maxHeight = 0;

							for ( var j = 0; j < rows[row[i]].length; j++ ) {
								var curHeight = $( selector ).eq( rows[row[i]][j] ).height();

								if ( maxHeight < curHeight ) {
									maxHeight = curHeight;
								}
							}
							//maxHeight = maxHeight + 15;

							// assign it to the elements
							for ( var j = 0; j < rows[row[i]].length; j++ ) {
								$( selector ).eq( rows[row[i]][j] ).css( "min-height", maxHeight );
							}
						}
					} );
				} else {
					groupByOffset( ".primary-link-promo-container > div", function( rows, selector ) {
						var row = Object.keys( rows );

						for ( var i = 0; i < row.length; i++ ) {
							// assign it to the elements
							for ( var j = 0; j < rows[row[i]].length; j++ ) {
							  $( selector ).eq( rows[row[i]][j] ).css( "min-height", "auto" );
							}
						}
					} );
				}
			}, 500 );
		} ).resize();
	}
	//END init_Primaryheights



	function init_form() {
		$( ".search-form-submit" ).on( "click", function( e ) {
			e.preventDefault();
		} );
	}
	//END init_form



	function init_introbanner() {
		$( window ).on( 'resize', function() {
			var windowheight = $( window ).height();

			if( $( 'html' ).hasClass( 'aem-AuthorLayer-Edit' ) || $( 'body' ).hasClass( 'aem-AuthorLayer-Preview' ) ) {
				var newheight = 437;
			} else if ( window.layout.above( 'DESKTOP:NARROW' ) ) {
				var newheight = windowheight - 294;
			} else {
				var newheight = "auto";
			}

			$( ".intro-banner-wrapper" ).each( function() {
				var me = $( this ),
					container = me.find( ".intro-banner-image-div" ),
					minheight = me.find( ".content-area" ).height(),
					compareheight = minheight + 50;

				if ( newheight > compareheight ) {
					container.height( newheight );
				} else {
					container.height( "" );
				}
			} );

		} ).resize();

	}
	//END init_introbanner



	function init_calendarevents() {
		$( window ).on( "resize", function() {
			$( ".upcoming-events-wrapper" ).each( function() {
				var me = $( this ),
					parent = me.parent(),
					parentwidth = parent.width();

				if ( parentwidth < 690 ) {
					me.find( "h2" ).css( "font-size", "24px" );

					me.find( ".event-name" ).css( "font-size", "18px" );
					me.find( ".event-text" ).css( ".event-text", "13px" );
					me.find( ".promo-title" ).css( ".event-text", "5px" );
				} else {
					me.find( "h2" ).css( "font-size", "" );

					me.find( ".event-name" ).css( "font-size", "" );
					me.find( ".event-text" ).css( ".event-text", "" );
					me.find( ".promo-title" ).css( ".event-text", "" );
				}
			} );
		} ).resize();
	}
	//END init_calendarevents



	
	



	



	



	




	function formatKeyPeople() {

		// Find Single Bio elements without images set and inherit the universal link color for Bio Name
		var bios = $( ".bio-single" );

		for ( var i = 0; i < bios.length; i++ ) {
			if ( !bios.eq( i ).find( "picture" ).length ) {
				$( ".bio-single h2" ).eq( i ).removeClass( "bio-name" ).addClass( "bio-name-link" );
			}
		}
	}
	//END formatKeyPeople



	function init_SearchPolicy() {

		function checkParentWidth() {
			var psf = $( ".policy-search-form" );
			var w = psf.parent().width();

			if ( w >= 690 ) {
				psf.addClass( "inline" );
			} else {
				psf.removeClass( "inline" );
			}

			if( psf.width() < 215 ) {
				psf.addClass( "small" );
			} else {
				psf.removeClass( "small" );
			}
		}

		checkParentWidth();

		$( window ).on( "resize", function() {
			checkParentWidth();
		} );
	}
	//END init_SearchPolicy

	//In the org chart template, move the sidenav below the main article so that
	//the semantic order matches the visual order
	function init_OrgChartSideNav () {

		if(checkTemplate( 'org-chart' )) {
			const mainArticle = document.getElementById('main-article');
			const sideNav = document.querySelector('.sidenav');
			if( checkSize( 'mobile' )) {
				sideNav.parentNode.insertBefore(mainArticle, sideNav );
			}
			$( window ).on( 'resize', function() {
				if ( !checkSize( 'mobile' ) ) {		
					sideNav.parentNode.insertBefore(sideNav, mainArticle);
				}
				else if( checkSize( 'mobile' )) {
					sideNav.parentNode.insertBefore(mainArticle, sideNav);
				}
			});
		}
	}


	function init_Controllers() {
		init_LayoutCtrl();
		init_SearchCtrl();
		init_HeaderCtrl();
		init_MainNav();
		init_EllipsisCtrl();
		init_Featprofiles();
		// init_homefooter();
		// init_homecover();
		init_feedbacktabs();
		init_cattabs();
		init_feedbackmodal();
		init_homeslider();
		init_videocontainer();
		init_studyAbroadMenu();

		init_admissionsFooter();
	}
	function init_Components() {
		init_Expandables();
		init_Tables();
		init_TableScrollCustom();
		init_Galleries();
		init_Slider();
		init_Seclist();
		// init_Featuredprofiles();
		init_pwidths();
		init_Primaryheights();
		init_form();
		init_introbanner();
		init_calendarevents();
		init_Storyarticleimg();
		init_MobileShoppingCartBrowseToggle();
		init_MobileHideShoppingNav();
		init_NewsSeries();
		init_SearchPolicy();
		init_StudyAbroadFooter();
		init_EventCalListings();
		init_OrgChartSideNav();

		init_RTEAnchors();
		formatKeyPeople();
		topAlignPageElements();
		fillSubNav();
	}

	$( document ).ready( function() {
		init_Urchin();
		init_Controllers();
		init_Components();

		$ = nyu$;
	} );
} () );



if ( $( window.location.hash ).length > 0 ) {
	var target = $( window.location.hash ).attr( "id" );

	window.setTimeout( function() {
		$( "html, body" ).animate( { scrollTop: $( "#" + target ).offset().top-200 }, 0 );
	}, 750 );

	if ( target == "main-content" ) { 
		$("#bypass-main").blur();
		$( "#main-content" ).focus();
	}

}



// Replace from html?
function toggleTopSearches() {
	// $ = nyu$;

	// $( ".top-searches" ).toggle();
}
//END toggleTopSearches






( function() {
	if ( $( ".intro-banner-image-div" ).length ) {
		var shadowHeight = ( $( ".intro-banner-wrapper .content-area" ).outerHeight() + 120 ).toString();

		$( "<style>.intro-banner-wrapper .intro-banner-image-div:after{height:" + shadowHeight + "px}</style>" ).appendTo( "head" );
	}
} ) ();



//looks to be unused
function hoverfix() {
	$ = nyu$;

	var el = this;
	var par = el.parentNode;
	var next = el.nextSibling;

	par.removeChild( el );

	setTimeout( function() {
		par.insertBefore( el, next );
	}, 0 );
}
//END hoverfix



function init_anchors( href ) {
	$ = nyu$;

	href = typeof( href ) == "string" ? href : $( this ).attr( "href" );

	if ( window.matchMedia( "(min-width: 930px)" ) ) {
		var fromTop = 114;
	} else {
		var fromTop = 50;
	}

	if ( href && href.indexOf( "#" ) == 0 ) {
		var $target = $( href );

		if ( $target.length ) {
			$( "html, body" ).animate( { scrollTop: $target.offset().top - fromTop } );

			var $targetId = "#" + $target.attr( "id");

			//focus on global nav button if jumped to
			if ( $target.attr( "id" ) == "global-menu-toggle" ) { 
				$( ".inner-header[data-type=main] #global-menu-toggle" ).focus();

			} else if ( $target.attr( "id" ) == "mobile-global-menu-toggle" ) { 
				$( ".inner-header[data-type=main] #mobile-global-menu-toggle" ).focus();

			} else if ( $target.attr( "id" ) == "main-content" ) { 
				$("#bypass-main").blur();
				$( "#main-content" ).focus();

				addTimedFocus('#main-content');

			} else if ( $target.attr( "id" ) == "main-article" ) { 
				$("#bypass-side").blur();
				$( "#main-article" ).focus();

				addTimedFocus( '#main-article' );
				
			} else{

				if (canFocus($targetId)){
					$targetId.focus();
				} else {
					$targetId.attr('tabindex', '-1').focus();
				}
			}

			if ( history && "pushState" in history ) {
				history.pushState( {}, document.title, window.location.pathname + "#" + $target.attr( "id" ) );

				return false;
			}
		}
	}
}

nyu$( "body" ).on( "click", "a", init_anchors );
//END init_anchors



// Bind all anchors with name attr on load to allow <HTML4 compatibility in HTML5
function init_RTEAnchors() {
	$ = nyu$;

	var RTEanchors = document.querySelectorAll( "a[name]" );

	for ( var i = 0; i < RTEanchors.length; i++ ) {
		RTEanchors[i].setAttribute( "id", RTEanchors[i].name );
	}
}
//END init_RTEAnchors





//looks to be unused
function fix() {
	var el = this;
	var par = el.parentNode;
	var next = el.nextSibling;

	par.removeChild( el );

	setTimeout( function() {
		par.insertBefore( el, next );
	}, 0 );
}
//END fix







function topAlignPageElements() {
	$ = nyu$;

	if ( $( ".content" ).first().first().first().length > 0 ) {
		var topContainer = $( ".content" ).first().first();

		topContainer.css( "margin-top", 0 );
		topContainer.css( "padding-top", 0 );

		topContainer.first().css( "margin-top", 0 );
		topContainer.first().css( "padding-top", 0 );
	}
}
//END topAlignPageElements



function fillSubNav() {
	$ = nyu$;

	if ( $( ".navigation" ).text().trim().length === 0 ) {
		$( ".navigation" ).html( "&nbsp;" );
	}
}
//END fillSubNav

function init_Urchin() {
	var topUrl = window.top.location.href;

	if ( topUrl.indexOf( "/cf#/" ) == -1 ) {
		var UH = UH || [];

		UH.push( [ "_trackPageview" ] );

		( function( d ) {
			var s = d.createElement( "script" );

			s.src = "https://www.nyu.edu/common/js/uh.v72.js";

			d.body.appendChild( s );
		} )
		( document );
	}
}
//END init_Urchin



//Function to the css rule
function checkSize(typeCheck){

	//check if it's mobile or not
	if(typeCheck == "mobile"){
		if(window.matchMedia("(min-width: " + breakDesktop + "rem)").matches){
			return false;
		} else {
			return true;
		}
	}

	//check if it's a more specific breakpoint
	if(typeCheck == "full"){
		if( window.matchMedia("(min-width: " + breakDesklg + "rem)").matches){
			return "breakDesklg";
		} else if( window.matchMedia("(min-width: " + breakDesktop + "rem)").matches){
			return "breakDesktop";
		} else if( window.matchMedia("(min-width: " + breakTablet + "rem)").matches){
			return "breakTablet";
		} else {
			return "breakPhone";
		}
	}
}



//Function to check the template
function checkTemplate(typeCheck){

	switch(typeCheck){
		case ("study-abroad"): 	return ($( ".study-abroad" ).length ? true : false); break;
		case ("alumni-role"): 	return ($( ".alumni-role" ).length ? true : false); break;
		case ("news"): 			return ( ($( ".newslanding" ).length || $( ".category" ).length || $( ".series" ).length) ? true : false); break;
		case ("org-chart") : 	return ( $( ".org-chart" ).length ? true : false); break;
		case ("cal"): 			return ($( ".cal" ).length ? true : false); break;
		default: 				return false; break;
	}

}



function addKeyboardListeners(which){
	$( "body" ).keydown(function(event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		if (which == "feedback-form"){

			if ($( ".feedback-form-component .form-modal" ).css('display') == 'block'){
				if (event.key == "Escape"){
					$( "body" ).css( {
						overflow: "",
						"-webkit-overflow-scrolling": ""
					} );

					$( ".form-modal" ).css( "display", "none" );
					$( "a[href^='#feedback']" ).focus();

					return;
				}

				if ($( ".feedback-form-component .form-modal .f-header-container h2" ).is(':focus') && (event.key == "Tab")){
					if (event.shiftKey){
						event.preventDefault();

						$( ".feedback-form-component .form-modal .cbutton" ).focus();
					}
					return;
				}

				if ($( ".feedback-form-component .form-modal .f-footer-container + .cbutton" ).is(':focus') && (event.key == "Tab")){
					event.preventDefault();
					
					if (event.shiftKey){
						$('.feedback-form-component .form-modal .f-footer-container .close-button').focus();
					} else{
						$( ".feedback-form-component .form-modal .f-header-container h2" ).focus();
					}
					return;
				}

				if( $('#tab-page-feedback').is(':focus') && (event.key == "ArrowRight")){
					event.preventDefault();
					$('#tab-overall-feedback').focus();
					return;
				}
				if( $('#tab-overall-feedback').is(':focus') && (event.key == "ArrowLeft")){
					event.preventDefault();
					$('#tab-page-feedback').focus();
					return;
				}
			}
		}

		if (which == "study-abroad-header"){
			
			if (checkSize("mobile")){
				if($('header.header').hasClass('menu-opened')){
					// Validated
					if (event.key == "Escape"){
						$('header.header').removeClass('menu-opened');
						$('header .inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden', 'true');
						$('.hamburger').attr('aria-expanded','false').focus();
						var isMenuOpen = ($('header.header').hasClass('menu-opened'));
						$('main').attr('aria-hidden', isMenuOpen.toString());
						$('footer').attr('aria-hidden', isMenuOpen.toString());

						// Restore Banner
						$('.inner-header[data-type=mobile] .logo-holder').attr('aria-hidden', isMenuOpen.toString());
						$('.inner-header[data-type=mobile] .main-navigation-search-form').attr('aria-hidden', isMenuOpen.toString());
						$('.inner-header[data-type=mobile] #mobile-global-menu-toggle').attr('aria-hidden', isMenuOpen.toString());

						//for study abroad menu
						$('a.super-navigation-link-title').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
						$('.logo-holder a.logo').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
						$('a.in-this-section-menu-link').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
						$('a.nav-link').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
						$('a.login-nyu-home').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
						$('a.subnav-link').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
						$('.menu-expand').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");

						return;
					}
					
					if ($('.inner-header[data-type="mobile"] .logo').is(':focus') && (event.key == "Tab")){
						
						if (event.shiftKey){
							event.preventDefault();
							$('.header > .hamburger').focus();
						} else {
							event.preventDefault();
							$('.mobile-main-menu .mobile-nav-list > li:first-child .menu-title a').focus();
						}
						return;
					}
					
					if ($('.mobile-main-menu .mobile-nav-list > li:first-child .menu-title a').is(':focus') && (event.key == "Tab")){
						if (event.shiftKey){
							event.preventDefault();
							$('.inner-header[data-type="mobile"] .logo-holder > .logo').focus();
						}
						return;
					}

					// Upper to Lower Nav
					if ($('.mobile-main-menu .mobile-nav-list > li:last-child a').is(':focus') && (event.key == "Tab")){
						if (event.shiftKey){
						} else { 
							event.preventDefault();
							
							$('.main-navigation-menu .in-this-section-menu li:first-child a').focus();
						}
						return;
					}

					if ($('.login-nyu-home').is(':focus') && (event.key == "Tab")){
						event.preventDefault();
						
						if (event.shiftKey){
							$('.mega-menu.menu-contents > .in-this-section > ul > li:last-child a').focus();
						} else {
							//$('.super-navigation-menu  .menu-title a').focus();
							$('a.super-navigation-link-title').focus();
						}
						return;
					}

					if ($('.super-navigation-link-title').is(':focus') && (event.key == "Tab")){
						event.preventDefault();
						
						if (event.shiftKey){
							$('.login-nyu-home').focus();
						} else {
							$('.header > .hamburger').focus();
						}
						return;
					}

					if ($('.header button.hamburger').is(':focus') && (event.key == "Tab")){
						event.preventDefault();
						if (event.shiftKey){
							$('.super-navigation-link-title').focus();
						} else {
							$('.inner-header[data-type="mobile"] .logo').focus();
						}
						return;
					}
					
					// Define tabbing behavior for Lower Nav list links
					if ($('.main-navigation-menu .in-this-section-menu li a').is(':focus') && (event.key == "Tab")){
						event.preventDefault();

						var $focused = $(':focus');
						if (event.shiftKey){

							// Lower to Upper Nav
							if ($('.mega-menu.menu-contents > .in-this-section > ul > li:first-child a').is(':focus')){
								$('.mobile-main-menu .mobile-nav-list > li:last-child a').focus();
							}
							else{
								$focused.parent().prev('li').find('a').focus();
							}
							return;

						} else{
							if ($('.main-navigation-menu .in-this-section-menu li:last-child a').is(':focus')){
								$('.login-nyu-home').focus();
							} else{
								$focused.parent().next('li').find('a').focus();
							}
						}

						return;
					}
				}
				else {
					// Menu isnt open: 
					if ($('.header button.hamburger').is(':focus') && (event.key == "Tab")){
						event.preventDefault();
						if (event.shiftKey){
							$('#mobile-global-menu-toggle').focus();
						} else {
							$('.search-toggle').focus();
						}
						return;
					}

					if ($('.search-toggle').is(':focus') && (event.key == "Tab")){
						event.preventDefault();
						if (event.shiftKey){
							$('.hamburger').focus();
						} else {
							$('#mobile-global-menu-toggle').focus();
						}
						return;
					}
					
					if ($('#mobile-global-menu-toggle').is(':focus') && (event.key == "Tab")){
						
						if (event.shiftKey){
							event.preventDefault();
							$('.search-toggle').focus();
						} 
						return;
					}
					
				}
			} else {

				if ($('.open .mega-menu a').is(':focus')){
					var $focused = $(':focus');

					switch (event.key) {

						//"Up" & "Down" travel through the opened menu
						case "ArrowUp":
							event.preventDefault();

							//if at first menu item in section, jump to next section
							if ($('.open .in-this-section-menu li:first-child a').is(':focus')){
								$('.main-navigation-menu .open .return-menu li:last-child a').focus();
								break;
							}

							//if at first menu item, wrap around
							if ($('.open .return-menu li:first-child a').is(':focus')){
								$('.main-navigation-menu .open .in-this-section-menu li:last-child a').focus();
								break;
							}

							//otherwise, just go to prev
							$focused.parent().prev('li').find('a').focus();
							break;

						case "ArrowDown":
							event.preventDefault();

							//if at last menu item in section, jump to next section
							if ($('.open .return-menu li:last-child a').is(':focus')){
								$('.main-navigation-menu .open .in-this-section-menu li:first-child a').focus();
								break;
							}

							//if at last menu item, wrap around
							if ($('.open .in-this-section-menu li:last-child a').is(':focus')){
								$('.main-navigation-menu .open .return-menu li:first-child a').focus();
								break;
							}

							//otherwise, just go to next
							$focused.parent().next('li').find('a').focus();
							break;

						//leave and close menu
						case "Escape":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('.has-submenu').find($('.main-navigation-menu-link-title')).focus();

							break;

						//jump to next outside link
						case "Tab":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$("#main-navigation-search").focus();

							break;

						//"Home" sends the focus to the first item in the menu
						case "Home":
							event.preventDefault();
							$('.main-navigation-menu .open .return-menu li:first-child a').focus();
							break;

						//"End" sends focus to the last item in the menu
						case "End":
							event.preventDefault();
							$('.open .in-this-section-menu li:last-child a').focus();
							break;
					}

				}  else if ($('.main-navigation-menu-link-title').is(':focus')){
					var $focused = $(':focus');

					switch (event.key) {
						//practically the same as ArrowDown, except no focus
						case "Space":
						case " ":
						case "Spacebar":
						//"Down” on main navigation items opens the menu and selects the first item in the menu
						case "ArrowDown":
							event.preventDefault();

							$focused.closest('li').addClass('open');
							if (!checkSize("mobile")){
								$focused.closest('li').find('.menu-title a').attr('aria-expanded', 'true');
							}
							$focused.closest('li').find('.menu-contents').attr('aria-expanded', 'true');

							$('.main-navigation-menu .open .return-menu li:first-child a').focus();
							break;
					}
				}
			}
		}



		if (which == "header"){
			if (checkSize("mobile")){

				if ($('header.header').hasClass('menu-opened')){

                    // MARK: Sep 30, 2021

					if (event.key == "Escape"){
						$('header.header').removeClass('menu-opened');
						$('.hamburger').attr('aria-expanded','false').focus();
						$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden', 'true');
						var isMenuOpen = ($('header.header').hasClass('menu-opened'));
						$('main').attr('aria-hidden', isMenuOpen.toString());
						$('footer').attr('aria-hidden', isMenuOpen.toString());
						// Restore Banner
						$('.inner-header[data-type=mobile] .logo-holder').attr('aria-hidden', isMenuOpen.toString());
						$('.inner-header[data-type=mobile] .main-navigation-search-form').attr('aria-hidden', isMenuOpen.toString());
						$('.inner-header[data-type=mobile] #mobile-global-menu-toggle').attr('aria-hidden', isMenuOpen.toString());
						return;
					}

					//if .hamburger is focused on
					if ($('.hamburger').is(':focus') && (event.key == "Tab")){
						event.preventDefault();
						if (event.shiftKey){
							$('.login-nyu-home').focus();
						} else { 
							$('.logo').focus();
						}
						return;
					}

					//if .logo is focused on
					if ($('.logo').is(':focus') && (event.key == "Tab")){
						if (event.shiftKey){
							event.preventDefault();
							$('.hamburger').focus();
						} else { 
							$('.main-navigation-menu ').focus();
						}
						return;
					}

					//if .main-navigation-menu first link is focused on
					if ($('.main-navigation-menu .has-submenu:last-child .menu-expand').is(':focus') && (event.key == "Tab")){
						if (!(event.shiftKey)){

							if (!$('.main-navigation-menu .has-submenu:last-child').hasClass('open')){
								event.preventDefault();
								$('.super-navigation-menu .has-submenu:first-child .menu-title a').focus();
							}
						}
						return;
					}

					//if .main-navigation-menu last link is focused on
					if ($('.main-navigation-menu .has-submenu:last-child .in-this-section-menu li:last-child a').is(':focus') && (event.key == "Tab")){
						if (!(event.shiftKey)){
							event.preventDefault();
							$('.super-navigation-menu .has-submenu:first-child .menu-title a').focus();
						}
						return;
					}

					//if .super-navigation-menu first link is focused on
					if ($('.super-navigation-menu .has-submenu:first-child .menu-title a').is(':focus') && (event.key == "Tab")){
						
						if (event.shiftKey){
							event.preventDefault();

							if ($('.main-navigation-menu .has-submenu:last-child').hasClass('open')){
								$('.main-navigation-menu .has-submenu:last-child .in-this-section-menu li:last-child a').focus();
							} else{
								$('.main-navigation-menu .has-submenu:last-child .menu-expand').focus();
							}
						}
						return;
					}

					//if .login-nyu-home is focused on - forward goes to logo
					if ($('.login-nyu-home').is(':focus') && (event.key == "Tab")){
						event.preventDefault();

						if (event.shiftKey){
							if ($('.super-navigation-menu .has-submenu:last-child').hasClass('open')){
								$('.super-navigation-menu .has-submenu:last-child .supernav-sublink:last-child a').focus();
							} else{
								$('.super-navigation-menu .has-submenu:last-child .menu-expand').focus();
							}

						} else { 
							$('.hamburger').focus();
						}
						return;
					}

				} else {
					switch (event.key) {
						case "Tab":
							// event.preventDefault();

							if ($('.hamburger').is(':focus')){
								if (!event.shiftKey){
									event.preventDefault();
									$('.logo').focus();
								}
								return;
							}

							if ($('.logo').is(':focus')){
								event.preventDefault();
								if (event.shiftKey){
									$('.hamburger').focus();
								} else {
									$('.search-toggle').focus();
								}
								return;
							}

							if ($('.header .search-toggle').is(':focus')){
								event.preventDefault();
								if (event.shiftKey){
									$('.logo').focus();
								} else {
									if($('header').hasClass('show-search')){
										$('#main-navigation-search').focus();
									}
									else {
										$('#mobile-global-menu-toggle').focus();
									}
								}
								return;
							}

							if ($('.main-navigation-search-form .main-navigation-search-form-text-field').is(':focus')){
								event.preventDefault();
								
								if (event.shiftKey){
									$('.inner-header[data-type=mobile] .search-toggle').focus();
								} else {
									if($('header').hasClass('show-search')){
										$('#global-menu-toggle').focus();
									}
									else{
										$('.header .search-toggle').focus();
									}
								}
								
								return;
							}

							if ($('#mobile-global-menu-toggle').is(':focus')){
								event.preventDefault();

								if (event.shiftKey){
									switch(true) {
										case $('.inner-header[data-type=mobile] #mobile-navigation-search').attr('aria-hidden') != 'true' : 
											$('.inner-header[data-type=mobile] #mobile-navigation-search').focus(); 
										break;
										default: $('.header button.search-toggle').focus();
									}
				
								} else {
									// Determine next element after navigation that screen reader should announce - templates are not uniform
									
									var firstAvailableFocusable;
									var allAvailableFocusable = [];
									var focusableItems = $('select:not([disabled]):not([aria-hidden]), a[href]:not([disabled]):not([aria-hidden]),  button:not([disabled]):not([aria-hidden]), input[type=text]:not([disabled]):not([aria-hidden])');

									var childPool = $('main > *:not(.breadcrumb-wrapper):not(#alertContainer):visible:not([disabled]):not([aria-hidden])');

									if ( $('#alertContainer a').length > 0) {
									
										$('#alertContainer a').focus(); 
									
									} else if( $('.alumni-band.top-band').length > 0 ){ 
									
										$('.alumni-band.top-band a').focus(); 
									
									} else{

										var firstAvailableFocusable;
										var allAvailableFocusable = [];
										var focusableItems = $('select:not([disabled]):not([aria-hidden]):not([style*="display: none"]), a[href]:not([disabled]):not([aria-hidden]):not([style*="display: none"]),  button:not([disabled]):not([aria-hidden]):not([style*="display: none"]), summary:not([disabled]):not([aria-hidden]):not([style*="display: none"]), input[type=text]:not([disabled]):not([aria-hidden]):not([style*="display: none"])');

										childPool.each(function(index){
											var currentFocusableItems = $(this).find(focusableItems);
											Array.prototype.push.apply(allAvailableFocusable, currentFocusableItems);

										});

										if (!allAvailableFocusable.length){

											if(checkTemplate("study-abroad")){
												$(".study-abroad-footer a.on-this-site-menu-link:first").focus();
											} else{
												$(".main-footer a.footer-top-menu-link:first").focus();
											}
										} else{ 
											allAvailableFocusable[0].focus();
										}
									}
								}
								return;
							}
				
							if($('#alertContainer a').is(':focus') || $('#alertContainer').is(':focus')){
								if (event.shiftKey){
									event.preventDefault();
									$('#mobile-global-menu-toggle').focus();
								}
								return;
							}

							// if ($('header.header + div .title').is(':focus')){
								
							// 	if (event.shiftKey){
							// 		event.preventDefault();
							// 		$('#global-menu-toggle').focus();
							// 	}
							// 	return;
							// }
							break;
					}
				}
			} else {

				if ($('.open .mega-menu a').is(':focus')){
					var $focused = $(':focus');

					switch (event.key) {
						//"Left" & "Right" now close the open menu and send the focus to the next main navigation link						
						case "ArrowLeft":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('.has-submenu').prev('li').find($('.main-navigation-menu-link-title')).focus();
							break;
						
						case "ArrowRight":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('.has-submenu').next('li').find($('.main-navigation-menu-link-title')).focus();
							break;

						//"Up" & "Down" travel through the opened menu
						case "ArrowUp":
							event.preventDefault();

							if ($('.main-navigation-menu .open .overview').is(':focus')){
								$('.open .related-links-menu li:last-child a').focus();
								break;
							}

							if ($('.open .related-links-menu li:first-child a').is(':focus')){
								$('.open .in-this-section-menu li:last-child a').focus();
								break;
							}

							if ($('.open .in-this-section-menu li:first-child a').is(':focus')){
								if (checkSize("full") == "breakDesklg"){
									$('.main-navigation-menu .open .overview').focus();
								} else{
									$('.open .related-links-menu li:last-child a').focus();
								}
								break;
							}

							$focused.parent().prev('li').find('a').focus();
							break;
						case "ArrowDown":
							event.preventDefault();

							if ($('.main-navigation-menu .open .overview').is(':focus')){
								$('.open .in-this-section-menu li:first-child a').focus();
								break;
							}

							if ($('.open .related-links-menu li:last-child a').is(':focus')){
								if (checkSize("full") == "breakDesklg"){
									$('.main-navigation-menu .open .overview').focus();
								} else{
									$('.open .in-this-section-menu li:first-child a').focus();
								}
								break;
							}

							if ($('.open .in-this-section-menu li:last-child a').is(':focus')){
								$('.open .related-links-menu li:first-child a').focus();
								break;
							}

							$focused.parent().next('li').find('a').focus();
							break;

						//leave and close menu
						case "Escape":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('.has-submenu').find($('.main-navigation-menu-link-title')).focus();
							break;

						//jump to next outside link
						case "Tab":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							if (event.shiftKey) {
								$focused.closest('.has-submenu').prev('li').find($('.main-navigation-menu-link-title')).focus();
							} else {
								$focused.closest('.has-submenu').next('li').find($('.main-navigation-menu-link-title')).focus();
							}
							break;

						//"Home" sends the focus to the first item in the menu (different between desktop and large desktop)
						case "Home":
							event.preventDefault();
							if (checkSize("full") == "breakDesklg"){
								$('.main-navigation-menu .open .overview').focus();
							} else{
								$('.main-navigation-menu .open .in-this-section-menu li:first-child a').focus();
							}
							break;

						//"End" sends focus to the last item in the menu
						case "End":
							event.preventDefault();
							$('.open .related-links-menu li:last-child a').focus();
							break;
					}
				} else if ($('.main-navigation-menu-link-title').is(':focus')){
					var $focused = $(':focus');
				
					switch (event.key) {
						// same as ArrowDown
						case "Space":
						case " ":
						case "Spacebar":
						//Down” on main navigation items opens the menu and selects the first item in the menu
						case "ArrowDown":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('li').addClass('open');
							if (!checkSize("mobile")){
								$focused.closest('li').find('.menu-title a').attr('aria-expanded', 'true');
							}
							$focused.closest('li').find('.menu-contents').attr('aria-expanded', 'true');

							if (checkSize("full") == "breakDesklg"){
								$('.main-navigation-menu .open .overview').focus();
							} else{
								$('.main-navigation-menu .open .in-this-section-menu li:first-child a').focus();
							}
							break;
						
						//"Left" & "Right" now close the open menu and send the focus to the next main navigation link
						case "ArrowLeft":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('li').prev('li').find($('.main-navigation-menu-link-title')).focus();
							break;
						
						case "ArrowRight":
							event.preventDefault();
							if (!checkSize("mobile")){
								$('.main-navigation-menu .open').find('.menu-title a').attr('aria-expanded', 'false');
							}
							$('.main-navigation-menu .open').find('.menu-contents').attr('aria-expanded', 'false');
							$('.main-navigation-menu .open').removeClass('open');

							$focused.closest('li').next('li').find($('.main-navigation-menu-link-title')).focus();
							break;
					}
				}
			}
		}
	});
}





function canFocus( $el ) {
    if ( $el.is( ":hidden" ) || $el.is( ":disabled" ) ) {
        return false;
    }

    var tabIndex = +$el.attr( "tabindex" );
    tabIndex = isNaN( tabIndex ) ? -1 : tabIndex;
    return $el.is( ":input, a[href], area[href], iframe" ) || tabIndex > -1;
}



function addTimedFocus( $which ) {
	$( $which ).append("<div class='timed-focus'></div>");

	setTimeout(function() {
		$( '.timed-focus' ).fadeOut( 1000, function() {
			$( this ).remove();
		});
	}, 500);
}
/* nyuseventy js here */
nyu$( document ).ready(function() {

	nyu$('.pagination-controls').on('click', '.list-button', function() {
		var url = $(this).data('url');
		var curUrl = window.location.href;
		if(curUrl.indexOf("p=")>-1){
			curUrl=curUrl.substring(0,curUrl.indexOf("p=")) + ((curUrl.indexOf("&", curUrl.indexOf("p=")+1) > -1 ) ? curUrl.substring(curUrl.indexOf("&", curUrl.indexOf("p=")+1)) : "" );
		}
		
		if(curUrl.indexOf("?")> -1){
			if(! url.indexOf("?") > 0){
				url = url + "?";
			}
			var curParams = curUrl.substring(curUrl.indexOf("?")+1);
			url = url + (curParams.startsWith("&") ? curParams : "&" + curParams );
		}
		
		window.location.href= url;
		
	}); 

	nyu$("time.timeago").timeago();

	nyu$('.video-container-youtube iframe').height(nyu$('.video-container-youtube iframe').width() * .56);
	nyu$('.video-container-stream iframe').height(nyu$('.video-container-stream iframe').width() * .56);
	nyu$('.video-container-vimeo iframe').height(nyu$('.video-container-vimeo iframe').width() * .56);
	
	nyu$('.news.series .top-wrapper .shortcuts-component select').on('change', function(){
		handleNewsSeriesSwitch(this);
	});
	
	nyu$('.shortcuts-component .shortcuts-select').on( "selectmenuchange", function( event, ui ) { 
    	window.location = this.value;
	});
	


	/** resize the cq containers based on the rendered components on home page */
	if(nyu$('.cq-wcm-edit .nyu-home-template').length > 0 || nyu$('.cq-wcm-preview .nyu-home-template').length > 0){
		nyu$('.nyu-home-template .stream .block.single, .nyu-home-template .stream .block.double-h').each(function(index, element) {
		    nyu$(this).parent().height(nyu$('.nyu-home-template .stream').height()/2);
		});
	}

	nyu$('.header .main-navigation-wrapper .logo, .footer-navigation-content .nyuhome').on('click', function(event){
		var href = nyu$(event.target).data('homepath');
		if(href){
			window.location = href;
		}
	});
	

	nyu$('.parbase.subject .copyValues').on('click', function() {
		nyu$( '.parbase.subject input[name="subjectMapVal[]"]' ).each(function( index ) {
			if(!this.value){
				nyu$(this).val(nyu$(this).parent().parent().find('input[name="subjectMapKey[]"]').val());
			}
		});
	});
	
	nyu$('.parbase.location .copyValues').on('click', function() {
		nyu$( '.parbase.location input[name="locationMapVal[]"]' ).each(function( index ) {
			if(!this.value){
				nyu$(this).val(nyu$(this).parent().parent().find('input[name="locationMapKey[]"]').val());
			}
		});
	});

	nyu$('#main-search-form-submit').on('click', function(e) {
		e.stopPropagation();
		submitSiteSearchFromNav('#main-navigation-search');
	});

	nyu$('#mobile-search-form-submit').on('click', function(e) {
		e.stopPropagation();
		submitSiteSearchFromNav('#mobile-navigation-search');
	});
	
	nyu$('#main-navigation-search').on("keypress", function(e) {
		e.stopPropagation();
	     if (e.which == 13) {
	    	 e.preventDefault();
	    	 submitSiteSearchFromNav('#main-navigation-search');
	     }
	});
	
	nyu$('#mobile-navigation-search').on("keypress", function(e) {
		e.stopPropagation();
	     if (e.which == 13) {
	    	 e.preventDefault();
	    	 submitSiteSearchFromNav('#mobile-navigation-search');
	     }
	});
	
	nyu$('.error-404 .sitesearch-form .main-navigation-search-form-submit').on('click', function(e) {
		e.stopPropagation();
		submitSiteSearchFromNav('.error-404 .sitesearch-form .search-form-field');
	});
	
	nyu$('.error-404 .sitesearch-form .search-form-field').on("keypress", function(e) {
		e.stopPropagation();
	     if (e.which == 13) {
	    	 submitSiteSearchFromNav('.error-404 .sitesearch-form .search-form-field');
	     }

	});
	

	
	
});


function convertTemperature(temperature, degree) {
    if (degree === "C") {
        return Math.round(temperature * 9 / 5 + 32);
    }
    else	if (degree === "F") {
        return Math.round((temperature -32) * 5 / 9);
    }
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + '' + ampm.toUpperCase();
    return strTime;
}

function handleNewsSeriesSwitch(slct){
	if(slct && slct.value){
		window.location = slct.value;
	}
}

function submitSiteSearchFromNav(sel){
	
	
		var href = "https://search.nyu.edu/s/search.html";
	
	var search = nyu$(sel).val();
	
	var qstr = "";
	var qIsUsed = false;
	if(search){
		qstr += (qIsUsed?'&':'?')+'query='+escape(search)+"&collection=nyu-all-meta-v02"; 
		qIsUsed = true;
		href += qstr;
		window.location.href = href;
	}
	
}


/**
 * @see http://stackoverflow.com/q/7616461/940217
 * @return {number}
 * 
 * usage: var hash = new String("some string to be hashed").hashCode();
 */
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

    

/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
/*! Gecko-Picture - v1.0
 * https://github.com/scottjehl/picturefill/tree/3.0/src/plugins/gecko-picture
 * Firefox's early picture implementation (prior to FF41) is static and does
 * not react to viewport changes. This tiny module fixes this.
 */
(function(window) {
	/*jshint eqnull:true */
	var ua = navigator.userAgent;

	if ( window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45) ) {
		addEventListener("resize", (function() {
			var timer;

			var dummySrc = document.createElement("source");

			var fixRespimg = function(img) {
				var source, sizes;
				var picture = img.parentNode;

				if (picture.nodeName.toUpperCase() === "PICTURE") {
					source = dummySrc.cloneNode();

					picture.insertBefore(source, picture.firstElementChild);
					setTimeout(function() {
						picture.removeChild(source);
					});
				} else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
					img._pfLastSize = img.offsetWidth;
					sizes = img.sizes;
					img.sizes += ",100vw";
					setTimeout(function() {
						img.sizes = sizes;
					});
				}
			};

			var findPictureImgs = function() {
				var i;
				var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
				for (i = 0; i < imgs.length; i++) {
					fixRespimg(imgs[i]);
				}
			};
			var onResize = function() {
				clearTimeout(timer);
				timer = setTimeout(findPictureImgs, 99);
			};
			var mq = window.matchMedia && matchMedia("(orientation: landscape)");
			var init = function() {
				onResize();

				if (mq && mq.addListener) {
					mq.addListener(onResize);
				}
			};

			dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

			if (/^[c|i]|d$/.test(document.readyState || "")) {
				init();
			} else {
				document.addEventListener("DOMContentLoaded", init);
			}

			return onResize;
		})());
	}
})(window);

/*! Picturefill - v3.0.2
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt;
 *  License: MIT
 */

(function( window, document, undefined ) {
	// Enable strict mode
	"use strict";

	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
	document.createElement( "picture" );

	var warn, eminpx, alwaysCheckWDescriptor, evalId;
	// local object for method references and testing exposure
	var pf = {};
	var isSupportTestReady = false;
	var noop = function() {};
	var image = document.createElement( "img" );
	var getImgAttr = image.getAttribute;
	var setImgAttr = image.setAttribute;
	var removeImgAttr = image.removeAttribute;
	var docElem = document.documentElement;
	var types = {};
	var cfg = {
		//resource selection:
		algorithm: ""
	};
	var srcAttr = "data-pfsrc";
	var srcsetAttr = srcAttr + "set";
	// ua sniffing is done for undetectable img loading features,
	// to do some non crucial perf optimizations
	var ua = navigator.userAgent;
	var supportAbort = (/rident/).test(ua) || ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35 );
	var curSrcProp = "currentSrc";
	var regWDesc = /\s+\+?\d+(e\d+)?w/;
	var regSize = /(\([^)]+\))?\s*(.+)/;
	var setOptions = window.picturefillCFG;
	/**
	 * Shortcut property for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
	// baseStyle also used by getEmValue (i.e.: width: 1em is important)
	var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
	var fsCss = "font-size:100%!important;";
	var isVwDirty = true;

	var cssCache = {};
	var sizeLengthCache = {};
	var DPR = window.devicePixelRatio;
	var units = {
		px: 1,
		"in": 96
	};
	var anchor = document.createElement( "a" );
	/**
	 * alreadyRun flag used for setOptions. is it true setOptions will reevaluate
	 * @type {boolean}
	 */
	var alreadyRun = false;

	// Reusable, non-"g" Regexes

	// (Don't use \s, to avoid matching non-breaking space.)
	var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
	    regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
	    regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
	    regexTrailingCommas = /[,]+$/,
	    regexNonNegativeInteger = /^\d+$/,

	    // ( Positive or negative or unsigned integers or decimals, without or without exponents.
	    // Must include at least one digit.
	    // According to spec tests any decimal point must be followed by a digit.
	    // No leading plus sign is allowed.)
	    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
	    regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

	var on = function(obj, evt, fn, capture) {
		if ( obj.addEventListener ) {
			obj.addEventListener(evt, fn, capture || false);
		} else if ( obj.attachEvent ) {
			obj.attachEvent( "on" + evt, fn);
		}
	};

	/**
	 * simple memoize function:
	 */

	var memoize = function(fn) {
		var cache = {};
		return function(input) {
			if ( !(input in cache) ) {
				cache[ input ] = fn(input);
			}
			return cache[ input ];
		};
	};

	// UTILITY FUNCTIONS

	// Manual is faster than RegEx
	// http://jsperf.com/whitespace-character/5
	function isSpace(c) {
		return (c === "\u0020" || // space
		        c === "\u0009" || // horizontal tab
		        c === "\u000A" || // new line
		        c === "\u000C" || // form feed
		        c === "\u000D");  // carriage return
	}

	/**
	 * gets a mediaquery and returns a boolean or gets a css length and returns a number
	 * @param css mediaqueries or css length
	 * @returns {boolean|number}
	 *
	 * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
	 */
	var evalCSS = (function() {

		var regLength = /^([\d\.]+)(em|vw|px)$/;
		var replace = function() {
			var args = arguments, index = 0, string = args[0];
			while (++index in args) {
				string = string.replace(args[index], args[++index]);
			}
			return string;
		};

		var buildStr = memoize(function(css) {

			return "return " + replace((css || "").toLowerCase(),
				// interpret `and`
				/\band\b/g, "&&",

				// interpret `,`
				/,/g, "||",

				// interpret `min-` as >=
				/min-([a-z-\s]+):/g, "e.$1>=",

				// interpret `max-` as <=
				/max-([a-z-\s]+):/g, "e.$1<=",

				//calc value
				/calc([^)]+)/g, "($1)",

				// interpret css values
				/(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)",
				//make eval less evil
				/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, ""
			) + ";";
		});

		return function(css, length) {
			var parsedLength;
			if (!(css in cssCache)) {
				cssCache[css] = false;
				if (length && (parsedLength = css.match( regLength ))) {
					cssCache[css] = parsedLength[ 1 ] * units[parsedLength[ 2 ]];
				} else {
					/*jshint evil:true */
					try{
						cssCache[css] = new Function("e", buildStr(css))(units);
					} catch(e) {}
					/*jshint evil:false */
				}
			}
			return cssCache[css];
		};
	})();

	var setResolution = function( candidate, sizesattr ) {
		if ( candidate.w ) { // h = means height: || descriptor.type === 'h' do not handle yet...
			candidate.cWidth = pf.calcListLength( sizesattr || "100vw" );
			candidate.res = candidate.w / candidate.cWidth ;
		} else {
			candidate.res = candidate.d;
		}
		return candidate;
	};

	/**
	 *
	 * @param opt
	 */
	var picturefill = function( opt ) {

		if (!isSupportTestReady) {return;}

		var elements, i, plen;

		var options = opt || {};

		if ( options.elements && options.elements.nodeType === 1 ) {
			if ( options.elements.nodeName.toUpperCase() === "IMG" ) {
				options.elements =  [ options.elements ];
			} else {
				options.context = options.elements;
				options.elements =  null;
			}
		}

		elements = options.elements || pf.qsa( (options.context || document), ( options.reevaluate || options.reselect ) ? pf.sel : pf.selShort );

		if ( (plen = elements.length) ) {

			pf.setupRun( options );
			alreadyRun = true;

			// Loop through all elements
			for ( i = 0; i < plen; i++ ) {
				pf.fillImg(elements[ i ], options);
			}

			pf.teardownRun( options );
		}
	};

	/**
	 * outputs a warning for the developer
	 * @param {message}
	 * @type {Function}
	 */
	warn = ( window.console && console.warn ) ?
		function( message ) {
			console.warn( message );
		} :
		noop
	;

	if ( !(curSrcProp in image) ) {
		curSrcProp = "src";
	}

	// Add support for standard mime types.
	types[ "image/jpeg" ] = true;
	types[ "image/gif" ] = true;
	types[ "image/png" ] = true;

	function detectTypeSupport( type, typeUri ) {
		// based on Modernizr's lossless img-webp test
		// note: asynchronous
		var image = new window.Image();
		image.onerror = function() {
			types[ type ] = false;
			picturefill();
		};
		image.onload = function() {
			types[ type ] = image.width === 1;
			picturefill();
		};
		image.src = typeUri;
		return "pending";
	}

	// test svg support
	types[ "image/svg+xml" ] = document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#Image", "1.1" );

	/**
	 * updates the internal vW property with the current viewport width in px
	 */
	function updateMetrics() {

		isVwDirty = false;
		DPR = window.devicePixelRatio;
		cssCache = {};
		sizeLengthCache = {};

		pf.DPR = DPR || 1;

		units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
		units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

		units.vw = units.width / 100;
		units.vh = units.height / 100;

		evalId = [ units.height, units.width, DPR ].join("-");

		units.em = pf.getEmValue();
		units.rem = units.em;
	}

	function chooseLowRes( lowerValue, higherValue, dprValue, isCached ) {
		var bonusFactor, tooMuch, bonus, meanDensity;

		//experimental
		if (cfg.algorithm === "saveData" ){
			if ( lowerValue > 2.7 ) {
				meanDensity = dprValue + 1;
			} else {
				tooMuch = higherValue - dprValue;
				bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

				bonus = tooMuch * bonusFactor;

				if (isCached) {
					bonus += 0.1 * bonusFactor;
				}

				meanDensity = lowerValue + bonus;
			}
		} else {
			meanDensity = (dprValue > 1) ?
				Math.sqrt(lowerValue * higherValue) :
				lowerValue;
		}

		return meanDensity > dprValue;
	}

	function applyBestCandidate( img ) {
		var srcSetCandidates;
		var matchingSet = pf.getSet( img );
		var evaluated = false;
		if ( matchingSet !== "pending" ) {
			evaluated = evalId;
			if ( matchingSet ) {
				srcSetCandidates = pf.setRes( matchingSet );
				pf.applySetCandidate( srcSetCandidates, img );
			}
		}
		img[ pf.ns ].evaled = evaluated;
	}

	function ascendingSort( a, b ) {
		return a.res - b.res;
	}

	function setSrcToCur( img, src, set ) {
		var candidate;
		if ( !set && src ) {
			set = img[ pf.ns ].sets;
			set = set && set[set.length - 1];
		}

		candidate = getCandidateForSrc(src, set);

		if ( candidate ) {
			src = pf.makeUrl(src);
			img[ pf.ns ].curSrc = src;
			img[ pf.ns ].curCan = candidate;

			if ( !candidate.res ) {
				setResolution( candidate, candidate.set.sizes );
			}
		}
		return candidate;
	}

	function getCandidateForSrc( src, set ) {
		var i, candidate, candidates;
		if ( src && set ) {
			candidates = pf.parseSet( set );
			src = pf.makeUrl(src);
			for ( i = 0; i < candidates.length; i++ ) {
				if ( src === pf.makeUrl(candidates[ i ].url) ) {
					candidate = candidates[ i ];
					break;
				}
			}
		}
		return candidate;
	}

	function getAllSourceElements( picture, candidates ) {
		var i, len, source, srcset;

		// SPEC mismatch intended for size and perf:
		// actually only source elements preceding the img should be used
		// also note: don't use qsa here, because IE8 sometimes doesn't like source as the key part in a selector
		var sources = picture.getElementsByTagName( "source" );

		for ( i = 0, len = sources.length; i < len; i++ ) {
			source = sources[ i ];
			source[ pf.ns ] = true;
			srcset = source.getAttribute( "srcset" );

			// if source does not have a srcset attribute, skip
			if ( srcset ) {
				candidates.push( {
					srcset: srcset,
					media: source.getAttribute( "media" ),
					type: source.getAttribute( "type" ),
					sizes: source.getAttribute( "sizes" )
				} );
			}
		}
	}

	/**
	 * Srcset Parser
	 * By Alex Bell |  MIT License
	 *
	 * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
	 *
	 * Based super duper closely on the reference algorithm at:
	 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
	 */

	// 1. Let input be the value passed to this algorithm.
	// (TO-DO : Explain what "set" argument is here. Maybe choose a more
	// descriptive & more searchable name.  Since passing the "set" in really has
	// nothing to do with parsing proper, I would prefer this assignment eventually
	// go in an external fn.)
	function parseSrcset(input, set) {

		function collectCharacters(regEx) {
			var chars,
			    match = regEx.exec(input.substring(pos));
			if (match) {
				chars = match[ 0 ];
				pos += chars.length;
				return chars;
			}
		}

		var inputLength = input.length,
		    url,
		    descriptors,
		    currentDescriptor,
		    state,
		    c,

		    // 2. Let position be a pointer into input, initially pointing at the start
		    //    of the string.
		    pos = 0,

		    // 3. Let candidates be an initially empty source set.
		    candidates = [];

		/**
		* Adds descriptor properties to a candidate, pushes to the candidates array
		* @return undefined
		*/
		// (Declared outside of the while loop so that it's only created once.
		// (This fn is defined before it is used, in order to pass JSHINT.
		// Unfortunately this breaks the sequencing of the spec comments. :/ )
		function parseDescriptors() {

			// 9. Descriptor parser: Let error be no.
			var pError = false,

			// 10. Let width be absent.
			// 11. Let density be absent.
			// 12. Let future-compat-h be absent. (We're implementing it now as h)
			    w, d, h, i,
			    candidate = {},
			    desc, lastChar, value, intVal, floatVal;

			// 13. For each descriptor in descriptors, run the appropriate set of steps
			// from the following list:
			for (i = 0 ; i < descriptors.length; i++) {
				desc = descriptors[ i ];

				lastChar = desc[ desc.length - 1 ];
				value = desc.substring(0, desc.length - 1);
				intVal = parseInt(value, 10);
				floatVal = parseFloat(value);

				// If the descriptor consists of a valid non-negative integer followed by
				// a U+0077 LATIN SMALL LETTER W character
				if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

					// If width and density are not both absent, then let error be yes.
					if (w || d) {pError = true;}

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes.
					// Otherwise, let width be the result.
					if (intVal === 0) {pError = true;} else {w = intVal;}

				// If the descriptor consists of a valid floating-point number followed by
				// a U+0078 LATIN SMALL LETTER X character
				} else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

					// If width, density and future-compat-h are not all absent, then let error
					// be yes.
					if (w || d || h) {pError = true;}

					// Apply the rules for parsing floating-point number values to the descriptor.
					// If the result is less than zero, let error be yes. Otherwise, let density
					// be the result.
					if (floatVal < 0) {pError = true;} else {d = floatVal;}

				// If the descriptor consists of a valid non-negative integer followed by
				// a U+0068 LATIN SMALL LETTER H character
				} else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

					// If height and density are not both absent, then let error be yes.
					if (h || d) {pError = true;}

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes. Otherwise, let future-compat-h
					// be the result.
					if (intVal === 0) {pError = true;} else {h = intVal;}

				// Anything else, Let error be yes.
				} else {pError = true;}
			} // (close step 13 for loop)

			// 15. If error is still no, then append a new image source to candidates whose
			// URL is url, associated with a width width if not absent and a pixel
			// density density if not absent. Otherwise, there is a parse error.
			if (!pError) {
				candidate.url = url;

				if (w) { candidate.w = w;}
				if (d) { candidate.d = d;}
				if (h) { candidate.h = h;}
				if (!h && !d && !w) {candidate.d = 1;}
				if (candidate.d === 1) {set.has1x = true;}
				candidate.set = set;

				candidates.push(candidate);
			}
		} // (close parseDescriptors fn)

		/**
		* Tokenizes descriptor properties prior to parsing
		* Returns undefined.
		* (Again, this fn is defined before it is used, in order to pass JSHINT.
		* Unfortunately this breaks the logical sequencing of the spec comments. :/ )
		*/
		function tokenize() {

			// 8.1. Descriptor tokeniser: Skip whitespace
			collectCharacters(regexLeadingSpaces);

			// 8.2. Let current descriptor be the empty string.
			currentDescriptor = "";

			// 8.3. Let state be in descriptor.
			state = "in descriptor";

			while (true) {

				// 8.4. Let c be the character at position.
				c = input.charAt(pos);

				//  Do the following depending on the value of state.
				//  For the purpose of this step, "EOF" is a special character representing
				//  that position is past the end of input.

				// In descriptor
				if (state === "in descriptor") {
					// Do the following, depending on the value of c:

				  // Space character
				  // If current descriptor is not empty, append current descriptor to
				  // descriptors and let current descriptor be the empty string.
				  // Set state to after descriptor.
					if (isSpace(c)) {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
							currentDescriptor = "";
							state = "after descriptor";
						}

					// U+002C COMMA (,)
					// Advance position to the next character in input. If current descriptor
					// is not empty, append current descriptor to descriptors. Jump to the step
					// labeled descriptor parser.
					} else if (c === ",") {
						pos += 1;
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

					// U+0028 LEFT PARENTHESIS (()
					// Append c to current descriptor. Set state to in parens.
					} else if (c === "\u0028") {
						currentDescriptor = currentDescriptor + c;
						state = "in parens";

					// EOF
					// If current descriptor is not empty, append current descriptor to
					// descriptors. Jump to the step labeled descriptor parser.
					} else if (c === "") {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

					// Anything else
					// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}
				// (end "in descriptor"

				// In parens
				} else if (state === "in parens") {

					// U+0029 RIGHT PARENTHESIS ())
					// Append c to current descriptor. Set state to in descriptor.
					if (c === ")") {
						currentDescriptor = currentDescriptor + c;
						state = "in descriptor";

					// EOF
					// Append current descriptor to descriptors. Jump to the step labeled
					// descriptor parser.
					} else if (c === "") {
						descriptors.push(currentDescriptor);
						parseDescriptors();
						return;

					// Anything else
					// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}

				// After descriptor
				} else if (state === "after descriptor") {

					// Do the following, depending on the value of c:
					// Space character: Stay in this state.
					if (isSpace(c)) {

					// EOF: Jump to the step labeled descriptor parser.
					} else if (c === "") {
						parseDescriptors();
						return;

					// Anything else
					// Set state to in descriptor. Set position to the previous character in input.
					} else {
						state = "in descriptor";
						pos -= 1;

					}
				}

				// Advance position to the next character in input.
				pos += 1;

			// Repeat this step.
			} // (close while true loop)
		}

		// 4. Splitting loop: Collect a sequence of characters that are space
		//    characters or U+002C COMMA characters. If any U+002C COMMA characters
		//    were collected, that is a parse error.
		while (true) {
			collectCharacters(regexLeadingCommasOrSpaces);

			// 5. If position is past the end of input, return candidates and abort these steps.
			if (pos >= inputLength) {
				return candidates; // (we're done, this is the sole return path)
			}

			// 6. Collect a sequence of characters that are not space characters,
			//    and let that be url.
			url = collectCharacters(regexLeadingNotSpaces);

			// 7. Let descriptors be a new empty list.
			descriptors = [];

			// 8. If url ends with a U+002C COMMA character (,), follow these substeps:
			//		(1). Remove all trailing U+002C COMMA characters from url. If this removed
			//         more than one character, that is a parse error.
			if (url.slice(-1) === ",") {
				url = url.replace(regexTrailingCommas, "");
				// (Jump ahead to step 9 to skip tokenization and just push the candidate).
				parseDescriptors();

			//	Otherwise, follow these substeps:
			} else {
				tokenize();
			} // (close else of step 8)

		// 16. Return to the step labeled splitting loop.
		} // (Close of big while loop.)
	}

	/*
	 * Sizes Parser
	 *
	 * By Alex Bell |  MIT License
	 *
	 * Non-strict but accurate and lightweight JS Parser for the string value <img sizes="here">
	 *
	 * Reference algorithm at:
	 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-sizes-attribute
	 *
	 * Most comments are copied in directly from the spec
	 * (except for comments in parens).
	 *
	 * Grammar is:
	 * <source-size-list> = <source-size># [ , <source-size-value> ]? | <source-size-value>
	 * <source-size> = <media-condition> <source-size-value>
	 * <source-size-value> = <length>
	 * http://www.w3.org/html/wg/drafts/html/master/embedded-content.html#attr-img-sizes
	 *
	 * E.g. "(max-width: 30em) 100vw, (max-width: 50em) 70vw, 100vw"
	 * or "(min-width: 30em), calc(30vw - 15px)" or just "30vw"
	 *
	 * Returns the first valid <css-length> with a media condition that evaluates to true,
	 * or "100vw" if all valid media conditions evaluate to false.
	 *
	 */

	function parseSizes(strValue) {

		// (Percentage CSS lengths are not allowed in this case, to avoid confusion:
		// https://html.spec.whatwg.org/multipage/embedded-content.html#valid-source-size-list
		// CSS allows a single optional plus or minus sign:
		// http://www.w3.org/TR/CSS2/syndata.html#numbers
		// CSS is ASCII case-insensitive:
		// http://www.w3.org/TR/CSS2/syndata.html#characters )
		// Spec allows exponential notation for <number> type:
		// http://dev.w3.org/csswg/css-values/#numbers
		var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;

		// (This is a quick and lenient test. Because of optional unlimited-depth internal
		// grouping parens and strict spacing rules, this could get very complicated.)
		var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;

		var i;
		var unparsedSizesList;
		var unparsedSizesListLength;
		var unparsedSize;
		var lastComponentValue;
		var size;

		// UTILITY FUNCTIONS

		//  (Toy CSS parser. The goals here are:
		//  1) expansive test coverage without the weight of a full CSS parser.
		//  2) Avoiding regex wherever convenient.
		//  Quick tests: http://jsfiddle.net/gtntL4gr/3/
		//  Returns an array of arrays.)
		function parseComponentValues(str) {
			var chrctr;
			var component = "";
			var componentArray = [];
			var listArray = [];
			var parenDepth = 0;
			var pos = 0;
			var inComment = false;

			function pushComponent() {
				if (component) {
					componentArray.push(component);
					component = "";
				}
			}

			function pushComponentArray() {
				if (componentArray[0]) {
					listArray.push(componentArray);
					componentArray = [];
				}
			}

			// (Loop forwards from the beginning of the string.)
			while (true) {
				chrctr = str.charAt(pos);

				if (chrctr === "") { // ( End of string reached.)
					pushComponent();
					pushComponentArray();
					return listArray;
				} else if (inComment) {
					if ((chrctr === "*") && (str[pos + 1] === "/")) { // (At end of a comment.)
						inComment = false;
						pos += 2;
						pushComponent();
						continue;
					} else {
						pos += 1; // (Skip all characters inside comments.)
						continue;
					}
				} else if (isSpace(chrctr)) {
					// (If previous character in loop was also a space, or if
					// at the beginning of the string, do not add space char to
					// component.)
					if ( (str.charAt(pos - 1) && isSpace( str.charAt(pos - 1) ) ) || !component ) {
						pos += 1;
						continue;
					} else if (parenDepth === 0) {
						pushComponent();
						pos +=1;
						continue;
					} else {
						// (Replace any space character with a plain space for legibility.)
						chrctr = " ";
					}
				} else if (chrctr === "(") {
					parenDepth += 1;
				} else if (chrctr === ")") {
					parenDepth -= 1;
				} else if (chrctr === ",") {
					pushComponent();
					pushComponentArray();
					pos += 1;
					continue;
				} else if ( (chrctr === "/") && (str.charAt(pos + 1) === "*") ) {
					inComment = true;
					pos += 2;
					continue;
				}

				component = component + chrctr;
				pos += 1;
			}
		}

		function isValidNonNegativeSourceSizeValue(s) {
			if (regexCssLengthWithUnits.test(s) && (parseFloat(s) >= 0)) {return true;}
			if (regexCssCalc.test(s)) {return true;}
			// ( http://www.w3.org/TR/CSS2/syndata.html#numbers says:
			// "-0 is equivalent to 0 and is not a negative number." which means that
			// unitless zero and unitless negative zero must be accepted as special cases.)
			if ((s === "0") || (s === "-0") || (s === "+0")) {return true;}
			return false;
		}

		// When asked to parse a sizes attribute from an element, parse a
		// comma-separated list of component values from the value of the element's
		// sizes attribute (or the empty string, if the attribute is absent), and let
		// unparsed sizes list be the result.
		// http://dev.w3.org/csswg/css-syntax/#parse-comma-separated-list-of-component-values

		unparsedSizesList = parseComponentValues(strValue);
		unparsedSizesListLength = unparsedSizesList.length;

		// For each unparsed size in unparsed sizes list:
		for (i = 0; i < unparsedSizesListLength; i++) {
			unparsedSize = unparsedSizesList[i];

			// 1. Remove all consecutive <whitespace-token>s from the end of unparsed size.
			// ( parseComponentValues() already omits spaces outside of parens. )

			// If unparsed size is now empty, that is a parse error; continue to the next
			// iteration of this algorithm.
			// ( parseComponentValues() won't push an empty array. )

			// 2. If the last component value in unparsed size is a valid non-negative
			// <source-size-value>, let size be its value and remove the component value
			// from unparsed size. Any CSS function other than the calc() function is
			// invalid. Otherwise, there is a parse error; continue to the next iteration
			// of this algorithm.
			// http://dev.w3.org/csswg/css-syntax/#parse-component-value
			lastComponentValue = unparsedSize[unparsedSize.length - 1];

			if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
				size = lastComponentValue;
				unparsedSize.pop();
			} else {
				continue;
			}

			// 3. Remove all consecutive <whitespace-token>s from the end of unparsed
			// size. If unparsed size is now empty, return size and exit this algorithm.
			// If this was not the last item in unparsed sizes list, that is a parse error.
			if (unparsedSize.length === 0) {
				return size;
			}

			// 4. Parse the remaining component values in unparsed size as a
			// <media-condition>. If it does not parse correctly, or it does parse
			// correctly but the <media-condition> evaluates to false, continue to the
			// next iteration of this algorithm.
			// (Parsing all possible compound media conditions in JS is heavy, complicated,
			// and the payoff is unclear. Is there ever an situation where the
			// media condition parses incorrectly but still somehow evaluates to true?
			// Can we just rely on the browser/polyfill to do it?)
			unparsedSize = unparsedSize.join(" ");
			if (!(pf.matchesMedia( unparsedSize ) ) ) {
				continue;
			}

			// 5. Return size and exit this algorithm.
			return size;
		}

		// If the above algorithm exhausts unparsed sizes list without returning a
		// size value, return 100vw.
		return "100vw";
	}

	// namespace
	pf.ns = ("pf" + new Date().getTime()).substr(0, 9);

	// srcset support test
	pf.supSrcset = "srcset" in image;
	pf.supSizes = "sizes" in image;
	pf.supPicture = !!window.HTMLPictureElement;

	// UC browser does claim to support srcset and picture, but not sizes,
	// this extended test reveals the browser does support nothing
	if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
		(function(image2) {
			image.srcset = "data:,a";
			image2.src = "data:,a";
			pf.supSrcset = image.complete === image2.complete;
			pf.supPicture = pf.supSrcset && pf.supPicture;
		})(document.createElement("img"));
	}

	// Safari9 has basic support for sizes, but does't expose the `sizes` idl attribute
	if (pf.supSrcset && !pf.supSizes) {

		(function() {
			var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
			var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
			var img = document.createElement("img");
			var test = function() {
				var width = img.width;

				if (width === 2) {
					pf.supSizes = true;
				}

				alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

				isSupportTestReady = true;
				// force async
				setTimeout(picturefill);
			};

			img.onload = test;
			img.onerror = test;
			img.setAttribute("sizes", "9px");

			img.srcset = width1 + " 1w," + width2 + " 9w";
			img.src = width1;
		})();

	} else {
		isSupportTestReady = true;
	}

	// using pf.qsa instead of dom traversing does scale much better,
	// especially on sites mixing responsive and non-responsive images
	pf.selShort = "picture>img,img[srcset]";
	pf.sel = pf.selShort;
	pf.cfg = cfg;

	/**
	 * Shortcut property for `devicePixelRatio` ( for easy overriding in tests )
	 */
	pf.DPR = (DPR  || 1 );
	pf.u = units;

	// container of supported mime types that one might need to qualify before using
	pf.types =  types;

	pf.setSize = noop;

	/**
	 * Gets a string and returns the absolute URL
	 * @param src
	 * @returns {String} absolute URL
	 */

	pf.makeUrl = memoize(function(src) {
		anchor.href = src;
		return anchor.href;
	});

	/**
	 * Gets a DOM element or document and a selctor and returns the found matches
	 * Can be extended with jQuery/Sizzle for IE7 support
	 * @param context
	 * @param sel
	 * @returns {NodeList|Array}
	 */
	pf.qsa = function(context, sel) {
		return ( "querySelector" in context ) ? context.querySelectorAll(sel) : [];
	};

	/**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 * wether native or pf.mMQ is used will be decided lazy on first call
	 * @returns {boolean}
	 */
	pf.matchesMedia = function() {
		if ( window.matchMedia && (matchMedia( "(min-width: 0.1em)" ) || {}).matches ) {
			pf.matchesMedia = function( media ) {
				return !media || ( matchMedia( media ).matches );
			};
		} else {
			pf.matchesMedia = pf.mMQ;
		}

		return pf.matchesMedia.apply( this, arguments );
	};

	/**
	 * A simplified matchMedia implementation for IE8 and IE9
	 * handles only min-width/max-width with px or em values
	 * @param media
	 * @returns {boolean}
	 */
	pf.mMQ = function( media ) {
		return media ? evalCSS(media) : true;
	};

	/**
	 * Returns the calculated length in css pixel from the given sourceSizeValue
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 * intended Spec mismatches:
	 * * Does not check for invalid use of CSS functions
	 * * Does handle a computed length of 0 the same as a negative and therefore invalid value
	 * @param sourceSizeValue
	 * @returns {Number}
	 */
	pf.calcLength = function( sourceSizeValue ) {

		var value = evalCSS(sourceSizeValue, true) || false;
		if (value < 0) {
			value = false;
		}

		return value;
	};

	/**
	 * Takes a type string and checks if its supported
	 */

	pf.supportsType = function( type ) {
		return ( type ) ? types[ type ] : true;
	};

	/**
	 * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
	 * @param sourceSizeStr
	 * @returns {*}
	 */
	pf.parseSize = memoize(function( sourceSizeStr ) {
		var match = ( sourceSizeStr || "" ).match(regSize);
		return {
			media: match && match[1],
			length: match && match[2]
		};
	});

	pf.parseSet = function( set ) {
		if ( !set.cands ) {
			set.cands = parseSrcset(set.srcset, set);
		}
		return set.cands;
	};

	/**
	 * returns 1em in css px for html/body default size
	 * function taken from respondjs
	 * @returns {*|number}
	 */
	pf.getEmValue = function() {
		var body;
		if ( !eminpx && (body = document.body) ) {
			var div = document.createElement( "div" ),
				originalHTMLCSS = docElem.style.cssText,
				originalBodyCSS = body.style.cssText;

			div.style.cssText = baseStyle;

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.cssText = fsCss;
			body.style.cssText = fsCss;

			body.appendChild( div );
			eminpx = div.offsetWidth;
			body.removeChild( div );

			//also update eminpx before returning
			eminpx = parseFloat( eminpx, 10 );

			// restore the original values
			docElem.style.cssText = originalHTMLCSS;
			body.style.cssText = originalBodyCSS;

		}
		return eminpx || 16;
	};

	/**
	 * Takes a string of sizes and returns the width in pixels as a number
	 */
	pf.calcListLength = function( sourceSizeListStr ) {
		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
		//
		//                           or (min-width:30em) calc(30% - 15px)
		if ( !(sourceSizeListStr in sizeLengthCache) || cfg.uT ) {
			var winningLength = pf.calcLength( parseSizes( sourceSizeListStr ) );

			sizeLengthCache[ sourceSizeListStr ] = !winningLength ? units.width : winningLength;
		}

		return sizeLengthCache[ sourceSizeListStr ];
	};

	/**
	 * Takes a candidate object with a srcset property in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, res is calculated
	 */
	pf.setRes = function( set ) {
		var candidates;
		if ( set ) {

			candidates = pf.parseSet( set );

			for ( var i = 0, len = candidates.length; i < len; i++ ) {
				setResolution( candidates[ i ], set.sizes );
			}
		}
		return candidates;
	};

	pf.setRes.res = setResolution;

	pf.applySetCandidate = function( candidates, img ) {
		if ( !candidates.length ) {return;}
		var candidate,
			i,
			j,
			length,
			bestCandidate,
			curSrc,
			curCan,
			candidateSrc,
			abortCurSrc;

		var imageData = img[ pf.ns ];
		var dpr = pf.DPR;

		curSrc = imageData.curSrc || img[curSrcProp];

		curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);

		// if we have a current source, we might either become lazy or give this source some advantage
		if ( curCan && curCan.set === candidates[ 0 ].set ) {

			// if browser can abort image request and the image has a higher pixel density than needed
			// and this image isn't downloaded yet, we skip next part and try to save bandwidth
			abortCurSrc = (supportAbort && !img.complete && curCan.res - 0.1 > dpr);

			if ( !abortCurSrc ) {
				curCan.cached = true;

				// if current candidate is "best", "better" or "okay",
				// set it to bestCandidate
				if ( curCan.res >= dpr ) {
					bestCandidate = curCan;
				}
			}
		}

		if ( !bestCandidate ) {

			candidates.sort( ascendingSort );

			length = candidates.length;
			bestCandidate = candidates[ length - 1 ];

			for ( i = 0; i < length; i++ ) {
				candidate = candidates[ i ];
				if ( candidate.res >= dpr ) {
					j = i - 1;

					// we have found the perfect candidate,
					// but let's improve this a little bit with some assumptions ;-)
					if (candidates[ j ] &&
						(abortCurSrc || curSrc !== pf.makeUrl( candidate.url )) &&
						chooseLowRes(candidates[ j ].res, candidate.res, dpr, candidates[ j ].cached)) {

						bestCandidate = candidates[ j ];

					} else {
						bestCandidate = candidate;
					}
					break;
				}
			}
		}

		if ( bestCandidate ) {

			candidateSrc = pf.makeUrl( bestCandidate.url );

			imageData.curSrc = candidateSrc;
			imageData.curCan = bestCandidate;

			if ( candidateSrc !== curSrc ) {
				pf.setSrc( img, bestCandidate );
			}
			pf.setSize( img );
		}
	};

	pf.setSrc = function( img, bestCandidate ) {
		var origWidth;
		img.src = bestCandidate.url;

		// although this is a specific Safari issue, we don't want to take too much different code paths
		if ( bestCandidate.set.type === "image/svg+xml" ) {
			origWidth = img.style.width;
			img.style.width = (img.offsetWidth + 1) + "px";

			// next line only should trigger a repaint
			// if... is only done to trick dead code removal
			if ( img.offsetWidth + 1 ) {
				img.style.width = origWidth;
			}
		}
	};

	pf.getSet = function( img ) {
		var i, set, supportsType;
		var match = false;
		var sets = img [ pf.ns ].sets;

		for ( i = 0; i < sets.length && !match; i++ ) {
			set = sets[i];

			if ( !set.srcset || !pf.matchesMedia( set.media ) || !(supportsType = pf.supportsType( set.type )) ) {
				continue;
			}

			if ( supportsType === "pending" ) {
				set = supportsType;
			}

			match = set;
			break;
		}

		return match;
	};

	pf.parseSets = function( element, parent, options ) {
		var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

		var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
		var imageData = element[ pf.ns ];

		if ( imageData.src === undefined || options.src ) {
			imageData.src = getImgAttr.call( element, "src" );
			if ( imageData.src ) {
				setImgAttr.call( element, srcAttr, imageData.src );
			} else {
				removeImgAttr.call( element, srcAttr );
			}
		}

		if ( imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset ) {
			srcsetAttribute = getImgAttr.call( element, "srcset" );
			imageData.srcset = srcsetAttribute;
			srcsetParsed = true;
		}

		imageData.sets = [];

		if ( hasPicture ) {
			imageData.pic = true;
			getAllSourceElements( parent, imageData.sets );
		}

		if ( imageData.srcset ) {
			imageSet = {
				srcset: imageData.srcset,
				sizes: getImgAttr.call( element, "sizes" )
			};

			imageData.sets.push( imageSet );

			isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");

			// add normal src as candidate, if source has no w descriptor
			if ( !isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x ) {
				imageSet.srcset += ", " + imageData.src;
				imageSet.cands.push({
					url: imageData.src,
					d: 1,
					set: imageSet
				});
			}

		} else if ( imageData.src ) {
			imageData.sets.push( {
				srcset: imageData.src,
				sizes: null
			} );
		}

		imageData.curCan = null;
		imageData.curSrc = undefined;

		// if img has picture or the srcset was removed or has a srcset and does not support srcset at all
		// or has a w descriptor (and does not support sizes) set support to false to evaluate
		imageData.supported = !( hasPicture || ( imageSet && !pf.supSrcset ) || (isWDescripor && !pf.supSizes) );

		if ( srcsetParsed && pf.supSrcset && !imageData.supported ) {
			if ( srcsetAttribute ) {
				setImgAttr.call( element, srcsetAttr, srcsetAttribute );
				element.srcset = "";
			} else {
				removeImgAttr.call( element, srcsetAttr );
			}
		}

		if (imageData.supported && !imageData.srcset && ((!imageData.src && element.src) ||  element.src !== pf.makeUrl(imageData.src))) {
			if (imageData.src === null) {
				element.removeAttribute("src");
			} else {
				element.src = imageData.src;
			}
		}

		imageData.parsed = true;
	};

	pf.fillImg = function(element, options) {
		var imageData;
		var extreme = options.reselect || options.reevaluate;

		// expando for caching data on the img
		if ( !element[ pf.ns ] ) {
			element[ pf.ns ] = {};
		}

		imageData = element[ pf.ns ];

		// if the element has already been evaluated, skip it
		// unless `options.reevaluate` is set to true ( this, for example,
		// is set to true when running `picturefill` on `resize` ).
		if ( !extreme && imageData.evaled === evalId ) {
			return;
		}

		if ( !imageData.parsed || options.reevaluate ) {
			pf.parseSets( element, element.parentNode, options );
		}

		if ( !imageData.supported ) {
			applyBestCandidate( element );
		} else {
			imageData.evaled = evalId;
		}
	};

	pf.setupRun = function() {
		if ( !alreadyRun || isVwDirty || (DPR !== window.devicePixelRatio) ) {
			updateMetrics();
		}
	};

	// If picture is supported, well, that's awesome.
	if ( pf.supPicture ) {
		picturefill = noop;
		pf.fillImg = noop;
	} else {

		 // Set up picture polyfill by polling the document
		(function() {
			var isDomReady;
			var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

			var run = function() {
				var readyState = document.readyState || "";

				timerId = setTimeout(run, readyState === "loading" ? 200 :  999);
				if ( document.body ) {
					pf.fillImgs();
					isDomReady = isDomReady || regReady.test(readyState);
					if ( isDomReady ) {
						clearTimeout( timerId );
					}

				}
			};

			var timerId = setTimeout(run, document.body ? 9 : 99);

			// Also attach picturefill on resize and readystatechange
			// http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
			var debounce = function(func, wait) {
				var timeout, timestamp;
				var later = function() {
					var last = (new Date()) - timestamp;

					if (last < wait) {
						timeout = setTimeout(later, wait - last);
					} else {
						timeout = null;
						func();
					}
				};

				return function() {
					timestamp = new Date();

					if (!timeout) {
						timeout = setTimeout(later, wait);
					}
				};
			};
			var lastClientWidth = docElem.clientHeight;
			var onResize = function() {
				isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
				lastClientWidth = docElem.clientHeight;
				if ( isVwDirty ) {
					pf.fillImgs();
				}
			};

			on( window, "resize", debounce(onResize, 99 ) );
			on( document, "readystatechange", run );
		})();
	}

	pf.picturefill = picturefill;
	//use this internally for easy monkey patching/performance testing
	pf.fillImgs = picturefill;
	pf.teardownRun = noop;

	/* expose methods for testing */
	picturefill._ = pf;

	window.picturefillCFG = {
		pf: pf,
		push: function(args) {
			var name = args.shift();
			if (typeof pf[name] === "function") {
				pf[name].apply(pf, args);
			} else {
				cfg[name] = args[0];
				if (alreadyRun) {
					pf.fillImgs( { reselect: true } );
				}
			}
		}
	};

	while (setOptions && setOptions.length) {
		window.picturefillCFG.push(setOptions.shift());
	}

	/* expose picturefill */
	window.picturefill = picturefill;

	/* expose picturefill */
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// CommonJS, just export
		module.exports = picturefill;
	} else if ( typeof define === "function" && define.amd ) {
		// AMD support
		define( "picturefill", function() { return picturefill; } );
	}

	// IE8 evals this sync, so it must be the last thing we do
	if ( !pf.supPicture ) {
		types[ "image/webp" ] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==" );
	}

} )( window, document );

nyu$( document ).ready(function() {
	
    $ = nyu$;

    var vHeight = $( window ).height();
    var vWidth = $( window ).width();
    var vSize = vWidth + ' x ' + vHeight;

    $( "#page-feedback-submit" ).click(function() {
        $( "#page-feedback-form input[name=pageLocation]" ).val(window.location.pathname);
        $( "#page-feedback-form input[name=viewportSize]" ).val(vSize);
        $( "#page-feedback-form" )[0].submit();
    });
    $( "#overall-feedback-submit" ).click(function() {
        $( "#overall-feedback-form input[name=pageLocation]" ).val(window.location.pathname);
        $( "#overall-feedback-form input[name=viewportSize]" ).val(vSize);
        $( "#overall-feedback-form" )[0].submit();
    });

    
	
	$('#page-feedback-submit').on("click", function(){
        $('body').css({
            overflow: '',
            '-webkit-overflow-scrolling': ''
        })
        $('.ui-radio').unbind('mouseup.radio touchend.radio')
        
		var me = $(this),
			modal = me.parents('.form-modal');
			
			modal.css("display","none");
			
	});	
	$('#page-feedback-submit').on("click", function(){
        $('body').css({
            overflow: '',
            '-webkit-overflow-scrolling': ''
        })
        $('.ui-radio').unbind('mouseup.radio touchend.radio')


		var me = $(this),
			modal = me.parents('.form-modal');
			
			modal.css("display","none");
			
	});
	$('#overall-feedback-submit').on("click", function(){
        $('body').css({
            overflow: '',
            '-webkit-overflow-scrolling': ''
        })
        $('.ui-radio').unbind('mouseup.radio touchend.radio')
        
		var me = $(this),
			modal = me.parents('.form-modal');
			
			modal.css("display","none");
			
	});	
	$('#overall-feedback-submit').on("click", function(){
        $('body').css({
            overflow: '',
            '-webkit-overflow-scrolling': ''
        })
        $('.ui-radio').unbind('mouseup.radio touchend.radio')


		var me = $(this),
			modal = me.parents('.form-modal');
			
			modal.css("display","none");
			
	});
		
});

console.log('Feedback Modal Module has been mounted.')

function init_feedbackmodal( ) {
	$( "#feedback" ).on( "click", function( e ) {
		e.stopPropagation();

		openFeedbackModal();
	} );

	$( ".feedback-form-component .close-button" ).on( "click", function() {
		
		closeFeedbackModal();
	} );

	$( ".feedback-form-component .cbutton" ).on( "click", function() {

		closeFeedbackModal();
	} );
}
//END init_feedbackmodal



function openFeedbackModal(){
	$( "body" ).css( {
		overflow: "hidden",
		"-webkit-overflow-scrolling": "touch"
	} );

	$( ".feedback-form-component .form-modal" ).css( "display", "block" );

	//timeout for safari 
	setTimeout(function(){
		$( ".feedback-form-component .form-modal .f-header-container h2" ).focus();
	}, 50);
}



function closeFeedbackModal(){
	$( "body" ).css( {
		overflow: "",
		"-webkit-overflow-scrolling": ""
	} );
				
	$( ".form-modal" ).css( "display", "none" );
	$( "a[href^='#feedback']" ).focus();
}



function init_feedbacktabs() {
	$( ".ftab" ).click( function() {
		var me = $( this ),
			// rel = $( this.rel ),
			tabs = me.parents( ".tabs" );

		tabs.find( ".active" ).removeClass( "active" );
		me.parent().addClass( "active" );

		var whichTab = '#' + $(this).attr('aria-controls');

		$( ".tab-content-container" ).find( ".tab-content-active" ).removeClass( "tab-content-active" );
		$(whichTab).addClass( "tab-content-active" );
		// rel.addClass( "tab-content-active" );
	} );

	addKeyboardListeners("feedback-form");
}
//END init_feedbacktabs
console.log('Expandable Module has been mounted.');

function init_Expandables() {

	$( "details summary a" ).click( function( event ) {
		event.preventDefault();

		window.location = $( this ).attr( "href" );
	} );
	

	//basic details
	$( "details:not(.mobile-only) summary" ).each( function( index ) {

		//add wrapper
		var $wrapper = $( this ).nextAll().wrapAll( "<div id='details-content"+ index + "''></div>" ).parent();
		if($( this ).nextAll().length>0) {
			//for accessability - tell aria which element this controls
			$( this ).attr( "aria-controls", "details-content"+ index );
		}
		
		// Hide elements that are not open by default
		if( !$( this ).parent( "details" ).attr("open")){
			$wrapper.hide();
		}

		$( this ).click( function( event ) {
			event.preventDefault();

			if( $( this ).parent( "details" ).attr( "open" ) ) {

				// Toggle aria-expanded
				$( this ).attr( "aria-expanded", "false" ); 

				$wrapper.slideUp( "fast", function() {

					// Remove the open attribute after sliding so, so the animation is visible in browsers supporting the <details> element
					$( this ).parent( "details" ).removeAttr( "open" );
				} );
			} else {

				// Add the open attribute before sliding down, so the animation is visible in browsers supporting the <details> element
				$( this ).parent( "details" ).attr( "open", true );
				
				// Toggle aria-expanded
				$( this ).attr( "aria-expanded", "true" );

				$wrapper.slideDown( "fast" );
		 	}
	   } );
	} );



	//only for select templates
	$(".nyureference .nyuexpandable").each( function(index) {
		var prevRef = $( this ).parent().parent().prev(".nyureference");

		if ( prevRef.has( ".nyuexpandable" ).length ){
			$( this ).removeClass( "expandable-top-element" );

			var nextRef = $( this ).parent().parent().next(".nyureference");

			if ( nextRef.has( ".nyuexpandable" ).length ){
				$( this ).addClass( "expandable-middle-element" );
			} else{
				$( this ).addClass( "expandable-bottom-element" );
			}
		}
	} );


	//for expandables that are only expandable on mobile and open on bigger sizes

	$( "details.mobile-only summary" ).each( function( index ) {
		var $wrapper = $( this ).nextAll().wrapAll( "<div id='details-mobile"+ index + "''></div>" ).parent();

		$( this ).attr( "aria-controls", "details-mobile"+ index );

		if( !$( this ).parent( "details" ).attr("open")){
			$wrapper.hide();
		}

		$( this ).click( function( event ) {
			event.preventDefault();

			if (checkSize("mobile")){

				if( $( this ).parent( "details" ).attr( "open" ) ) {
					$( this ).attr( "aria-expanded", "false" ); 
					
					$wrapper.slideUp( "fast", function() {
						$( this ).parent( "details" ).removeAttr( "open" );
					});

				} else {

					$( this ).parent( "details" ).attr( "open", true );
					$( this ).attr( "aria-expanded", "true" );
					$wrapper.slideDown( "fast" );
			 	}
			}
		} );
	} );

	//set details.mobile-only at current moment
	if (checkSize("full") == "breakPhone"){
		$( "details.mobile-only" ).attr( "open", false );
		$( "details.mobile-only summary" ).attr( "aria-expanded", "false" );
		$( "details.mobile-only summary + *" ).show();
		$( "details.mobile-only summary" ).attr( "aria-disabled", "false" );
	} else{
		$( "details.mobile-only" ).attr( "open", true );
		$( "details.mobile-only summary" ).attr( "aria-expanded", "true" );
		$( "details.mobile-only summary + *" ).show();
		$( "details.mobile-only summary" ).attr( "aria-disabled", "true" );
	}

	//open details.mobile-only when not mobile, close when it is
	$( window ).on( "resize", function() {
		if (checkSize("full") == "breakPhone"){
			$( "details.mobile-only" ).attr( "open", false );
			$( "details.mobile-only summary" ).attr( "aria-expanded", "false" );
			$( "details.mobile-only summary + *" ).show();
			$( "details.mobile-only summary" ).attr( "aria-disabled", "false" );
		} else{
			$( "details.mobile-only" ).attr( "open", true );
			$( "details.mobile-only summary" ).attr( "aria-expanded", "true" );
			$( "details.mobile-only summary + *" ).show();
			$( "details.mobile-only summary" ).attr( "aria-disabled", "true" );
			$( "details.mobile-only summary" ).blur();
		}
	} );

}
// END init_Expandables





var expandables = $( ".nyuexpandable" );

for ( var i = 0; i < expandables.length; i++ ) {
	if ( !expandables.eq( i ).prev( "div" ).hasClass( "nyuexpandable" ) && !expandables.eq( i ).prev( "div" ).hasClass( "nyureference" ) ) {
		expandables.eq( i ).addClass( "expandable-top-element" );
	} else {
		expandables.eq( i ).addClass( "expandable-stack" ).removeClass( "expandable-top-element" );
	}
}
console.log('Table Module has been mounted.');

function init_Tables() {
	// sorting
	$( "table.table-sortable" ).tablesorter ( {
		widthFixed: true,
		widgets: ["zebra"]
	} );

	// shadows
	$( ".table-container" ).each( function() {
		var me = $( this );

		var parentWidth = me.width();
		var tableWidth = me.find( "table" ).width();
		var tableMinusParent = tableWidth - parentWidth;

		if (tableMinusParent < 1){
			me.find( ".table-shadow" ).css( "display", "none" );
		}

		me.onResize = function() {
			var scrollLeft = me.find( ".table-wrapper" ).scrollLeft();
			var parentWidth = me.width();
			var tableWidth = me.find( "table" ).width();
			var tableMinusParent = tableWidth - parentWidth;

			if (tableMinusParent < 1){
				me.find( ".table-shadow-left" ).css( "display", "none" );
				me.find( ".table-shadow-right" ).css( "display", "none" );
			} else{
				//set left shadow visibility
				if ( scrollLeft > 0 ) {
					me.find( ".table-shadow-left" ).css( "display", "block" );
				} else {
					me.find( ".table-shadow-left" ).css( "display", "none" );
				}

				//set right shadow visibility
				if ( scrollLeft >= tableMinusParent ) {
					me.find( ".table-shadow-right" ).css( "display", "none" );
				} else {
					me.find( ".table-shadow-right" ).css( "display", "block" );
				}
			}
		};

		$( window ).on( "resize", me.onResize );
	} );
}
//END init_Tables



function init_TableScrollCustom() {
	$( ".table-wrapper" ).scroll( function() {

		var scrollLeft = $( this ).scrollLeft();
		var parentWidth = $( this ).parent().width();
		var tableWidth = $( this ).children( "table" ).width();
		var tableMinusParent = tableWidth - parentWidth;

		//set left shadow visibility
		if ( scrollLeft > 0 ) {
			$( this ).siblings( ".table-shadow.table-shadow-left" ).css( "display", "block" );
		} else {
			$( this ).siblings( ".table-shadow.table-shadow-left" ).css( "display", "none" );
		}

		//set right shadow visibility
		if ( scrollLeft >= tableMinusParent ) {
			$( this ).siblings( ".table-shadow.table-shadow-right" ).css( "display", "none" );
		} else {
			$( this ).siblings( ".table-shadow.table-shadow-right" ).css( "display", "block" );
		}
	} );
}
// END init_TableScrollCustom
console.log('Gallery Module has been mounted.');

function init_Galleries() {
	// initialize all Galleries on the DOM
	$(".photo-gallery").each((i, el) => initGallery(i, el));
}

function initGallery(i, el) {
	let $el = $(el),
	$modal = $el.next(".gallery-modal-view"),
	win = $(window);

	$el.attr('data-gallery-index', i + 1);
	//Calling the model function with the right scope ( the elem ) and the argument = false means it'classSelector not inside a modal window
	GalleryModel.apply($el, [false]);

	$el.fadeIn();
	$el.parent().css("min-height", "0");
	$el.find('.close-modal').css({"position": "absolute", "visibility" : "hidden"});

	setUniqueIds($el, false);

	// detect if gallery is in viewport
	$.fn.isOnScreen = function() {
		let viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft()
		};

		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		let bounds = this.offset();
		bounds.right = bounds.left + this.outerWidth();
		bounds.bottom = bounds.top + this.outerHeight();

		return (!( viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
	};

	$("body").keyup(function(e) {
		let formModal = $(".form-modal");
		let classSelector = false;

		if (formModal.css('display') !== 'none')
			return; 

		switch(e.keyCode) {
			case 37: // left arrow key
				classSelector = ".prev";
			case 39: // right arrow key
				classSelector = ".next";
			case 27: // ESC
			case 88: // X
				classSelector = ".to-thumbs, .close-modal";
		}

		//press A
		if (e.keyCode == 65 && window.layout.inOrAbove("TABLET:PORTRAIT")) {
			if ($el.find(".photo-gallery-items").hasClass("slider")) {
				classSelector = ".to-thumbs";
			} else {
				classSelector = ".to-single";
			}
		}

		// Instead of triggering on hover, it is now triggered if gallery is visible within viewport
		if (!$el.hasClass("v-mobile-indicator")) {
			if (classSelector && $el.isOnScreen()) {
				$el.find(classSelector).trigger("click");
			}
		} else {
			if (classSelector && $modal.css("display") == "block") {
				$modal.find(classSelector).trigger("click");
			}
		}
	});
}

// Create unique id for each gallery element referenced by aria-describedby
function setUniqueIds(jElement, isModalClone) {
	let suffix = isModalClone ? "Modal" : "";

	let galleryIndex = Number(jElement.attr('data-gallery-index'));
	let gallerySpan = jElement.find(".total-images");
	let imageCount = Number(gallerySpan.attr('data-image-count'));

	let gallerySpanId = "totalImages" + galleryIndex + suffix;
	gallerySpan.attr('id', gallerySpanId);
	jElement.attr('aria-describedby', gallerySpanId);

	let gallerySlider = jElement.find(".photo-gallery-items");
	let gallerySliderId = 'gallerySlidesWrapper' + galleryIndex + suffix;
	gallerySlider.attr('id', gallerySliderId);
	jElement.find('.next').attr('aria-controls', gallerySliderId);
	jElement.find('.prev').attr('aria-controls', gallerySliderId);

	let galleryTitle = jElement.find(".gallery-title");
	galleryTitle.attr('id', 'photoGalleryTitle' + galleryIndex + suffix);

	jElement.attr('aria-labelledby', 'photoGalleryTitle' + galleryIndex + suffix);

	for (let i = 0; i < imageCount; i++ ) {
		let galleryItem = jElement.find(".photo-gallery-item-" + (i + 1));
		let galleryItemTitle = galleryItem.find(".gallery-item-title");
		let galleryItemTitleId = "photoGallery" + galleryIndex + "Item" + (i + 1) + suffix;
		galleryItemTitle.attr('id', galleryItemTitleId);
		galleryItem.attr('aria-describedby', galleryItemTitleId);
	}
}


// the gallery argument is the gallery elem delegate.
function GalleryModalWin( gallery ) {
	var me = $( this ),
		gal = $( gallery );

	me.init = function() {
		me.empty();

		// initializing as an empty obj. the var will be populated/cloned each time init is called.
		me.clone = {};

		//  var that holds the current visibility state of the modal win
		me.isShowing = false;

		me.addBehaviours();

		return me;
	};

	me.open = function() {
		if(me.isShowing)
			return;

		let _clone = gal.clone(true);
		// _clone.filter((i, el) => {
		// 	$(el).find("[id]").each((i, elWithId) => {
		// 		$(elWithId).attr('id', $(elWithId).attr('id') + "Modal");
		// 	});
		// });
		setUniqueIds(_clone, true);
		me.clone = GalleryModel.apply(_clone, [true]);

		me.isShowing = true;

		me.append( _clone );

		me.clone.indicator( false );
		me.clone.setState( "SINGLE_SLIDE" );

		me.css( "display", "block" );

		me.find('.close-modal').css('visibility', 'visible');

		me.find('.photo-gallery-item').on('keydown', function(e){
			if(e.keyCode === 13 || e.keyCode === 32){
				$(this).find('.gallery-image-container').trigger('click');
			}
		});
		
		me.toggleA11yAttributes(true);


		me.trapFocusByQuery(me, me.siblings('.photo-gallery').find('.gallery-mobile-cta'), me.siblings('.photo-gallery').find('.close-modal'));

		me.ariaToggleHideBackground('on');
		
		me.find('li.photo-gallery-item').attr('tabindex', '0');

		$( "body" ).css( "overflow", "hidden" );

		// Stop background from scrolling. Does not disable iOS momentum/bounce as that
		$( "html" ).addClass( "freeze-background" );
		$( "body" ).addClass( "freeze-background" );

		if ( isMobile ) {
			setTimeout( me.clone.fadeControls, 5000 );
		}

		me.addCloneBehaviours();

		me.resize();

		me.clone.resize();
	};

	me.close = function( e ) {
		if( e ) {
			e.stopPropagation();
		}

		me.isShowing = false;

		me.css( "display", "none" ).empty();
		
		me.siblings('.close-modal').css('visibility', 'hidden');
		
		me.ariaToggleHideBackground('off');
		me.toggleA11yAttributes(false);

		me.clone = {};

		$( "body" ).css( "overflow", "auto" );

		gal.resize();
	};

	me.resize = function() {
		if( !me.isShowing ) return;

		var win_in_height   = $( window ).innerHeight(),
			win_in_width    = $( window ).innerWidth(),
			ua              = navigator.userAgent,
			iphone          = ~ua.indexOf( "iPhone" ) || ~ua.indexOf( "iPod" ),
			justiphone      = ~ua.indexOf( "iPhone" ) || ~ua.indexOf( "iPod" ),
			ipad            = ~ua.indexOf( "iPad" ),
			fullscreen      = window.navigator.standalone;

		if ( iphone && !fullscreen && win_in_height > win_in_width ) {
			me.height( win_in_height );
		} else if( ipad && !fullscreen ) {
				me.height( win_in_height );
		} else {
			me.height( win_in_height );
		}

		if ( isMobile ) {
			me.find( ".gallery-info" ).css( "height", me.find( ".gallery-title" ).height() + 15 );
		}

		me.clone.adjustHeights();
	};

	me.addBehaviours = function() {
		$( window ).on( "resize", me.resize );
	};

	me.addCloneBehaviours = function() {
		me.clone.on( "click", ".close-modal", me.close );

		me.on( "click", function( e ) {
			if( e.target != this ) return;

			me.close( e );
		} );

		me.clone.on( "swipeleft swiperight", ".photo-gallery-item", function( e ) {
			if ( !me.isShowing ) return;

			me.clone.find( e.type == "swiperight" ? ".prev" : ".next" ).trigger( "click" );
		} );
	};

	me.ariaToggleHideBackground = function(toggle){
		var outsideEls  = Array.prototype.slice.apply( document.querySelectorAll("[role='main'] .parbase.section, main .parbase.section, [role='contentinfo'], footer, header, [role='banner'], nav, [role='navigation'] ,[role='complementary']"));
		var isHidden = (toggle == 'on') ? false : true; 

		outsideEls.forEach(function(v,i){
			if (v== me[0].closest(".nyuphotogallery")) return;
			if(!isHidden){
				v.setAttribute('aria-hidden','true');
			}else{
				v.removeAttribute('aria-hidden');
			}
		});
	};

	me.trapFocusByQuery = function(elemSelector, triggerEl, closeEl){
		var focusedElementBeforeFocus = triggerEl;
		var focusedElement = elemSelector[0];
		var closeButton = closeEl[0];


		focusedElement.setAttribute('tabindex','0');

		// Listen for and trap the keyboard
		focusedElement.addEventListener('keydown', trapTabKey);

		closeButton.addEventListener('keydown', returnFocus);

		// Find all focusable children
		var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
		var focusableElements = $(focusedElement.querySelectorAll(focusableElementsString)).filter(':visible');
		focusableElements = Array.prototype.slice.call(focusableElements);

		var firstTabStop = focusableElements[0];
		var lastTabStop = focusableElements[focusableElements.length - 1];

		// Focus first child
		firstTabStop.focus();
		
		me.clone.on('stateChange', function(){
				focusableElements = $(focusedElement.querySelectorAll(focusableElementsString)).filter(':visible');
				focusableElements = Array.prototype.slice.call(focusableElements);
				firstTabStop = focusableElements[0];
				lastTabStop = focusableElements[focusableElements.length - 1];
		});

		function trapTabKey(e) {
			// TAB
			if(e.keyCode === 9){
				if(e.shiftKey){
					if (document.activeElement === firstTabStop) {
						e.preventDefault();
						lastTabStop.focus();
					}
				}else{
					if (document.activeElement === lastTabStop) {
						e.preventDefault();
						firstTabStop.focus();
					}
				}
			}

			// ESCAPE
			if (e.keyCode === 27) {
				focusedElementBeforeFocus.focus();
				focusedElement.removeAttribute('tabindex');
			}
		}

		function returnFocus(e){
			if(e.keyCode === 13 || e.keyCode === 32){
				e.preventDefault();
				focusedElementBeforeFocus.focus();
				focusedElement.removeAttribute('tabindex');
			}
		}
	};


	me.toggleA11yAttributes = function(toggleOn){
		let galleryIndex = me.find('[data-gallery-index]').attr('data-gallery-index')

		if(toggleOn){
			me.parents('.gallery-container').attr({'role': 'dialog', 'aria-labelledby': 'photoGalleryTitle' + galleryIndex + 'Modal', 'aria-modal': true});
			me.find('.photo-gallery').attr({'role': 'region', 'aria-labelledby': 'photoGalleryTitle' + galleryIndex + 'Modal', 'aria-roledesription': 'carousel', 'aria-describedby': 'totalImages' + galleryIndex + 'Modal'});
		} else {
			me.parents('.gallery-container').removeAttr('role aria-labelledby aria-modal');
			me.find('.photo-gallery').removeAttr('role aria-labelledby aria-roledesription aria-describedby');
		}
			
	};

	return me.init();
}
// END GalleryModalWin



function GalleryModel( inside_modal ) {
	var me          = $( this ),
		on_modal     = inside_modal || false,
		modal        = false,
		$bar         = me.find( ".photo-gallery-scrollbar" ),
		$items       = me.find( ".photo-gallery-items" ),
		$controls    = me.find( ".gallery-controls" ),
		$overlay     = me.find( ".gallery-overlay" ),
		$scroller    = me.find( ".photo-gallery-scroller" );

	me.init = function() {
		me.state = "SINGLE_SLIDE";

		me._indicator = false;

		me.initSlides();

		me.find( ".gallery-overlay" ).css( {"display":"none"} );
		
		if ( !on_modal ) {
			// not on modal so this will be the modal delegate.
			modal = GalleryModalWin.apply( me.siblings( ".gallery-modal-view" ), me );
		} else {
			if( isMobile ) me.on( "tap", me.showElements );
		}

		me.attachBehaviours();

		me.resize();

		return me;
	};

	me.initSlides = function() {
		me.slides = {
			total: $items.find( "li" ).length,
			slide: $items.find( "li:active" ),
			index: $items.find( "li:active" ).index(),
			prev: function() {
				me.slides.set( me.slides.index - 1 );
			},
			next: function() {
				if( me.slides.set( me.slides.index + 1 ) === false ) {
					if( me.state == "SINGLE_SLIDE" && window.layout.inOrAbove( "TABLET:PORTRAIT" ) ) $overlay.css( "display", "block" );
				}
			},
			set: function( i ) {
				if( i < 0 || i >= me.slides.total ) {
					return false;
				}

				$items.find( ".active" ).removeClass( "active" );

				me.slides.index = i;
				me.slides.slide = $items.find( "li" ).eq( i ).addClass( "active" );

				me.find( ".gallery-item-number .gallery-current" ).text( i+1 );

				me.adjustHeights();

				return i;
			}
		};

		me.find( ".gallery-item-number .gallery-count, .gallery-mobile-cta .gallery-mobile-count" ).text( me.slides.total );

		me.slides.set( 0 );
	};

	me.adjustHeights = function() {

		var act = ( ( modal && modal.isShowing ) ? modal.clone : me ),
			info_h = act.slides.slide.find( ".gallery-item-info" ).height();

		info_h += window.width < window.layout["TABLET:PORTRAIT"] ? 40 : 20;

		if( on_modal && window.matchMedia( "(max-width: 929px)" ).matches ) {
			act.slides.slide.find( ".gallery-image-container" ).css( { "max-height": "calc(100% - " + info_h + "px)" } );
		}
	};

	me.resize = function() {
		if( me.state == "NONE" ) me.setState( "BROWSING_SLIDES" );
		
		if( me.closest( ".col" ).width() < 960 && me.closest( ".col" ).width() >= 930 ) {
			me.parent( ".gallery-container" ).css( { "padding":"15px 0px", "margin":"auto" } );
		} else if ( me.closest( ".col" ).width() >= 960 || me.closest( ".col" ).width() < 930 ) {
			if ( $( window ).width() >= 480 ) {
				me.parent( ".gallery-container" ).css( {"padding":"15px" } );
			} else {
				me.parent( ".gallery-container" ).css( {"padding":"15px 0" } );
			}
		}

		if( me.parent().width() >= window.layouts["TABLET:PORTRAIT"] ) {
			if( me._indicator ) me.indicator( false );
		} else {
			me.indicator( true );
		}
	};

	me.setState = function( state ) {
		if( state == "BROWSING_SLIDES" ) {
			me.state = state;

			$items.removeClass( "slider" );

			$controls.removeClass( "slider-controls" );
			
			$items.find('.photo-gallery-item').each(function(){
				var existingLabel = $(this).attr("aria-label");
				var slideNum;
				var className = this.className.match(/photo-gallery-item-\d+/);
				$(this).attr('aria-label', 'Choose '+existingLabel);
				if (className) {
					$(this).attr('aria-describedby',className[0].replace('-item-', '-item-title-'));
				}
			});

			// me.refreshScrollbar();
		}

		if( state == "SINGLE_SLIDE" ) {
			me.state = state;

			$items.addClass( "slider" );

			$controls.addClass( "slider-controls" );
			
			$items.find('.photo-gallery-item').each(function(){
				var existingLabel = $(this).attr("aria-label").replace("Choose ","");
				$(this).attr('aria-label', existingLabel);
				$(this).removeAttr('aria-describedby');
				
			});
		}
		me.trigger('stateChange');
	};

	me.indicator = function( v ) {
		if( v && !on_modal ) {
			me._indicator = true;

			me.addClass( "v-mobile-indicator" );

			$items.removeClass( "slider" );
		} else {
			me._indicator = false;

			me.removeClass( "v-mobile-indicator" );

			me.setState ( me.state );
		}
	};
	

	me.viewAll = function(e) {
		e.preventDefault();e.stopPropagation();
		me.setState( "BROWSING_SLIDES" );
		$controls.find('.to-single').focus();
	};

	me.enlarge =  function(e) {
		e.preventDefault();e.stopPropagation();
		me.setState( "SINGLE_SLIDE" );
		$controls.find('.to-thumbs').focus();
	};

	me.enlargeClicked = function() {
		if( !me.hasClass( "v-mobile-indicator" ) ) {
			me.slides.set( $( this ).parent().index() );

			if( window.layout.inOrAbove( "TABLET:PORTRAIT" ) ) {
				me.setState( "SINGLE_SLIDE" );
			}
		}
	};

	me.resetGalRemoveOverlay = function() {
		me.slides.set( 0 );

		$overlay.css( "display", "none" );
	};

	me.viewAllRemoveOverlay = function() {
		$overlay.css( "display", "none" );

		me.setState( "BROWSING_SLIDES" );
	};

	me.fadeControls = function() {};
	me.showElements = function() {};

	me.attachBehaviours = function() {
		$( window ).on( "resize", me.resize );

		$controls
			.on( "click", ".prev", me.slides.prev )
			.on( "click", ".next", me.slides.next )
			.on( "click", ".to-thumbs", me.viewAll )
			.on( "click", ".to-single", me.enlarge );

		$overlay
			.on( "click", ".end-options-buttons .gallery-reset", me.resetGalRemoveOverlay )
			.on( "click", ".end-options-buttons .gallery-to-thumb", me.viewAllRemoveOverlay );

		$items.on( "click tap", ".gallery-image-container", me.enlargeClicked );

		me.hover( function() { $( this ).addClass( "hovered" ); },
			function() { $( this ).removeClass( "hovered" ); } )
			.on( "click", function() { if( modal && me._indicator && ! $( "body" ).hasClass( "cq-wcm-edit" ) ) modal.open(); } )
			.on("keydown", '.gallery-mobile-cta', function(e){
				var enterKey = (e.keyCode === 13) ? true : false; 
				var spaceKey = (e.keyCode === 32) ? true : false;
				if(enterKey || spaceKey) e.preventDefault(), e.stopPropagation(), me.click(); 
			} )
			.mousewheel( function( e, delta ) {
				var mar_t = parseInt( $scroller.css( "margin-top" ) );

				mar_i = 0;

				if( !me._indicator && me.state != "SINGLE_SLIDE" && window.layout.inOrAbove( "TABLET:PORTRAIT" ) ) {
					e.preventDefault();

					$( document ).unbind( "mousewheel DOMMouseScroll" );

					if( delta < 0 && -1 * mar_t < 150 + ( parseInt( $scroller.outerHeight( true ) ) - parseInt( $items.outerHeight( true ) ) ) ) {
						mar_i = -15;
					}
					
					if( delta > 0 && mar_t < 0 ) {
						mar_i = 15;
					}

					if( mar_i != 0 ) {
						$scroller.css( "margin-top", mar_t + mar_i );

						$bar.css( "top", parseInt( $bar.css( "top" ) ) - mar_i );
					}
				}
			} );

		var start = { x:0, y:0 };

		$items
			.on( "touchstart", function( evt ) {
				if( !me._indicator && me.state != "SINGLE_SLIDE" && window.layout.inOrAbove( "TABLET:PORTRAIT" ) ) {
					evt.preventDefault();

					start.y = evt.originalEvent.touches[0].pageY;
				}
			} )
			.on( "touchmove", function( evt ) {
				if( !me._indicator && me.state != "SINGLE_SLIDE" && window.layout.inOrAbove( "TABLET:PORTRAIT" ) ) {
					evt.preventDefault();

					var offset = {};

					offset.y = event.touches[0].pageY - start.y;

					var delta = offset.y,
							mar_t = parseInt( $scroller.css( "margin-top" ) );
							mar_i = 0;

					if( delta < 0 && -1 * mar_t < 150 + ( parseInt( $scroller.outerHeight( true ) ) - parseInt( $items.outerHeight( true ) ) ) ) mar_i = -15;

					if( delta > 0 && mar_t < 0 ) mar_i = 15;

					if( mar_i != 0 ) {
						$scroller.css( "margin-top", mar_t + mar_i );

						$bar.css( "top", parseInt( $bar.css( "top" ) ) - mar_i );
					}
				}

			} );
	};

	return me.init();
}
// END GalleryModel
console.log('Video Container Module has been mounted.');

function init_videocontainer() {
	$( ".video-container" ).on( "click", function() {
		var container = $( this ),
			player = container.find( ".jwplayer" ),
			height = $( window ).height(),
			width = $( window ).width(),
			modal = container.find( ".video-modal" ),
			playerwidth = player.width(),
			playerheight = player.height();


		if ( !container.hasClass( "active" ) ) {
			container.addClass( "active" );
		}

		if ( modal.css( "display" ) === "block" ) {
			return false;
		}

		if ( modal.length > 0 ) {
			modal.css( "display", "block" );
			modal.css( "height", height );
		}

		jwplayer( player.attr( "id" ) ).play();

		$( window ).on( "resize", function() {
			newheight = $( window ).height();
			newwidth = $( window ).width();

			newpheight = player.height();
			newpwidth = player.width();

			newhorizontal = newwidth/2 - newpwidth/2;
			newvertical = newheight/2 - newpheight/2;

			modal.css( "height", newheight );
			player.css( "top", newvertical );
			player.css( "left", newhorizontal );
		} ).resize();
	} );

	var closeVideo = function( e ) {
		e.stopPropagation();

		var $modal = $( ".video-container .video-modal" );

		if( $modal.css( "display" ) === "block" ) {
			$modal.css( "display", "none" );

			var player = $modal.find( ".jwplayer" );

			jwplayer( player.attr( "id" ) ).stop();

			$modal.parent().removeClass( "active" );
		}
	};

	$( ".video-container" ).on( "click", ".video-modal, .close-button", function( e ) {
		closeVideo( e );
	} );

	$( ".video-container .video-modal" ).on( "click", ".jwplayer", function( e ) {
		e.stopPropagation();
	} );

	$( "body" ).keyup( function( e ) {
		if ( e.keyCode == 27 ) {
			closeVideo( e );
		}
	} );
}
//END init_videocontainer
console.log('Shopping Cart Module has been mounted.');

function init_MobileShoppingCartBrowseToggle() {
	$( "#mobile-browse-toggle" ).on( "click", function() {
		var $sub = $( ".shopping-nav .shopping-sub" );
		var $btn = $( this ).parent();

		if ( $btn.hasClass( "active" ) ) {
			$sub.hide();

			$btn.removeClass( "active" );
		} else {
			$sub.show();

			$btn.addClass( "active" );
		}
	} );
}
//END init_MobileShoppingCartBrowseToggle



function init_MobileHideShoppingNav() {

	// number of pixels before modifying styles
	var treshold = 50,
		s_top = $( window ).scrollTop();

	var $shoppingNav = $( ".header + .shopping-nav" );

	$( window ).bind( "scroll", function() {
		var o = { position: "fixed", top: 0 },
			new_s_top = $( window ).scrollTop();

		// scrolling bellow threshold
		if ( new_s_top > treshold ) { 
			$shoppingNav.find( ".shopping-sub" ).hide();

			$( "#mobile-browse-toggle" ).parent().removeClass( "active" );

			// below 930px && scrolling up
			if ( window.layout.inOrBelow( "TABLET:PORTRAIT" ) && s_top > new_s_top ) {
				if ( !$( "body" ).hasClass( "cq-wcm-edit" ) ) {
					$shoppingNav.css( {
						"position": "fixed",
						"top": 50,
						"z-index": 1
					} );
				}

			// scrolling above threshold
			} else { 
				$shoppingNav.css( {
					"position": "relative",
					"top": 0
				} );
			}

		// scrolling above threshold
		} else {
			$shoppingNav.css( {
				"position": "relative",
				"top": 0
			} );
		}

		s_top = new_s_top;
	} );
}
//END init_MobileHideShoppingNav





function init_cattabs() {

	// cat page
	$( "a[data-ui='tab']" ).on( "click", function() {
		// both tabs and mobile submenu
		var $tab = $( this );
		var $tabs = $( "*[data-ui='tabs']" );
		var $rel = $( this.rel );

		$tabs.find( ".active" ).removeClass( "active" );
		$tabs.find( "a[rel='" + $tab.attr( "rel" ) + "']" ).parent().addClass( "active" );

		$( ".tab-content-container" ).find( ".active" ).removeClass( "active" );
		$rel.addClass( "active" );

		// hide mobile browse after click
		if ( $tabs.hasClass( "sub-inner" ) ) {
			$( ".shopping-nav .shopping-sub" ).hide();

			$( "#mobile-browse-toggle" ).parent().removeClass( "active" );
		}

		// count
		$( ".item-count" ).text( $rel.find( ".item-showcase" ).length );

		// url
		window.location = $tab.attr( "rel" ).replace( "cat-", "" );
	} );

	// on page load check hash
	if ( window.location.hash !== "" ) {
		var cat = "#cat-" + window.location.hash.replace( "#", "" );

		$( "a[data-ui='tab']" ).parent().removeClass( "active" );
		$( "a[rel='" + cat + "']" ).parent().addClass( "active" );

		$( ".shopping-category-table" ).removeClass( "active" );

		$( cat ).addClass( "active" );
		$( ".item-count" ).text( $( cat ).find( ".item-showcase" ).length );
	}

	var loadMoreInit = ( function() {
		// hide items after 6 in categories
		$( ".shopping-category-table" ).each( function() {
			var $cat = $( this );
			var $items = $cat.find( ".item-showcase" );

			// default all visible
			$items.eq( i ).attr( "data-mobile-show", true );

			if( $items.length > 6 ) {
				var l = $items.length;

				// hide items
				for( var i = 6; i < l; i++ ) {
					$items.eq( i ).attr( "data-mobile-show", false );
				}

				// inject button
				$cat.append( "<hr class='divider loaddiv'/><a href='#' class='caret-button' data-ui='load-more'>Load More</a>" );
			}
		} );

		// load more click
		$( ".shopping-category-table" ).on( "click", "a[data-ui='load-more']", function() {
			var $btn = $( this );
			var $cat = $btn.parent();
			var $items = $cat.find( ".item-showcase" );
			var i = 0;

			$items.each( function() {
				var $item = $( this );

				if ( $item.attr( "data-mobile-show" ) === "false" ) {
					$item.attr( "data-mobile-show", "true" );
					$item.css( "display", "block" );

					i++;
				}

				if ( i === 6 ) {
					return;
				}
			} );

			// if last one is visible remove button
			if ( $items.eq( $items.length - 1 ).attr( "data-mobile-show" ) === "true" ) {
				$btn.hide();
			}
		} );
	} );

	var itemsSize = function() {
		var maxHeight = 0;

		$( ".shoppingcategory-template .item-showcase > .item" ).each( function() {
			$( this ).css( "min-height", "" );

			maxHeight = Math.max( maxHeight, $( this ).outerHeight( true ) );
		} );

		$( ".shoppingcategory-template .item-showcase > .item" ).css( "min-height", maxHeight );
	};

	var clearCart = function() {
		// if cart value = 0, clear drop down values
		// for when user clears cart and hits browser back button
		var cartItemVal = $( ".cartbox-nbr-count" ).html();

		if ( cartItemVal === "0" ) {
			$( ".item select" ).val( "" ).selectmenu( "refresh" );
		}
	};

	var toggleItems = function() {
		if( !$( "body" ).hasClass( "cq-wcm-edit" ) && window.layout.inOrBelow( "TABLET:PORTRAIT" ) ) {
			$( ".item-showcase[data-mobile-show='false']" ).hide();

			if ( $( ".item-showcase[data-mobile-show='false']" ).length ) {
				$( "a[data-ui='load-more']" ).show();
			}
		} else {
			$( ".item-showcase[data-mobile-show='false']" ).show();

			$( "a[data-ui='load-more']" ).hide();
		}
	};

	$( window ).on( "resize", function() {
		toggleItems();

		itemsSize();
	} );

	$( document ).ready( function() {
		if ( $( ".shoppingcategory-template" ).length === 1 ) {

			// /templates3/shoppingcategory.html
			var el = $( ".tab-content-container div" ).first();

			$( ".item-count" ).text( el.find( ".item-showcase" ).length );
		}

		if ( $( ".shoppingcart-template" ).length === 1 ) {

			// /templates3/shoppingcart.html
			$( ".item-count" ).text( $( ".cart-content-table .item-showcase" ).length );
		}
	} );

	$( window ).load( function( $ ) {
		itemsSize();

		clearCart();
	} );
}
//END init_cattabs
console.log('Study Abroad Module has been mounted.');

function init_studyAbroadMenu() {
	if ( $( ".study-abroad" ).length ) {
		var studyMenu = "";
		var sidebarMenu = $( ".study-abroad ul.navigation-content" );

		sidebarMenu.find('li a').wrap('<div class="menu-title"></div>');
		sidebarMenu.find('li > ul a').unwrap('<div class="menu-title"></div>');
		sidebarMenu.find( "li > ul" ).parent().addClass( "has-submenu open" );
		sidebarMenu.find('.has-submenu .menu-title').append("<button class='menu-expand'><span class='screen-reader-text'>Expand</span></button>");
		sidebarMenu.find('.subnavigation').wrap("<div class='menu-contents'></div>");

		// studyMenu += "<div class='mobile-main-menu'>";
		// studyMenu += "<ul class='mobile-nav-list'>";
		studyMenu += sidebarMenu.html();
		// studyMenu += "</ul>";
		// studyMenu += "</div>";

		// $( studyMenu ).insertBefore( ".main-navigation-menu" );
		$( studyMenu ).appendTo(".mobile-nav-list");
		
	}
}
//END init_studyAbroadMenu



function init_StudyAbroadFooter() {
	$( ".centers-abroad h6" ).on( "click", function( e ) {
		e.preventDefault();

		var tabletBp = window.matchMedia( "(max-width:689px)" );

		if ( tabletBp.matches ) {
			var p = $( this ).parent();
			
			if ( p.hasClass( "active" ) ) {
				p.removeClass( "active" );
			} else {
				p.addClass( "active" );
			}
		}
	} );
}
//END init_StudyAbroadFooter
console.log('Home Slider Module has been mounted.');

// load more (mobile, tablet?) and bring-cov fake clicks
function init_homeslider() {
	$( ".load-more-btn" ).on( "click", function( e ) {
		e.preventDefault();

		$(".stream").addClass('loadMore');

		//timeout for safari 
		//	- safari can't switch focus without the pause
		setTimeout(function(){
			$(".stream").children(".slug2").first().children("a").focus();
		}, 50);
	} );
}
//END init_homeslider
function init_EllipsisCtrl() {
	function EllipsisShow() {
		var sum = 0;
		var windowwidth = $( window ).width();

		$( ".breadcrumb-wrapper li" ).each( function() {
			sum = sum + $( this ).width();
		} );

		if( sum + 30 > $( ".breadcrumb-inner" ).width() ) {
			$( ".breadcrumb-wrapper" ).addClass( "shrink" );
		} else {
			$( ".breadcrumb-wrapper" ).removeClass( "shrink" );
		}
	}

	$( ".ellipsis-cta, .ellipsis-foreground" ).on( "click", function() {
		$( this ).parents( ".breadcrumb-wrapper" ).removeClass( "shrink" );
	} );

	$( window ).on( "breakpoint", EllipsisShow );
	EllipsisShow();
}
// END init_EllipsisCtrl





function init_SearchCtrl() {

	$( ".inner-header[data-type=main] #main-navigation-search" ).keypress(function(e) {
		if(e.keyCode == 13) {
			$( ".main-navigation-search-form" ).submit();
		}
	} );

	$('header .search-toggle').keypress(function(e) {
		if(e.keyCode == 13 || e.keyCode == 32) {
			if($(this).attr('aria-expanded') === 'true') {
				$(this).attr('aria-expanded', 'false');
			}
			else {
				$(this).attr('aria-expanded', 'true');
			}
		}
	});

	$('#mobile-navigation-search').on('keydown', function(e) {
		if(e.keyCode === 27 || e.keyCode === 9){
			toggleMobileSearchForm();
		}
	});

	$( ".search-form .multi-fields .search-field" ).on( "click", function( e ) {
		e.preventDefault();
		e.stopPropagation();

		var tabletBp = window.matchMedia( "(max-width:929px)" );

		if ( tabletBp.matches ) {
			var container = $( this ).closest( ".search-component" );
			var w = container.find( ".multi-fields" ).width();

			container.find( ".input-fields" ).css( "max-width", w );

			if ( container.hasClass( "active" ) ) {
				container.removeClass( "active" );
			} else {
				container.addClass( "active" );
			}
		}
	} );

	$( ".search-form .multi-fields .ui-selectmenu-button" ).on( "click", function( e ) {
		e.preventDefault();
		var tabletBp = window.matchMedia( "(max-width:929px)" );

		if( tabletBp.matches ) {
			$( ".ui-selectmenu-menu.ui-front" ).each( function( index ) {
				if( !$( this ).hasClass( "search-mobile" ) ) {
					$( this ).addClass( "search-mobile" );
				}
			} );
		}
	} );

	$( window ).on( "resize", function() {
		var container = $( ".search-component" );
		var tabletBp = window.matchMedia( "(min-width:930px)" );

		if( tabletBp.matches ) {
			container.removeClass( "active" );
			container.find( ".input-fields" ).css( "max-width", "" );
		} else {
			var w = container.find( ".multi-fields" ).width();
			container.find( ".input-fields" ).css( "max-width", w );
		}
	} );

	if (checkSize("mobile") && $('header .search-toggle').attr('aria-expanded') === "false"){
		$('#main-navigation-search').attr('aria-hidden','true');
	}
	if (!checkSize("mobile")) {
		$('#main-navigation-search').attr('aria-hidden','false');
	}
}
// END init_SearchCtrl





function init_HeaderCtrl() {

	//jump to top
	$( ".back-to-top" ).click( function() {
		$( "html, body" ).animate( { scrollTop: 0 }, 600 );

		$('#top').attr('tabindex', '-1').focus();
		$( '#top' ).focus();
		
		return false;
	} );

	$( "#mobile-global-menu-toggle" ).bind ("click", function() {	
		globalNavObject.toggleNavigation();	
		$('#GN-sub-nav').show();	
		$('.GN-nyu-login-btn a').focus()
		$( ".GN-close-btn" ).focus(); // Fix: March 22, 2022
	 } );
	 
	$( "#global-menu-toggle" ).bind ("click", function() {	
		globalNavObject.toggleNavigation();	
		$('#GN-sub-nav').show();
		$( "#GN-global-nav-body button.GN-close-btn" ).focus();
		} );

	if( !$( "body" ).hasClass( "cq-wcm-edit" ) ) {

		// number of pixels before modifying styles
		var treshold = 50;
		var s_top = $( window ).scrollTop();

		$( window ).bind( "scroll", function() {
			var new_s_top = $( window ).scrollTop();

			$( "header.header" ).addClass( "fixed" );
			$( "header.header" ).removeClass( "scrolled" );

			// scrolling below threshold
			if ( new_s_top > treshold ) { 

				// wider than 930px && scrolling up
				var tabletBp = window.matchMedia( "(min-width:930px)" );

				if( tabletBp.matches && s_top < new_s_top ) {
					$( "header.header" ).addClass( "scrolled" );
				}

			// scrolling above threshold
			} else { 
				$( "header.header" ).removeClass( "fixed" );
			}

			s_top = new_s_top;
		} );
	}

	// Initial Aria-Hidden state of Navigation	
	$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden', 'true');
	$('.inner-header[data-type=main]').attr('aria-hidden', ($('header.header').hasClass('menu-opened')).toString() );
	$('#GN-local-nav').attr('aria-hidden', 'true');
}
// END init_HeaderCtrl





function init_MainNav() {

	//just generates the submenu content, no tab||keyboard controls added
	init_MobileNavCurrentPage();

	// control what is tab-able when
	ctrl_HeaderTabbing();

	//btn controls
	$( ".hamburger, .menu-mask" ).on( "click touchstart", function(e) {
		e.stopPropagation();
		e.preventDefault();

		$('header.header').removeClass("show-search");
		$('header.header').toggleClass("menu-opened");
		
		$('.hamburger').attr('aria-expanded', ($('header.header').hasClass('menu-opened')).toString());
			
		var isMenuOpen = ($('header.header').hasClass('menu-opened'));

		$('main').attr('aria-hidden', isMenuOpen.toString());
		$('footer').attr('aria-hidden', isMenuOpen.toString());

		// If Mobile Menu OPEN: Hide Logo, Search, All NYU
		$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden', (!isMenuOpen).toString());
		
		// Restore Banner
		$('.inner-header[data-type=mobile] .logo-holder').attr('aria-hidden', isMenuOpen.toString());
		$('.inner-header[data-type=mobile] .main-navigation-search-form').attr('aria-hidden', isMenuOpen.toString());
		$('.inner-header[data-type=mobile] #mobile-global-menu-toggle').attr('aria-hidden', isMenuOpen.toString());

		$('.inner-header[data-type=mobile] .main-nav-wrap').attr('aria-hidden', (!isMenuOpen).toString());
		$('.inner-header[data-type=mobile] .role-nav-wrap').attr('aria-hidden', (!isMenuOpen).toString());
		$('.inner-header[data-type=mobile] .login-nyu').attr('aria-hidden', (!isMenuOpen).toString());

		$('.main-navigation-menu a').first().focus(); // Fix: Sep 30, 2021

		ctrl_HeaderTabbing();
	});

	$( "body" ).on( "click touch", ".main-navigation-menu .menu-expand, .super-navigation-menu .menu-expand, .mobile-main-menu .menu-expand", function( e ) {
		var me = $( this ).parent().parent();
		me.toggleClass( "open" );

		if (me.hasClass("open")){
			me.find('.menu-title a').attr('aria-hidden', 'false');
			if (!checkSize("mobile")){
				me.find('.menu-title a').attr('aria-expanded', 'true');
			}
			me.find('.menu-expand').attr('aria-expanded', 'true');
			me.find('.menu-contents').attr('aria-expanded', 'true').attr('aria-hidden', 'false').focus();
			me.find('.menu-contents a').attr('tabindex', '0').attr('aria-hidden', 'false');
		} else {
			if (!checkSize("mobile")){
				me.find('.menu-title a').attr('aria-expanded', 'false');
			}
			me.find('.menu-title a').attr('aria-hidden', 'true');
			me.find('.menu-expand').attr('aria-expanded', 'false');
			me.find('.menu-contents').attr('aria-expanded', 'false').attr('aria-hidden', 'true');
			me.find('.menu-contents a').attr('tabindex', '-1').attr('aria-hidden', 'true');
		}
		ctrl_HeaderTabbing();
	});

	// Listen for ENTER || SPACE on SuperNav Menu Expands
	$(".inner-header[data-type='mobile'] .super-navigation-menu .menu-expand").keypress(function(e) {
		if(e.keyCode == 13 || e.keyCode == 32) {
			var me = $( this ).parent().parent();

			if (me.hasClass("open")){
				me.find('.menu-title a').attr('aria-hidden', 'false');
				me.find('.menu-expand').attr('aria-expanded', 'true');
				me.find('.menu-contents').attr('aria-expanded', 'true').attr('aria-hidden', 'false');
				me.find('.menu-contents a').attr('tabindex', '0').attr('aria-hidden', 'false');
			} else {
				me.find('.menu-title a').attr('aria-hidden', 'true');
				me.find('.menu-expand').attr('aria-expanded', 'false');
				me.find('.menu-contents').attr('aria-expanded', 'false').attr('aria-hidden', 'true');
				me.find('.menu-contents a').attr('tabindex', '-1').attr('aria-hidden', 'true');
			}
			ctrl_HeaderTabbing();
		}
	})

	$(".inner-header[data-type='mobile'] .main-navigation-menu .menu-expand").keypress(function(e) {
		if(e.keyCode == 13 || e.keyCode == 32) {
			var me = $( this ).parent().parent();

			if (me.hasClass("open")){
				me.find('.menu-title a').attr('aria-hidden', 'false');
				me.find('.menu-contents').attr('aria-expanded', 'true').attr('aria-hidden', 'false');
				me.find('.menu-contents a').attr('tabindex', '0').attr('aria-hidden', 'false');
				me.find('.menu-expand').attr('aria-expanded', 'true');
			} else {
				me.find('.menu-title a').attr('aria-hidden', 'true');
				me.find('.menu-contents').attr('aria-expanded', 'false').attr('aria-hidden', 'true');
				me.find('.menu-contents a').attr('tabindex', '-1').attr('aria-hidden', 'true');
				me.find('.menu-expand').attr('aria-expanded', 'false');
			}
			ctrl_HeaderTabbing();
		}
	})

	//mouse controls
	$( ".main-navigation-menu .has-submenu" ).mouseenter(function() {
		if (!checkSize("mobile")){
			$(this).addClass('open');
			$(this).find('.menu-title a').attr('aria-expanded', 'true');
			$(this).find('.menu-contents').attr('aria-expanded', 'true');
		}
	});
	
	$( ".menu-title a" ).mouseleave(function() {
		if (!checkSize("mobile") && $('.mega-menu:hover').length === 0){
			$('.has-submenu.open .menu-title a').attr('aria-expanded', 'false').attr('aria-hidden', 'false');
			$('.has-submenu.open .menu-contents').attr('aria-expanded', 'false').attr('aria-hidden', 'false');
			$('.has-submenu.open').removeClass('open').attr('aria-hidden', 'false');
		}
	});
	$( ".mega-menu" ).mouseleave(function() {
		if (!checkSize("mobile") && $('.menu-title a:hover').length === 0){
			$('.has-submenu.open .menu-title a').attr('aria-expanded', 'false').attr('aria-hidden', 'true');
			$('.has-submenu.open .menu-contents').attr('aria-expanded', 'false').attr('aria-hidden', 'true');
			$('.has-submenu.open').removeClass('open').attr('aria-hidden', 'true');
		}
	});
	
	

	//resize - recheck and reset
	$( window ).on( "resize", function() {
		ctrl_HeaderTabbing(); 

		if (!checkSize("mobile")){
			$('.main-navigation-menu .has-submenu').removeClass('open');
			$('#main-navigation-search').attr('aria-hidden','false');
			$('.inner-header[data-type=main]').attr('aria-hidden','false');
			$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden','true');
		
			// Adjust sidenav ARIA behavior for news templates
			if(checkTemplate("news")) {
				$('.sidenav').eq(0).attr('aria-hidden','false');
			}
		}
		else {
			$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden','true');
			$('.inner-header[data-type=main]').attr('aria-hidden','true');

			if(checkTemplate("news")) {
				$('.sidenav').eq(0).attr('aria-hidden','true');
			}
		}

		if(checkSize("mobile") && $('header .search-toggle').attr('aria-expanded') === "false") {
			$('#main-navigation-search').attr('aria-hidden','true');
		}
	} );

	// Initial State of Headers
	if (!checkSize("mobile")){
		// Desktop
		$('.inner-header[data-type=main]').attr('aria-hidden','false');
		$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden','true');
	}
	else {
		// Mobile
		$('.inner-header[data-type=mobile] .mobile-nav-content').attr('aria-hidden','true');
		$('.inner-header[data-type=main]').attr('aria-hidden','true');
	}

	//add keyboard listeners
	if (checkTemplate("study-abroad")){
		addKeyboardListeners("study-abroad-header");
	} else {
		addKeyboardListeners("header");
	}

} // END init_MainNav





function ctrl_HeaderTabbing() {
	if (checkSize("mobile")){
		if ($('header.header').hasClass( "menu-opened" )){
			//when mobile - header open
				// side title links are tab-able
				// expand btns can be tabbed

			$('.search-toggle').attr('tabindex', '-1').css("pointer-events", "none");
			$('.global-menu').attr('tabindex', '-1').css("pointer-events", "none");

			$('.main-nav-wrap a').attr('tabindex', '0').css("pointer-events", "auto");
			$('.main-nav-wrap button').attr('tabindex', '0').css("pointer-events", "auto");
			$('.role-nav-wrap a').attr('tabindex', '0').css("pointer-events", "auto");
			$('.role-nav-wrap button').attr('tabindex', '0').css("pointer-events", "auto");
			$('.login-nyu a').attr('tabindex', '0').css("pointer-events", "auto");

			$('.menu-contents a').attr('tabindex', '-1').css("pointer-events", "none");
			$('.menu-contents a').attr('aria-hidden', 'true');	

			$('.open .menu-contents a').attr('aria-hidden', 'false');
			$('.open .menu-contents a').attr('tabindex', '0').css("pointer-events", "auto");

			//turn on interactivity for study abroad locatons links (white area in mobile menu)
			$('a.in-this-section-menu-link').attr('tabindex', '0').attr('aria-hidden', 'false').css("pointer-events", "auto");

			//add additional values for study abroad options
			$('a.super-navigation-link-title').attr('tabindex', '0').attr('aria-hidden', 'false').css("pointer-events", "auto");
			$('.logo-holder a.logo').attr('tabindex', '0').attr('aria-hidden', 'false').css("pointer-events", "auto");
			$('a.nav-link').attr('tabindex', '0').attr('aria-hidden', 'false').css("pointer-events", "auto");
			$('a.login-nyu-home').attr('tabindex', '0').attr('aria-hidden', 'false').css("pointer-events", "auto");
			$('.menu-expand').attr('tabindex', '0').attr('aria-hidden', 'false').css("pointer-events", "auto");

			handleSubmenuTabbing();

		} else {
			//when mobile - header closed
				//no expand btns or side links are tab-able

			$('.search-toggle').attr('tabindex', '0').css("pointer-events", "auto");
			$('.global-menu').attr('tabindex', '0').css("pointer-events", "auto");

			$('.main-nav-wrap a').attr('tabindex', '-1').css("pointer-events", "none");
			$('.main-nav-wrap button').attr('tabindex', '-1').css("pointer-events", "none");
			$('.role-nav-wrap a').attr('tabindex', '-1').css("pointer-events", "none");
			$('.role-nav-wrap button').attr('tabindex', '-1').css("pointer-events", "none");
			$('.login-nyu a').attr('tabindex', '-1').css("pointer-events", "none");
			
			$('.menu-contents a').attr('tabindex', '-1').css("pointer-events", "none");
			$('.menu-contents a').attr('aria-hidden', 'true');
			$('.open .menu-contents a').attr('tabindex', '-1').css("pointer-events", "none");

			// turn off interactivity for study abroad locations links (white area of mobile menu)
			$('a.in-this-section-menu-link').attr('tabindex', '-1').attr('aria-hidden', 'true').css("pointer-events", "none");
		}

		$('.menu-contents .overview').attr('tabindex', '-1').attr('aria-hidden','true');
			//only when expanded can submenu btns be tabbed
	} else {

		//when desktop
			//all visible links are allowed

		$('.main-nav-wrap a').attr('tabindex', '0').css("pointer-events", "auto");
		$('.main-nav-wrap button').attr('tabindex', '0').css("pointer-events", "auto");
		$('.role-nav-wrap a').attr('tabindex', '0').css("pointer-events", "auto");
		$('.role-nav-wrap button').attr('tabindex', '0').css("pointer-events", "auto");
		$('.login-nyu a').attr('tabindex', '0').css("pointer-events", "auto");
		$('.open .menu-contents a').attr('tabindex', '0').css("pointer-events", "auto");
		$('.menu-contents .overview').attr('tabindex', '0').attr('aria-hidden','false');
		$('.inner-header[data-type=main]').attr('tabindex','0').attr('aria-hidden','false');
	}

}

function handleSubmenuTabbing() {
	// Fixes for CMS-2058 - May 15, 2023
	let submenus = document.getElementsByClassName("has-submenu");
	for (let submenu of submenus) {
		let items = submenu.getElementsByClassName("in-this-section-menu-link");
		for (let item of items) {
			if (submenu.classList.contains("open")) {
				item.setAttribute('tabindex', '0');
				item.setAttribute('aria-hiden', 'false');
				item.setAttribute('pointer-events', 'auto');
			} else {
				item.setAttribute('tabindex', '-1');
				item.setAttribute('aria-hiden', 'true');
				item.setAttribute('pointer-events', 'none');
			}
		}
	}
}

function init_MobileNavCurrentPage() {
	$ = nyu$;

	if ( $( ".breadcrumb-list li" ).length > 2 ) {
		var secondLevel = $( ".breadcrumb-list li" )[2].innerText.trim();
		var navLinks = $( ".main-navigation-menu-link-title" );
		var mobileSection;

		for ( var i = 0; i < navLinks.length; i++ ) {
			mobileSection = navLinks.eq( i );

			if ( mobileSection.text().trim() === secondLevel ) {

				if(checkSize("mobile")){
					mobileSection.closest( ".has-submenu" ).addClass( "open" );
					mobileSection.closest( ".menu-expand" ).attr('aria-expanded', 'true');
					mobileSection.closest( ".has-submenu" ).attr('aria-expanded', 'true').attr('aria-hidden', 'false');
					mobileSection.closest( ".has-submenu" ).find(".menu-contents").attr('aria-expanded', 'true');
				}
				
				// if ( $( ".has-submenu.open > div.mega-menu > .in-this-section > .navigation-content" ).length < 1 && $( ".has-submenu.open > div.mega-menu > .in-this-section > .nav-list" ).length < 1 ) {
					mobileSection = $( ".has-submenu.open > div.mega-menu > .in-this-section" );
					$( ".navigation-content" ).clone().addClass("sub-section").removeClass("navigation-content").appendTo( mobileSection );
				// }
			}
		}

		var secMobileSection;
		var secNavLinks = $( ".super-navigation-link-title" );

		for ( var i = 0; i < secNavLinks.length; i++ ) {
			secMobileSection = secNavLinks.eq( i );

			if( secMobileSection.text().trim() === secondLevel ) {

				if(checkSize("mobile")){
					secMobileSection.closest( ".has-submenu" ).addClass( "open" );
					secMobileSection.closest( ".menu-expand" ).attr('aria-expanded', 'true');
					secMobileSection.closest( ".has-submenu" ).attr('aria-expanded', 'true').attr('aria-hidden', 'false');
					secMobileSection.closest( ".has-submenu" ).find(".menu-contents").attr('aria-expanded', 'true').attr('aria-hidden','false');
				}


				if ( $( ".sidenav .navigation-content .subnavigation" ).length > 0 ) {

					// do when there is a submenu, don't when it's just the top level menu
					secMobileSection = $( ".super-navigation-menu .has-submenu.open ul" );
					secMobileSection.empty();

					if (checkTemplate("alumni-role")){
						$('.navigation-content > li summary').each(function(){
							$( secMobileSection ).append( "<li class='supernav-sublink'>" + $(this).html() + "</li>" );  
						});

						$( secMobileSection ).find(".nav-toggle").remove();
						$( secMobileSection ).find("a").removeClass();
					} else {
						$( ".nav-list" ).clone().height( "auto" ).appendTo( secMobileSection );
						$( ".navigation-content" ).clone().height( "auto" ).appendTo( secMobileSection );
						$( ".navigation-content" ).css( "padding", "1rem" );
						$( ".navigation-content .subnavigation" ).css( "padding-left", "1rem" );
					}

				}
			}
		}
	}

	
}
//END init_MobileNavCurrentPage





function toggleMobileSearchForm() {
	$ = nyu$;

	$( "header.header" ).toggleClass( "show-search" );

	if ( $( "header.header" ).hasClass( "show-search" ) ) {
		$( "#mobile-navigation-search" ).focus();
		$('#mobile-navigation-search').attr('aria-hidden', 'false').attr('tabindex','0');
		$('header .search-toggle').attr('aria-expanded', 'true');
	}
	else {
		$('header .search-toggle').attr('aria-expanded', 'false');
		$('#mobile-navigation-search').attr('aria-hidden', 'true').attr('tabindex','-1');
		$('header .search-toggle').focus();
	}
}
//END toggleMobileSearchForm

console.log('Admissions Module has been mounted.');

function init_admissionsFooter(){
	if ( $.trim( $('.admissions-footer .footer-content div').text() ).length == 0 ) {
		$(':not(cq-wcm-preview) .admissions-footer').addClass("empty");
	}
}
//END init_admissionsFooter
console.log('Secondary Links Module has been mounted.');

function init_Seclist() {
	$( ".secondary-links" ).each( function() {
		var me = $( this ),
			linkcont = me.find( ".sec-links-container" );

		me.resize = function() {
			if ( window.innerWidth < 400 ) {
				me.addClass( "turnlist" );

				linkcont.css( "height", "" );
			} else {
				var contheight = 0,
					counter = 0,
					links = me.find( "a" ),
					linkheight = 0;

				me.removeClass( "turnlist" );

				links.each( function() {
					linkheight = $( this ).height();

					counter++;

					contheight = contheight + linkheight;
				} );

				//if odd, make even
				if ( Math.abs( counter % 2 ) == 1 ) {
					counter++;

					contheight = contheight + linkheight;
				}

				contheight = Math.ceil( ( contheight + counter * 15 ) / 2 );

				linkcont.css( "height", contheight );
			}
		};

		$( window ).on( "resize", me.resize ).resize();
	} );
}
//END init_Seclist
console.log('Image Slider Module has been mounted.');

//Start Image Slider
function init_Slider() {
	$( ".image-slider" ).each( function() {
		var me = $( this ),
			fchild = me.find( ".image-component" ).first(),
			setheight = fchild.find( "img" ).height();

		me.hover(  function() {
			me.addClass( "hovered" );
		},  function() {
			me.removeClass( "hovered" );
		} );

		SlideThis = function() {
			slideNext = function() {

				$current = me.find( ".image-component:visible" );
				$next = $current.next( ".image-component" );

				if( $next.length == 0 ) {
					$next = fchild;
				}

				$current.hide();
				$next.show();
			};

			if ( !me.hasClass( "hovered" ) ) {
				setTimeout( slideNext, 1000 );
			}
		};

		setInterval( SlideThis, 4000 );
	} );
 }
//END Image Slider
console.log('Featured Profiles Module has been mounted.');

function init_Featprofiles() {
	$( ".featured-profile-component" ).each( function() {
		var me = $( this ),
			$slides = me.find( ".featured-slides" ),
			$controls = me.find( ".featured-profiles-controls" );

		me.slides = {
			total: $slides.length,
			slide: me.find( ".featured-slides.active" ),
			index: me.find( ".featured-slides.active" ).index(),
			prev: function() {
				if( me.slides.set( me.slides.index - 1 ) === false ) {
					me.slides.set( me.slides.total - 1 );
				}
			},
			next: function() {
				if ( me.slides.set( me.slides.index + 1 ) === false ) {
					me.slides.set( 0 );
				}
			},
			set: function( i ) {
				if ( i < 0 || i >= me.slides.total ) {
					return false;
				}

				me.find( ".active" ).removeClass( "active" );

				me.slides.index = i;
				me.slides.slide = me.find( ".featured-slides" ).eq( i ).addClass( "active" );
				me.find( ".current-slide-number" ).text( i + 1 );

				return i;
			}
		};

		me.find( ".current-slide-number" ).text( me.slides.index + 1 );
		me.find( ".total-slide-number" ).text( me.slides.total );

		$controls
			.on( "click", ".prev", me.slides.prev )
			.on( "click", ".next", me.slides.next );
	} );
}
//END init_Featprofiles



// function init_Featuredprofiles() {
// 	$( window ).on( "resize", function() {
// 		$( ".featured-profile-component" ).each( function() {
// 			var me = $( this ),
// 				imageheight = me.find( ".featured-image-container" ).height(),
// 				numberposition = imageheight + 20;

// 			if ( window.layout.below( "MOBILE:LANDSCAPE" ) ) {
// 				me.find( ".slide-order" ).css( "top", numberposition + "px" );
// 			} else {
// 				me.find( ".slide-order" ).css( "top", "" );
// 			}
// 		} );
// 	} ).resize();
// }
//END init_Featuredprofiles
console.log('Event Cal Module has been mounted.');


function init_EventCalListings() {
	$( ".event-cal-tabs a" ).on( "click", function( event ) { 
		event.preventDefault();
		event.stopPropagation();

		$( this ).closest( ".event-cal-tabs" ).find( "a" ).removeClass("active").attr('aria-expanded', 'false');
		$( this ).addClass( "active" ).attr('aria-expanded', 'true');

		$( this ).closest(".event-cal-listing").find(".event-cal-content-container" ).find( ".tab-panel" ).removeClass("active");
		$($( this ).attr("href")).addClass( "active" );
	});
}
// END init_EventCalListings
console.log('News Module has been mounted.');

function init_Storyarticleimg() {
	$( window ).on( "resize", function() {
		$( ".story-image-container" ).each( function() {

			var me = $( this ),
				storyimage = me.find( "img" ),
				storyimageheight = storyimage.height();

			if ( storyimageheight > 440 ) {
				me.css( "max-height", "440px" );
				me.css( "overflow", "hidden" );
			} else {
				me.css( "height", "" );
				me.css( "overflow", "" );
			}
		} );
	} ).resize();
}
//END init_Storyarticleimg





function init_NewsSeries() {
	$( document ).ready( function() {
		$( ".news.series .articles-count" ).text( $( ".news.series .single-post" ).length );
	} );
}
//END init_NewsSeries






$( ".storyarticle .post-information .bottom-portion .post-category" ).first().addClass( "first" );
$( ".storyarticle .post-information .bottom-portion .post-tag" ).first().addClass( "first" );
$( ".releasearticle .post-information .bottom-portion .post-category" ).first().addClass( "first" );
$( ".releasearticle .post-information .bottom-portion .post-tag" ).first().addClass( "first" );

$( ".storyarticle .post-information .bottom-portion .post-category" ).last().addClass( "last" );
$( ".storyarticle .post-information .bottom-portion .post-tag" ).last().addClass( "last" );
$( ".releasearticle .post-information .bottom-portion .post-category" ).last().addClass( "last" );
$( ".releasearticle .post-information .bottom-portion .post-tag" ).last().addClass( "last" );

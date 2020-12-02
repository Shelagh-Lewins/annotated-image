// image map area highlighting is done with the imagemapster jquery plugin
// using the version from Github / master that is fixed for recent jQuery: https://github.com/jamietre/ImageMapster/issues/284
// http://www.outsharked.com/imagemapster/default.aspx?docs.html

// data is loaded from the file scripts/data.js

let $itemlist;
let $mainImage;

// /////////////////////////////////
// Resize the map to fit within the boundaries provided
const resizeTime = 0; // total duration of the resize effect, 0 is instant
const resizeDelay = 100;// time to wait before checking the window size again
// the shorter the time, the more reactive it will be.
// short or 0 times could cause problems with old browsers.

function resize(maxWidth, maxHeight) {
	$mainImage.mapster('resize', maxWidth, maxHeight, resizeTime);
}

// Track window resizing events, but only actually call the map resize when the
// window isn't being resized any more

let resizeTimeout;

function callResize() {
	const wrapper = $('.main-image-holder');
	const maxHeight = wrapper.height();
	const maxWidth = wrapper.width();

	let newHeight = 0;
	let newWidth = 0;

	// on mobile, image is full width
	if (window.innerWidth <= 768) {
		newWidth = maxWidth;
	} else {
		// on wider screens, image is to the left
		const imageWidth = $($mainImage).prop('naturalWidth');
		const imageHeight = $($mainImage).prop('naturalHeight');

		if (imageHeight / maxHeight > imageWidth / maxWidth) {
			newHeight = maxHeight;
		} else {
			newWidth = maxWidth;
		}
	}

	resize(newWidth, newHeight);
}

function onWindowResize() {
	clearTimeout(resizeTimeout);

	resizeTimeout = window.setTimeout(() => {
		callResize();
		// at certain sizes, the containing div does not have the correct width at this point.
		// only after the resize() does it have the right width
		// I haven't worked out why
		// but resizing again after a short delay seems to fix it
		// problem happens in Chrome and Firefox
		window.setTimeout(() => {
			callResize();
		}, resizeDelay);
	}, resizeDelay);
}

$(window).bind('resize', onWindowResize);

// /////////////////////////////////
function buildDetailImages() {
	// build all detail images so that they will preload
	const parentElm = $('.item-detail-image');

	areaData.forEach((item) => {
		const fileName = item['data-item'];
		const fileExtension = item['file-extension'] || 'jpg';
		const elm = $(`<img src="images/${fileName}.${fileExtension}" class="${fileName}">`);
		$(parentElm).append(elm);
	});
}

function selectDetail(key) {
	// the image is not present initially because an empty image doesn't look right, so append it when an item is first selected
	const data = areaData.find(item => item['data-item'] === key);
	const { description } = data;

	$('.item-detail-text .inner').text(description);

	$('.item-detail-image img').each((index, elm) => {
		if ($(elm).attr('class') === key) {
			$(elm).css('display', 'inline');
		} else {
			$(elm).css('display', 'none');
		}
	});
}

function buildAreas() {
	const $imageMap = $('map[name="image-map"]');

	areaData.forEach((entry) => {
		const elm = $(`<area id="${entry['data-item']}" data-item="${entry['data-item']}" data-full="${entry['data-full']}" href="#" alt="${entry['data-full']}" title="${entry['data-full']}" coords="${entry.coords}" shape="rect">`);
		$imageMap.append(elm);
	});

	$($mainImage).attr('usemap', '#image-map');
}

function buildList(items) {
	let item;

	$itemlist.children().remove();
	for (let i = 0; i < items.length; i += 1) {
		const id = `radio_${items[i].key}`;
		item = $(`<div><input type="radio" id="${id}" name="items" data-item="${items[i].key}" value="${items[i].value}"><label for="${id}">${items[i].value}</label></div>`);

		$itemlist.append(item);
	}

	const radioButton = $($itemlist).find('input:radio');

	$(radioButton).on('change', (e) => {
		selectDetail($(e.target).attr('data-item'));
	});

	// return the list to mapster so it can bind to it
	return $itemlist.find('input:checkbox').unbind('click').click((e) => {
		const selected2 = $(this).is(':checked');
		$mainImage.mapster('set', selected2, $(this).attr('name'));
	});
}

function configureMainImage() {
	$mainImage.mapster({
		'isDeselectable': false, // radio buttons
		'singleSelect': true, // radio buttons
		'fillOpacity': 0,
		'stroke': true,
		'strokeColor': '007bff',
		'strokeOpacity': 1.0,
		'strokeWidth': 2,
		'render_highlight': {
			'fillOpacity': 0.2,
			'fillColor': 'ffffff',
			'stroke': true,
			'strokeOpacity': 1.0,
			'strokeColor': '0069d9',
			'strokeWidth': 2,
		},
		'boundList': $('.item-list').find('input'),
		'mapKey': 'data-item',
		'mapValue': 'data-full',
		'listKey': 'data-item',
		'listSelectedClass': 'selected',
		'listSelectedAttribute': 'checked',
		'sortList': 'asc',
		'onGetList': buildList,
		'onClick': (e) => { // I couldn't get the bound list to work reliably, so added my own onclick
			const radioButtons = $itemlist.find('input:radio');

			radioButtons.each((index, elm) => {
				const newChecked = ($(elm).attr('data-item') === e.key);

				$(elm).prop('checked', newChecked); // attr() is not reliable

				if (newChecked) {
					selectDetail(e.key);
				}
			});
		},
	});

	onWindowResize();

	window.setTimeout(() => {
		// this hides the original image before it has been rescaled
		// hiding this div seems unnecessary as mapster shows a new image on top of its canvas
		// but it seems prudent
		$('.hide-while-loading').css('display', 'none');
	}, 1000);
}

$(document).ready(() => {
	$itemlist = $('.item-list');
	$mainImage = $('#main_image');

	buildDetailImages();
	buildAreas();

	$('.items-header h3').text(titleText);
	$('.items-footer').html(footer);

	// this won't work for SEO but gives a meaningful title in the browser tab
	document.title = titleText;

	if ($mainImage[0].complete) { // image was probably cached
		configureMainImage();
	} else { // image reloaded
		$mainImage.on('load', () => {
			configureMainImage();
		});
	}
});

$(document).on('click', '.item-list input', (e) => {
	const el = $(e.target);

	$mainImage.mapster('set', true, el.attr('data-item'));
	// changing selections manually doesn't result in the boundList
	// being fired, we still have to set the state on the list item
});

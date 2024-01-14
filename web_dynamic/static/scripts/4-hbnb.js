// Write a JavaScript script (static/scripts/1-hbnb.js):

// Your script must be executed only when DOM is loaded
$(document).ready(function () {
    let selectedAmenities = {};

    // Listen for changes on each input checkbox tag:
    $('input[type="checkbox"]').change(function () {
		// if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
		let amenityId = $(this).data('id');
		let amenityName = $(this).data('name')
		if ($(this).prop('checked')) {
			selectedAmenities[amenityId] = amenityName
		} else {
			// if the checkbox is unchecked, you must remove the Amenity ID from the variable
			delete selectedAmenities[amenityId]
		}
		// update the h4 tag inside the div Amenities with the list of Amenities checked
		let selectedAmenitiesList = Object.values(selectedAmenities).join(', ');
		$(".amenities h4").text(selectedAmenitiesList);
		// console.log(selectedAmenities);
    })


    // make the request fromm the http://0.0.0.0:5001/api/v1/status/
    $.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
        if (data.status === 'OK') {
			// console.log(data.status);
            $("#api_status").addClass("available");
			// $("#api_status").css("background-color", "#ff545f");

        } else {
            $("#api_status").removeClass("available");
        }
    });
	$.post({
		url: "http://0.0.0.0:5001/api/v1/places_search/",
		data: JSON.stringify({}), // Replace yourData with the actual data you want to send
		contentType: "application/json", // Set the content type to JSON
		dataType: "json",
		success: function(response) {
			for (let place of response) {
				// console.log(place);
				let article = "<article><div class='title_box'><h2>" + place['name'] +
				"</h2><div class='price_by_night'>" + "$" + place['price_by_night'] +
				"</div></div><div class='information'><div class='max_guest'>" + place['max_guest'] +
				"</div><div class='number_rooms'>" + place['number_rooms'] +
				"</div><div class='number_bathrooms'>" + place['number_bathrooms'] +
				"</div></div><div class='description'>" + place['description'] + "</div></article>";
				$('section.places').append(article);
			}
		},
		error: function(error) {
		  // Handle errors here
		}
	  });
	$('button').click(function() {
		let amenitiesList = []
		for (let amen in selectedAmenities) {
			amenitiesList.push(amen)
		}
		console.log(amenitiesList);
		$.post({
			url: "http://0.0.0.0:5001/api/v1/places_search/",
			data: JSON.stringify({"states":[], "cities": [],"amenities":amenitiesList}), // Replace yourData with the actual data you want to send
			contentType: "application/json", // Set the content type to JSON
			dataType: "json",
			success: function(response) {
				$('.places').empty()
				for (let place of response) {
					// console.log(place);
					let article = "<article><div class='title_box'><h2>" + place['name'] +
					"</h2><div class='price_by_night'>" + "$" + place['price_by_night'] +
					"</div></div><div class='information'><div class='max_guest'>" + place['max_guest'] +
					"</div><div class='number_rooms'>" + place['number_rooms'] +
					"</div><div class='number_bathrooms'>" + place['number_bathrooms'] +
					"</div></div><div class='description'>" + place['description'] + "</div></article>";
					$('section.places').append(article);
				}
			},
			error: function(error) {
			  // Handle errors here
			}
		  });
	})

});
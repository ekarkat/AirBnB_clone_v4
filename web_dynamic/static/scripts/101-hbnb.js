// Write a JavaScript script (static/scripts/1-hbnb.js):

// Your script must be executed only when DOM is loaded
$(document).ready(function () {
    let selectedAmenities = {};
	let selectedStates = {};
	let selectedCities = {};

    // Listen for changes on each input checkbox tag:
    $('.amenities input[type="checkbox"]').change(function () {
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



    $('.states input[type="checkbox"]').change(function () {
		// if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
		let stateId = $(this).data('id');
		let stateName = $(this).data('name')
		if ($(this).prop('checked')) {
			selectedStates[stateId] = stateName
		} else {
			// if the checkbox is unchecked, you must remove the Amenity ID from the variable
			delete selectedStates[stateId]
		}
		// update the h4 tag inside the div Amenities with the list of Amenities checked
		let selectedStateList = Object.values(selectedStates).join(', ');
		$(".locations h4").text(selectedStateList);
		// console.log(selectedStates);
    })


    $('.cities input[type="checkbox"]').change(function () {
		// if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
		let cityId = $(this).data('id');
		let cityName = $(this).data('name')
		if ($(this).prop('checked')) {
			selectedCities[cityId] = cityName
		} else {
			// if the checkbox is unchecked, you must remove the Amenity ID from the variable
			delete selectedCities[cityId]
		}
		// console.log(selectedCities);
		let selectedCityList = Object.values(selectedCities).join(', ');
		$(".locations h4").text(selectedCityList);
		// update the h4 tag inside the div Amenities with the list of Amenities checked
		// console.log(selectedAmenities);
    })


	function get_user_name(user_id) {
		return new Promise(function (resolve, reject) {
			$.get({
				url: "http://0.0.0.0:5001/api/v1/users/" + user_id,
				success: function (response) {
					resolve(response["first_name"] + " " + response["last_name"]);
				},
				error: function (error) {
					reject(error);
				}
			});
		});
	}



	function get_reviews_info(place_id) {
		return new Promise(function (resolve, reject) {
			$.get({
				url: "http://0.0.0.0:5001/api/v1/places/" + place_id + "/reviews",
				success: function (response) {
					let rev_texts = []
					for (let rev of response) {
						// console.log(rev)
						rev_texts.push({"text":rev['text'], "user_id":rev['user_id'], "time":rev["created_at"]})
					}
					resolve(rev_texts);
				},
				error: function (error) {
					reject(error);
				}
			});
		});
	}

	function get_reviews_username(user_id) {
		return new Promise(function (resolve, reject) {
			$.get({
				url: "http://0.0.0.0:5001/api/v1/users/" + user_id,
				success: function (response) {
					resolve(response["first_name"]+ " " +response["last_name"]);
				},
				error: function (error) {
					reject(error);
				}
			});
		});
	}


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
		success: async function(response) {
			$('.places').empty()
			for (let place of response) {
				let reviewsListInfo = await get_reviews_info(place['id']);

				// console.log(reviewsList)
				// console.log("********************************")
				let name = await get_user_name(place['user_id']);
				let article = "<article><div class='title_box'><h2>" + place['name'] +
				"</h2><div class='price_by_night'>" + "$" + place['price_by_night'] +
				"</div></div><div class='information'><div class='max_guest'>" + place['max_guest'] +
				"</div><div class='number_rooms'>" + place['number_rooms'] +
				"</div><div class='number_bathrooms'>" + place['number_bathrooms'] +
				"</div></div>" + "<div class='user'> <b>Owner: </b>" + name + "</div>" + "<div class='description'>" + place['description'] + "</div>"
				+ "<div class='reviews'><h2>Reviews</h2></div></article>";
				$('section.places').append(article);
				for (let rev of reviewsListInfo) {
					let username = await get_reviews_username(rev['user_id'])
					let date = [year, month, day] = rev['time'].split("T")[0].split("-");
					let formattedDate = `${year}-${month}-${day}`;
					let reviews = "<ul><li><h3>From: " + username + " on the " +formattedDate + "</h3><p>" + rev['text'] + "</p></li></ul>";
					// Find the '.reviews' element within the current article and append the reviews
					$('section.places article:last-child').find('.reviews').append(reviews);
				}
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
		let stateList = []
		for (let state in selectedStates) {
			stateList.push(state)
		}
		let cityList = []
		for (let city in selectedCities) {
			cityList.push(city)
		}

		$.post({
			url: "http://0.0.0.0:5001/api/v1/places_search/",
			data: JSON.stringify({"states":stateList, "cities":cityList,"amenities":amenitiesList}), // Replace yourData with the actual data you want to send
			contentType: "application/json", // Set the content type to JSON
			dataType: "json",
			success: async function(response) {
				$('.places').empty()
				for (let place of response) {
					let reviewsListInfo = await get_reviews_info(place['id']);
	
					// console.log(reviewsList)
					// console.log("********************************")
					let name = await get_user_name(place['user_id']);
					let article = "<article><div class='title_box'><h2>" + place['name'] +
					"</h2><div class='price_by_night'>" + "$" + place['price_by_night'] +
					"</div></div><div class='information'><div class='max_guest'>" + place['max_guest'] +
					"</div><div class='number_rooms'>" + place['number_rooms'] +
					"</div><div class='number_bathrooms'>" + place['number_bathrooms'] +
					"</div></div>" + "<div class='user'> <b>Owner: </b>" + name + "</div>" + "<div class='description'>" + place['description'] + "</div>"
					+ "<div class='reviews'><h2>Reviews</h2></div></article>";
					$('section.places').append(article);
					for (let rev of reviewsListInfo) {
						let username = await get_reviews_username(rev['user_id'])
						let date = [year, month, day] = rev['time'].split("T")[0].split("-");
						let formattedDate = `${year}-${month}-${day}`;
						let reviews = "<ul><li><h3>From: " + username + " on the " +formattedDate + "</h3><p>" + rev['text'] + "</p></li></ul>";
						// Find the '.reviews' element within the current article and append the reviews
						$('section.places article:last-child').find('.reviews').append(reviews);
					}
				}
			},
			error: function(error) {
			  // Handle errors here
			}
		  });
	})

});
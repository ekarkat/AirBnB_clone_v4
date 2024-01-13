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
    })

    
    // if the checkbox is unchecked, you must remove the Amenity ID from the variable
    // update the h4 tag inside the div Amenities with the list of Amenities checked
});
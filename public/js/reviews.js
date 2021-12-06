(function($){
    let viewPage = $('#view-page');

    function getReviews(){
        let requestConfig = {
            method: 'GET',
            url: '/travel-bliss/reviews/reviewsId'
        }

        $.ajax(requestConfig).then(function(responseMessage){
            console.log(responseMessage);
            var newElement = $(responseMessage);
            bindEvents(newElement);
            viewPage.html(newElement);
        })
    }

    function bindEvents(element) {
		element.find('.delete-review').on('click', function(event) {
			event.preventDefault();
			var href = $(this).attr('href');
            var arr = href.split('=');
            const review_id = arr[1];
			

			var requestConfig = {
				method: 'DELETE',
				url: '/travel-bliss/reviews/' + review_id
			};

			$.ajax(requestConfig).then(function(responseMessage) {
				getReviews();
			});
		});
	}

    $('a[href="#my_reviews"]').click(function(event){
        event.preventDefault();
        getReviews();
    }); 

    
})(window.jQuery);
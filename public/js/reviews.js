(function($){
    let viewPage = $('#view-page');

    function getReviews(){
        let requestConfig = {
            method: 'GET',
            url: '/travel-bliss/reviews/reviewsId'
        }

        $.ajax(requestConfig).then(function(responseMessage){
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

        element.find('.edit-review').on('click', function(event){
            event.preventDefault();
            var href = $(this).attr('href');
            var arr = href.split('=');
            const review_id = arr[1];

            $('#editReviewModal').modal('show');
            $('#review-input').val("");
            $('#rating-input').val("");
            $('#review-error').hide();
            let requestConfig = {
                    method: 'GET',
                    url: 'travel-bliss/reviews/user'
                };
            let review;    
            $.ajax(requestConfig).then(function(responseMessage){
                     var reviewsJson = $(responseMessage);
                     const reviews = reviewsJson[0].reviews;
                    review = reviews.find(review => review.id === review_id);

                     $('#review-input').val(review.review);
                     $('#rating-input').val(review.rating);
            })

            $('#save-review-changes').on('click', function(event){
                let newReview = $('#review-input').val();
                    newRating = $('#rating-input').val();
                    reviewError = $('#review-error');
                
                
                if(newRating && newRating.trim() > 0){
                    let intRating = parseFloat(newRating); 
                    if(intRating > 5 || intRating < 1){
                        reviewError.text('Rating should be in between 1-5');
                        reviewError.show();
                        return;
                    }
                }else{
                    reviewError.text('Please enter a valid number for rating.');
                    reviewError.show();
                    return;
                }
                if(!newReview || newReview.trim() < 1){
                    reviewError.text('Please enter a valid string.');
                    reviewError.show();
                    return;
                }  

                let requestConfig = {
                    method: 'PATCH',
                    url: 'travel-bliss/reviews/'+review_id,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "rating": newRating,
                        "review": newReview
                    })
                };
                $.ajax(requestConfig).then(function(responseMessage){
                    $('#editReviewModal').modal('toggle');
                    setTimeout(() => {
                        getReviews();
                    }, 500);
                })
            })
        })
	}

    $('a[href="#my_reviews"]').click(function(event){
        event.preventDefault();
        getReviews();
    }); 
    
    
})(window.jQuery);
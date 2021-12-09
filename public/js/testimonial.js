(function($){
    let viewPage = $('#view-page');

    $('a[href="#add_testimonial"]').click(function(event){
        event.preventDefault();
        let requestConfig = {
            method: 'GET',
            url: '/travel-bliss/testimonials/addTestimonial'
        }

        $.ajax(requestConfig).then((responseMessage)=>{
            const newElement = $(responseMessage);
            bindEvents(newElement);
            viewPage.html(newElement);
        })
    }); 

    function bindEvents(element){
        element.find('#add-testimonial-form').submit(function(event){
            event.preventDefault();

            let testimonial = $('#add-testimonial').val();
            let error = $('#testimonial-error');
            error.hide();
            
            if(!testimonial || testimonial.trim()<1){
                error.text('Invalid input for Testimonial');
                error.show();
                return;
            }
            let requestConfig = {
                method: 'POST',
                url : "/travel-bliss/testimonials",
                contentType: 'application/json',
                data: JSON.stringify({
                    testimonial : testimonial,
                })
            }

            $.ajax(requestConfig).then(function(responseMessage){
                alert("You testimonial is uploaded successfully");
            })
        })
    }
    

})(window.jQuery);
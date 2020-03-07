$( document ).ready(function() {
	var $form = $('#payment-form');
	$form.find('.subscribe').on('click', sendForm);
	
	$('#cardHolder').on('keyup change', function(){
		var card_holder = '';
		card_holder += $(this).val();
		$('#cc-holder').html(card_holder);
	});
	
	$('#cardNumber').on('keyup change', function(){
	    var card_number = '';
	    card_number += $(this).val();
	    $('#cc-number').html(card_number);
	});
	
	$('#cardExpiry').on('keyup change', function(){
	    var card_number = '';
	    card_number += $(this).val();
	    $('#cc-expires').html(card_number);
	});
	
	$('#cardCVC').on('keyup change', function(){
	    var card_number = '';
	    card_number += $(this).val();
	    $('#cc-ccv').html(card_number);
	});
	
	function sendForm() {
		if (!validator.form()) {
		    return false;
		}
		$form.find('.subscribe').html('Validating <i class="fa fa-spinner fa-pulse"></i>').prop('disabled', true);
		$('#cardHolder').attr('readonly','readonly');
		$('#cardNumber').attr('readonly','readonly');
		$('#cardExpiry').attr('readonly','readonly');
		$('#cardCVC').attr('readonly','readonly');
		$form.find('.subscribe').html('Processing <i class="fa fa-spinner fa-pulse"></i>');
		$form.submit();
	}
	
	$('input[name=cardNumber]').payment('formatCardNumber');
	$('input[name=cardCVC]').payment('formatCardCVC');
	$('input[name=cardExpiry').payment('formatCardExpiry');
	
	$.validator.addMethod("cardNumber", function(value, element) {
	    return this.optional(element) || validateCardNumber(value);
	}, "Please specify a valid credit card number.");
	
	$.validator.addMethod("cardExpiry", function(value, element) {    
	    value = $.payment.cardExpiryVal(value);
	    return this.optional(element) || validateExpiry(value.month, value.year);
	}, "Invalid expiration date.");
	
	$.validator.addMethod("cardCVC", function(value, element) {
	    return this.optional(element) || validateCVC(value);
	}, "Invalid CVC.");
	
	validator = $form.validate({
		rules: {
			cardHolder: {
	            required: true,
	        },
			cardNumber: {
				required: true,
				cardNumber: true            
			},
			cardExpiry: {
				required: true,
				cardExpiry: true
			},
			cardCVC: {
				required: true,
				cardCVC: true
			}
		},
		messages: {
	        cardHolder: {
	            required: "Required",
	        },
	        cardNumber: {
	            required: "Required",
	        },
	        cardExpiry: {
	            required: "Required",
	        },
	        cardCVC: {
	            required: "Required",
	        },
	    },
		highlight: function(element) {
			$(element).closest('.form-control').removeClass('success').addClass('error');
		},
		unhighlight: function(element) {
			$(element).closest('.form-control').removeClass('error').addClass('success');
		},
		errorPlacement: function(error, element) {
			$(element).closest('.form-group').append(error);
		}
	});
	
	paymentFormReady = function() {
		if ($form.find('[name=cardNumber]').hasClass("success") &&
			$form.find('[name=cardExpiry]').hasClass("success") &&
			$form.find('[name=cardCVC]').val().length > 2) {
			return true;
		} else {
			return false;
		}
	}
	
	$form.find('.subscribe').prop('disabled', true);
	var readyInterval = setInterval(function() {
		if (paymentFormReady()) {
			$form.find('.subscribe').prop('disabled', false);
		} else {
			$form.find('.subscribe').prop('disabled', true);
		}
	}, 250);
	
	function validateCardNumber(value) {
	    if (/[^0-9-\s]+/.test(value)) return false;
	    var nCheck = 0, nDigit = 0, bEven = false;
	    value = value.replace(/\D/g, "");
	    for (var n = value.length - 1; n >= 0; n--) {
	        var cDigit = value.charAt(n),
	              nDigit = parseInt(cDigit, 10);
	        if (bEven) {
	            if ((nDigit *= 2) > 9) nDigit -= 9;
	        }
	        nCheck += nDigit;
	        bEven = !bEven;
	    }
	    return (nCheck % 10) == 0;
	}
	
	function validateExpiry(month, year) {
		var today = new Date();
		var someday = new Date();
		var thisYear = today.getFullYear();
		var lastYear = thisYear + 20;
		someday.setFullYear(year, month, 1);
		if (someday < today) {
		   return false;
		}
		if (year > lastYear) {
	       return false;
	    }
	    return true;
	}
	
	function validateCVC(value) {
		if (value.length<3) {
	        return false;
	    }
	    return true;
	}
});
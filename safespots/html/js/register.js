$(document).ready(function() {
	var emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
	var nameReg = /[a-zA-Z]+/;

	$("#fname").keyup(function() {
		if(nameReg.test(this.value))
			$("#fnameSpan").removeClass("invalid").addClass("valid");
		else
			$("#fnameSpan").removeClass("valid").addClass("invalid");
	});
	$("#lname").keyup(function() {
		if(nameReg.test(this.value))
			$("#lnameSpan").removeClass("invalid").addClass("valid");
		else
			$("#lnameSpan").removeClass("valid").addClass("invalid");
	});
	$("#email").keyup(function() {
		if(emailRegex.test($("#email").val()))
			$("#emailSpan").removeClass("invalid").addClass("valid");
		else
			$("#emailSpan").removeClass("valid").addClass("invalid");
	});
	$("#username").keyup(function() {
		if($("#username")[0].value.length > 0) {
			$("#userSpan").removeClass("invalid").addClass("valid");
		}
		else
			$("#userSpan").removeClass("valid").addClass("invalid");
	});
	$("#password").keyup(function() {
		if(this.value.length > 7 && this.value.length < 41) {
			$("#passSpan").removeClass("invalid").addClass("valid");
			if (this.value == $("#confirmation").val()) {
				$("#confSpan").removeClass("invalid").addClass("valid");
			}
			else {
				$("#confSpan").removeClass("valid").addClass("invalid");
			}
		}
		else {
			$("#passSpan").removeClass("valid").addClass("invalid");
			$("#confSpan").removeClass("valid").addClass("invalid");
		}
	});
	$("#confirmation").keyup(function() {
		if(this.value == $("#password").val()) {
			$("#confSpan").removeClass("invalid").addClass("valid");
		}
		else
			$("#confSpan").removeClass("valid").addClass("invalid");
	});
	$("#submitButton").click(function() {
		var creds = true;
		var spans = $("form span");
		var invalidTest = /invalid/;
		for(i = 0; i < spans.length; i++) {
			if(invalidTest.test(spans[i].className)) {
				creds = false;
			}
		}
		if(creds) {
			var data = {
				user: $("#username").val(),
				pass: $("#password").val(),
				email: $("#email").val(),
				first: $("#fname").val(),
				last: $("#lname").val()
			}
			var data_JSON = JSON.stringify(data);
			var settings = {
				type: "POST",
				data: data_JSON,
				dataType: "json",
				url: "/api/users",
				success: function() {
					$("h3").remove();
					$("#regHead").after("<h3 class='valid'>Registration complete!</h3>");
				},
				error: function() {
					$("h3").remove();
					$("#regHead").after("<h3 class='invalid'>Something went wrong</h3>");
				}
			}
			$.ajax(settings);
		}
		else {
			$("h3").remove();
			$("#regHead").after("<h3 class='invalid'>Invalid Form! Please review your registration and try again.</h3>");
		}

	})


})

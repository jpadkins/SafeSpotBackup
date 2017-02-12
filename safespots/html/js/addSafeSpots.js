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
        var address = $("#address").val() + $("#city").val() + $("#state").val() + $("#postalCode").val();
        var google_url = "http://maps.googleapis.com/maps/api/geocode/json?address=";
        var sensor = "&sensor=false";
        var long;
        var lat;
        
        function myFunction(){ 
            $.getJSON(
            google_url+dir1+sensor,
            function(result){
                lat = JSON.stringify(result.results[0].geometry.bounds.northeast.lat) )
                long = JSON.stringify(result.results[0].geometry.bounds.northeast.lng) )  
            };
        var data = {
            lng: long,
            lat: lat
        }
        var data_JSON = JSON.stringify(data);
        var settings = {
            type: "POST",
            data: data_JSON,
            dataType: "json",
            url: "public/api/users/safespots",
            success: function() {
                $("h3").remove();
                $("#addSafeSpot").after("<h3 class='valid'>SafeSpot Added!</h3>");
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
        $("#addSafeSpot").after("<h3 class='invalid'>Invalid Address</h3>");
    }
    }
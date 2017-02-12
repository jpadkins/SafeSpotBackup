/**
 * Created by PRO on 10/20/2015.
 */

$(document).ready(function(){
    var ecInfo; //these 2 are global only for the vanilla wersion of this page
    var ecLen;

    /*$.ajax({
        type:'GET',
        url: 'api/users/logged_in',
        success:
    })*/

    var global_user_data = {};

    function set_username() {
        $.ajax({
            type: 'GET',
            url: '/api/users',
            success: function(res) {
                global_user_data = JSON.parse(res);
                $('#s_user').text('Hello ' + global_user_data['user']);
                $('#s_first').text('first name: ' + global_user_data['first']);
                $('#s_last').text('last name: ' + global_user_data['last']);
                $('#s_email').text('email: ' + global_user_data['email']);
                $('#s_pin').text('pin: ' + global_user_data['pin']);
                $('#s_timeout').text('timeout: ' + global_user_data['timeout']);
            },
            error: function(err) {
                console.log('error!');
            }
        });
    }

    //Get user safespots (if they exist) and populate a list with them
    $.ajax({
        type: 'GET',
        url: '/api/spots',
        success: function(res) {
            var safespots = JSON.parse(res);
            var safespotLen = safespots.length();
            if(safespotLen > 0) {
                for (i = 0; i < safespotLen; i++) {
                    $('#ul_safespots').append('<li value="' + safespots[i].name + '">' + safespots[i].name + '<span>  </span><button value="' + safespots[i].name + '" ' + 'class="deleteSS" id="' + i + '">Delete</button></li>');
                    /* <p style="display: inline" value="'+
                     safespots[i].name + '" name="' + safespots[i].name +
                     '" class="editSS" id="'+ i +'">(edit)</p><br>');*/
                }
                $("#show_safespots").show();
            }
        },
        error: function(err) {
            console.log('Error Obtaining Safespots!');
        }
    });



    $.ajax({
        type:'GET',
        url:'/api/users/contacts',
        dataType: 'json',
        success:function(data){
            console.log("Obtained EC info! : " + data);
            ecInfo = JSON.parse(data);
            ecLen = ecInfo["contacts"].length;
            if(ecLen != 0)
            {
                for(var x = 0; x < ecLen; x++ ){
                    $("#ec").append('<li value="'+ ecInfo["contacts"][x].phone +'">'+ ecInfo["contacts"][x].first +' '
                      + ecInfo["contacts"][x].last + '</li><p style="display: inline" value="'+ ecInfo["contacts"][x].phone
                      +'" class="deleteEC" id="'+ x +'">(-)</p> <p style="display: inline" value="'+ ecInfo["contacts"][x].phone
                      + '" name="' + ecInfo["contacts"][x].first +'" class="editEC" id="'+ x +'">(edit)</p><br>');
                    console.log("Contact No. and First name:"+x+", "+ecInfo["contacts"][x].first);
                }
                $("#show_EC").show();
            }
        },
        error: function(err) {
            console.log('error!');
        }
    });

    //**** Add this later to make a user-specific header
    //$("#acc_mng_header").append('<h1 id="h_user">'+ userInfo.fname +" "+ userInfo.lname+'</h1>');


    //$$$$$$$$$$$$$$$$testing

    userInfo = {
        fname: "Ziga",
        lname: "Cerkovnik",
        phone: "7671112233",
        email: "myname.isjeff@gmailcom",
        pin: 0002,

    };
    /*
    ecInfo = { 
        contacts: [{
            first: "Ken",
            last: "Howard",
            phone: 2142223434,
            street: "xyz 12a",
            city: "Dallas",
            state: "Texas"
        },
        {
            first: "Marta",
            last: "Stewart",
            phone: 6763211234,
            street: "xyville 11b",
            city: "Jacksonville",
            state: "Florida"
        }]
    };
    
    ecLen = ecInfo["contacts"].length;
   
  
            if(ecLen != 0)
            {
             for(var x = 0; x < ecLen; x++ ){
                 $("#ec").append('<li value="'+ ecInfo["contacts"][x].phone +'">'+ ecInfo["contacts"][x].first +' '
                 + ecInfo["contacts"][x].last + '</li><p style="display: inline" value="'+ ecInfo["contacts"][x].phone
                 +'" class="deleteEC" id="'+ x +'">(-)</p> <p style="display: inline" value="'+ ecInfo["contacts"][x].phone
                 + '" name="' + ecInfo["contacts"][x].first +'" class="editEC" id="'+ x +'">(edit)</p><br>');
                 console.log("Contact No. and First name:"+x+", "+ecInfo["contacts"][x].first);
             }
                $("#show_EC").show();

            }

    safespots = [
        {
            name: 'Home',
            lat: 32.812769,
            lng:-96.782947
        },
        {
            name: 'Police Station',
            lat: 31.812769,
            lng:-96.222947
        }
    ];
    var safespotLen = safespots.length;
    if(safespotLen > 0) {
        for (i = 0; i < safespotLen; i++) {
            $('#ul_safespots').append('<li value="' + safespots[i].name + '">' + safespots[i].name + '<span>  </span><button value="' + safespots[i].name + '" ' + 'class="deleteSS" id="' + i + '">Delete</button></li>');/* <p style="display: inline" value="'+
                safespots[i].name + '" name="' + safespots[i].name +
                '" class="editSS" id="'+ i +'">(edit)</p><br>');
        }
        $("#show_safespots").show();
    }

	*/ 

	

    $("#ec").on('click', ".deleteEC", function(){
        var pnum = $(this).attr('value');
        var nameID = $(this).attr('id');
        var ecFirst;
        var ecLast;
        var ecCity;
        var ecState
        var ecStreet;
        var ecPhone;
        var findPhone = $("#ec");

        findPhone.find('li[value="'+pnum+'"]').remove();
        findPhone.find('p[value="'+pnum+'"]').remove();
        var pnum1 = parseInt(pnum);
        for(var i = 0; i < ecLen; i++ ){
            if(parseInt(ecInfo["contacts"][i].phone) === pnum1){
                ecCity = ecInfo["contacts"][i].city;
                ecFirst = ecInfo["contacts"][i].first;
                ecLast = ecInfo["contacts"][i].last;
                ecPhone = ecInfo["contacts"][i].phone;
                ecState = ecInfo["contacts"][i].state;
                ecStreet = ecInfo["contacts"][i].street;
            }
        }

        var toDelete = {city: ecCity, first: ecFirst, last: ecLast, phone: ecPhone, state: ecState,
        street: ecStreet};
        console.log("Name to delete: " + toDelete.first + ' ' + toDelete.last);
        var nameDelete = JSON.stringify(toDelete);
        console.log(nameDelete);
        //**test
        //delete ecInfo["contacts"][x];
        //**/test

        $.ajax({
            method: 'DELETE',
            url: '/api/contacts',
            //dataType: 'json',
            data: nameDelete,
            success:function(res){
                console.log("Sucessfully deleted an EC! : " + res);
            },
            error:function(err){
                console.log("Error with DELETING a contact : " + err);
            }
        });

    });

    //***Edit EC info:
    $("#ec").on('click', ".editEC", function(){
        $("#add_EC_info").show();
        var b_name;
        var b_num = $(this).attr('value');
        var b_nameID = $(this).attr('id');
        console.log(b_num);
        console.log(b_nameID);
        b_num = parseInt(b_num);

        for(var x = 0; x < ecLen; x++ ){
            if(b_num == ecInfo["contacts"][x].phone){
                editEC = ecInfo["contacts"][x];
                var form = $("#new_EC");
                form.find("#EC_fname").attr({value: editEC.first, placeholder: editEC.first});
                form.find("#EC_lname").attr({value: editEC.last, placeholder: editEC.last});
                form.find("#EC_pnum").attr({value: editEC.phone, placeholder: editEC.phone});
                form.find("#EC_street").attr({value: editEC.street, placeholder: editEC.street});
                form.find("#EC_city").attr({value: editEC.city, placeholder: editEC.city});
                form.find("#EC_state").attr({value: editEC.state, placeholder: editEC.state});
            }
        }

        //var ecNum = parseInt(b_num);
        for(var i = 0; i < ecLen; i++ ){
            if(parseInt(ecInfo["contacts"][i].phone) === b_num){
                b_name = ecInfo["contacts"][i].first;
                console.log("Contact being edited:" + b_name);
                var contact = ecInfo["contacts"][i];
                //Delete contact
                var toDelete = {
                    city: contact.city,
                    first: contact.first,
                    last: contact.last,
                    phone: contact.phone,
                    state: contact.state,
                    street: contact.street
                };
                var _toDelete = JSON.stringify(toDelete);
                delete_contact(_toDelete);

            }
        }
        //var toDelete = {name: b_name};
        //var nameDelete = JSON.stringify(toDelete);


        /*
        $.ajax({
            type:'DELETE',
            url:'/api/contacts',
            data: nameDelete,
            success:function(){
                console.log("Successfully deleted an EC!");
            },
            error:function(){
                console.log("Error with DELETING a contact");
            }
        });*/
    });

    $("#ul_spots").on('click', ".deleteSS", function(){
        var name = $(this).attr('value');
        var nameID = $(this).attr('id');
        var ssName;
        var ssLat;
        var ssLng;
        var findName = $("#ul_safespots");

        findName.find('li[value="'+name+'"]').remove();
        findName.find('p[value="'+name+'"]').remove();
        //var name1 = parseInt(name);
        for(var i = 0; i < safespotLen; i++ ){
            if(safespots[i].name === name){
                ssName = safespots[i].name;
                ssLat = safespots[i].lat;
                ssLng = safespots[i].lng;
            }
        }

        var toDelete = {name: ssName, lat:ssLat, lng: ssLng};
        console.log("Safespot to delete: " + toDelete.name);
        var ssDelete = JSON.stringify(toDelete);
        //**test
        //delete ecInfo["contacts"][x];
        //**/test

        $.ajax({
            method: 'DELETE',
            url: '/api/safespots',
            //dataType: 'application/json',
            data: ssDelete,
            success:function(res){
                console.log("Sucessfully deleted an EC! : " + res);
            },
            error:function(err){
                console.log("Error with DELETING a contact : " + err);
            }
        });

    });





    //Change the e-mail:
    $("#b_submit_email").click(function(e){
        e.preventDefault();
        var newEmail = $("#new_email").val();
        console.log("New email is " + newEmail);
        var email = {
            field: 'email',
            value: newEmail
        };
        newEmail = JSON.stringify(email);

        $.ajax({
            type: 'PUT',
            url: '/api/users',
            data: newEmail,
            contentType: 'application/json',
            success:function(res){
                console.log("New Email POSTED : " + res);
                $("#new_email").val('');
            },
            error:function(err){
                console.log("Error with POSTING email" +err);
            }
        });

    });

    //Create new PIN:

    $("#b_submit_pin").click(function(e){
        e.preventDefault();
        var newPIN = $("#new_pin").val();
        console.log("New Pin is " + newPIN);
        var nPin = {
            field: 'pin',
            value: newPIN
        };
        console.log(nPin);
        newPIN = JSON.stringify(nPin);

        $.ajax({
            type: 'PUT',
            url: '/api/users',
            dataType: 'application/json',
            data: newPIN,
            success:function(res){
                console.log("New PIN POSTED " + res);
                 $("#new_pin").val('');
            },
            error:function(){
                console.log("Error with POSTING PIN");
            }
        });
    });

    //Create new password:
    $("#b_submit_pass").click(function(e){
        e.preventDefault();
        var newPass = $("#new_pass").val();
        var nPass = {
            field: password,
            value: newPass
        };
        newPass = JSON.stringify(nPass);
        $.ajax({
            type: 'PUT',
            url: '/api/users',
            data: newPass,
            dataType: 'application/json',
            success:function(res){
                console.log("New Password POSTED : " + res);
            },
            error:function(err){
                console.log("Error with posting new Password");
            }
        });

    });

    $("#b_addMoreEC").click(function(){
        var temp = $("#add_EC_info");
        //console.log(temp.css('display'));//val('display'));
        if(temp.css('display') === "block"){
            $("#add_EC_info").hide();
        }
        else{
            $("#add_EC_info").show();
        }
        //console.log("Enable adding Contacts");
    });

    $("#add_ED").click(function(){
        var form = $("#new_EC");
        var fName = form.find('input:text[id=EC_fname]').val();
        var lName = form.find('input:text[id=EC_lname]').val();
        var pNum = form.find('input:text[id=EC_pnum]').val();
        var _street = form.find('input:text[id=EC_street]').val();
        var _city = form.find('input:text[id=EC_city]').val();
        var _state = form.find('input:text[id=EC_state]').val();

        var new_EC = {
            first: fName,
            last: lName,
            phone: pNum,
            street: _street,
            city: _city,
            state: _state
        };


        var json_new_EC = JSON.stringify(new_EC);
        console.log(json_new_EC);
        //****test
        //ecInfo["contacts"].push(new_EC);
        //*****test
        $.ajax({
            type: 'POST',
            url: '/api/contacts',
            data: json_new_EC,
            dataType: 'json',
            success:function(){
                console.log("New EC successfully added!");
                location.reload();
            },
            error:function(){
                console.log("Error with submitting new EC");
            }
        });

    });

});

function delete_contact(contact){
    $.ajax({
        type:'DELETE',
        url:'/api/contacts',
        data: contact,
        dataType: 'application/json',
        success:function(){
            console.log("Successfully deleted an EC!");
        },
        error:function(){
            console.log("Error with DELETING a contact");
        }
    });
}

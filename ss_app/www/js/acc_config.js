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

    $.ajax({
        type:'GET',
        url:'/public/api/users/contacts',
        //dataType: 'json',
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
        }
    });

    //**** Add this later to make a user-specific header
    //$("#acc_mng_header").append('<h1 id="h_user">'+ userInfo.fname +" "+ userInfo.lname+'</h1>');


    /*$$$$$$$$$$$$$$$$testing purpose

    userInfo = {
        fname: "Ziga",
        lname: "Cerkovnik",
        phone: "7671112233",
        email: "myname.isjeff@gmailcom",
        pin: 0002,

    };
    ecInfo = { //**************This will be substituted for jscript struct obtained from contact list
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
    //$$$$$$$$$$$$$$$$$$test
    ecLen = ecInfo["contacts"].length;
    //console.log(ecLen);
    //console.log(ecInfo["contacts"][0].name);
            if(ecLen != 0)
            {
                $("#show_EC").show();
                for(var x = 0; x < ecLen; x++ ){
                    $("#ec").append('<li value="'+ ecInfo["contacts"][x].phone +'">'+ ecInfo["contacts"][x].first +' '+ ecInfo["contacts"][x].last + '</li><p style="display: inline" value="'+ ecInfo["contacts"][x].phone +'" class="deleteEC" id="'+ x +'">(-)</p> <p style="display: inline" value="'+ ecInfo["contacts"][x].phone +'" name="'+ ecInfo["contacts"][x].first +'" class="editEC" id="'+ x +'">(edit)</p><br>');
                    console.log(ecInfo["contacts"][x].name);
                }

            }

    //$$$$$$$$$$$$$$$$$/test
*/


    $("#ec").on('click', ".deleteEC", function(){
        var pnum = $(this).attr('value');
        var nameID = $(this).attr('id');
        var ecFirst;
        var ecLast;
        var findPhone = $("#ec");

        findPhone.find('li[value="'+pnum+'"]').remove();
        findPhone.find('p[value="'+pnum+'"]').remove();
        var pnum1 = parseInt(pnum);
        for(var i = 0; i < ecLen; i++ ){
            if(parseInt(ecInfo["contacts"][i].phone) === pnum1){
                ecFirst = ecInfo["contacts"][i].first;
                ecLast = ecInfo["contacts"][i].last;
            }
        }
        var toDelete = {first: ecFirst, last: ecLast};
        console.log("Name to delete: " + toDelete.first + ' ' + toDelete.last);
        var nameDelete = JSON.stringify(toDelete);
        //**test
        //delete ecInfo["contacts"][x];
        //**/test

        $.ajax({
            method: 'DELETE',
            url: '/public/api/users/contacts',
            dataType: 'json',
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
            }
        }
        var toDelete = {name: b_name};
        var nameDelete = JSON.stringify(toDelete);

        /*
        $.ajax({
            type:'DELETE',
            url:'/api/users/contacts',
            data: nameDelete,
            success:function(){
                console.log("Sucessfully deleted an EC!");
            },
            error:function(){
                console.log("Error with DELETING a contact");
            }
        });*/
    });

    //Create new e-mail:
    $("#b_submit_email").click(function(e){
        e.preventDefault();
        var newEmail = $("#new_email").val();
        console.log("New email is " + newEmail);
        var email = {
            email: newEmail
        };
        newEmail = JSON.stringify(email);

        $.ajax({
            type: 'POST',
            url: '/public/api/users/email',
            data: newEmail,
            success:function(res){
                console.log("New Email POSTED : " + res);
                $("#new_email").val('');
            },
            error:function(){
                console.log("Error with POSTING email");
            }
        });

    });

    //Create new PIN:
    $("#b_submit_pin").click(function(e){
        e.preventDefault();
        var newPIN = $("#new_pin").val();
        console.log("New Pin is " + newPIN);
        var nPin = {
            pin: newPIN
        };
        console.log(nPin);
        newPIN = JSON.stringify(nPin);

        $.ajax({
            type: 'POST',
            url: '/public/api/users/pin',
            dataType: 'json',
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
            pass: newPass
        };
        newPass = JSON.stringify(nPass);
        $.ajax({
            type: 'POST',
            url: '/public/api/users/password',
            data: newPass,
            dataType: 'json',
            success:function(res){
                console.log("New Password POSTED : " + res);
            },
            error:function(){
                console.log("Error with POSTING email");
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
            url: '/public/api/users/contacts',
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

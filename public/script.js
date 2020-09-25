$(document).ready(function() {
    //Get table information
    $.get( "/tabledata", function( response ) {
        var obj = response;
        var tableInfo = response.reservations;
        var userInfo = response.users;
        var deviceInfo = response.devices;
        tableInfo.forEach(item => {
            //Append table information.
                $('.table-body').append('<tr class="table-body-row"><td class="table-body-element">' + item.deviceName + '</td>' +
                    '<td class="table-body-element">' + item.deviceId + '</td>' + 
                    '<td class="table-body-element">' + item.userName + '</td>' +
                    '<td class="table-body-element">' + item.time + '</td>' + 
                    '<td><button id="' + item.deviceId + '" class="btn-delete">&nbsp</button></tr>'
                );
        });

        userInfo.forEach(item => {
             //Append user data
             $('#user-list').append('<option value="' + item.name + '">' + item.name + '</option>');
        });


        deviceInfo.forEach(item => {
            //Append device data
            $('#device-list').append('<option value="' + item.deviceId + '">' + item.name + ' - ' + item.deviceId + '</option>');
        });
    });
});

$(document).on('click', ".btn-submit", function() {
    
    //Post form Information
    var userName = $("#user-list").val();
    var deviceName = $("#device-list option:selected").text();
    deviceName = deviceName.split('-', 1);
    var deviceId = $("#device-list").val();
    var reserveObj = {
        "userName" : userName,
        "deviceName" : deviceName,
        "deviceId" : deviceId
    };

    $.ajax({
        type: "POST",
        url: "/reservation",
        data: reserveObj,
        dataType: "application/json",
        success: function(result){
            location.reload();
        },
    });
});

$(document).on('click', ".btn-delete", function() {
    //Delete table data
    var id = $(".btn-delete").attr('id');
    $.ajax({
        url: `/delete/${id}`,
        type: 'DELETE',
        success: function(result) {
            location.reload();
        }
    });
});
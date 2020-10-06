$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: '/device-data',
        dataType: "json",
        success: function(result) {
            renderTable(result);
        }
      });
});

function renderTable(data) {
    data.forEach(element => {
        console.log(element);
        if(element.inUse == true) {
            $('.table-body').append(
                '<tr class="table-body-row">' +
                '<td class="table-body-element">' + element.did + '</td>' +
                '<td class="table-body-element">' + element.name + '</td>' +
                '<td class="table-body-element">' + element.pcip + '</td>' +
                '<td class="table-body-element"> <button class="button button-delete" id="' + element.did + '">delete </button></td>' +
                '</tr>'
            )
        }
        else {
            $('#device-select').append(
                '<option value="' + element.did + '">' + element.name + ' - ' + element.did + '</option>'
            )
        }
    })
}

$('#reserve').click(function () {
    var deviceId = $('#device-select option:selected').val();
    console.log(deviceId);
    var obj = { 'deviceId': deviceId};
    $.ajax({
        type: "POST",
        url: "/reserve-device",
        data: obj,
        dataType: "text",
        success: function(){
            alert("You have successfully reserved the device" + deviceId + "!");
            location.reload();
        },
    })
})

$('table').on('click', '.button-delete', function () {
    var deviceId = $('.button-delete').attr('id');
    var obj = { 'deviceId': deviceId};
    $.ajax({
        type: "POST",
        url: "/remove-device",
        data: obj,
        dataType: "text",
        success: function(){
            alert("You have successfully removed the device" + deviceId + "!");
            location.reload();
        },
    })
})

$('#logout').on('click', function() {
    $.ajax({
        type: "GET",
        url: "/logout",
        success: function() {
            alert('You have successfully logged out!');
            location.reload();
        }
    })
})
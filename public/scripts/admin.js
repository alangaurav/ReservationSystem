$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: '/device-data',
        dataType: "json",
        success: function(result) {
            renderDeviceTable(result);
        }
      });

      $.ajax({
        type: "GET",
        url: '/user-data',
        dataType: "json",
        success: function(result) {
            renderUserTable(result);
        }
      });

      $.ajax({
        type: "GET",
        url: '/pc-data',
        dataType: "json",
        success: function(result) {
            renderPCTable(result);
        }
      });
});

function renderDeviceTable(data) {
    data.forEach(element => {
        $('.table-body__device').append(
            '<tr class="table-body-row">' +
            '<td class="table-body-element">' + element.did + '</td>' +
            '<td class="table-body-element">' + element.name + '</td>' +
            '<td class="table-body-element">' + element.pcip + '</td>' +
            '<td class="table-body-element">' + element.currentUser + '</td>' +
            '<td class="table-body-element"> <button class="button button-delete" id="' + element.did + '">delete</button></td>' +
            '</tr>'
        )
    })
}

function renderUserTable(data) {
    data.forEach(element => {
        $('.table-body__user').append(
            '<tr class="table-body-row">' +
            '<td class="table-body-element">' + element.uid + '</td>' +
            '<td class="table-body-element">' + element.name + '</td>' +
            '<td class="table-body-element">' + element.uip + '</td>' +
            '<td class="table-body-element"> <button class="button button-delete" id="' + element.uid + '">delete</button></td>' +
            '</tr>'
        )
    })
}

function renderPCTable(data) {
    data.forEach(element => {
        $('.table-body__pc').append(
            '<tr class="table-body-row">' +
            '<td class="table-body-element">' + element.name + '</td>' +
            '<td class="table-body-element">' + element.ip + '</td>' +
            '<td class="table-body-element"> <button class="button button-delete" id="' + element.ip + '">delete</button></td>' +
            '</tr>'
        )
    })
}

$('.table-body__device').on('click', '.button-delete', function () {
    var deviceId = $(this).attr('id');
    var obj = { 'deviceId': deviceId};
    $.ajax({
        type: "DELETE",
        url: "/delete-device",
        data: obj,
        dataType: "text",
        success: function(){
            alert("You have successfully deleted the device " + deviceId + "!");
            location.reload();
        },
    })
})

$('.table-body__user').on('click', '.button-delete', function () {
    var uid = $(this).attr('id');
    var obj = { 'uid': uid};
    $.ajax({
        type: "DELETE",
        url: "/delete-user",
        data: obj,
        dataType: "text",
        success: function(){
            alert("You have successfully deleted " + uid + "!");
            location.reload();
        },
    })
})

$('.table-body__pc').on('click', '.button-delete', function () {
    var pcip = $(this).attr('id');
    var obj = { 'pcip': pcip};
    $.ajax({
        type: "DELETE",
        url: "/delete-pc",
        data: obj,
        dataType: "text",
        success: function(){
            alert("You have successfully deleted the pc " + pcip + "!");
            location.reload();
        },
    })
})

$('#logout').on('click', function() {
    $.ajax({
        type: "GET",
        url: "/logout",
        success: function(){
            alert("You have successfully logged out!");
            location.reload();
        },
    })
})
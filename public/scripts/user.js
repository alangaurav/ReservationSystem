var user;

$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: '/current-user',
        dataType: "json",
        success: function (result) {
            user = result.uid;
            $('.title-user').append(result.name + '.');

            $.ajax({
                type: "GET",
                url: '/device-data',
                dataType: "json",
                success: function (result) {
                    renderDeviceTable(result);
                }
            });
        }
    });

});

function renderDeviceTable() {
    $.ajax({
        type: "GET",
        url: '/device-data',
        dataType: "json",
        success: function (data) {
            $('#table-device .table-body').html('');
            data.forEach(element => {
                if (element.currentUser == user) {
                    $('#table-device .table-body').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.pcip + '</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '<td class="table-body-element"> <button class="button button-delete" id="' + element.did + '">delete </button></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser == null) {
                    $('#table-device .table-body').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.pcip + '</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"> <button class="button button-reserve" id="' + element.did + '">reserve </button></td>' +
                        '</tr>'
                    )
                }
                else {
                    $('#table-device .table-body').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.pcip + '</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '</tr>'
                    )
                }
            })
        }
    })
}

function renderPCTable() {
    $.ajax({
        type: "GET",
        url: '/pc-data',
        dataType: "json",
        success: function (data) {
            $('#table-pc .table-body').html('');
            data.forEach(element => {
                if (element.currentUser == user) {
                    $('#table-pc .table-body').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.ip + '</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '<td class="table-body-element"> <button class="button button-delete" id="' + element.ip + '">delete </button></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser == null) {
                    $('#table-pc .table-body').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.ip + '</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"> <button class="button button-reserve" id="' + element.ip + '">reserve </button></td>' +
                        '</tr>'
                    )
                }
                else {
                    $('#table-pc .table-body').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.ip + '</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '</tr>'
                    )
                }
            })
        }
    })
}

function renderUserInfo() {
    console.log("user info called");
    $.ajax({
        type: "GET",
        url: '/current-user',
        dataType: "json",
        success: function (result) {
            $('#uid').val(result.uid);
            $('#uname').val(result.name);
            $('#uIP').val(result.uip);
        }
    })
}

$('.sidenav-list').on('click', '.sidenav-list-item', function () {
    var clickedItem = $(this).attr('value');
    if (clickedItem == 'devices')
        renderDeviceTable();
    else if (clickedItem == 'pcs')
        renderPCTable();
    else if (clickedItem == 'user-info')
        renderUserInfo();

    $('.sidenav-list > li').each(function () {
        $(this).removeClass('sidenav-list-item__active');
    })

    $(this).addClass('sidenav-list-item__active');

    $('.main-container > section').each(function () {
        if ($(this).attr('id') == clickedItem) {
            $(this).addClass('active');
            $(this).removeClass('inactive');
        }
        else {
            $(this).addClass('inactive');
            $(this).removeClass('active');
        }
    })
})

$('#table-device .table-body').on('click', '.button-reserve', function () {
    var deviceId = $(this).attr('id');
    var obj = { 'deviceId': deviceId };
    $.ajax({
        type: "POST",
        url: "/reserve-device",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully reserved the device" + deviceId + "!");
            renderDeviceTable();
        },
    })
})

$('#table-device .table-body').on('click', '.button-delete', function () {
    var deviceId = $(this).attr('id');
    var obj = { 'deviceId': deviceId };
    $.ajax({
        type: "POST",
        url: "/remove-device",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully removed the device " + deviceId + "!");
            renderDeviceTable();
        },
    })
})

$('#table-pc .table-body').on('click', '.button-reserve', function () {
    var pcip = $(this).attr('id');
    var obj = { 'pcip': pcip };
    $.ajax({
        type: "POST",
        url: "/reserve-pc",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully reserved the pc " + pcip + "!");
            renderPCTable();
        },
    })
})

$('#table-pc .table-body').on('click', '.button-delete', function () {
    var pcip = $(this).attr('id');
    var obj = { 'pcip': pcip };
    $.ajax({
        type: "POST",
        url: "/remove-pc",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully removed the pc " + pcip + "!");
            renderPCTable();
        },
    })
})

$('#signout').on('click', function () {
    $.ajax({
        type: "GET",
        url: "/logout",
        success: function () {
            alert('You have successfully logged out!');
            location.reload();
        }
    })
})
var user;

$(document).ready(function () {
    getUserInfo();
    renderDeviceTable();
});

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/current-user',
        dataType: "json",
        success: function (result) {
            user = result.uid;
            $('.title-user').append(result.name + '.');
        }
    });
}

function renderDeviceTable() {
    $.ajax({
        type: "GET",
        url: '/device-data',
        dataType: "json",
        success: function (data) {
            $('.table-body__device').html('');
            data.forEach(element => {
                if (element.currentUser == null && element.location.name == null) {
                    $('.table-body__device').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"><button class="button button-delete" id="' + element.did + '">delete</button>&nbsp<a class="button button-update" id="' + element.did + '" href="#popup-device">update</a></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser == null && element.location.name != null && element.location.loc != null) {
                    $('.table-body__device').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.location.name + '&nbsp (' + element.location.ip + '&nbsp' + element.location.loc + ')</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"><button class="button button-delete" id="' + element.did + '">delete</button>&nbsp<a class="button button-update" id="' + element.did + '" href="#popup-device">update</a></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser == null && element.location.name != null && element.location.loc == null) {
                    $('.table-body__device').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.location.name + '&nbsp (' + element.location.ip + ')</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"><button class="button button-delete" id="' + element.did + '">delete</button>&nbsp<a class="button button-update" id="' + element.did + '" href="#popup-device">update</a></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser != null && element.location.name == null) {
                    $('.table-body__device').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '<td class="table-body-element"><a class="button button-update" id="' + element.did + '" href="#popup-device-disabled">update</a></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser != null && element.location.name != null && element.location.loc != null) {
                    $('.table-body__device').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.location.name + '&nbsp (' + element.location.ip + '&nbsp' + element.location.loc + ')</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '<td class="table-body-element"><a class="button button-update" id="' + element.did + '" href="#popup-device-disabled">update</a></td>' +
                        '</tr>'
                    )
                }
                else if (element.currentUser != null && element.location.name != null && element.location.loc == null) {
                    $('.table-body__device').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.did + '</td>' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.location.name + '&nbsp (' + element.location.ip + ')</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '<td class="table-body-element"><a class="button button-update" id="' + element.did + '" href="#popup-device-disabled">update</a></td>' +
                        '</tr>'
                    )
                }
            })
        }
    });
}

function renderUserTable() {
    $.ajax({
        type: "GET",
        url: '/user-data',
        dataType: "json",
        success: function (data) {
            $('.table-body__user').html('');
            data.forEach(element => {
                $('.table-body__user').append(
                    '<tr class="table-body-row">' +
                    '<td class="table-body-element">' + element.uid + '</td>' +
                    '<td class="table-body-element">' + element.name + '</td>' +
                    '<td class="table-body-element">' + element.uip + '</td>' +
                    '<td class="table-body-element">' + element.location + '</td>' +
                    '<td class="table-body-element"> <button class="button button-delete" id="' + element.uid + '">delete</button></td>' +
                    '</tr>'
                )
            })
        }
    });
}

function renderPCTable() {
    $.ajax({
        type: "GET",
        url: '/pc-data',
        dataType: "json",
        success: function (data) {
            $('.table-body__pc').html('');
            data.forEach(element => {
                if (element.currentUser == null) {
                    $('.table-body__pc').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.ip + '</td>' +
                        '<td class="table-body-element"></td>' +
                        '<td class="table-body-element"><button class="button button-delete" id="' + element.ip + '">delete</button>&nbsp<a class="button button-update" id="' + element.ip + '" href="#popup-pc">update</a></td>' +
                        '</tr>'
                    )
                }
                else {
                    $('.table-body__pc').append(
                        '<tr class="table-body-row">' +
                        '<td class="table-body-element">' + element.name + '</td>' +
                        '<td class="table-body-element">' + element.ip + '</td>' +
                        '<td class="table-body-element">' + element.currentUser + '</td>' +
                        '</tr>'
                    )
                }
            })
        }
    });
}

function renderDeviceSelect() {
    $('.locationList').append('<option value="0.0.0.0" selected>None</option>');
    $.ajax({
        type: "GET",
        url: '/pc-data',
        dataType: "json",
        success: function (data) {
            data.forEach(element => {
                $('.locationList').append('<option value="' + element.ip + '">' + element.name + '</option>');

            })
        }
    })

    $.ajax({
        type: "GET",
        url: '/user-data',
        dataType: "json",
        success: function (data) {
            data.forEach(element => {
                $('.locationList').append('<option value="' + element.uip + '">' + element.name + '</option>');
            })
        }
    })
}

$('.sidenav-list').on('click', '.sidenav-list-item', function () {
    var clickedItem = $(this).attr('value');
    var deviceTableInterval, pcTableInterval;
    if (clickedItem == 'devices') {
        renderDeviceTable();
        deviceTableInterval = setInterval(renderDeviceTable, 150000);
        clearInterval(pcTableInterval);
    }
    else if (clickedItem == 'pcs') {
        renderPCTable();
        pcTableInterval = setInterval(renderPCTable, 150000);
        clearInterval(deviceTableInterval);
    }
    else if (clickedItem == 'users')
        renderUserTable();

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

$('.table-body__device').on('click', '.button-delete', function () {
    var deviceId = $(this).attr('id');
    var obj = { 'deviceId': deviceId };
    $.ajax({
        type: "DELETE",
        url: "/delete-device",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully deleted the device " + deviceId + "!");
            location.reload();
        },
    })
})

$('.table-body__user').on('click', '.button-delete', function () {
    var uid = $(this).attr('id');
    var obj = { 'uid': uid };
    $.ajax({
        type: "DELETE",
        url: "/delete-user",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully deleted " + uid + "!");
            location.reload();
        },
    })
})

$('.table-body__pc').on('click', '.button-delete', function () {
    var pcip = $(this).attr('id');
    var obj = { 'pcip': pcip };
    $.ajax({
        type: "DELETE",
        url: "/delete-pc",
        data: obj,
        dataType: "text",
        success: function () {
            alert("You have successfully deleted the pc " + pcip + "!");
            location.reload();
        },
    })
})

$('.table-body__device').on('click', '.button-update', function () {
    var row = $(this).closest('tr');
    var name = row.children('td').eq(1).html();
    var ip = row.children('td').eq(2).html();
    var id = $(this).attr('id');

    renderDeviceSelect();
    $('.form-input__id').val(id);
    $('.form-input__name').val(name);
})

$('.table-body__pc').on('click', '.button-update', function () {
    var row = $(this).closest('tr');
    var name = row.children('td').eq(0).html();
    var ip = $(this).attr('id');

    $('.form-input__name').val(name);
    $('.form-input__ip').val(ip);
})

$('#signout').on('click', function () {
    $.ajax({
        type: "GET",
        url: "/logout",
        success: function () {
            alert("You have successfully logged out!");
            location.reload();
        },
    })
})
window.onload = function () {
    const useNodeJS = true;   // Apabila Anda menggunakan node.js Anda dapat mengubah nilai dari useNodeJS menjadi true tanpa mengisi defaultLiffID.
    const defaultLiffId = "";   // Namun apabila tidak menggunakan node.js dan deploy aplikasi ke service seperti Heroku maka Anda dapat mengisinya dengan false dan wajib mengisi defaultLiffID.
    // Anda dapat mengisi defaultLIffId dengan LIFF ID yang terletak pada LIFF URL di channel LIFF LINE Developers yang sudah Anda buat.

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function (reqResponse) {
                return reqResponse.json();
            })
            .then(function (jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function (error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Apabila myLiffId bernilai null maka LIFF tidak akan di inisialisasi.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* LIFF ID yang berhasil diinisialisasi dan sesuai dengan yang
* ada pada LINE Developers, maka Anda bisa menggunakan LIFF API.
* Otherwise catch the error, inisialisasi LIFF gagal.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}


var user_displayName = "";
var user_pictureUrl = "";
var user_statusMessage = "";


/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    try {
        console.log("initializeApp() ...");
        $('#content').hide();
        $('#loading').show();
        // hide semua dulu
        initHideAll();

        // check if the user is logged in OR logged out,
        // and disable inappropriate button.
        if (liff.isLoggedIn()) {
            $(`#not-loggedin`).hide();
            showLoggedinElements();
            initializeLoggedinElements();
        } else {
            $(`#liff-logout`).hide();
            showLoggedoutElements()
        }

        // register terakhir
        registerEventListeners();
        $('#content').show();
        $('#loading').hide();
        console.log("initializeApp() done");
    } catch (error) {
        window.alert(error);
    }
}

function initHideAll() {
    console.log("initHideAll()...");
    $('#loggedin').hide();
    $('#menu-makanan').hide();
    $('#menu-minuman').hide();
    $('#ringkasan').hide();
    $('#loggedin-statusMessage').hide();
    $('#inApp').hide();
    $('#notInApp').hide();
    console.log("done");
}

function showLoggedinElements() {
    console.log("showLoggedinElements()...");
    getLiffProfile();
    $('#loggedin').show();
    putLiffProfile();
    $('#menu-makanan').show();
    $('#menu-minuman').show();
    $('#loggedin-statusMessage').show();
    if (liff.isInClient()) {
        $('#inApp').show();
    }
    else {
        $('#notInApp').show();
    }
    console.log("done");
}
function showLoggedoutElements() {
    console.log("showLoggedoutElements()...");
    $(`#not-loggedin`).show();
    console.log("done");
}

function initializeLoggedinElements() {
    makanan_id_index = createKeyValuePairFromArray("fd_", [...Array(nama_makanan.length).keys()], Array(nama_makanan.length).fill(0));
    minuman_id_index = createKeyValuePairFromArray("bv_", [...Array(nama_minuman.length).keys()], Array(nama_minuman.length).fill(0));

    makanan_id_nama = createKeyValuePairFromArray("fd_", Array(nama_makanan.length), nama_makanan);
    minuman_id_nama = createKeyValuePairFromArray("bv_", Array(nama_minuman.length), nama_minuman);

    makanan_id_harga = createKeyValuePairFromArray("fd_", Array(harga_makanan.length), harga_makanan);
    minuman_id_harga = createKeyValuePairFromArray("bv_", Array(harga_minuman.length), harga_minuman);

    makanan_id_qty = createKeyValuePairFromArray("fd_", Array(harga_makanan.length), Array(harga_makanan.length).fill(0));
    minuman_id_qty = createKeyValuePairFromArray("bv_", Array(harga_minuman.length), Array(harga_minuman.length).fill(0));

    loadMenu("makanan", makanan_id_qty, nama_makanan, harga_makanan);
    loadMenu("minuman", minuman_id_qty, nama_minuman, harga_minuman);
    // initialization: hide decrement button & qty value
    for (id in makanan_id_qty) {
        $(`#${id}-dec`).hide();
        $(`#${id}-qty`).hide();
    }
    for (id in minuman_id_qty) {
        $(`#${id}-dec`).hide();
        $(`#${id}-qty`).hide();
    }
}

function getLiffProfile() {
    liff.getProfile()
        .then(function (profile) {
            user_displayName = profile.displayName;
            user_pictureUrl = profile.pictureUrl;
            user_statusMessage = profile.statusMessage;
            window.alert(`GET: user_pictureUrl = [${user_pictureUrl}] \nuser_displayName = [${user_displayName}]`);
        })
        .catch(function (error) {
            window.alert('Error getting profile: ' + error);
        });
}
function putLiffProfile() {
    window.alert(`GLOBAL: user_pictureUrl = [${user_pictureUrl}] \nuser_displayName = [${user_displayName}]`);
    let data = `<p>Hi `;
    if (user_pictureUrl && user_displayName) {
        data += `<img src="${user_pictureUrl}" alt=""> `;
        data += `<span id="user-name" class="bold">${user_displayName}</span>!`;
    }
    else {
        data += `<span class="bold">Customer!</span>`;
    }
    data += `</p>`;
    data += `<p>Kakak bisa pilih menu di bawah</p>`;
    $('#user-profile').html(data);
}

function registerEventListeners() {
    console.log("registerEventListeners() ...");
    document.getElementById('liff-login').addEventListener('click', function () {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });
    console.log("#liff-login");
    document.getElementById('liff-logout').addEventListener('click', function () {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
    console.log("#liff-logout");
    document.getElementById('liff-external').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://eliteraihan-liff-food-ordering.herokuapp.com/',
            external: true  // false: inside LINE app
        });
    });
    console.log("#liff-external");

    // document.getElementById('konfirmasi-pesanan').addEventListener('click', function () {
    //     konfirmasiPesanan();
    // });
    console.log("#konfirmasi-pesanan");
    console.log("done");
}

// function konfirmasiPesanan() {
//     if (liff.isInClient()) {
//         let message = `Hai ${user_displayName},

//         Terima kasih telah memesan makanan,
//         berikut adalah review pesanannya.

//         Item :
//         ${global_nama_qty_consumable}

//         Jumlah :
//         IDR ${global_total_harga.toLocaleString()}

//         Pesanan kakak akan segera diproses dan
//         akan diberitahu jika sudah bisa diambil.

//         Mohon ditunggu ya!
//         RECEIPT [${(Date.now() % 2097152).toLocaleString()}]`;

//         liff.sendMessages([{
//             'type': 'text',
//             'text': message
//         }])
//             .then(function () {
//                 window.alert('Resi telah dikirim.');
//             })
//             .catch(function (error) {
//                 window.alert('Error sending message: ' + error);
//             });
//     }
//     else {
//         alert(`RECEIPT [${(Date.now() % 2097152).toLocaleString()}]\n` + `Total [IDR ${global_total_harga.toLocaleString()}]`);
//     }
// }

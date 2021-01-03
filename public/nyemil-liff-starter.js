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

        if (liff.isLoggedIn()) {
            console.log("initialize loggedin");
            // kalo udah login, baru inisialisasi
            $('#loading').show();
            showLoggedinElements();
            initializeLoggedinElements();
            registerEventListeners();
            $('#not-loggedin').hide();
        } else {
            console.log("initialize not-loggedin")
            initHideAll();
            // kalo belom login, munculin tombol login aja
            $('#liff-logout').hide();
            $('#not-loggedin').show();
        }
        $('#loading').hide();

        // baru hide semua
        // initHideAll();
        // $('#content').hide();

        // $('#content').show();
        // $('#loading').hide();
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
    $('#konfirmasi-pesanan').hide();
    $('#loggedin-statusMessage').hide();
    $('#inApp').hide();
    $('#notInApp').hide();
    console.log("done");
}

function showLoggedinElements() {
    console.log("showLoggedinElements()...");
    $('#loggedin').show();
    getLiffProfile();
    $('#menu-makanan').show();
    $('#menu-minuman').show();
    $('#loggedin-statusMessage').show();
    if (liff.isInClient()) {
        $('#inApp').show();
    }
    else {
        $('#notInApp').show();
    }
    console.log("showLoggedinElements() done");
}

function initializeLoggedinElements() {
    console.log("initializeLoggedinElements()...");
    makanan_id_index = createKeyValuePairFromArray("fd_", [...Array(nama_makanan.length).keys()], Array(nama_makanan.length).fill(0));
    minuman_id_index = createKeyValuePairFromArray("bv_", [...Array(nama_minuman.length).keys()], Array(nama_minuman.length).fill(0));

    makanan_id_nama = createKeyValuePairFromArray("fd_", Array(nama_makanan.length), nama_makanan);
    minuman_id_nama = createKeyValuePairFromArray("bv_", Array(nama_minuman.length), nama_minuman);

    makanan_id_harga = createKeyValuePairFromArray("fd_", Array(harga_makanan.length), harga_makanan);
    minuman_id_harga = createKeyValuePairFromArray("bv_", Array(harga_minuman.length), harga_minuman);

    makanan_id_qty = createKeyValuePairFromArray("fd_", Array(harga_makanan.length), Array(harga_makanan.length).fill(0));
    minuman_id_qty = createKeyValuePairFromArray("bv_", Array(harga_minuman.length), Array(harga_minuman.length).fill(0));

    initMenu("makanan", makanan_id_qty, nama_makanan, harga_makanan);
    initMenu("minuman", minuman_id_qty, nama_minuman, harga_minuman);
    // initialization: hide decrement button & qty value
    for (id in makanan_id_qty) {
        $(`#${id}-dec`).hide();
        $(`#${id}-qty`).hide();
    }
    for (id in minuman_id_qty) {
        $(`#${id}-dec`).hide();
        $(`#${id}-qty`).hide();
    }
    // initialization: hide #konfirmasi-pesanan button
    console.log("done");
}

function getLiffProfile() {
    console.log("getLiffProfile()...");
    liff.getProfile()
        .then(function (profile) {
            user_displayName = profile.displayName;
            user_pictureUrl = profile.pictureUrl;
            user_statusMessage = profile.statusMessage;
            console.log(`GET: user_pictureUrl = [${user_pictureUrl}] \nuser_displayName = [${user_displayName}]`);
            putLiffProfile();
        })
        .catch(function (error) {
            window.alert('Error getting profile: ' + error);
        });
    console.log("done");
}
function putLiffProfile() {
    console.log("putLiffProfile()...");
    console.log(`GLOBAL: user_pictureUrl = [${user_pictureUrl}] \nuser_displayName = [${user_displayName}]`);
    let opening = ``;
    let profile_card = ``;

    profile_card += `<span id="user-profile" class="bold">`;
    if (user_pictureUrl && user_displayName) {
        profile_card += `<img src="${user_pictureUrl}" alt=""> ${user_displayName}`;
    }
    else {
        profile_card += `Customer`;
    }
    profile_card += `</span>`;

    opening += `<p>Hai ${profile_card}</p>`;
    opening += `<p>Kakak bisa pilih menu di bawah</p>`;

    $('#opening').html(opening);
    console.log("done");
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

    document.getElementById('konfirmasi-pesanan').addEventListener('click', function () {
        konfirmasiPesanan();
    });
    console.log("#konfirmasi-pesanan");
    console.log("done");
}

function konfirmasiPesanan() {
    if (liff.isInClient()) {
        // let message = `Hai ${user_displayName},

        // Terima kasih telah memesan makanan,
        // berikut adalah review pesanannya.

        // Item :
        // ${global_nama_qty_consumable}

        // Jumlah :
        // IDR ${global_total_harga.toLocaleString()}

        // Pesanan kakak akan segera diproses dan
        // akan diberitahu jika sudah bisa diambil.

        // Mohon ditunggu ya!
        // RECEIPT [${(Date.now() % 2097152).toLocaleString()}]`;

        liff.sendMessages([{
            'type': 'text',
            'text': 'message'
        }])
            .then(function () {
                window.alert('Resi telah dikirim.');
            })
            .catch(function (error) {
                window.alert('Error sending message: ' + error);
            });
    }
    else {
        window.alert(`RECEIPT [${(Date.now() % 2097152).toLocaleString()}]\n` + `Total [IDR ${global_total_harga.toLocaleString()}]`);
    }
}

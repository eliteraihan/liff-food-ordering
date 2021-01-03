window.onload = function () {
    console.log("window.onload ...");
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
                // document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
    console.log("window.onload done");
};

/**
* Apabila myLiffId bernilai null maka LIFF tidak akan di inisialisasi.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    console.log("initializeLiffOrDie() ...");
    if (!myLiffId) {
        // document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
    console.log("initializeLiffOrDie() done");
}

/**
* LIFF ID yang berhasil diinisialisasi dan sesuai dengan yang
* ada pada LINE Developers, maka Anda bisa menggunakan LIFF API.
* Otherwise catch the error, inisialisasi LIFF gagal.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    console.log("initializeLiff() ...");
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
    console.log("initializeLiff() done");
}


var user_displayName = "";
var user_pictureUrl = "";
var user_statusMessage = "";


/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    console.log("initializeApp() ...");
    try {
        $('#loading').show();
        $('#loggedin-statusMessage').hide();

        if (liff.isLoggedIn()) {
            console.log("[loggedin] initializing ...");
            // kalo udah login, baru inisialisasi
            initializeLoggedinElements();
            registerLoggedinEventListeners();
            getLiffProfile();
            $('#ringkasan-group').hide();
            $('#loggedin-statusMessage').show();
            $('#not-loggedin').hide();
            console.log("[loggedin] initialized");
        } else {
            console.log("[not-loggedin] initializing ...")
            $('#loggedin').hide();
            $('#liff-logout').hide();
            // kalo belom login, munculin tombol login aja
            $('#not-loggedin').show();
            registerLoggedoutEventListeners();
            console.log("[not-loggedin] initialized");
        }

        $('#loading').hide();
        console.log("initializeApp() done");
    } catch (error) {
        window.alert(error);
    }
}

function initializeLoggedinElements() {
    console.log("initializeLoggedinElements() ...");

    $('#loggedin-statusMessage').show();
    if (liff.isInClient()) {
        $('#notInApp').hide();
    }
    else {
        $('#inApp').hide();
    }

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

    console.log("initializeLoggedinElements() done");
}

function getLiffProfile() {
    console.log("getLiffProfile() ...");
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
    console.log("getLiffProfile() done");
}
function putLiffProfile() {
    console.log("putLiffProfile() ...");
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
    console.log("putLiffProfile() done");
}

function registerLoggedinEventListeners() {
    console.log("registerEventListeners() ...");
    if (liff.isInClient()) {
        document.getElementById('liff-external').addEventListener('click', function () {
            console.log("click: #liff-external");
            liff.openWindow({
                url: 'https://eliteraihan-liff-food-ordering.herokuapp.com/',
                external: true  // false: inside LINE app
            });
        });
        console.log("#liff-external");
    }
    else {
        document.getElementById('liff-logout').addEventListener('click', function () {
            console.log("click: #liff-logout");
            if (liff.isLoggedIn()) {
                liff.logout();
                window.location.reload();
            }
        });
        console.log("#liff-logout");
    }

    document.getElementById('konfirmasi-pesanan').addEventListener('click', function () {
        console.log("click: #konfirmasi-pesanan");
        konfirmasiPesanan();
    });
    console.log("#konfirmasi-pesanan");
    console.log("registerEventListeners() done");
}

function registerLoggedoutEventListeners() {
    console.log("registerLoggedoutEventListeners() ...");
    document.getElementById('liff-login').addEventListener('click', function () {
        console.log("click: #liff-login");
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });
    console.log("#liff-login");
    console.log("registerLoggedoutEventListeners() done");
}

function konfirmasiPesanan() {
    global_nama_qty_consumable["makanan"] = $('#nama-qty-makanan').html();
    global_nama_qty_consumable["minuman"] = $('#nama-qty-minuman').text();

    if (liff.isInClient()) {
        let message = `Hai ${user_displayName},

        Terima kasih telah memesan makanan,
        berikut adalah review pesanannya.

        Item :
        ${global_nama_qty_consumable["makanan"]}
        ${global_nama_qty_consumable["minuman"]}

        Jumlah :
        IDR ${global_total_harga.toLocaleString()}

        Pesanan kakak akan segera diproses dan
        akan diberitahu jika sudah bisa diambil.

        Mohon ditunggu ya!
        RECEIPT [${(Date.now() % 2097152).toLocaleString()}]`;

        liff.sendMessages([{
            'type': 'text',
            'text': message
        }])
            .then(function () {
                window.alert('Resi telah dikirim.');
            })
            .catch(function (error) {
                window.alert('Error sending message: ' + error);
            });
    }
    else {
        let resi = `RECEIPT [${(Date.now() % 2097152).toLocaleString()}]

        Item :
        ${global_nama_qty_consumable["makanan"]}
        ${global_nama_qty_consumable["minuman"]}

        Total [IDR ${global_total_harga.toLocaleString()}]`;

        window.alert(resi);
    }
}

window.onload = function () {
    console.log("(1) window.onload ...");
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
    console.log("[1] window.onload done");
};

/**
* Apabila myLiffId bernilai null maka LIFF tidak akan di inisialisasi.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    console.log("(2) initializeLiffOrDie() ...");
    if (!myLiffId) {
        // document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
    console.log("[2] initializeLiffOrDie() done");
}

/**
* LIFF ID yang berhasil diinisialisasi dan sesuai dengan yang
* ada pada LINE Developers, maka Anda bisa menggunakan LIFF API.
* Otherwise catch the error, inisialisasi LIFF gagal.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    console.log("(3) initializeLiff() ...");
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
    console.log("[3] initializeLiff() done");
}


var user_displayName = "";
var user_pictureUrl = "";
var user_statusMessage = "";


/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    console.log("(4) initializeApp() ...");
    try {
        $('#loading').show();
        $('#loggedin-statusMessage').hide();

        if (liff.isLoggedIn()) {
            console.log("[loggedin] initializing ...");
            // kalo udah login, baru inisialisasi
            getLiffProfile();
            initializeLoggedinElements();
            registerLoggedinEventListeners();
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
        console.log("[4] initializeApp() done");
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
        lockoutElement(`#konfirmasi-pesanan`);
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

function prosesItemHtmlToPlain(consumable) {
    let plain = $(`#nama-qty-${consumable}`).html();
    if (plain) {
        plain = plain.trim();
        plain = plain.replace(/<p>/g, "");
        plain = plain.replace(/<\/p>/g, "\n");
    }
    else {
        plain = "";
    }

    return plain;
}

function konfirmasiPesanan() {
    global_nama_qty_consumable["makanan"] = prosesItemHtmlToPlain("makanan");
    global_nama_qty_consumable["minuman"] = prosesItemHtmlToPlain("minuman");
    let number = Date.now(); // .toLocaleString()
    let receipt_string = `[${number % 99}-${number % 999}-${number % 999}-${number % 99}]`;

    if (liff.isInClient()) {
        let message = `` +
            `RECEIPT NO. ${receipt_string}\n` +
            `===========\n\n` +
            `Hai ${user_displayName},\n\n` +
            `Terima kasih telah memesan makanan,\n` +
            `berikut adalah review pesanannya.\n\n` +
            `Item :\n` +
            `${global_nama_qty_consumable["makanan"]}` +
            `${global_nama_qty_consumable["minuman"]}\n` +
            `Jumlah :\n` +
            `IDR ${global_total_harga.toLocaleString()}\n\n` +
            `Pesanan kakak akan segera diproses dan\n` +
            `akan diberitahu jika sudah bisa diambil.\n\n` +
            `Mohon ditunggu ya!`;

        liff.sendMessages([{
            'type': 'text',
            'text': `${message}`
        }])
            .then(function () {
                window.alert('Resi telah dikirim.');
            })
            .catch(function (error) {
                window.alert('Error sending message: ' + error);
            });
    }
    else {
        let resi = `` +
            `RECEIPT NO. ${receipt_string}\n` +
            `===========\n\n` +
            `Item: \n` +
            `${global_nama_qty_consumable["makanan"]}\n` +
            `${global_nama_qty_consumable["minuman"]}\n\n` +
            `Total [IDR ${global_total_harga.toLocaleString()}]`;

        window.alert(resi);
    }
}

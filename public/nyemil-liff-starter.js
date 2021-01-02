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

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    // pangil fungsi di sini
    registerEventListeners();

    // check if the user is logged in OR logged out,
    // and disable inappropriate button.
    if (liff.isLoggedIn()) {
        $(`#not-loggedin`).hide();
        showLoggedinElements();
    } else {
        $(`#liff-logout`).hide();
        showLoggedoutElements()
    }
}

function initHideAll() {
    $('#loggedin').hide();
    $('#menu-makanan').hide();
    $('#menu-minuman').hide();
    $('#ringkasan').hide();
    $('#loggedin-statusMessage').hide();
    $('#inApp').hide();
    $('#notInApp').hide();
}

function showLoggedinElements() {
    $('#loggedin').show();
    $('#menu-makanan').show();
    $('#menu-minuman').show();
    $('#ringkasan').show();
    $('#loggedin-statusMessage').show();
    loadMenu("makanan", makanan_id_qty, nama_makanan, harga_makanan);
    loadMenu("minuman", minuman_id_qty, nama_minuman, harga_minuman);
    if (liff.isInClient()) {
        $('#inApp').show();
    }
    else {
        $('#notInApp').show();
    }
}
function showLoggedoutElements() {
    $(`#not-loggedin`).show();
}

function registerEventListeners() {
    document.getElementById('liff-login').addEventListener('click', function () {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });
    document.getElementById('liff-logout').addEventListener('click', function () {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
    document.getElementById('liff-external').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://eliteraihan-liff-food-ordering.herokuapp.com/',
            external: true  // false: inside LINE app
        });
    });

    document.getElementById('konfirmasi-pesanan').addEventListener('click', function () {
        if (!liff.isInClient()) {
            konfirmasiPesanan();
        } else {
            let message = `Hai Customer,

            Terima kasih telah memesan makanan,
            berikut adalah review pesanannya :

            __PESANAN__

            Pesanan kakak akan segera diproses dan
            akan diberitahu jika sudah bisa diambil.

            Mohon ditunggu ya!`;

            liff.sendMessages([{
                'type': 'text',
                'text': "Anda telah menggunakan fitur Send Message!"
            }]).then(function () {
                window.alert('Ini adalah pesan dari fitur Send Message');
            }).catch(function (error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });
}

function konfirmasiPesanan() {
    alert(`Invoice order code [${(Date.now() % 2097152).toLocaleString()}]\n` + `Total [IDR ${total_harga.toLocaleString()}]`);
    // tbd
}

// menu list, editable here! and only here...
const nama_makanan = ["Makanan Enak", "Makanan Gurih", "Makanan Pedas Manis"];
const harga_makanan = [5000, 7000, 9000];

const nama_minuman = ["Minuman Segar", "Minuman Manis", "Minuman Hangat Manis"];
const harga_minuman = [1000, 2000, 4000];
// ... end of editable menu list.

var global_i = 0;

var global_ringkasan_string = ``;
var global_nama_qty_consumable = {};
var global_total_harga = 0;

/**
 * https://stackoverflow.com/questions/5223/length-of-a-javascript-object
 */
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function createKeyValuePairFromArray(uid, keys, values, unique = false) {
    try {
        let keyValuePair = new Array();
        let length = (keys.length > values.length) ? keys.length : values.length;

        if (uid == "" && unique == true) {
            // buat kunci unik otomatis
            uid = toString(global_i) + "_";
            ++global_i;
        }
        else if (uid == "" && unique != true) {
            // gabungin biasa
            for (let i = 0; i < length; i++) {
                currentKey = keys[i];
                currentVal = values[i];
                keyValuePair[currentKey] = currentVal;
            }
            return keyValuePair;
        }

        // gabungin unik, kunci unik otomatis or argumen
        for (let i = 0; i < length; i++) {
            currentKey = uid + i;
            currentVal = values[i];
            keyValuePair[currentKey] = currentVal;
        }
        return keyValuePair;

    } catch (error) {
        alert(error);
    }
}

// initialized later
var makanan_id_index = {};
var minuman_id_index = {};

var makanan_id_nama = {};
var minuman_id_nama = {};

var makanan_id_harga = {};
var minuman_id_harga = {};

var makanan_id_qty = {};
var minuman_id_qty = {};

// const harga_minuman = {
//     "0": 5000,
//     "1": 7000,
//     "2": 9000
// };

function initMenu(consumable, id_qty, nama_consumable, harga_consumable) {
    let index = 0;
    let menu_string = "menu-" + consumable;
    let list_menu = "";
    list_menu += `<h2>`;
    list_menu += (consumable == "makanan") ? `Makanan` : `Minuman`;
    list_menu += `</h2>`;
    list_menu += `<table>`;

    for (id in id_qty) {
        let onclick_string = `'${id}', jenisConsumable('${consumable}')`;
        // nama
        list_menu += `<tr>`;
        list_menu += `<th>${nama_consumable[index]}</th>`;
        list_menu += `<th><button id="${id}-dec" class="btn btn-secondary" onclick="decrement(${onclick_string})">-</button></th>`;  // versi button
        // list_menu += `<th><a class="btn btn-secondary" href="javascript:void(0)" onclick="decrement(${onclick_string})">-</a></th>`;     // versi anchor
        list_menu += `<th><span id="${id}-qty" class="width-qty"></span></th>`;
        list_menu += `<th><button id="${id}-inc" class="btn btn-success" onclick="increment(${onclick_string})">+</button></th>`;
        // list_menu += `<th><a class="btn btn-success" href="javascript:void(0)" onclick="increment(${onclick_string})">+</a></th>`;
        list_menu += `</tr>`;

        // harga
        list_menu += `<tr>`;
        list_menu += `<td class="harga">IDR ${harga_consumable[index].toLocaleString()}</td>`;    //n.toLocaleString()
        list_menu += `</tr>`;
        ++index;
    }
    list_menu += `</table>`;

    try {
        // document.getElementById(menu_string).innerHTML = list_menu;
        $(`#${menu_string}`).html(list_menu);
        // alert("LOADED!");
    } catch (error) {
        window.alert(error);
    }
}

function jenisConsumable(consumable) {
    consumable = consumable.trim();
    // alert((consumable == "minuman") ? "minuman" : "makanan");
    return (consumable == "minuman") ? minuman_id_qty : makanan_id_qty;
}
// function reverseJenisConsumable(consumable_id_qty) {
//     // alert((consumable_id_qty == minuman_id_qty) ? "minuman" : "makanan");
//     return (consumable_id_qty == minuman_id_qty) ? "minuman" : "makanan";
// }


function decrement(id, id_qty) {
    console.log(`click: ${id}`);
    if (--id_qty[id] <= 0) {
        id_qty[id] = 0;
    }
    // alert(id_qty[id]);
    cekCetakQtyJq(id, id_qty);
}
function increment(id, id_qty) {
    console.log(`click: ${id}`);
    ++id_qty[id];
    // alert(id_qty[id]);
    cekCetakQtyJq(id, id_qty);
}

// function cekCetakQty(id, id_qty) {
//     let qty_element = document.getElementById(`${id}-qty`);
//     let dec_button = document.getElementById(`${id}-dec`);

//     if (id_qty[id] <= 0 && !dec_button.classList.contains('hidden')) {
//         dec_button.classList.add('hidden');
//         qty_element.innerText = "";
//     }
//     else {
//         dec_button.classList.remove('hidden');
//         qty_element.innerText = id_qty[id];
//     }
//     cekCetakRingkasan(id);
// }

function cekCetakQtyJq(id, id_qty) {
    let qty_element = $(`#${id}-qty`);  // JANGAN LUPA kalo id itu pake #
    let dec_button = $(`#${id}-dec`);

    try {
        if (id_qty[id] <= 0) {
            dec_button.hide("fast");
            qty_element.text("");
        }
        else {
            dec_button.show("fast");
            qty_element.show();
            qty_element.text(id_qty[id]);
        }
        // alert(`id = [${id}]   ||   value = [${id_qty[id]}]   ||   text = [${qty_element.text()}]`);
        cekCetakRingkasan(id);
    } catch (error) {
        window.alert(error);
    }
}

/**
 * https://stackoverflow.com/questions/11317688/finding-the-key-of-the-max-value-in-a-javascript-array
 * https://javascript.info/keys-values-entries
 */
function isNonZero(kv) {
    try {
        return (Math.max(...Object.values(kv)) > 0) ? true : false;
    } catch (error) {
        window.alert(error);
    }
}

function cekCetakRingkasan(id) {
    let ringkasan_html = ``;
    // let nama_qty_makanan = ``;
    // let nama_qty_minuman = ``;
    let total_harga = 0;

    try {
        if (!isNonZero(makanan_id_qty) && !isNonZero(minuman_id_qty)) {
            $('#ringkasan-group').hide("fast");
            return;
        } else {
            ringkasan_html += `<h4 class="bold">Ringkasan Pesanan</h4>`;
        }

        // if (isNonZero(makanan_id_qty)) {
        //     ringkasan_html += `<h5 class="bold">Makanan :</h5>`;
        //     nama_qty_makanan += `<div id="nama-qty-makanan">`;
        //     for (id in makanan_id_index) {
        //         if (makanan_id_qty[id] > 0) {
        //             nama_qty_makanan += `<p>${makanan_id_qty[id]} x `;
        //             nama_qty_makanan += `${makanan_id_nama[id]}</p>`;
        //             total_harga += (makanan_id_qty[id] * makanan_id_harga[id]);
        //         }
        //     }
        //     nama_qty_makanan += `</div>`;
        //     ringkasan_html += `${nama_qty_makanan}<br>`;
        // }

        // if (isNonZero(minuman_id_qty)) {
        //     ringkasan_html += `<h5 class="bold">Minuman :</h5>`;
        //     nama_qty_minuman += `<div id="nama-qty-minuman">`;
        //     for (id in minuman_id_index) {
        //         if (minuman_id_qty[id] > 0) {
        //             nama_qty_minuman += `<p>${minuman_id_qty[id]} x `;
        //             nama_qty_minuman += `${minuman_id_nama[id]}</p>`;
        //             total_harga += (minuman_id_qty[id] * minuman_id_harga[id]);
        //         }
        //     }
        //     nama_qty_minuman += `</div>`;
        //     ringkasan_html += `${nama_qty_minuman}<br>`;
        // }

        let makanan = qtyToHtmlString(id, "makanan", makanan_id_index, makanan_id_qty, makanan_id_nama, makanan_id_harga);
        let minuman = qtyToHtmlString(id, "minuman", minuman_id_index, minuman_id_qty, minuman_id_nama, minuman_id_harga);
        ringkasan_html += makanan.ringkasan_html;
        total_harga += makanan.total_harga;
        ringkasan_html += minuman.ringkasan_html;
        total_harga += minuman.total_harga;

        ringkasan_html += `<br>Total : IDR ${total_harga.toLocaleString()}`;

        global_ringkasan_html = ringkasan_html;
        global_total_harga = total_harga;

        $('#ringkasan-group').show("fast");
        $('#ringkasan-string').html(ringkasan_html);
    } catch (error) {
        window.alert(error);
    }
}

function qtyToHtmlString(id, consumable, consumable_id_index, consumable_id_qty, consumable_id_nama, consumable_id_harga) {
    let ringkasan_html = ``;
    let nama_qty_consumable = ``;
    let total_harga = 0;
    let consumable_header = (consumable == "makanan") ? "Makanan" : "Minuman";

    if (isNonZero(consumable_id_qty)) {
        ringkasan_html += `<h5 class="bold">${consumable_header} :</h5>`;
        nama_qty_consumable += `<div id="nama-qty-${consumable}">`;
        for (id in consumable_id_index) {
            if (consumable_id_qty[id] > 0) {
                nama_qty_consumable += `<p>${consumable_id_qty[id]} x `;
                nama_qty_consumable += `${consumable_id_nama[id]}</p>`;
                total_harga += (consumable_id_qty[id] * consumable_id_harga[id]);
            }
        }
        nama_qty_consumable += `</div>`;
        ringkasan_html += `${nama_qty_consumable}<br>`;
    }

    // return {
    //     ringkasan_html: ringkasan_html,
    //     total_harga: total_harga,
    // };
    return [ringkasan_html, total_harga];
}

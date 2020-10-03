const electron = require('electron');
const dialog = electron.dialog;
const sqlite3 = require('sqlite3').verbose();
export const db = new sqlite3.Database('db.sqlite3');

export const setupDatabase = () => {
  db.serialize(()=>{
    createTableAreas();
    insertTableAreas();

    createTableProvinces();
    insertTableProvinces();

    createTableHospitals();
    insertTableHospitals();

    createTableMatches();
    insertTableMatches();

    createTableCustomers();
  });

  dialog.showMessageBox({type: 'info', title: 'Thông báo', message: 'Đã khởi tạo Database thành công, bạn có thể tiếp tục sử dụng ứng dụng.'});
}

function createTableCustomers() {
  db.run('DROP TABLE IF EXISTS customers;');
  db.run('CREATE TABLE customers(customer_id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT,\
  district TEXT, province TEXT, phone TEXT, day TEXT, month TEXT, year TEXT,\
  hospital_id INTEGER, campaignName TEXT, brand TEXT,\
  babyWeight INTEGER, babySize TEXT, giftSize TEXT,\
  week TEXT,\
  batch TEXT,\
  collectedDate TEXT,\
  collectedDay INTEGER,\
  collectedMonth INTEGER,\
  collectedYear INTEGER,\
  hasError INTEGER DEFAULT 0,\
  missingData INTEGER DEFAULT 0,\
  missingName INTEGER DEFAULT 0, \
  missingLivingCity INTEGER DEFAULT 0, \
  missingPhone INTEGER DEFAULT 0, \
  missingDeliveryDate INTEGER DEFAULT 0,\
  missingHospital INTEGER DEFAULT 0,\
  missingBrand INTEGER DEFAULT 0,\
  missingOtherInformation INTEGER DEFAULT 0,\
  illogicalData INTEGER DEFAULT 0,\
  illogicalPhone INTEGER DEFAULT 0,\
  illogicalDeliveryDate INTEGER DEFAULT 0,\
  illogicalSize INTEGER DEFAULT 0,\
  illogicalBrand INTEGER DEFAULT 0, \
  illogicalBabyWeight INTEGER DEFAULT 0, \
  illogicalOthers INTEGER DEFAULT 0, \
  duplicatedPhone INTEGER DEFAULT 0,\
  FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));')
}

function createTableAreas() {
  db.run('DROP TABLE IF EXISTS areas;');
  db.run('CREATE TABLE areas(area_id INTEGER PRIMARY KEY, name TEXT, channel TEXT);');
}

function insertTableAreas() {
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 1, 'Hồ Chí Minh', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 2, 'Đà Nẵng', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 3, 'Hà Nội', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 4, 'Miền Bắc', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 5, 'Miền Trung', 'Urban');
}

function createTableProvinces() {
  db.run('DROP TABLE IF EXISTS provinces;');
  db.run('CREATE TABLE provinces(province_id INTEGER PRIMARY KEY, name TEXT, area_id INTEGER, FOREIGN KEY(area_id) REFERENCES areas(area_id));')
}

function insertTableProvinces() {
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 1, 'Hồ Chí Minh', 1);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 2, 'Đà Nẵng', 2);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 3, 'Nha Trang', 5);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 4, 'Hà Nội', 3);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 5, 'Bắc Ninh', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 6, 'Vĩnh Phúc', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 7, 'Hải Phòng', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 8, 'Thái Nguyên', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 9, 'Hải Dương', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 10, 'Thái Bình', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 11, 'Nghệ An', 5);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 12, 'Thanh Hóa', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 13, 'Hưng Yên', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 14, 'Ninh Bình', 4);
}

function createTableHospitals() {
  db.run('DROP TABLE IF EXISTS hospitals;');
  db.run('CREATE TABLE hospitals(hospital_id INTEGER PRIMARY KEY, name TEXT, province_id INTEGER, FOREIGN KEY(province_id) REFERENCES provinces(province_id));');
}

function insertTableHospitals() {
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 1, 'Bệnh viện Đa Khoa Hưng Hà', 13);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 2, 'Bệnh viện Đa Khoa Huyện Tiên Du', 5);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 3, 'Bệnh viện Đa Khoa Huyện Từ Sơn', 5);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 4, 'Bệnh viện Đa Khoa Khánh Hòa', 3);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 5, 'Bệnh viện Đa Khoa Trung Ương Thái Nguyên', 8);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 6, 'Bệnh viện Nhi Đồng Thành Phố', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 7, 'Bệnh viện Nhi Thái Bình', 10);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 8, 'Bệnh viện Nhi Thanh Hóa', 12);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 9, 'Bệnh viện Quận Thủ Đức', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 10, 'Bệnh viện Sản Nhi Hưng Yên', 13);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 11, 'Bệnh viện Sản Nhi Nghệ An', 11);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 12, 'Bệnh viện Sản Nhi Ninh Bình', 14);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 13, 'Bệnh viện Thành phố Vinh', 11);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 14, 'Bệnh viện Trẻ Em Hải Phòng', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 15, 'Phòng Khám Đa Khoa Đức Minh', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 16, 'Tiêm Chủng Polyvac Vĩnh Hưng', 4);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 17, 'Trung Tâm Kiểm Soát Bệnh Tật Nghệ An', 11);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 18, 'Viện Kiểm Định Quốc Gia Vắc xin Và Sinh Phẩm Y Tế', 4);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 19, 'Viện Vệ Sinh Dịch Tể Trung Ương - 131 Lò Đúc', 4);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 20, 'Bệnh viện Đa Khoa Phúc Yên', 6);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 21, 'Bệnh viện Quốc Tế Thái Nguyên ', 8);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 22, 'Trung Tâm Kiểm Soát Bệnh Tật Hải Dương', 9);
}

function createTableMatches() {
  db.run('DROP TABLE IF EXISTS matches;');
  db.run('CREATE TABLE matches(match_id INTEGER PRIMARY KEY, hospital_id INTEGER, name TEXT, FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));');
}

function insertTableMatches() {
  // db.run('INSERT INTO matches(match_id, hospital_id, name) VALUES(?, ?, ?)', 1, 10, 'Bênh viện Quốc Tế Mỹ');
}

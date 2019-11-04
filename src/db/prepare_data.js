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
  email TEXT, district TEXT, province TEXT, phone TEXT, day TEXT, month TEXT, year TEXT, s1 TEXT, s2 TEXT,\
  sampling TEXT, hospital_id INTEGER, batch TEXT,\
  hasError INTEGER DEFAULT 0,\
  missingData INTEGER DEFAULT 0,\
  missingFirstName INTEGER DEFAULT 0, \
  missingLastName INTEGER DEFAULT 0,\
  missingMomName INTEGER DEFAULT 0, \
  missingDistrict INTEGER DEFAULT 0, \
  missingProvince INTEGER DEFAULT 0,\
  missingAddress INTEGER DEFAULT 0,\
  missingPhone INTEGER DEFAULT 0, \
  missingEmail INTEGER DEFAULT 0,\
  missingSampling INTEGER DEFAULT 0, \
  missingDate INTEGER DEFAULT 0,\
  missingMomStatus INTEGER DEFAULT 0,\
  illogicalData INTEGER DEFAULT 0,\
  illogicalPhone INTEGER DEFAULT 0, illogicalName INTEGER DEFAULT 0,\
  illogicalSampling INTEGER DEFAULT 0, illogicalEmail INTEGER DEFAULT 0,\
  illogicalAddress INTEGER DEFAULT 0, illogicalDate INTEGER DEFAULT 0,\
  illogicalOther INTEGER DEFAULT 0, \
  duplicatedPhone INTEGER DEFAULT 0,\
  duplicatedPhoneBetweenS1AndS2 INTEGER DEFAULT 0,\
  duplicatedPhoneS1 DEFAULT 0, \
  duplicatedPhoneS2 INTEGER DEFAULT 0,\
  FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));')
}

function createTableAreas() {
  db.run('DROP TABLE IF EXISTS areas;');
  db.run('CREATE TABLE areas(area_id INTEGER PRIMARY KEY, name TEXT, channel TEXT);');
}

function insertTableAreas() {
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 1, 'Hồ Chí Minh', 'Key Urban 1');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 2, 'Hà Nội', 'Key Urban 1');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 6, 'Hải Phòng', 'Key Urban 1');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 3, 'Đà Nẵng', 'Key Urban 2');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 4, 'Cần  Thơ', 'Key Urban 2');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 7, 'Miền Bắc', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 8, 'Miền Trung', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 10, 'Miền Tây', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 9, 'Miền Đông', 'Urban');
}

function createTableProvinces() {
  db.run('DROP TABLE IF EXISTS provinces;');
  db.run('CREATE TABLE provinces(province_id INTEGER PRIMARY KEY, name TEXT, area_id INTEGER, FOREIGN KEY(area_id) REFERENCES areas(area_id));')
}

function insertTableProvinces() {
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 1, 'Hồ Chí Minh', 1);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 2, 'Hà Nội', 2);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 3, 'Đà Nẵng', 3);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 4, 'Cần Thơ', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 6, 'Hải Phòng', 6);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 7, 'Nghệ An', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 9, 'Thái Nguyên', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 11, 'Hải Dương', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 13, 'Thái Bình', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 14, 'Hưng Yên', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 15, 'Ninh Bình', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 16, 'Vĩnh Phúc', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 17, 'Bắc Ninh', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 18, 'Thừa Thiên Huế', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 19, 'Quảng Ngãi', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 20, 'Đắk Lắk', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 21, 'Bình Định', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 23, 'Bình Dương', 9);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 24, 'Đồng Nai', 9);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 27, 'Bến Tre', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 46, 'Bạc Liêu', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 47, 'Kiên Giang', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 48, 'Sóc Trăng', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 29, 'Trà Vinh', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 31, 'Vĩnh Long', 10);
}

function createTableHospitals() {
  db.run('DROP TABLE IF EXISTS hospitals;');
  db.run('CREATE TABLE hospitals(hospital_id INTEGER PRIMARY KEY, name TEXT, province_id INTEGER, FOREIGN KEY(province_id) REFERENCES provinces(province_id));');
}

function insertTableHospitals() {
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 1, 'Bệnh viện An Sinh', 1);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 2, 'Bệnh viện An Thịnh', 2);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 3, 'Bệnh viện Đa Khoa Gia Đình', 3);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 4, 'Bệnh Viện Đa Khoa Hồng Đức', 1);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 5, 'Bệnh viện Đa Khoa Quốc Tế Thiên Đức', 2);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 6, 'Bệnh viện Đa Khoa Vạn Phúc 1', 23); // Bình Dương

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 7, 'Bệnh viện Đại Học Y Dược HCM', 1);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 8, 'Bệnh viện Green Hải Phòng', 6);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 9, 'Bệnh viện Hoàn Mỹ Sài Gòn', 1);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 10, 'Bệnh Viện Quốc Tế Mỹ', 1);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 11, 'Bệnh viện Sản Nhi Bình Dương', 23);

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?, ?, ?)', 12, 'Phòng Khám Sản Khoa Nhi Khoa & Bảo Sanh Sài Gòn', 1);
}

function createTableMatches() {
  db.run('DROP TABLE IF EXISTS matches;');
  db.run('CREATE TABLE matches(match_id INTEGER PRIMARY KEY, hospital_id INTEGER, name TEXT, FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));');
}

function insertTableMatches() {
  db.run('INSERT INTO matches(match_id, hospital_id, name) VALUES(?, ?, ?)', 1, 9, 'Bệnh viện Hoàn Mỹ Sài Gòn - Hội Thảo');

  db.run('INSERT INTO matches(match_id, hospital_id, name) VALUES(?, ?, ?)', 2, 10, 'Bệnh Viện Quốc Tế Mỹ - Hội thảo');
}

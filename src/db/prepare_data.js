const electron = require('electron');
const dialog = electron.dialog;
const sqlite3 = require('sqlite3').verbose();
export const db = new sqlite3.Database('db.sqlite3');

export const setupDatabase = () => {
  db.serialize(()=>{
    // insertTableAreas();
    // insertTableProvinces();
    // insertTableHospitals();
    // insertTableMatches();
    // createTableCustomers();
  });

  dialog.showMessageBox({type: 'info', title: 'Thông báo', message: 'Đã khởi tạo Database thành công, bạn có thể tiếp tục sử dụng ứng dụng.'});
}

function addColumnsToCustomers() {
  // db.run('ALTER TABLE customers\
  //   ADD collectedDay INTEGER');
  // db.run('ALTER TABLE customers\
  //   ADD collectedMonth INTEGER');
  // db.run('ALTER TABLE customers\
  //   ADD collectedYear INTEGER');
  // db.run('ALTER TABLE customers\
  //   ADD duplicatedWithAnotherAgency INTEGER DEFAULT 0');
}

function createTableCustomers() {
  db.run('DROP TABLE IF EXISTS customers;');
  db.run('CREATE TABLE customers(customer_id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT,\
  email TEXT, district TEXT, province TEXT, phone TEXT, day TEXT, month TEXT, year TEXT, s1 TEXT, s2 TEXT,\
  sampling TEXT, hospital_id INTEGER, batch TEXT, source TEXT,\
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
  duplicatedWithAnotherAgency INTEGER DEFAULT 0,\
  collectedDay INTEGER,\
  collectedMonth INTEGER,\
  collectedYear INTEGER,\
  FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));')
}

function insertTableAreas() {
  db.run('DROP TABLE IF EXISTS areas;');
  db.run('CREATE TABLE areas(area_id INTEGER PRIMARY KEY, name TEXT, channel TEXT);');

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

function insertTableProvinces() {
  db.run('DROP TABLE IF EXISTS provinces;');
  db.run('CREATE TABLE provinces(province_id INTEGER PRIMARY KEY, name TEXT, area_id INTEGER, FOREIGN KEY(area_id) REFERENCES areas(area_id));')

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

function insertTableHospitals() {
  db.run('DROP TABLE IF EXISTS hospitals;');

  db.run('CREATE TABLE hospitals(hospital_id INTEGER PRIMARY KEY, name TEXT, province_id INTEGER, FOREIGN KEY(province_id) REFERENCES provinces(province_id));');

  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',1, 'Bệnh Viện Hùng Vương', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',2, 'Bệnh Viện Đa Khoa Quốc Ánh', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',3, 'Bệnh viện Nhân Dân Gia Định', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',4, 'Bệnh viện Quận Tân Phú', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',5, 'Bệnh viện Quận Thủ Đức', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',6, 'Bệnh viện Từ Dũ', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',7, 'Bệnh viện Bạch Mai', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',8, 'Bệnh viện Đa Khoa Hà Đông', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',9, 'Bệnh viện Phụ Sản Hà Nội', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',10, 'Bệnh viện Phụ Sản Trung Ương', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',11, 'Bệnh viện Trung ương Quân Đội 108', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',12, 'Bệnh viện Phụ Sản Hải Phòng', 6);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',13, 'Bệnh viện Phụ sản Tâm Phúc', 6);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',14, 'Bệnh viện Phụ Sản Cần Thơ', 4);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',15, 'Bệnh viện Sản Nhi Đà Nẵng', 3);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',16, 'Trung Tâm Y Tế Quận Liên Chiểu', 3);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',17, 'Bệnh viện Đa Khoa Tỉnh Bạc Liêu', 46);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',18, 'Bệnh viện Đa Khoa Huyện Tiên Du', 17);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',19, 'Bệnh viện Đa Khoa Huyện Từ Sơn', 17);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',20, 'Bệnh viện Hoàn Mỹ Bắc Ninh', 17);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',21, 'Bệnh viện Đa Khoa Nguyễn Đình Chiểu', 27);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',22, 'Bệnh viện Phụ Sản Tiền Giang', 27);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',23, 'Bệnh viện Đa Khoa Bình Định', 21);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',24, 'Bệnh viện Đa Khoa Thành Phố Quy Nhơn', 21);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',25, 'Bệnh viện Đa Khoa Tỉnh Bình Đinh - Phần Mở Rộng', 21);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',26, 'Bệnh viện Đa Khoa Bình Dương', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',27, 'Bệnh viện Đa Khoa Thuận An', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',28, 'Bệnh viện Hoàn Hảo 2', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',29, 'Trung tâm Chăm sóc Sức khoẻ Sinh sản Bình Dương', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',30, 'Bệnh viện Đa Khoa Vùng Tây Nguyên', 20);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',31, 'Bệnh viện Đa Khoa Thống Nhất', 24);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',32, 'Bệnh viện Phụ Sản Hải Dương', 11);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',33, 'Bệnh viện Đa Khoa Hưng Hà', 14);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',34, 'Bệnh viện Đa Khoa Hưng Yên', 14);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',35, 'Bệnh viện Đa Khoa Tỉnh Kiên Giang', 47);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',36, 'Bệnh viện 115 - Nghệ An', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',37, 'Bệnh viện Đa Khoa Hữu Nghị', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',38, 'Bệnh viện Đa Khoa Thái An', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',39, 'Bệnh viện Sản Nhi Nghệ An', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',40, 'Bệnh viện Thành phố Vinh', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',41, 'Bệnh viện Sản Nhi Ninh Bình', 15);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',42, 'Bệnh viện Sản Nhi Quảng Ngãi', 19);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',43, 'Bệnh viện Sản Nhi Sóc Trăng', 48);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',44, 'Bệnh viện Thành phố Thái Bình', 13);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',45, 'Bệnh viện A Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',46, 'Bệnh viện C Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',47, 'Bệnh viện Đa Khoa Trung ương Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',48, 'Bệnh viện Gang Thép Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',49, 'Bệnh viện Quốc Tế Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',50, 'Bệnh viện Đa Khoa Trung ương Huế', 18);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',51, 'Bệnh viện Y Dược Huế', 18);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',52, 'Bệnh viện Sản Nhi Trà Vinh', 29);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',53, 'Bệnh viện Đa Khoa Tỉnh Vĩnh Long', 31);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);',54, 'Bệnh viện Sản Nhi Vĩnh Phúc', 16);
}

function insertTableMatches() {
  db.run('DROP TABLE IF EXISTS matches;');
  db.run('CREATE TABLE matches(match_id INTEGER PRIMARY KEY, hospital_id INTEGER, name TEXT, FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));');
}

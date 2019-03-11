const electron = require('electron');
const dialog = electron.dialog;
const sqlite3 = require('sqlite3').verbose();
export const db = new sqlite3.Database('db.sqlite3');

export const setupDatabase = () => {
  db.serialize(()=>{
    // db.run('ALTER TABLE customers ADD COLUMN duplicatedPhoneBetweenS1AndS2 INTEGER DEFAULT 0');
    insertTableAreas();
    insertTableProvinces();
    insertTableHospitals();
    insertTableMatches();
    createTableCustomers();
  });
  dialog.showMessageBox({type: 'info', title: 'Thông báo', message: 'Đã khởi tạo Database thành công, bạn có thể tiếp tục sử dụng ứng dụng.'});
}

function createTableCustomers() {
  db.run('DROP TABLE IF EXISTS customers;');
  db.run('CREATE TABLE customers(customer_id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT,\
  email TEXT, district TEXT, province TEXT, phone TEXT, baby_name TEXT,\
  baby_gender TEXT, day TEXT, month TEXT, year TEXT, s1 TEXT, s2 TEXT,\
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
  missingBabyName INTEGER DEFAULT 0, \
  missingBabyGender INTEGER DEFAULT 0,\
  missingBabyInformation INTEGER DEFAULT 0,\
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

function insertTableAreas() {
  db.run('DROP TABLE IF EXISTS areas;');
  db.run('CREATE TABLE areas(area_id INTEGER PRIMARY KEY, name TEXT, channel TEXT);');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 1, 'Hồ Chí Minh', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 2, 'Hà Nội', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 3, 'Đà Nẵng', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 4, 'Cần  Thơ', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 5, 'Khánh Hòa', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 6, 'Hải Phòng', 'Key Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 7, 'Miền Bắc - Urban', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 8, 'Miền Trung - Urban', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 10, 'Miền Tây - Urban', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 9, 'Miền Đông - Urban', 'Urban');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 11, 'Miền Bắc - Rural', 'Rural');
  db.run('INSERT INTO areas(area_id, name, channel) VALUES(?, ?, ?);', 12, 'Miền Trung - Rural', 'Rural');
}

function insertTableProvinces() {
  db.run('DROP TABLE IF EXISTS provinces;');
  db.run('CREATE TABLE provinces(province_id INTEGER PRIMARY KEY, name TEXT, area_id INTEGER, FOREIGN KEY(area_id) REFERENCES areas(area_id));')
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 1, 'Hồ Chí Minh', 1);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 2, 'Hà Nội', 2);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 3, 'Đà Nẵng', 3);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 4, 'Cần Thơ', 4);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 5, 'Khánh Hòa', 5);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 6, 'Hải Phòng', 6);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 7, 'Nghệ An - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 8, 'Quảng Ninh', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 9, 'Thái Nguyên - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 10, 'Thanh Hóa - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 11, 'Hải Dương - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 12, 'Phú Thọ - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 13, 'Thái Bình - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 14, 'Hưng Yên - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 15, 'Ninh Bình', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 16, 'Vĩnh Phúc - Urban', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 17, 'Bắc Ninh', 7);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 18, 'Huế ', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 19, 'Quảng Ngãi - Urban', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 20, 'Dak Lak - Urban', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 21, 'Bình Định - Urban', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 22, 'Quảng Nam - Urban', 8);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 23, 'Bình Dương', 9);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 24, 'Đồng Nai', 9);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 25, 'Bình Thuận', 9);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 26, 'Tiền Giang', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 27, 'Bến Tre', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 28, 'An Giang', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 29, 'Trà Vinh', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 30, 'Đồng Tháp', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 31, 'Vĩnh Long', 10);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 32, 'Nghệ An - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 33, 'Thái Nguyên -  Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 34, 'Thanh Hóa - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 35, 'Hải Dương - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 36, 'Phú Thọ - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 37, 'Thái Bình - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 38, 'Hưng Yên - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 39, 'Vĩnh Phúc - Rural', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 40, 'Bắc Giang', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 41, 'Nam Định', 11);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 42, 'Quảng Ngãi - Rural', 12);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 43, 'Dak Lak - Rural', 12);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 44, 'Bình Định - Rural', 12);
  db.run('INSERT INTO provinces(province_id, name, area_id) VALUES(?,?,?);', 45, 'Quảng Nam - Rural', 12);
}

function insertTableMatches() {
  db.run('DROP TABLE IF EXISTS matches;');
  db.run('CREATE TABLE matches(match_id INTEGER PRIMARY KEY, hospital_id INTEGER, name TEXT, FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id));');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 1, 'Từ Dũ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 2, 'Hùng Vương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 3, 'Bv Phụ Sản MeKong');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 4, 'Bv Quận Tân Phú');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 5, 'Bv Quốc Ánh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 6, 'Bv Hóc Môn');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 7, 'Nguyễn Tri Phương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 8, 'Quận Thủ Đức');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 9, 'ĐK Thủ Đức');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 10, 'PS Trung Ương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 11, 'PS Hà Nội');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 12, 'Bv Bạch Mai');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 13, 'Bv Bưu Điện');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 14, 'Bv Nông Nghiệp');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 15, 'Bv 108');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 16, 'Hà Đông');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 17, 'Sản Nhi Đà Nẵng');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 18, 'Bv Quận Sơn Trà');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 19, 'Bv Quận Liên Chiểu');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 20, 'TW Cần Thơ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 21, 'PS Cần Thơ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 22, 'Bv ĐK Khánh Hòa');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 23, 'Bv Phụ Sản Hải Phòng');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 24, 'ĐK TP Vinh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 25, 'Bv Thái An');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 26, 'Bv 115');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 27, 'Bv Hữu Nghị Nghệ An');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 28, 'Sản Nhi Nghệ An');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 29, 'Bv Bãi Cháy');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 30, 'Bv Sản Nhi Quảng Ninh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 31, 'BvĐK TW Thái Nguyên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 32, 'Bv A Thái Nguyên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 33, 'Bv C Thái Nguyên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 34, 'Bv Gang Thép Thái Nguyên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 35, 'Bv Phụ Sản Thanh Hóa');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 36, 'Bv ĐK Thanh Hóa');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 37, 'PS Hải Dương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 38, 'Bv Y Học Cổ Truyền Hải Dương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 39, 'Bv ĐK Phú Thọ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 40, 'Bv ĐK Thái Bình');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 41, 'Bv PS Nhi Thái Bình');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 42, 'Bv Hưng Hà');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 43, 'Bv Sản Nhi Hưng Yên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 44, 'Bv Sản Nhi Ninh Bình');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 45, 'Bv ĐK Vĩnh Phúc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 46, 'Bv Sản Nhi Vĩnh Phúc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 47, 'Sản Nhi Bắc Ninh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 48, 'Bv ĐK Từ Sơn');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 49, 'Bv ĐK Tiên Du');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 50, 'Bv ĐK TW Huế');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 51, 'Y Dược Huế');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 52, 'Bv ĐK Tp Quảng Ngãi');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 53, 'Bv ĐK Thiện Hạnh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 54, 'Bv ĐK Daklak');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 55, 'Bv ĐK Thị Xã Buôn hồ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 56, 'Bv ĐK Bình Định');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 57, 'Bv ĐK KV Quảng Nam');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 58, 'TTCSSK SS Bình Dương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 59, 'Bv Quân Đoàn 4');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 60, 'Bv ĐK Bình Dương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 61, 'Đa Khoa Đồng Nai');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 62, 'TTCSSK SS Bình Thuận');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 63, 'Bv ĐK Bình Thuận');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 64, 'PS Tiền Giang');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 65, 'TTCSSK SS Tiền Giang');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 66, 'Bv ĐK Nguyễn Đình Chiểu');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 67, 'Bv Sản Nhi An Giang');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 68, 'Bv ĐK Trung Tâm An Giang');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 69, 'Sản Nhi Trà Vinh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 70, 'Bv ĐK Đồng Tháp');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 71, 'Bv ĐK Tỉnh Vĩnh Long');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 72, 'Bv TP Vĩnh Long');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 73, 'Bv Huyện Cửa Lò');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 74, 'Bv Huyện Diễn Châu');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 75, 'Bv Huyện Hưng Nguyên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 76, 'Bv Huyện Nghi Lộc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 77, 'Bv Huyện Nam Đàn');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 78, 'Bv Huyện Đồng Hỷ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 79, 'Bv Huyện Sông Công');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 80, 'Bv Huyện Phú Lương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 81, 'Bv Huyện Lang chánh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 82, 'Bv Huyện Cẩm Thủy');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 83, 'Bv Huyện Ngọc Lặc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 84, 'Bv Huyện Bá Thước');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 85, 'Bv Huyện Thường Xuân');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 86, 'Bv Huyện Cẩm Giàng');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 87, 'Bv Huyện Gia Lộc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 88, 'Bv Huyện Nam Sách');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 89, 'Bv Huyện Bình Giang');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 90, 'Bv Huyện Thanh Hà');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 91, 'Bv Huyện Lâm Thao');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 92, 'Bv Huyện Song Thao');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 93, 'Bv Huyện Tân Sơn');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 94, 'Bv Huyện Vũ Thư');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 95, 'Bv Huyện Đông Hưng');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 96, 'Bv Huyện Tiền Hải');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 97, 'Bv Huyện Kiến Xương');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 98, 'Bv Huyện Phù Cừ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 99, 'Bv Huyện Kim Động');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 100, 'Bv Huyện Ân Thi');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 101, 'Bv Huyện Bình Xuyên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 102, 'Bv Huyện Phúc Yên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 103, 'Bv Huyện Yên lạc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 104, 'Bv Huyện Lạng giang');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 105, 'Bv Huyện Yên Dũng');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 106, 'Bv Huyện Lục Nam');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 107, 'Bv Huyện Tân yên');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 108, 'Bv Huyện Mỹ Lộc');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 109, 'Bv Huyện Nam Trực');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 110, 'Bv Huyện Trực Ninh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 111, 'Bv Huyện Vụ Bản');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 112, 'Bv Sơn Hà');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 113, 'Bv Tư Nghĩa');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 114, 'Bv Sơn Tịnh');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 115, 'Bv Huyện Cư kuin');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 116, 'Bv ĐK Huyện Krong pak');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 117, 'Bv ĐK Cư M\'gar');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 118, 'Bv ĐK Thị Xã Buôn hồ');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 119, 'TT Y Tế Huyện An Nhơn');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 120, 'Bv Huyện Tuy Phước');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 121, 'Bv Huyện Phù Cát');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 122, 'Bv ĐK TW Quảng Nam');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 123, 'TT Y Tế Huyện Thăng Bình');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 124, 'Bv Huyện Tiên Phước');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 125, 'TT Y Tế Huyện Hiệp Đức');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 126, 'Đa Khoa Thống Nhất');
  db.run('INSERT INTO matches(hospital_id, name) VALUES(?, ?);', 127, 'Trung tâm chăm sóc sức khỏe sinh sản An Giang');
}

function insertTableHospitals() {
  db.run('DROP TABLE IF EXISTS hospitals;');
  db.run('CREATE TABLE hospitals(hospital_id INTEGER PRIMARY KEY, name TEXT, province_id INTEGER, FOREIGN KEY(province_id) REFERENCES provinces(province_id));');
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 1, 'Từ Dũ', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 2, 'Hùng Vương', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 3, 'Bv Phụ Sản MeKong', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 4, 'Bv Quận Tân Phú', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 5, 'Bv Quốc Ánh', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 6, 'Bv Hóc Môn', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 7, 'Nguyễn Tri Phương', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 8, 'Quận Thủ Đức', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 9, 'ĐK Thủ Đức', 1);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 10, 'PS Trung Ương', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 11, 'PS Hà Nội', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 12, 'Bv Bạch Mai', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 13, 'Bv Bưu Điện', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 14, 'Bv Nông Nghiệp', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 15, 'Bv 108', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 16, 'Hà Đông', 2);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 17, 'Sản Nhi Đà Nẵng', 3);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 18, 'Bv Quận Sơn Trà', 3);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 19, 'Bv Quận Liên Chiểu', 3);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 20, 'TW Cần Thơ', 4);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 21, 'PS Cần Thơ', 4);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 22, 'Bv ĐK Khánh Hòa', 5);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 23, 'Bv Phụ Sản Hải Phòng', 6);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 24, 'ĐK TP Vinh', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 25, 'Bv Thái An', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 26, 'Bv 115', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 27, 'Bv Hữu Nghị Nghệ An', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 28, 'Sản Nhi Nghệ An', 7);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 29, 'Bv Bãi Cháy', 8);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 30, 'Bv Sản Nhi Quảng Ninh', 8);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 31, 'BvĐK TW Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 32, 'Bv A Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 33, 'Bv C Thái Nguyên', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 34, 'Bv Gang Thép Thái Nguyên ', 9);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 35, 'Bv Phụ Sản Thanh Hóa', 10);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 36, 'Bv ĐK Thanh Hóa', 10);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 37, 'PS Hải Dương', 11);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 38, 'Bv Y Học Cổ Truyền Hải Dương', 11);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 39, 'Bv ĐK Phú Thọ');
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 40, 'Bv ĐK Thái Bình', 13);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 41, 'Bv PS Nhi Thái Bình', 13);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 42, 'Bv Hưng Hà', 14);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 43, 'Bv Sản Nhi Hưng Yên', 14);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 44, 'Bv Sản Nhi Ninh Bình', 15);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 45, 'Bv ĐK Vĩnh Phúc', 16);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 46, 'Bv Sản Nhi Vĩnh Phúc', 16);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 47, 'Sản Nhi Bắc Ninh', 17);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 48, 'Bv ĐK Từ Sơn', 17);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 49, 'Bv ĐK Tiên Du', 17);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 50, 'Bv ĐK TW Huế', 18);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 51, 'Y Dược Huế', 18);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 52, 'Bv ĐK Tp Quảng Ngãi', 19);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 53, 'Bv ĐK Thiện Hạnh', 20);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 54, 'Bv ĐK Daklak', 20);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 55, 'Bv ĐK Thị Xã Buôn hồ', 20);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 56, 'Bv ĐK Bình Định', 21);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 57, 'Bv ĐK KV Quảng Nam', 22);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 58, 'TTCSSK SS Bình Dương', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 59, 'Bv Quân Đoàn 4', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 60, 'Bv ĐK Bình Dương', 23);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 61, 'Đa Khoa Đồng Nai', 24);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 62, 'TTCSSK SS Bình Thuận', 25);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 63, 'Bv ĐK Bình Thuận', 25);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 64, 'PS Tiền Giang', 26);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 65, 'TTCSSK SS Tiền Giang', 26);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 66, 'Bv ĐK Nguyễn Đình Chiểu', 27);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 67, 'Bv Sản Nhi An Giang', 28);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 68, 'Bv ĐK Trung Tâm An Giang', 28);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 69, 'Sản Nhi Trà Vinh', 29);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 70, 'Bv ĐK Đồng Tháp', 30);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 71, 'Bv ĐK Tỉnh Vĩnh Long', 31);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 72, 'Bv TP Vĩnh Long', 31);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 73, 'Bv Huyện Cửa Lò', 32);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 74, 'Bv Huyện Diễn Châu', 32);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 75, 'Bv Huyện Hưng Nguyên', 32);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 76, 'Bv Huyện Nghi Lộc', 32);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 77, 'Bv Huyện Nam Đàn', 32);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 78, 'Bv Huyện Đồng Hỷ', 33);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 79, 'Bv Huyện Sông Công', 33);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 80, 'Bv Huyện Phú Lương', 33);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 81, 'Bv Huyện Lang chánh', 34);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 82, 'Bv Huyện Cẩm Thủy', 34);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 83, 'Bv Huyện Ngọc Lặc', 34);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 84, 'Bv Huyện Bá Thước', 34);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 85, 'Bv Huyện Thường Xuân', 34);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 86, 'Bv Huyện Cẩm Giàng', 35);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 87, 'Bv Huyện Gia Lộc', 35);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 88, 'Bv Huyện Nam Sách', 35);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 89, 'Bv Huyện Bình Giang', 35);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 90, 'Bv Huyện Thanh Hà', 35);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 91, 'Bv Huyện Lâm Thao', 36);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 92, 'Bv Huyện Song Thao', 36);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 93, 'Bv Huyện Tân Sơn', 36);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 94, 'Bv Huyện Vũ Thư', 37);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 95, 'Bv Huyện Đông Hưng', 37);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 96, 'Bv Huyện Tiền Hải', 37);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 97, 'Bv Huyện Kiến Xương', 37);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 98, 'Bv Huyện Phù Cừ', 38);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 99, 'Bv Huyện Kim Động', 38);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 100, 'Bv Huyện Ân Thi', 38);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 101, 'Bv Huyện Bình Xuyên', 39);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 102, 'Bv Huyện Phúc Yên', 39);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 103, 'Bv Huyện Yên lạc', 39);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 104, 'Bv Huyện Lạng giang', 40);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 105, 'Bv Huyện Yên Dũng', 40);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 106, 'Bv Huyện Lục Nam', 40);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 107, 'Bv Huyện Tân yên', 40);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 108, 'Bv Huyện Mỹ Lộc', 41);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 109, 'Bv Huyện Nam Trực', 41);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 110, 'Bv Huyện Trực Ninh', 41);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 111, 'Bv Huyện Vụ Bản', 41);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 112, 'Bv Sơn Hà', 42);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 113, 'Bv Tư Nghĩa', 42);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 114, 'Bv Sơn Tịnh', 42);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 115, 'Bv Huyện Cư kuin', 43);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 116, 'Bv ĐK Huyện Krong pak', 43);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 117, 'Bv ĐK Cư M\'gar', 43);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 118, 'Bv ĐK Thị Xã Buôn hồ', 43);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 119, 'TT Y Tế Huyện An Nhơn', 44);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 120, 'Bv Huyện Tuy Phước', 44);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 121, 'Bv Huyện Phù Cát', 44);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 122, 'Bv ĐK TW Quảng Nam', 45);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 123, 'TT Y Tế Huyện Thăng Bình', 45);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 124, 'Bv Huyện Tiên Phước', 45);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 125, 'TT Y Tế Huyện Hiệp Đức', 45);
  db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 126, 'Đa Khoa Thống Nhất', 24);
	db.run('INSERT INTO hospitals(hospital_id, name, province_id) VALUES(?,?,?);', 127, 'Trung tâm chăm sóc sức khỏe sinh sản An Giang', 28);
}

import { db } from './prepare_data';

export const createCustomer = (customer) => {
  return new Promise((resolve, reject) => {
    customer.phone = '' + customer.phone.replace(/[\.\-\_\s\+\(\)]/g,'');
    customer.sampling = '';
    customer.isPhoneDuplicated = false;
    if (customer.s1 !== undefined && customer.s1 !== null && customer.s1 !== '') {
      customer.sampling = 'S1';
    }

    if (customer.s2 !== undefined && customer.s2 !== null && customer.s2 !== '') {
      if (customer.sampling === '') {
        customer.sampling = 'S2';
      } else {
        if (
          customer.babyName !== undefined && customer.babyName !== null &&
          customer.babyName !== '' && customer.babyGender !== undefined &&
          customer.babyGender !== null && customer.babyGender !== ''
        ) {
          customer.sampling = 'S2';
        } else {
          customer.sampling = 'S1';
        }
      }
    }

    isPhoneDuplicate(customer.phone).then( (res) => {
      if (res == true) {
        customer.phone = customer.phone + ' - *dup*';
        customer.isPhoneDuplicated = true;
      }
      db.run('INSERT INTO customers(first_name, last_name, email, district, province, phone, baby_name, baby_gender, day, month, year, s1, s2, sampling, hospital_id, batch) VALUES($firstName, $lastName, $email, $district, $province, $phone, $babyName, $babyGender, $day, $month, $year, $s1, $s2, $sampling, $hospital_id, $batch);',
      {
        $firstName: customer.firstName,
        $lastName: customer.lastName,
        $email: customer.email,
        $district: customer.district,
        $province: customer.province,
        $phone: customer.phone,
        $babyName: customer.babyName,
        $babyGender: customer.babyGender,
        $day: customer.day,
        $month: customer.month,
        $year: customer.year,
        $s1: customer.s1,
        $s2: customer.s2,
        $sampling: customer.sampling,
        $hospital_id: customer.hospital_id,
        $batch: customer.batch
      }, (errRes) => {
        db.get('SELECT last_insert_rowid() as id', (err, row) => {
          customer.id = row.id;
          resolve(customer);
        })
      });
    });
  });

  // if (phone.length >= 8 && phone.length <= 12 && !isNaN(parseInt(phone)){
  //   // Valid Phone
  //   // Check with Database for Duplication
  // }
}

export const isPhoneDuplicate = (phone) => {
  return new Promise((resolve, reject) => {

    if (phone === undefined || phone === null) {
      return resolve(false);
    }

    if (phone.length < 8 || phone.length > 12 || isNaN(parseInt(phone))) {
      // Không check với trường hợp phone không hợp lệ
      return resolve(false);
    }

    db.get('SELECT customer_id FROM customers WHERE customers.phone = ?', phone, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (res === undefined || res === null) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  })
}

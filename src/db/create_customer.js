import { db } from './prepare_data';

export const updateCustomer = (customer) => {
  return new Promise((resolve, reject) => {
    if (customer.customer_id === null || customer.customer_id === undefined) {
      return reject('failed');
    }
    db.run('UPDATE customers SET\
      hasError = $hasError, missingData = $missingData,\
      missingFirstName = $missingFirstName, missingLastName = $missingLastName, missingMomName = $missingMomName,\
      missingDistrict = $missingDistrict, missingProvince = $missingProvince,\
      missingAddress = $missingAddress, missingPhone = $missingPhone,\
      missingEmail = $missingEmail, missingBabyInformation = $missingBabyInformation,\
      missingBabyName = $missingBabyName, missingBabyGender = $missingBabyGender,\
      missingSampling = $missingSampling, missingDate = $missingDate,\
      missingMomStatus = $missingMomStatus,\
      illogicalData = $illogicalData, illogicalPhone = $illogicalPhone,\
      illogicalName = $illogicalName, illogicalSampling = $illogicalSampling,\
      illogicalEmail = $illogicalEmail, illogicalAddress = $illogicalAddress,\
      illogicalDate = $illogicalDate, duplicatedPhone = $duplicatedPhone,\
      duplicatedPhoneS1 = $duplicatedPhoneS1, duplicatedPhoneS2 = $duplicatedPhoneS2 \
      WHERE customer_id = $customer_id', {
      $customer_id: customer.customer_id,
      $hasError: customer.hasError || 0,
      $missingData: customer.missingData || 0,
      $missingFirstName: customer.missingFirstName || 0,
      $missingLastName: customer.missingLastName || 0,
      $missingMomName: customer.missingMomName || 0,
      $missingDistrict: customer.missingDistrict || 0,
      $missingProvince: customer.missingProvince || 0,
      $missingAddress: customer.missingAddress || 0,
      $missingPhone: customer.missingPhone || 0,
      $missingEmail: customer.missingEmail || 0,
      $missingBabyInformation: customer.missingBabyInformation || 0,
      $missingBabyName: customer.missingBabyName || 0,
      $missingBabyGender: customer.missingBabyGender || 0,
      $missingSampling: customer.missingSampling || 0,
      $missingDate: customer.missingDate || 0,
      $missingMomStatus: customer.missingMomStatus || 0,
      $illogicalData: customer.illogicalData || 0,
      $illogicalPhone: customer.illogicalPhone || 0,
      $illogicalName: customer.illogicalName || 0,
      $illogicalSampling: customer.illogicalSampling || 0,
      $illogicalEmail: customer.illogicalEmail || 0,
      $illogicalAddress: customer.illogicalAddress || 0,
      $illogicalDate: customer.illogicalDate || 0,
      $duplicatedPhone: customer.duplicatedPhone || 0,
      $duplicatedPhoneS1: customer.duplicatedPhoneS1 || 0,
      $duplicatedPhoneS2: customer.duplicatedPhoneS2 || 0,
    }, (err) => {
      if (err) {
        console.log(err);
      }
      resolve(true);
    })
  });
}

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

    isPhoneDuplicate(customer).then( (res) => {
      if (res === true) {
        customer.phone = customer.phone + ' - *dup*';
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
        db.get('SELECT last_insert_rowid() as customer_id', (err, row) => {
          customer.customer_id = row.customer_id;
          resolve(customer);
        })
      });
    });
  });
}

function isPhoneDuplicate(customer) {
  return new Promise((resolve, reject) => {

    if (customer.phone === undefined || customer.phone === null) {
      return resolve(false);
    }

    if (customer.phone.length < 8 || customer.phone.length > 12 || isNaN(parseInt(customer.phone))) {
      // Không check với trường hợp phone không hợp lệ
      return resolve(false);
    }

    db.get('SELECT customer_id FROM customers WHERE customers.phone = ?', customer.phone, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (res === undefined || res === null) {
        resolve(false);
      } else {
        customer.isPhoneDuplicated = true;
        customer.duplicatedPhone = 1;
        if (customer.sampling !== 'S1' && customer.sampling !== 'S2' ) {
          resolve(true);
        } else {
          db.get('SELECT customer_id FROM customers WHERE customers.phone = ? AND customers.sampling = ?', customer.phone, customer.sampling, (err, subRes) => {
            if (subRes !== undefined && subRes !== null) {
              if (customer.sampling === 'S1') {
                customer.duplicatedPhoneS1 = 1;
              }
              if (customer.sampling === 'S2') {
                customer.duplicatedPhoneS2 = 1;
              }
            }
            resolve(true);
          });
        }
      }
    });
  })
}

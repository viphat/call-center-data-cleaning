import { db } from './prepare_data';

export const updateCustomer = (customer) => {
  return new Promise((resolve, reject) => {
    if (customer.customer_id === null || customer.customer_id === undefined) {
      return reject('failed');
    }
    db.run('UPDATE customers SET\
      day = $day, month = $month, year = $year,\
      hasError = $hasError, missingData = $missingData,\
      missingFirstName = $missingFirstName, missingLastName = $missingLastName, missingMomName = $missingMomName,\
      missingDistrict = $missingDistrict, missingProvince = $missingProvince,\
      missingAddress = $missingAddress, missingPhone = $missingPhone,\
      missingEmail = $missingEmail,\
      missingSampling = $missingSampling, missingDate = $missingDate,\
      missingMomStatus = $missingMomStatus,\
      illogicalData = $illogicalData, illogicalPhone = $illogicalPhone,\
      illogicalName = $illogicalName, illogicalSampling = $illogicalSampling,\
      illogicalEmail = $illogicalEmail, illogicalAddress = $illogicalAddress,\
      illogicalDate = $illogicalDate, illogicalOther = $illogicalOther, \
      duplicatedPhone = $duplicatedPhone,\
      duplicatedPhoneBetweenS1AndS2= $duplicatedPhoneBetweenS1AndS2,\
      duplicatedPhoneS1 = $duplicatedPhoneS1, duplicatedPhoneS2 = $duplicatedPhoneS2 \
      WHERE customer_id = $customer_id', {
      $customer_id: customer.customer_id,
      $day: customer.day,
      $month: customer.month,
      $year: customer.year,
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
      $illogicalOther: customer.illogicalOther || 0,
      $duplicatedPhone: customer.duplicatedPhone || 0,
      $duplicatedPhoneBetweenS1AndS2: customer.duplicatedPhoneBetweenS1AndS2 || 0,
      $duplicatedPhoneS1: customer.duplicatedPhoneS1 || 0,
      $duplicatedPhoneS2: customer.duplicatedPhoneS2 || 0
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
    // customer.sampling = '';
    customer.isPhoneDuplicated = false;

    if (customer.s1 !== undefined && customer.s1 !== null && customer.s1 !== '') {
      if (customer.sampling == 'S2'){
        customer.illogicalSampling = 1;
        customer.sampling = 'S2';
        customer.s1 = '';
        customer.s2 = 'S1';
      };
    }

    if (customer.s2 !== undefined && customer.s2 !== null && customer.s2 !== '') {
      if (customer.sampling == 'S1'){
        customer.illogicalSampling = 1;
        customer.sampling = 'S1';
        customer.s2 = '';
        customer.s1 = 'S2';
      }
    }

    db.run('INSERT INTO customers(\
        first_name, last_name, email,\
        district, province, phone,\
        day, month, year, s1, s2, sampling,\
        illogicalSampling,\
        hospital_id, batch) \
        VALUES($firstName, $lastName, $email,\
        $district, $province, $phone, $day, $month, $year, $s1, $s2, $sampling,\
        $illogicalSampling,\
        $hospital_id, $batch);',
    {
      $firstName: customer.firstName,
      $lastName: customer.lastName,
      $email: customer.email,
      $district: customer.district,
      $province: customer.province,
      $phone: customer.phone,
      $day: customer.day,
      $month: customer.month,
      $year: customer.year,
      $s1: customer.s1,
      $s2: customer.s2,
      $sampling: customer.sampling,
      $illogicalSampling: customer.illogicalSampling,
      $hospital_id: customer.hospital_id,
      $batch: customer.batch
    }, (errRes) => {
      db.get('SELECT last_insert_rowid() as customer_id', (err, row) => {
        customer.customer_id = row.customer_id;
        isPhoneDuplicate(customer).then((customer) => {
          resolve(customer);
        });
      });
    });
  });
}

export function isPhoneDuplicate(customer) {
  return new Promise((resolve, reject) => {

    if (customer.phone === undefined || customer.phone === null) {
      return resolve(customer);
    }

    if (customer.phone.length < 8 || customer.phone.length > 12 || isNaN(parseInt(customer.phone))) {
      // Không check với trường hợp phone không hợp lệ
      return resolve(customer);
    }

    db.get('SELECT customers.customer_id, customers.last_name, customers.first_name,\
    customers.email, customers.district, customers.province, customers.phone,\
    customers.day, customers.month, customers.year,\
    customers.s1, customers.s2, hospitals.name as hospital_name, \
    provinces.name as province_name, areas.channel as area_channel, \
    areas.name as area_name,\
    customers.sampling, customers.batch\
    from customers JOIN hospitals ON \
    hospitals.hospital_id = customers.hospital_id JOIN provinces ON \
    hospitals.province_id = provinces.province_id JOIN areas ON \
    areas.area_id = provinces.area_id \
    WHERE customers.phone = ? AND customers.customer_id != ?',
      customer.phone, customer.customer_id, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (res === undefined || res === null) {
        resolve(customer);
      } else {
        customer.duplicatedWith = res;
        customer.isPhoneDuplicated = true;
        customer.duplicatedPhone = 1;
        if (customer.sampling !== 'S1' && customer.sampling !== 'S2' ) {
          resolve(customer);
        } else {
          // Chưa hiểu đoạn này lắm, sao mình phải vào database lấy record này ra lần nữa nhỉ?
          // Để làm gì nhỉ?
          db.get('SELECT customer_id FROM customers \
            WHERE customers.customer_id != ? AND customers.phone = ? AND customers.sampling = ?',
            customer.customer_id, customer.phone, customer.sampling, (err, subRes) => {
            if (subRes !== undefined && subRes !== null) {
              if (customer.sampling === 'S1') {
                customer.duplicatedPhoneS1 = 1;
              }
              if (customer.sampling === 'S2') {
                customer.duplicatedPhoneS2 = 1;
              }
            } else {
              customer.duplicatedPhoneBetweenS1AndS2 = 1;
            }
            resolve(customer);
          });
        }
      }
    });
  })
}

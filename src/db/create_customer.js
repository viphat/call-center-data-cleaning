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
      duplicatedWithinPast2Years = $duplicatedWithinPast2Years,\
      duplicatedOverPast2Years = $duplicatedOverPast2Years,\
      duplicatedWithSameYear = $duplicatedWithSameYear,\
      duplicatedWith2019 = $duplicatedWith2019,\
      duplicatedWith2020 = $duplicatedWith2020,\
      duplicatedWith2021 = $duplicatedWith2021,\
      duplicatedWith2022 = $duplicatedWith2022,\
      duplicatedWith2023 = $duplicatedWith2023,\
      duplicatedPhoneBetweenS1AndS2= $duplicatedPhoneBetweenS1AndS2,\
      duplicatedPhoneS1 = $duplicatedPhoneS1, duplicatedPhoneS2 = $duplicatedPhoneS2, \
      duplicatedWithAnotherAgency = $duplicatedWithAnotherAgency\
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
      $duplicatedWithSameYear: customer.duplicatedWithSameYear || 0,
      $duplicatedWith2019: customer.duplicatedWith2019 || 0,
      $duplicatedWith2020: customer.duplicatedWith2020 || 0,
      $duplicatedWith2021: customer.duplicatedWith2021 || 0,
      $duplicatedWith2022: customer.duplicatedWith2022 || 0,
      $duplicatedWith2023: customer.duplicatedWith2023 || 0,
      $duplicatedWithinPast2Years: customer.duplicatedWithinPast2Years || 0,
      $duplicatedOverPast2Years: customer.duplicatedOverPast2Years || 0,
      $duplicatedPhoneBetweenS1AndS2: customer.duplicatedPhoneBetweenS1AndS2 || 0,
      $duplicatedPhoneS1: customer.duplicatedPhoneS1 || 0,
      $duplicatedPhoneS2: customer.duplicatedPhoneS2 || 0,
      $duplicatedWithAnotherAgency: customer.duplicatedWithAnotherAgency || 0
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
        collectedDay, collectedMonth, collectedYear, staff, \
        note, pgCode, qrCode, \
        illogicalSampling,\
        hospital_id, batch, source) \
        VALUES($firstName, $lastName, $email,\
        $district, $province, $phone, $day, $month, $year, $s1, $s2, $sampling,\
        $collectedDay, $collectedMonth, $collectedYear, $staff, $note, $pgCode, $qrCode, \
        $illogicalSampling,\
        $hospital_id, $batch, $source);',
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
      $collectedDay: customer.collectedDay,
      $collectedMonth: customer.collectedMonth,
      $collectedYear: customer.collectedYear,
      $staff: customer.staff,
      $note: customer.note,
      $pgCode: customer.pgCode,
      $qrCode: customer.qrCode,
      $illogicalSampling: customer.illogicalSampling,
      $hospital_id: customer.hospital_id,
      $batch: customer.batch,
      $source: customer.source
    }, (errRes) => {
      console.log(errRes)

      db.get('SELECT last_insert_rowid() as customer_id', (err, row) => {
        customer.customer_id = row.customer_id;
        isPhoneDuplicate(customer).then((c1) => {
          isPhoneDuplicateWithAnotherAgency(c1).then((c2) => {
            resolve(c2);
          });
        });
      });
    });
  });
}

export function isPhoneDuplicateWithAnotherAgency(customer) {
  return new Promise((resolve, reject) => {

    if (customer.phone === undefined || customer.phone === null) {
      return resolve(customer);
    }

    if (customer.phone.length < 8 || customer.phone.length > 12 || isNaN(parseInt(customer.phone))) {
      return resolve(customer);
    }

    db.get('SELECT customers.customer_id, customers.last_name, customers.first_name,\
    customers.email, customers.district, customers.province, customers.phone,\
    customers.day, customers.month, customers.year,\
    customers.s1, customers.s2, hospitals.name as hospital_name, \
    provinces.name as province_name, areas.channel as area_channel, \
    areas.name as area_name,\
    customers.sampling, customers.batch, customers.source,\
    customers.staff, customers.note, customers.pgCode, customers.qrCode, customers.collectedDay, customers.collectedMonth, customers.collectedYear\
    from customers JOIN hospitals ON \
    hospitals.hospital_id = customers.hospital_id JOIN provinces ON \
    hospitals.province_id = provinces.province_id JOIN areas ON \
    areas.area_id = provinces.area_id \
    WHERE customers.phone = ? AND customers.customer_id != ? AND customers.source != ?',
      customer.phone, customer.customer_id, customer.source, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (res === undefined || res === null) {
        resolve(customer);
      } else {
        customer.duplicateWithAnotherAgency = res;
        customer.duplicatedWithAnotherAgency = 1;

        customer.isPhoneDuplicatedWithAnotherAgency = true;
        resolve(customer);
      }
    });
  })
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
    customers.sampling, customers.batch, customers.source, customers.staff, customers.note, customers.pgCode, customers.qrCode, \
    customers.collectedDay, customers.collectedMonth, customers.collectedYear\
    from customers JOIN hospitals ON \
    hospitals.hospital_id = customers.hospital_id JOIN provinces ON \
    hospitals.province_id = provinces.province_id JOIN areas ON \
    areas.area_id = provinces.area_id \
    WHERE customers.phone = ? AND customers.customer_id != ? AND customers.source = ?',
      customer.phone, customer.customer_id, customer.source, (err, res) => {
      if (err) {
        return reject(err);
      }

      if (res === undefined || res === null) {
        resolve(customer);
      } else {
        customer.duplicatedWith = res;
        customer.isPhoneDuplicated = true;
        customer.duplicatedPhone = 1;

        if (res.collectedYear) {
          var duplicatedRecordCollectedDate = new Date(res.collectedYear, res.collectedMonth - 1, res.collectedDay);
          var currentCollectedDate = new Date(customer.collectedYear, customer.collectedMonth - 1, customer.collectedDay);

          var year = 2;
          if (customer.source === 'IMC') {
            year = 1;
          }

          if (currentCollectedDate.getTime() < duplicatedRecordCollectedDate.getTime() + year * 365 * 24 * 60 * 60 * 1000) {
            customer.duplicatedWithinPast2Years = 1;
            customer.duplicatedOverPast2Years = 0;
          } else {
            if (customer.collectedYear == res.collectedYear + year && customer.collectedMonth == res.collectedMonth && customer.collectedDay == res.collectedDay) {
              customer.duplicatedWithinPast2Years = 1;
              customer.duplicatedOverPast2Years = 0;
            } else {
              customer.duplicatedOverPast2Years = 1;
              customer.duplicatedWithinPast2Years = 0;
            }
          }
        }

        // if (res.collectedYear) {
        //   if (res.collectedYear == 2024) {
        //     customer.duplicatedWithSameYear = 1;
        //   } else if (res.collectedYear == 2023) {
        //     if (res.source === 'IMC') {
        //       if (res.collectedMonth >= 10) {
        //         customer.duplicatedWith2023 = 1;
        //       } else {
        //         customer.duplicatedWith2022 = 1;
        //       }
        //     } else {
        //       customer.duplicatedWith2023 = 1;
        //     }
        //   } else if (res.collectedYear == 2022) {
        //     customer.duplicatedWith2022 = 1;
        //   } else if (res.collectedYear == 2021) {
        //     customer.duplicatedWith2021 = 1;
        //   } else if (res.collectedYear == 2020) {
        //     customer.duplicatedWith2020 = 1;
        //   } else if (res.collectedYear == 2019) {
        //     customer.duplicatedWith2019 = 1;
        //   }
        // }

        if (customer.sampling !== 'S1' && customer.sampling !== 'S2' ) {
          resolve(customer);
        } else {
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

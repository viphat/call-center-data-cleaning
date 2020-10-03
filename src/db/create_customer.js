import { db } from './prepare_data';

export const updateCustomer = (customer) => {
  return new Promise((resolve, reject) => {
    if (customer.customer_id === null || customer.customer_id === undefined) {
      return reject('failed');
    }

    db.run('UPDATE customers SET\
      day = $day, month = $month, year = $year,\
      hasError = $hasError, missingData = $missingData,\
      missingName = $missingName,\
      missingLivingCity = $missingLivingCity,\
      missingPhone = $missingPhone,\
      missingDeliveryDate = $missingDeliveryDate,\
      missingHospital = $missingHospital,\
      missingBrand = $missingBrand,\
      missingOtherInformation = $missingOtherInformation,\
      illogicalData = $illogicalData, illogicalPhone = $illogicalPhone,\
      illogicalDeliveryDate = $illogicalDeliveryDate,\
      illogicalSize = $illogicalSize, \
      illogicalBrand = $illogicalBrand, \
      illogicalBabyWeight = $illogicalBabyWeight, \
      illogicalOthers = $illogicalOthers, \
      duplicatedPhone = $duplicatedPhone\
      WHERE customer_id = $customer_id', {
      $customer_id: customer.customer_id,
      $day: customer.day,
      $month: customer.month,
      $year: customer.year,
      $hasError: customer.hasError || 0,
      $missingData: customer.missingData || 0,
      $missingName: customer.missingName || 0,
      $missingLivingCity: customer.missingLivingCity || 0,
      $missingDeliveryDate: customer.missingDeliveryDate || 0,
      $missingPhone: customer.missingPhone || 0,
      $missingHospital: customer.missingHospital || 0,
      $missingBrand: customer.missingBrand || 0,
      $missingOtherInformation: customer.missingOtherInformation || 0,
      $illogicalData: customer.illogicalData || 0,
      $illogicalPhone: customer.illogicalPhone || 0,
      $illogicalDeliveryDate: customer.illogicalDeliveryDate || 0,
      $illogicalSize: customer.illogicalSize || 0,
      $illogicalBabyWeight: customer.illogicalBabyWeight || 0,
      $illogicalBrand: customer.illogicalBrand || 0,
      $illogicalOthers: customer.illogicalOthers || 0,
      $duplicatedPhone: customer.duplicatedPhone || 0
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
    console.log(customer)

    customer.phone = '' + customer.phone.replace(/[\.\-\_\s\+\(\)]/g,'');
    customer.isPhoneDuplicated = false;

    db.run('INSERT INTO customers(\
        first_name, last_name,\
        district, province, phone,\
        day, month, year,\
        collectedDate,\
        collectedDay,\
        collectedMonth,\
        collectedYear,\
        campaignName, brand, babyWeight, babySize, giftSize,\
        hospital_id, week, batch)\
        VALUES($firstName, $lastName,\
        $district, $province, $phone, $day, $month, $year,\
        $collectedDate,\
        $collectedDay,\
        $collectedMonth,\
        $collectedYear,\
        $campaignName, $brand, $babyWeight, $babySize, $giftSize,\
        $hospital_id, $week, $batch);',
    {
      $firstName: customer.firstName,
      $lastName: customer.lastName,
      $district: customer.district,
      $province: customer.province,
      $phone: customer.phone,
      $day: customer.day,
      $month: customer.month,
      $year: customer.year,
      $collectedDate: customer.collectedDate,
      $collectedDay: customer.collectedDay,
      $collectedMonth: customer.collectedMonth,
      $collectedYear: customer.collectedYear,
      $campaignName: customer.campaignName,
      $brand: customer.brand,
      $babyWeight: customer.babyWeight,
      $babySize: customer.babySize,
      $giftSize: customer.giftSize,
      $hospital_id: customer.hospital_id,
      $week: customer.week,
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

    db.get('SELECT customers.customer_id, customers.first_name, customers.last_name,\
    customers.district, customers.province, customers.phone,\
    customers.day, customers.month, customers.year,\
    hospitals.name as hospital_name,\
    provinces.name as province_name,\
    areas.name as area_name,\
    customers.campaignName, customers.babyWeight, customers.babySize, customers.brand, customers.giftSize,\
    customers.collectedDate, customers.week, customers.batch\
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
        resolve(customer);
      }
    });
  })
}

import { db } from '../db/prepare_data.js';

export const clearBatchData = (batch) => {
  return new Promise((resolve, reject) => {
    resolve(db.run('DELETE FROM customers WHERE customers.batch = ?', batch));
  });
}

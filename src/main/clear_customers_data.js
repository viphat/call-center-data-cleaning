import { db } from '../db/prepare_data.js';
const _  = require('lodash');

export const clearBatchData = (batch, source) => {
  return new Promise((resolve, reject) => {
    resolve(db.run('DELETE FROM customers WHERE customers.batch = ? AND customers.source = ?;', batch, source));
  });
}

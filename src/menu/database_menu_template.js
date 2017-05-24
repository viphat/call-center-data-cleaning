import { setupDatabase } from '../db/sqlite3.js';

export const databaseMenuTemplate = {
  label: 'Database',
  submenu: [{
    label: 'Setup Database',
    click: () => {
      setupDatabase();
    }
  }]
}

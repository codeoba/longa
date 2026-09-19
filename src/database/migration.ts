import { db } from './DatabaseManager';
import { COLLECTIONS } from './config';

// Migration helper - kusaidia kuhamisha data kati ya databases
export class DatabaseMigration {
  // Export data from current database
  static async exportAll(): Promise<Record<string, any[]>> {
    const exported: Record<string, any[]> = {};
    
    for (const collection of Object.values(COLLECTIONS)) {
      try {
        exported[collection] = await db.export(collection);
      } catch (error) {
        console.warn(`Failed to export ${collection}:`, error);
        exported[collection] = [];
      }
    }
    
    return exported;
  }
  
  // Import data to current database
  static async importAll(data: Record<string, any[]>): Promise<void> {
    for (const [collection, items] of Object.entries(data)) {
      try {
        await db.import(collection, items);
      } catch (error) {
        console.warn(`Failed to import ${collection}:`, error);
      }
    }
  }
  
  // Migrate from one database type to another
  static async migrate(
    fromConfig: any,
    toConfig: any
  ): Promise<void> {
    // Export from source
    const { DatabaseManager: SourceManager } = await import('./DatabaseManager');
    const sourceDb = SourceManager.getInstance();
    await sourceDb.initialize(fromConfig);
    
    const data = await this.exportAll();
    await sourceDb.disconnect();
    
    // Import to destination
    const { DatabaseManager: DestManager } = await import('./DatabaseManager');
    const destDb = DestManager.getInstance();
    await destDb.initialize(toConfig);
    
    await this.importAll(data);
    
    console.log('Migration completed successfully');
  }
  
  // Backup current database to JSON
  static async backup(): Promise<string> {
    const data = await this.exportAll();
    return JSON.stringify(data, null, 2);
  }
  
  // Restore from JSON backup
  static async restore(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    await this.importAll(data);
  }
  
  // Download backup as file
  static async downloadBackup(): Promise<void> {
    const backup = await this.backup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `x-app-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Upload and restore from file
  static async uploadBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const json = e.target?.result as string;
          await this.restore(json);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

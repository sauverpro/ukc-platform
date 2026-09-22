import sqlite3
import re
import sys

def convert_sqlite_to_mysql(sqlite_file, mysql_file):
    conn = sqlite3.connect(sqlite_file)
    cursor = conn.cursor()
    
    with open(mysql_file, 'w', encoding='utf-8') as f:
        f.write("SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';\n")
        f.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        for table_tuple in tables:
            table_name = table_tuple[0]
            if table_name == 'sqlite_sequence':
                continue
                
            # Get create statement
            cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table_name}';")
            create_stmt = cursor.fetchone()[0]
            if not create_stmt:
                continue
                
            # Basic conversions
            create_stmt = create_stmt.replace('"', '`')
            create_stmt = re.sub(r'AUTOINCREMENT', 'AUTO_INCREMENT', create_stmt, flags=re.IGNORECASE)
            create_stmt = re.sub(r'\bvarchar\b(?!\()', 'varchar(255)', create_stmt, flags=re.IGNORECASE)
            
            f.write(f"DROP TABLE IF EXISTS `{table_name}`;\n")
            f.write(f"{create_stmt};\n\n")
            
            # Get data
            cursor.execute(f"SELECT * FROM `{table_name}`;")
            rows = cursor.fetchall()
            
            if rows:
                cursor.execute(f"PRAGMA table_info(`{table_name}`);")
                columns_info = cursor.fetchall()
                col_names = [f"`{col[1]}`" for col in columns_info]
                
                f.write(f"INSERT INTO `{table_name}` ({', '.join(col_names)}) VALUES \n")
                
                insert_rows = []
                for row in rows:
                    values = []
                    for val in row:
                        if val is None:
                            values.append("NULL")
                        elif isinstance(val, (int, float)):
                            values.append(str(val))
                        else:
                            val_str = str(val).replace("'", "''")
                            val_str = val_str.replace('\\', '\\\\')
                            val_str = val_str.replace('\n', '\\n')
                            val_str = val_str.replace('\r', '\\r')
                            values.append(f"'{val_str}'")
                    insert_rows.append(f"({', '.join(values)})")
                
                f.write(",\n".join(insert_rows) + ";\n\n")
                
        f.write("SET FOREIGN_KEY_CHECKS = 1;\n")
        
    conn.close()

if __name__ == '__main__':
    convert_sqlite_to_mysql('database/database.sqlite', 'database_mysql.sql')
    print("Database successfully exported to database_mysql.sql")

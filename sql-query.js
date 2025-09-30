// SQL-Like Query Interface for IndexedDB
class SQLQuery {
    constructor(database) {
        this.db = database;
    }

    // SQL-like SELECT query
    async select(options = {}) {
        const {
            from = 'tasks',
            where = {},
            orderBy = null,
            limit = null,
            offset = 0
        } = options;

        let results = [];

        // Get data based on 'from' table
        switch (from) {
            case 'tasks':
                results = await this.db.getAllTasks();
                break;
            case 'tags':
                results = await this.db.getAllTags();
                break;
            case 'activityLog':
                results = await this.db.getRecentActivity(1000);
                break;
            default:
                throw new Error(`Unknown table: ${from}`);
        }

        // Apply WHERE conditions
        if (Object.keys(where).length > 0) {
            results = this.applyWhere(results, where);
        }

        // Apply ORDER BY
        if (orderBy) {
            results = this.applyOrderBy(results, orderBy);
        }

        // Apply OFFSET and LIMIT
        if (offset > 0) {
            results = results.slice(offset);
        }
        if (limit) {
            results = results.slice(0, limit);
        }

        return results;
    }

    // Apply WHERE conditions
    applyWhere(data, conditions) {
        return data.filter(item => {
            return Object.entries(conditions).every(([key, value]) => {
                // Handle special operators
                if (typeof value === 'object' && value !== null) {
                    return this.applyOperator(item[key], value);
                }
                // Simple equality
                return item[key] === value;
            });
        });
    }

    // Apply operators (>, <, >=, <=, !=, LIKE, IN)
    applyOperator(fieldValue, condition) {
        const operator = Object.keys(condition)[0];
        const value = condition[operator];

        switch (operator) {
            case '$gt':
                return fieldValue > value;
            case '$gte':
                return fieldValue >= value;
            case '$lt':
                return fieldValue < value;
            case '$lte':
                return fieldValue <= value;
            case '$ne':
                return fieldValue !== value;
            case '$like':
                return fieldValue.toLowerCase().includes(value.toLowerCase());
            case '$in':
                return Array.isArray(value) && value.includes(fieldValue);
            case '$contains':
                return Array.isArray(fieldValue) && fieldValue.some(v => 
                    v.toLowerCase().includes(value.toLowerCase())
                );
            default:
                return false;
        }
    }

    // Apply ORDER BY
    applyOrderBy(data, orderBy) {
        const [field, direction = 'ASC'] = orderBy.split(' ');
        
        return data.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            
            if (aVal < bVal) return direction.toUpperCase() === 'ASC' ? -1 : 1;
            if (aVal > bVal) return direction.toUpperCase() === 'ASC' ? 1 : -1;
            return 0;
        });
    }

    // SQL-like INSERT
    async insert(table, data) {
        switch (table) {
            case 'tasks':
                return await this.db.addTask(data);
            case 'tags':
                return await this.db.saveTag(data.name);
            case 'users':
                return await this.db.saveUser(data);
            default:
                throw new Error(`Cannot insert into table: ${table}`);
        }
    }

    // SQL-like UPDATE
    async update(table, id, data) {
        switch (table) {
            case 'tasks':
                const task = await this.db.getTask(id);
                if (!task) throw new Error('Task not found');
                return await this.db.updateTask({ ...task, ...data });
            default:
                throw new Error(`Cannot update table: ${table}`);
        }
    }

    // SQL-like DELETE
    async delete(table, id) {
        switch (table) {
            case 'tasks':
                return await this.db.deleteTask(id);
            default:
                throw new Error(`Cannot delete from table: ${table}`);
        }
    }

    // SQL-like COUNT
    async count(options = {}) {
        const results = await this.select(options);
        return results.length;
    }

    // SQL-like JOIN (simple implementation)
    async join(options = {}) {
        const {
            from,
            join,
            on,
            where = {},
            orderBy = null
        } = options;

        // Get data from both tables
        const leftData = await this.select({ from });
        const rightData = await this.select({ from: join });

        // Perform join
        const results = [];
        leftData.forEach(left => {
            rightData.forEach(right => {
                if (left[on.left] === right[on.right]) {
                    results.push({ ...left, ...right });
                }
            });
        });

        // Apply WHERE and ORDER BY
        let filtered = results;
        if (Object.keys(where).length > 0) {
            filtered = this.applyWhere(filtered, where);
        }
        if (orderBy) {
            filtered = this.applyOrderBy(filtered, orderBy);
        }

        return filtered;
    }

    // Aggregate functions
    async aggregate(options = {}) {
        const {
            from = 'tasks',
            groupBy = null,
            having = {},
            functions = {}
        } = options;

        const data = await this.select({ from });

        if (!groupBy) {
            // Simple aggregation without grouping
            return this.calculateAggregates(data, functions);
        }

        // Group by field
        const groups = {};
        data.forEach(item => {
            const key = item[groupBy];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        // Calculate aggregates for each group
        const results = Object.entries(groups).map(([key, items]) => {
            return {
                [groupBy]: key,
                ...this.calculateAggregates(items, functions)
            };
        });

        // Apply HAVING conditions
        if (Object.keys(having).length > 0) {
            return this.applyWhere(results, having);
        }

        return results;
    }

    // Calculate aggregate functions
    calculateAggregates(data, functions) {
        const result = {};

        Object.entries(functions).forEach(([alias, func]) => {
            const [operation, field] = func.split('(');
            const fieldName = field?.replace(')', '');

            switch (operation.toUpperCase()) {
                case 'COUNT':
                    result[alias] = data.length;
                    break;
                case 'SUM':
                    result[alias] = data.reduce((sum, item) => sum + (item[fieldName] || 0), 0);
                    break;
                case 'AVG':
                    const sum = data.reduce((s, item) => s + (item[fieldName] || 0), 0);
                    result[alias] = data.length > 0 ? sum / data.length : 0;
                    break;
                case 'MIN':
                    result[alias] = Math.min(...data.map(item => item[fieldName] || Infinity));
                    break;
                case 'MAX':
                    result[alias] = Math.max(...data.map(item => item[fieldName] || -Infinity));
                    break;
            }
        });

        return result;
    }
}

// Query Builder for fluent API
class QueryBuilder {
    constructor(database) {
        this.db = database;
        this.sql = new SQLQuery(database);
        this.query = {
            from: 'tasks',
            where: {},
            orderBy: null,
            limit: null,
            offset: 0
        };
    }

    // FROM clause
    from(table) {
        this.query.from = table;
        return this;
    }

    // WHERE clause
    where(field, operator, value) {
        if (arguments.length === 2) {
            // Simple equality: where('status', 'completed')
            this.query.where[field] = operator;
        } else {
            // With operator: where('dueDate', '>', '2025-10-01')
            const opMap = {
                '>': '$gt',
                '>=': '$gte',
                '<': '$lt',
                '<=': '$lte',
                '!=': '$ne',
                'LIKE': '$like',
                'IN': '$in',
                'CONTAINS': '$contains'
            };
            this.query.where[field] = { [opMap[operator]]: value };
        }
        return this;
    }

    // AND clause (chainable WHERE)
    and(field, operator, value) {
        return this.where(field, operator, value);
    }

    // ORDER BY clause
    orderBy(field, direction = 'ASC') {
        this.query.orderBy = `${field} ${direction}`;
        return this;
    }

    // LIMIT clause
    limit(count) {
        this.query.limit = count;
        return this;
    }

    // OFFSET clause
    offset(count) {
        this.query.offset = count;
        return this;
    }

    // Execute query
    async get() {
        return await this.sql.select(this.query);
    }

    // Get first result
    async first() {
        this.query.limit = 1;
        const results = await this.sql.select(this.query);
        return results[0] || null;
    }

    // Count results
    async count() {
        return await this.sql.count(this.query);
    }
}

// Example usage and helper functions
const DBQuery = {
    // Create query builder
    table(tableName, database) {
        return new QueryBuilder(database).from(tableName);
    },

    // Quick queries
    async findById(db, table, id) {
        const sql = new SQLQuery(db);
        const results = await sql.select({
            from: table,
            where: { id: id },
            limit: 1
        });
        return results[0] || null;
    },

    async findWhere(db, table, conditions) {
        const sql = new SQLQuery(db);
        return await sql.select({
            from: table,
            where: conditions
        });
    },

    async findAll(db, table) {
        const sql = new SQLQuery(db);
        return await sql.select({ from: table });
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SQLQuery, QueryBuilder, DBQuery };
}

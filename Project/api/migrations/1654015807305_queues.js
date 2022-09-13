exports.up = (pgm) => {
    pgm.createTable('queues', {
        restaurant: { type: 'int', notNull: true },
        author: { type: 'string', notNull: true },
        timestamp: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp')},
        value: { type: 'int', notNull: true }
    })
}

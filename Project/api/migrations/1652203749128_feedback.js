exports.up = (pgm) => {
    pgm.createTable('meal_review', {
        id: 'id',
        description: { type: 'text', notNull: true },
        author: { type: 'text', notNull: true },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        restaurant: { type: 'text', notNull: true },
        dish: { type: 'text', notNull: true },
        rating: { type: 'integer', notNull: true },
    })
    pgm.createTable('teacher_review', {
        id: 'id',
        description: { type: 'text', notNull: true },
        author: { type: 'text', notNull: true },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        class: { type: 'text', notNull: true },
        teacher: { type: 'text', notNull: true },
    })
}


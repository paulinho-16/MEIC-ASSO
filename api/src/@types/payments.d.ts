export type Movement = { 
    [attribute: string]: string 
}

export type MovementTableHeadings = string[]

export type MovementTable = {
    headings: MovementTableHeadings,
    movements: Movement[],
}

export type Movements = {
    [attribute: string]: MovementTable 
}

export type PaymentsResponse = {
    [attribute: string]: string | Movements
}

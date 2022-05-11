export type Payment = { 
    [attribute: string]: string 
}

export type PaymentsTableHeadings = string[]

export type PaymentsTable = {
    headings: PaymentsTableHeadings,
    payments: Payment[],
}

export type PaymentsResponse = {
    [attribute: string]: PaymentsTable 
}

interface DemoItem {
    char_field: string;
    boolean_field: boolean;
    email_field: string;
    integer_field: string;
    decimal_field: string;
    date_field: string;
    datetime_field: string;
    foreign_key_field: number | string; // Use union type for mixed types like number, string, uuids
    text_field: string;
}

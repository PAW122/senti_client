function convertTypeToString(type) {
    console.log(type)
    switch (type) {
        case 1:
            return 'SUB_COMMAND';
        case 2:
            return 'SUB_COMMAND_GROUP';
        case 3:
            return 'STRING';
        case 4:
            return 'INTEGER';
        case 5:
            return 'BOOLEAN';
        case 6:
            return 'USER';
        case 7:
            return 'CHANNEL';
        case 8:
            return 'ROLE';
        default:
            return 'UNKNOWN';
    }
}

module.exports = convertTypeToString;
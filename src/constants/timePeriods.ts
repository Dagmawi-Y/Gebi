
const periodGoals = {
    DAILY:"ዕለታዊ ግብ",
    MONTHLY:"ወርሃዊ ግብ",
    SIX_MONTHS:"የስድስት ወር ግብ",
    ANUALY:"አመታዊ ግብ"
}
const goalToPeriod = (goal:string|null) =>{
    switch (goal) {
        case periodGoals.DAILY:
            return "በቀን"
            case periodGoals.MONTHLY:
                return "በወር"            
            case periodGoals.SIX_MONTHS:
                return "በ 6 ወር"
            case periodGoals.ANUALY:
                return "በ አመት"
            default:
                return "በቀን"
    
    }
}
export {periodGoals,goalToPeriod}

export default function getMinute(minute:Date){
    if (minute.getMinutes() === 30) return 0.5
    else return 0
}
import { event } from "../types/interfaces"

export const months: any = [
    {name: "January"  , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 0},
    {name: "Febuary"  , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28], i: 1},
    {name: "March"    , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 2},
    {name: "April"    , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], i: 3},
    {name: "May"      , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 4},
    {name: "June"     , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], i: 5},
    {name: "July"     , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 6},
    {name: "August"   , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 7},
    {name: "September", days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], i: 8},
    {name: "Ocotber"  , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 9},
    {name: "November" , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], i: 10},
    {name: "December" , days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], i: 11},
]

export const days_of_week: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function isLeapYear(year: any) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

export var current_date = new Date();

// takes year and index of month to return number of days in month.
export function daysInMonth(iMonth: any, iYear: any){
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

var test_event1: event = {name: "Test Name", location: "Test Location", attendees: ["Test User 1", "Test User 2"], date: new Date('Nov 12 2021')}
var test_event2: event = {name: "Test Name 2", location: "Test Location 2", attendees: ["Test User 1", "Test User 2", "Test User 3"], date: new Date('Nov 9 2021')}
export const events = [test_event1, test_event2];
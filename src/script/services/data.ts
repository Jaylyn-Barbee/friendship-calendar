import { event } from "../types/interfaces"

export const months: any = [
    {name: "January"  ,  i: 0},
    {name: "Febuary"  ,  i: 1},
    {name: "March"    ,  i: 2},
    {name: "April"    ,  i: 3},
    {name: "May"      ,  i: 4},
    {name: "June"     ,  i: 5},
    {name: "July"     ,  i: 6},
    {name: "August"   ,  i: 7},
    {name: "September",  i: 8},
    {name: "Ocotber"  ,  i: 9},
    {name: "November" ,  i: 10},
    {name: "December" ,  i: 11},
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
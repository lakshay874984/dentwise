import { getUserAppointments } from "@/lib/actions/appointments";
import { format, isAfter, isSameDay, parseISO } from "date-fns";
import NoNextAppointments from "./NoNextAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

async function NextAppointment() {
  const appointments = await getUserAppointments();

  // filter for upcoming CONFIRMED appointments only (today or future)
  const upcomingAppointments =
    appointments?.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);  //parseisO converts ISO string to Date object for example, "2024-06-20" to Date object as we cannot directly compare string with Date object and we do this because in the database date is stored as Date object
      const today = new Date(); // it stores the current date for example, 2024-06-15 and as it is a Date object we can compare it with another Date object
      const isUpcoming = isSameDay(appointmentDate, today) || isAfter(appointmentDate, today);  // checks if appointment date is today or in future
      return isUpcoming && (appointment.status === "CONFIRMED"); // returns true if both conditions are met
    }) || [];  // default to empty array if no appointments

  // get the next appointment (earliest upcoming one)
  const nextAppointment = upcomingAppointments[0];

  if (!nextAppointment) return <NoNextAppointments />; // no appointments, return nothing

  const appointmentDate = parseISO(nextAppointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy"); // format date to a readable format for example, "Thursday, June 20, 2024" and we do this for better user experience
  const isToday = isSameDay(appointmentDate, new Date());  // check if the appointment is today

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="size-5 text-primary" />
          Next Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">
              {isToday ? "Today" : "Upcoming"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            {nextAppointment.status}
          </span>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <UserIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{nextAppointment.doctorName}</p>
              <p className="text-xs text-muted-foreground">{nextAppointment.reason}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CalendarIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{formattedDate}</p>
              <p className="text-xs text-muted-foreground">
                {isToday ? "Today" : format(appointmentDate, "EEEE")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClockIcon className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{nextAppointment.time}</p>
              <p className="text-xs text-muted-foreground">Local time</p>
            </div>
          </div>
        </div>

        {/* More Appointments Count */}
        {upcomingAppointments.length > 1 && (
          <p className="text-xs text-center text-muted-foreground">
            +{upcomingAppointments.length - 1} more upcoming appointment
            {upcomingAppointments.length > 2 ? "s" : ""}   
          </p> // pluralize "appointment" if more than 2 and show count of additional appointments as "+X more upcoming appointments"
        )}
      </CardContent>
    </Card>
  );
}

export default NextAppointment;

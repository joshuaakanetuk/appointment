import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, User, Activity, Folder, AlertCircle } from 'lucide-react'

type Appointment = {
  entities: {
    client: {
      firstName: string
      lastName: string
    }
    activity: {
      externalId: string
      label: string
    }
    progam: {
      externalId: string
      label: string
    }
  }
  scheduledTime: string
  scheduledEndTime: string
  scheduledEnd: string
  status: string
}

export function AppointmentBoardComponent() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulating an API call
    const fetchAppointments = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('https://servicescheduling.bestbuy.com/api/api/QueueBoard/pr?locationId=422')
        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }
        const data = await response.json()
        setAppointments(data)
      } catch (err) {
        console.log(err)
        setError('Failed to load appointments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (isLoading) {
    return <div className="text-center p-4">Loading appointments...</div>
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <AlertCircle className="mx-auto mb-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((appointment, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <User className="mr-2" size={18} />
                  {`${appointment.entities.client.firstName} ${appointment.entities.client.lastName}`}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Activity className="mr-2" size={18} />
                  <span>{appointment.entities.activity.label}</span>
                </div>
                <div className="flex items-center">
                  <Folder className="mr-2" size={18} />
                  <span>{appointment.entities.progam.label}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2" size={18} />
                  <span>{format(parseISO(appointment.scheduledTime), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2" size={18} />
                  <span>
                    {format(parseISO(appointment.scheduledTime), 'h:mm a')} - 
                    {format(parseISO(appointment.scheduledEndTime), 'h:mm a')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
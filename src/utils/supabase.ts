import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://eotxhjuaksnzwbedgrcc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdHhoanVha3NuendiZWRncmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2Mzc4OTMsImV4cCI6MjAzNDIxMzg5M30.AMLQvwc6F45Qe-Ig3XtGTbDkmetTduhd8pYhAPu82Eg',
)
